import { MetaEvent, ChannelEvent, SystemExclusiveEvent } from '../midi_event';
import PSGConverter from './PSGConverter';
import MakiMabiSequence from './mms';

/**
 * @classdesc Three Macro Language Editor (3MLE) mml file Parser
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019,2023 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */
export default class ThreeMacroLanguageEditor extends MakiMabiSequence {
  /**
   * @param {Uint8Array} input
   * @param {object} optParams
   */
  constructor(input, optParams = {}) {
    super(input, optParams);
  }
  /**
   */
  parse() {
    this.parseHeader();
    this.parseTracks();
    this.toPlainTrack();
  }
  /**
   */
  parseHeader() {
    /** @type {Record<string, string>} */
    const header = this.input.Settings;
    /** @type {string} */
    this.title = header.Title;
    /** @type {string} */
    this.author = header.Source;
    /** @type {number} */
    this.timeDivision = header.TimeBase ? parseInt(header.TimeBase) : 32;

    // 曲名と著者情報を付加
    /** @type {import('../midi_event.js').MidiEvent[]}  */
    const headerTrack = [];
    // GM Reset
    headerTrack.push(
      new SystemExclusiveEvent(
        'SystemExclusive',
        0,
        0,
        [0x7e, 0x7f, 0x09, 0x01]
      )
    );
    headerTrack.push(
      new MetaEvent('SequenceTrackName', 0, 0, [
        this.encoder.encode(this.title),
      ])
    );
    headerTrack.push(
      new MetaEvent('CopyrightNotice', 0, 0, [this.encoder.encode(this.author)])
    );
    headerTrack.push(
      new MetaEvent('TextEvent', 0, 0, [this.encoder.encode(header.Memo)])
    );
    headerTrack.push(
      new MetaEvent('TimeSignature', 0, 0, [
        header.TimeSignatureNN ? parseInt(header.TimeSignatureNN) : 4,
        header.TimeSignatureDD ? parseInt(header.TimeSignatureDD) : 4,
        0,
        0,
      ])
    );
    headerTrack.push(new MetaEvent('EndOfTrack', 0, 0));
    this.tracks.push(headerTrack);

    // 3MLE EXTENSION、Settingsを取り除く
    delete this.input['3MLE EXTENSION'];
    delete this.input.Settings;
  }

  /**
   * MML parse
   */
  parseTracks() {
    const input = this.input;
    /** @type {number[]} 終了時間比較用 */
    const endTimes = [];

    /** @type {string[]} 各ブロックのMML */
    const mmls = [];
    /** @type {any[]} 各ブロックの演奏情報 */
    const settings = [];

    for (const block in this.input) {
      if (!Object.prototype.hasOwnProperty.call(this.input, block)) {
        continue;
      }
      if (block.match(/^Channel(\d+)$/i)) {
        // MMLは[Channel[n]]ブロックのキー

        // ひどいファイル形式だ・・・。
        mmls[(RegExp.$1 | 0) - 1] = Object.keys(input[block])
          .join('')
          .replace(/\/\*([^*]|\*[^/])*\*\//g, '');
      }

      if (block.match(/^ChannelProperty(\d+)$/i)) {
        // 各パートの楽器情報などは[ChannelProperty[n]]に格納されている
        settings[(RegExp.$1 | 0) - 1] = {
          name: input[block].Name,
          instrument: parseInt(input[block].Patch),
          panpot: parseInt(input[block].Pan),
        };
      }
    }

    /** @type {array} 整形済みデータ */
    const data = [];

    // データを整形
    for (const no in mmls) {
      if (!Object.prototype.hasOwnProperty.call(mmls, no)) {
        continue;
      }
      if (settings[no] !== void 0) {
        data[no] = {
          mml: mmls[no],
          name: settings[no].name || '',
          instrument: settings[no].instrument || 0,
          panpot: settings[no].panpot || 64,
        };
      } else {
        data[no] = {
          mml: mmls[no],
          name: '',
          instrument: 0,
          panpot: 64,
        };
      }
    }

    // console.log(data);

    for (const part in data) {
      if (!Object.prototype.hasOwnProperty.call(data, part)) {
        continue;
      }
      /** @type {number} */
      const ch = part | 0;
      /** @type {import('../midi_event.js').MidiEvent[]} MIDIイベント */
      let track = [];
      if (data[part].mml === '') {
        // 空っぽのMMLトラックの場合処理しない
        return;
      }

      // 楽器名
      track.push(
        new MetaEvent('InsturumentName', 0, 48, [
          this.encoder.encode(data[part].name),
        ])
      );
      // プログラムチェンジ
      track.push(
        new ChannelEvent('ProgramChange', 0, 96, ch, data[part].instrument)
      );
      // パン
      track.push(
        new ChannelEvent('ControlChange', 0, 154, ch, 10, data[part].panpot)
      );

      /** @param {PSGConverter} */
      const mml2Midi = new PSGConverter({
        timeDivision: this.timeDivision,
        channel: ch,
        timeOffset: 386,
        mml: data[part].mml,
      });
      // トラックにマージ
      track = track.concat(mml2Midi.events);
      // 演奏時間を更新
      endTimes.push(mml2Midi.endTime);

      // トラック終了
      track.concat(new MetaEvent('EndOfTrack', 0, Math.max(endTimes)));
      this.tracks.push(track);
    }

    this.numberOfTracks = this.tracks.length;
  }
}
