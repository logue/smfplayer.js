import { ChannelEvent, MetaEvent } from './midi_event';
/**
 * @class       PSGConverter
 * @classdesc   Mabinogi MML and Maple Story 2 MML to MIDI Converter.
 * @version     3.0.2
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license     MIT
 */
export default class PSGConverter {
  /**
   * Constructor
   * @param {array} optParams
   */
  constructor(optParams = {}) {
    /** @type {number} 分解能 */
    this.timeDivision = optParams.timeDivision | 0 || 96;
    /** @type {number} チャンネル（0～15） */
    this.channel = optParams.channel | 0;
    /** @type {number} 演奏開始までのオフセット時間 */
    this.timeOffset = optParams.timeOffset | 0;
    /** @type {string} MMLのチャンネルごとのマッチパターン */
    this.PATTERN = /[a-glnortv<>][+#-]?[0-9]*\.?&?/g;
    /** @type {Array<string, number>} ノートのマッチングテーブル */
    this.NOTE_TABLE = {
      c: 0,
      d: 2,
      e: 4,
      f: 5,
      g: 7,
      a: 9,
      b: 11,
    };
    /** @type {number} １拍（Tick連動） */
    this.MINIM = this.timeDivision * 2;
    /** @type {number} 1小節 */
    this.SEMIBREVE = this.timeDivision * 4;
    /** @type {number} ベロシティの倍率 */
    this.VELOCITY_MAGNIFICATION = 7; // 127÷15≒8.4
    /** @type {array} MMLデータ */
    this.mml = optParams.mml;
    /** @type {array} イベント */
    this.events = [];
    /** @type {array} WML送信用イベント */
    this.plainEvents = [];
    /** @type {number} 終了時間 */
    this.endTime = 0;
    /** @type {number} ノートオフの逆オフセット(tick指定) */
    this.noteOffNegativeOffset = 2;
    /** @type {bool} テンポ命令を無視する */
    this.ignoreTempo = optParams.igonreTempo | false;
    /** @type {number} 最大オクターブ */
    this.maxOctave = optParams.maxOctave | 8;
    /** @type {number} 最小オクターブ */
    this.minOctave = optParams.minOctave | 0;
    /** @type {number} オクターブモード（0：処理しない。1：外れる音階はその前後のオクターブをループする。2：常に同じ音を鳴らす */
    this.octaveMode = optParams.octaveMode | 0;
    /** @type {number} 最低音階（octaveModeが0の場合は無視されます。デフォルトはピアノの音階。GM音源で再生するとき用） */
    this.minNote = optParams.minNote | 12;
    /** @type {number} 最高音階（octaveModeが0の場合は無視されます。デフォルトはピアノの音階。GM音源で再生するとき用） */
    this.maxNote = optParams.minNote | 98;
    // 変換実行
    this.parse();
  }

  /**
   * Parse MML
   */
  parse() {
    /** @type {Array} MMLストリーム */
    let mmls = [];
    try {
      // 小文字に変換した後正規表現で命令単位で分割する。
      mmls = this.mml.toLowerCase().match(this.PATTERN);
    } catch (e) {
      console.warn('Could not parse MML.', this.mml);
      return;
    }

    if (!mmls) {
      // 空欄の場合処理しない
      return;
    }

    /** @type {number} タイムスタンプ */
    let time = this.timeOffset;
    /** @type {number} 現在の音の長さ */
    let currentSoundLength = this.timeDivision;
    /** @type {number} 現在の音階 */
    let currentNote = 0;
    /** @type {number} ベロシティ(0～15) */
    let currentVelocity = 8;
    /** @type {number} オクターブ(0~8) */
    let currentOctave = 4;
    /** @type {bool} タイ記号 */
    let tieEnabled = false;

    /** @type {array} MIDIイベント */
    const events = [];

    // MMLを命令単位でパース
    for (const message of mmls) {
      /** @type {number} すすめるtick数 */
      let tick = currentSoundLength | 0;
      /** @type {string} コマンド */
      let command = '';
      /** @type {number} 値 */
      let value = 0;

      // 音長(L)、オクターブ(O<>)、テンポ（T）、ベロシティ（V）をパース
      if (message.match(/([lotv<>])([1-9][0-9]*|0?)(\.?)(&?)/)) {
        command = RegExp.$1.toLowerCase();
        value = RegExp.$2 | 0;

        if (tieEnabled && RegExp.$4 !== '&') {
          // タイ記号
          tieEnabled = false;
          events.push(
            new ChannelEvent('NoteOff', 0, time - this.noteOffNegativeOffset, this.channel, currentNote),
          );
        }

        switch (command) {
          case 'l':
            // 音長設定 Ln[.] (n=1～192)
            if (value >= 1 && value <= this.MINIM) {
              currentSoundLength = Math.floor(this.SEMIBREVE / value);
              if (RegExp.$3 === '.') {
                // 付点の場合音長を1.5倍する
                currentSoundLength = Math.floor(currentSoundLength * 1.5);
              }
            }
            break;
          case 'o':
            // オクターブ設定 On (n=1～8)
            if (value >= this.minOctave && value <= this.maxOctave) {
              currentOctave = value;
            }
            break;
          case 't':
            // テンポ設定 Tn (n=32～255)
            events.push(
              new MetaEvent('SetTempo', 0, time, [Math.floor(60000000 / value)]),
            );
            break;
          case 'v':
            // ベロシティ調整
            if (value >= 0 && value <= 15) {
              currentVelocity = value;
            }
            break;

          // 簡易オクターブ設定 {<>}
          case '<':
            currentOctave = currentOctave <= this.minOctave ? this.minOctave : currentOctave - 1;
            break;
          case '>':
            currentOctave = currentOctave >= this.maxOctave ? this.maxOctave : currentOctave + 1;
            break;
        }
      } else if (message.match(/([a-gn])([+#-]?)([0-9]*)(\.?)(&?)/)) {
        // ノート命令（CDEFGAB）、絶対音階指定（N）をパース

        /** @type {number} 音階 */
        let note = 0;
        command = RegExp.$1.toLowerCase();
        value = RegExp.$3 | 0;

        if (command === 'n') {
          // Nn：絶対音階指定 Lで指定した長さに設定
          note = value;
        } else {
          // [A-G]：音名表記
          // 音符の長さ指定: n分音符→128分音符×tick数
          if (value >= 1 && value <= this.MINIM) {
            tick = Math.floor(this.SEMIBREVE / value); // L1 -> 384tick .. L64 -> 6tick
          }
          if (RegExp.$4 === '.') {
            tick = Math.floor(tick * 1.5); // 付点つき -> 1.5倍
          }

          if (this.octaveMode !== 2) {
            // 音名→音階番号変換(C1 -> 12, C4 -> 48, ..)
            note = 12 * currentOctave + this.NOTE_TABLE[command];

            // 調音記号の処理
            if (RegExp.$2 === '+' || RegExp.$2 === '#') {
              note++;
            } else if (RegExp.$2 === '-') {
              note--;
            }
          }
        }

        // オクターブ調整（楽器の音域エミュレーション。通常は0。GM互換モード時のみ使用）
        switch (this.octaveMode) {
          case 1:
            // オクターブループモード
            while (note < this.minNote) note = note + 12;
            while (note > this.maxNote) note = note - 12;
            note += 12;
            break;
          case 2:
            // ワンショットモード（音階の強制指定）
            note = this.maxNote;
            break;
          default:
            // 通常モード（非GMモードでは常にこれ）
            note += 12;
            break;
        }

        if (!tieEnabled) {
          // 前回タイ記号が無いときのみノートオン
          events.push(
            new ChannelEvent(
              'NoteOn',
              0,
              time,
              this.channel,
              note,
              currentVelocity * this.VELOCITY_MAGNIFICATION, // ※127÷15≒8.4なので8とする。
            ),
          );
        } else if (note !== currentNote) {
          // c&dなど無効なタイの処理
          events.push(
            new ChannelEvent('NoteOff', 0, time - this.noteOffNegativeOffset, this.channel, currentNote),
          );
          tieEnabled = false;
        }

        // タイムカウンタを音符の長さだけ進める
        time += tick;

        // ノートオフ命令の追加
        if (RegExp.$5 === '&') {
          // タイ記号の処理
          tieEnabled = true;
          currentNote = note; // 直前の音階を保存
        } else {
          tieEnabled = false;
          // 発音と消音が同じ時間の場合、そこのノートが再生されないため、消音時にtimeを-1する。
          events.push(
            new ChannelEvent('NoteOff', 0, time - this.noteOffNegativeOffset, this.channel, note),
          );
        }
      } else if (message.match(/R([0-9]*)(\.?)/i)) {
        // 休符設定 R[n][.] (n=1～64)
        value = RegExp.$1 | 0;

        if (value >= 1 && value <= this.MINIM) {
          // L1 -> 128tick .. L64 -> 2tick
          tick = Math.floor(this.SEMIBREVE / value);
        }

        if (RegExp.$2 === '.') {
          // 付点つき -> 1.5倍
          tick = Math.floor(tick * 1.5);
        }

        time += tick; // タイムカウンタを休符の長さだけ進める
      } else {
        console.warn('unknown signeture.', message);
      }
    }
    // イベントを代入
    this.events = events;
    // 演奏完了時間を代入
    this.endTime = time;
  }
}
