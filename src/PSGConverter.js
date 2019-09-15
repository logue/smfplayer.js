import { ChannelEvent, MetaEvent } from './midi_event';
/**
 * @class       PSGConverter
 * @classdesc   Mabinogi MML and Maple Story 2 MML to MIDI Converter.
 * @version     3.0
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2007-2013,2018-2019 Logue <http://logue.dev/> All rights reserved.
 * @license     MIT
 */
export default class PSGConverter {
  /**
   * Constructor
   * @param {array} optParams
   */
  constructor(optParams = {}) {
    /** @type {number} 解像度 */
    this.timeDivision = parseInt(optParams.timeDivision) || 96;
    /** @type {number} チャンネル */
    this.channel = optParams.channel | 0;
    /** @type {number} 演奏開始までのオフセット時間 */
    this.timeOffset = optParams.timeOffset | 0;
    /** @type {string} MMLのチャンネルごとのマッチパターン */
    this.PATTERN = /[A-GLNORTV<>][\+\#-]?[0-9]*\.?&?/ig;
    /** @type {Array<string, number>} ノートのマッチングテーブル */
    this.NOTE_TABLE = {
      'c': 0,
      'd': 2,
      'e': 4,
      'f': 5,
      'g': 7,
      'a': 9,
      'b': 11,
    };
    /** @type {number} １拍（Tick連動） */
    this.MINIM = this.timeDivision * 2;
    /** @type {number} 1小節 */
    this.SEMIBREVE = this.timeDivision * 4;
    /** @type {array} MML */
    this.mml = optParams.mml;
    /** @type {array} イベント */
    this.events = [];
    /** @type {array} WML送信用イベント */
    this.plainEvents = [];
    /** @type {number} 終了時間 */
    this.endTime = 0;
    // 変換実行
    this.parse();
  }
  /**
   * Parse MML
   */
  parse() {
    /** @type {Array} MMLストリーム */
    let notes;
    try {
      notes = this.mml.match(this.PATTERN);
    } catch (e) {
      console.warn('Could not parse MML.', this.mml);
      return;
    }
    /** @type {number} タイムスタンプ */
    let time = this.timeOffset;
    /** @type {number} 現在の音の長さ */
    let cLength = this.timeDivision;
    /** @type {number} 現在の音階 */
    let cNote = 0;
    /** @type {boolean} タイ記号 */
    let tieEnabled = false;
    /** @type {number} 現在のボリューム(0～15)*/
    let cVolume = 8;
    /** @type {number} 現在のオクターブ(1~8)*/
    let cOctave = 4;
    /** @type {Array} イベント */
    const events = [];

    for (const mnid in notes) {
      if (notes.hasOwnProperty(mnid)) {
        /** @type {number} 現在の音符の長さ */
        let tick = cLength | 0;
        /** @type {number} 値*/
        let val = 0;

        // 音長(L)、オクターブ(O<>)、テンポ（T）、ボリューム（V）をパース
        if (notes[mnid].match(/([LOTV<>])([1-9][0-9]*|0?)(\.?)(&?)/i)) {
          val = parseInt(RegExp.$2);
          if (tieEnabled && RegExp.$4 !== '&') {
            // タイ記号
            tieEnabled = false;
            events.push(new ChannelEvent('NoteOff', 0, time, this.channel, cNote));
          }
          switch (RegExp.$1) {
            case 'L':
            case 'l':
              // 音長設定 Ln[.] (n=1～192)
              if (val >= 1 && val <= this.MINIM) {
                cLength = Math.floor(this.SEMIBREVE / val);
                if (RegExp.$3 == '.') {
                  // 付点の場合音長を1.5倍する
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
          val = RegExp.$3 | 0;

          if (RegExp.$1 === 'n' || RegExp.$1 === 'N') {
            // Nn：絶対音階指定 Lで指定した長さに設定
            note = val;
          } else {
            // [A-G]：音名表記
            // 音符の長さ指定: n分音符→128分音符×tick数
            if (1 <= val && val <= this.MINIM) {
              tick = Math.floor(this.SEMIBREVE / val); // L1 -> 384tick .. L64 -> 6tick
            }
            if (RegExp.$4 === '.') {
              tick = Math.floor(tick * 1.5); // 付点つき -> 1.5倍
            }

            // 音名→音階番号変換(C1 -> 12, C4 -> 48, ..)
            note = 12 * cOctave + this.NOTE_TABLE[RegExp.$1.toLowerCase()];

            // 調音記号の処理
            if (RegExp.$2 === '+' || RegExp.$2 === '#') {
              note++;
            } else if (RegExp.$2 === '-') {
              note--;
            }
          }
          // 1オクターブ低く演奏される不具合を修正 060426
          note += 12;

          if (!tieEnabled) {
            // 前回タイ記号が無いときのみノートオン
            events.push(new ChannelEvent('NoteOn', 0, time, this.channel, note, 8 * cVolume));
          } else if (note !== cNote) {
            // c&dなど無効なタイの処理
            events.push(new ChannelEvent('NoteOff', 0, time, this.channel, cNote));
            tieEnabled = false;
          }

          // タイムカウンタを音符の長さだけ進める
          time += tick;

          // ノートオフ命令の追加
          if (RegExp.$5 === '&') {
            // タイ記号の処理
            tieEnabled = true;
            cNote = note; // 直前の音階を保存
          } else {
            tieEnabled = false;
            // 発音と消音が同じ時間の場合、そこのノートが再生されないため、消音時にtimeを-1する。
            events.push(new ChannelEvent('NoteOff', 0, time, this.channel, note));
          }
        } else if (notes[mnid].match(/[rR]([0-9]*)(\.?)/)) {
          // 休符設定 R[n][.] (n=1～64)
          val = RegExp.$1 | 0;

          if (1 <= val && val <= this.MINIM) {
            // L1 -> 128tick .. L64 -> 2tick
            tick = Math.floor(this.SEMIBREVE / val);
          }

          if (RegExp.$2 === '.') {
            // 付点つき -> 1.5倍
            tick = Math.floor(tick * 1.5);
          }

          time += tick; // タイムカウンタを休符の長さだけ進める
        } else {
          console.warn('unknown signeture.', notes[mnid]);
        }
      }
    }
    this.events = events;
    this.endTime = time;
  }
}
