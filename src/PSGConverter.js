import { ChannelEvent, MetaEvent } from './midi_event';
/**
 * PSGConverter.js - Mabinogi MML and Maple Story 2 MML to MIDI Converter.
 * v3.0
 *
 * @author Logue <logue@hotmail.co.jp>
 * @copyright 2007-2013,2018,2019 Logue <http://logue.be/> All rights reserved.
 * @license MIT
 */
export default class PSGConverter {
  /**
   * Constructor
   * @param {array} optParams
   */
  constructor(optParams = {}) {
    /** @type {number} 解像度 */
    this.timeDivision = optParams.division || 96;
  }
  /**
   * Parse MML
   * @param {string} mml
   * @param {int} channel
   * @return {array}
   */
  parse(mml, channel) {
    /** @type {number} 現在の音階 */
    let cNote = 0;
    /** @type {boolean} タイ記号 */
    let tieEnabled = false;
    /** @type {number} 現在のボリューム(0～15)*/
    let cVolume = 8;
    /** @type {number} 現在のオクターブ(1~8)*/
    let cOctave = 4;
    /** @type {number} 現在の音の長さ */
    let cLength = this.timeDivision;

    /** @type {string} MMLのチャンネルごとのマッチパターン */
    const PATTERN = /[A-GLNORTV<>][\+\#-]?[0-9]*\.?&?/ig;
    /** @type {Array<string, number>} ノートのマッチングテーブル */
    const NOTE_TABLE = {
      'c': 0,
      'd': 2,
      'e': 4,
      'f': 5,
      'g': 7,
      'a': 9,
      'b': 11,
    };
    /** @type {Array} MMLストリーム */
    const notes = mml.match(PATTERN);
    /** @type {Array} イベント */
    const events = [];

    /** @type {number} １拍（Tick連動） */
    const MINIM = this.timeDivision * 2;
    /** @type {number} 1小節 */
    const SEMIBREVE = this.timeDivision * 4;
    /** @type {number} タイムスタンプ */
    let time = 0;

    for (const mnid in notes) {
      if (notes.hasOwnProperty(mnid)) {
        /** @type {number} 現在の音符の長さ */
        let tick = cLength;
        /** @type {number} 値*/
        let val = 0;

        // 音長(L)、オクターブ(O<>)、テンポ（T）、ボリューム（V）をパース
        if (notes[mnid].match(/([LOTV<>])([1-9][0-9]*|0?)(\.?)(&?)/i)) {
          val = parseInt(RegExp.$2);
          if (tieEnabled == true && RegExp.$4 !== '&') {
            // タイ記号
            tieEnabled = false;
            events.push(new ChannelEvent('NoteOff', 0, time, channel, cNote));
          }
          switch (RegExp.$1) {
            case 'L':
            case 'l':
              // 音長設定 Ln[.] (n=1～192)
              if (val >= 1 && val <= MINIM) {
                cLength = Math.floor(SEMIBREVE / val);
                if (RegExp.$3 == '.') {
                  cLength = Math.floor(cLength * 1.5);
                }
              }
              break;
            case 'O':
            case 'o':
              // オクターブ設定 On (n=1～8)
              if (val >= 0 && val <= 8) {
                cOctave = val;
              }
              break;
            case 'T':
            case 't':
              // テンポ設定 Tn (n=32～255)
              events.push(new MetaEvent('SetTempo', 0, time, [Math.floor(60000000 / val)]));
              break;
            case 'V':
            case 'v':
              // ボリューム調整
              if (val >= 0 && val <= 15) {
                cVolume = val;
              }
              break;

            // 簡易オクターブ設定 {<>}
            case '<':
              cOctave = (cOctave <= 0) ? 0 : (cOctave - 1);
              break;
            case '>':
              cOctave = (cOctave >= 8) ? 8 : (cOctave + 1);
              break;
          }
        } else if (notes[mnid].match(/([A-GN])([\+\#-]?)([0-9]*)(\.?)(&?)/i)) {
          // ノート命令（CDEFGAB）、絶対音階指定（N）をパース
          /** @type {number} 音階 */
          let note = 0;
          val = parseInt(RegExp.$3, 10);

          if (RegExp.$1 === 'n' || RegExp.$1 === 'N') {
            // Nn：絶対音階指定 Lで指定した長さに設定
            note = val;
          } else {
            // [A-G]：音名表記
            // 音符の長さ指定: n分音符→128分音符×tick数
            if (1 <= val && val <= MINIM) {
              tick = Math.floor(SEMIBREVE / val); // L1 -> 384tick .. L64 -> 6tick
            }
            if (RegExp.$4 === '.') {
              tick = Math.floor(tick * 1.5); // 付点つき -> 1.5倍
            }

            // 音名→音階番号変換(C1 -> 12, C4 -> 48, ..)
            note = 12 * cOctave + NOTE_TABLE[RegExp.$1.toLowerCase()];

            // 調音記号の処理
            if (RegExp.$2 === '+' || RegExp.$2 === '#') {
              note++;
            } else if (RegExp.$2 === '-') {
              note--;
            }
          }
          // 1オクターブ低く演奏される不具合を修正 060426
          note += 12;

          // 前回タイ記号が無いときのみノートオン
          if (tieEnabled == false) {
            events.push(new ChannelEvent('NoteOn', 0, time, channel, note, 8 * cVolume));
          }

          // c&dなど無効なタイの処理
          if (tieEnabled == true && note !== cNote) {
            tieEnabled = false;
            events.push(new ChannelEvent('NoteOff', 0, time, channel, cNote));
          }

          // タイムカウンタを音符の長さだけ進める
          time += tick;

          // ノートオフ命令の追加
          if (RegExp.$5 == '&') { // タイ記号の処理
            tieEnabled = true;
            cNote = note; // 直前の音階を保存
          } else {
            tieEnabled = false;
            // 発音と消音が同じ時間の場合、そこのノートが再生されないため、消音時にtimeを-1する。
            events.push(new ChannelEvent('NoteOff', 0, time, channel, note));
          }
        } else if (notes[mnid].match(/[rR]([0-9]*)(\.?)/)) {
          // 休符設定 R[n][.] (n=1～64)
          val = parseInt(RegExp.$1, 10);

          if (1 <= val && val <= MINIM) {
            // L1 -> 128tick .. L64 -> 2tick
            tick = Math.floor(SEMIBREVE / val);
          }

          if (RegExp.$2 == '.') {
            // 付点つき -> 1.5倍
            tick = Math.floor(tick * 1.5);
          }

          time += tick; // タイムカウンタを休符の長さだけ進める
        } else {
          console.warn('unknown signeture.', notes[mnid]);
        }
        if (tieEnabled == true) { // 無効なタイの処理
          tieEnabled = false;
          events.push(new ChannelEvent('NoteOff', 0, time, channel, cNote));
        }
      }
    }
    return events;
  };

  /**
   * ダミー
   * @param {array} events
   * @return {array}
   */
  toPlainTrack(events) {
    /** @var {array} */
    const rawEvents = [];

    for (const i in events) {
      if (events.hasOwnProperty(i)) {
        /** @var {Event} */
        const event = events[i];
        /** @var {Uint8Array} */
        let raw;

        if (event instanceof ChannelEvent) {
          switch (event.subtype) {
            case 'NoteOn':
              // console.log(event);
              if ((event).parameter2 === 0) {
                raw = new Uint8Array([0x80 | event.channel, event.parameter1, event.parameter2]);
              } else {
                raw = new Uint8Array([0x90 | event.channel, event.parameter1, event.parameter2]);
              }
              break;
            case 'NoteOff':
              raw = new Uint8Array([0x80 | event.channel, event.parameter1, event.parameter2]);
              break;
          }
        } else if (event instanceof MetaEvent) {
          switch (event.subtype) {
            case 'SetTempo':
              raw = new Uint8Array([0xFF, 0x51, 0x03, 0x07, 0xA1, 0x20]);
              break;
          }
        }
        rawEvents.push(raw);
      }
    }
    return rawEvents;
  }
}
