import { parse } from 'ini';
import { convert } from 'encoding-japanese';

import { MetaEvent, ChannelEvent, SystemExclusiveEvent } from '../midi_event';
import PSGConverter from './PSGConverter';

/**
 * @classdesc MakiMabi Sequence File Parser
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019,2023 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */
export default class MakiMabiSequence {
  /** @type {number[]} まきまびしーくの楽器番号変換テーブル（MabiIccoのMMSFile.javaのテーブルを流用） */
  static mmsInstTable = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 65, 66, 67,
    68, 69, 70, 71, 72, 73, 74, 75, 76, 18,
  ];

  /**
   * @param {Uint8Array} input
   * @param {object} optParams
   */
  constructor(input, optParams = {}) {
    /** @type {TextEncoder} */
    this.encoder = new TextEncoder('UTF-8');
    /** @type {string} */
    this.source = convert(input, {
      to: 'UNICODE',
      from: 'AUTO',
      type: 'string',
    });
    /** @type {Record<{[key: string]: any}>} MMSファイルをパースしたもの */
    this.input = parse(this.source) || {};
    /** @type {object[][]} 全トラックの演奏情報 */
    this.tracks = [];
    /** @type {Uint8Array[][]} WMLに送る生のMIDIイベント */
    this.plainTracks = [];
    /** @param {number} トラック数 */
    this.numberOfTracks = 1;
    /** @type {number} 分解能 */
    this.timeDivision = optParams.timeDivision
      ? parseInt(optParams.timeDivision)
      : 96;
  }

  /**
   * パース処理
   */
  parse() {
    this.parseHeader();
    this.parseTracks();
    this.toPlainTrack();
  }
  /**
   * ヘッダーメタ情報をパース
   */
  parseHeader() {
    /** @type {object} インフォメーション情報 */
    const header = this.input.infomation || {}; // informationじゃない

    // まきまびしーくは基本Shift_JIS

    /** @type {string} タイトル */
    this.title = header.title;
    /** @type {string} 著者情報 */
    this.author = header.auther; // authorじゃない。

    /** @type {number} 分解能 */
    this.timeDivision = header.timeBase ? parseInt(header.timeBase) : 96;

    // 曲名と著者情報を付加

    /** @type {MetaEvent[]}  */
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
      new MetaEvent('TimeSignature', 0, 0, [
        parseInt(header.rythmNum) || 4,
        parseInt(header.rythmBase) || 4,
        0,
        0,
      ])
    );
    headerTrack.push(new MetaEvent('EndOfTrack', 0, this.timeDivision));
    this.tracks.push(headerTrack);

    // infomationおよびmms-fileを取り除く
    delete this.input.infomation;
    delete this.input['mms-file'];
  }
  /**
   * MML parse
   */
  parseTracks() {
    /** @type {ChannelEvent[]} MIDIイベント */
    let track = [];
    /** @type {array} 終了時間比較用 */
    const endTimes = [];
    /** @type {number} チャンネル */
    let ch = 0;

    for (const part in this.input) {
      if (!Object.prototype.hasOwnProperty.call(this.input, part)) {
        continue;
      }
      const currentPart = this.input[part];
      /** @param {string[]} MMLの配列 */
      const mmls = [
        currentPart.ch0_mml,
        currentPart.ch1_mml,
        currentPart.ch2_mml,
      ];
      /** @param {number} パンポット */
      const panpot = parseInt(currentPart.panpot) + 64;

      // 楽器名
      track.push(
        new MetaEvent('InsturumentName', 0, 48, [
          this.encoder.encode(currentPart.name),
        ])
      );
      // プログラムチェンジ
      track.push(
        new ChannelEvent(
          'ProgramChange',
          0,
          96,
          ch,
          MakiMabiSequence.mmsInstTable[currentPart.instrument]
        )
      );

      // パン
      track.push(new ChannelEvent('ControlChange', 0, 154, ch, 10, panpot));

      // MMLの各チャンネルの処理
      mmls.forEach(chord => {
        /** @param {PSGConverter} */
        const mml2Midi = new PSGConverter({
          timeDivision: this.timeDivision,
          channel: ch,
          timeOffset: 386,
          mml: mmls[chord],
        });
        // トラックにマージ
        track = track.concat(mml2Midi.events);
        endTimes.push(mml2Midi.endTime);
      });
      ch++;
      // トラック終了
      track.concat(new MetaEvent('EndOfTrack', 0, Math.max(endTimes)));
      this.tracks.push(track);
    }
    this.numberOfTracks = this.tracks.length;
  }

  /**
   * WebMidiLink信号に変換
   */
  toPlainTrack() {
    for (let i = 0; i < this.tracks.length; i++) {
      /** @type {array} トラックのイベント */
      let rawTrackEvents = [];

      /** @type {array} 全イベント */
      let rawEvents = [];

      /** @type {array} */
      const events = this.tracks[i];

      for (const event of events) {
        /** @var {Uint8Array} WebMidiLink信号 */
        let raw;

        if (event instanceof ChannelEvent) {
          switch (event.subtype) {
            case 'NoteOn':
              // console.log(event);
              if (event.parameter2 === 0) {
                raw = [
                  0x80 | event.channel,
                  event.parameter1,
                  event.parameter2,
                ];
              } else {
                raw = [
                  0x90 | event.channel,
                  event.parameter1,
                  event.parameter2,
                ];
              }
              break;
            case 'NoteOff':
              raw = [0x80 | event.channel, event.parameter1, event.parameter2];
              break;
            case 'ControlChange':
              raw = [0xb0 | event.channel, event.parameter1, event.parameter2];
              break;
            case 'ProgramChange':
              raw = [0xc0 | event.channel, event.parameter1];
              break;
          }
        } else if (event instanceof MetaEvent) {
          // Metaイベントの内容は実際使われない。単なる配列の数合わせのためのプレースホルダ（音を鳴らすことには関係ない処理だから）
          /** @type {Uint8Array} */
          const data = event.data;
          switch (event.subtype) {
            case 'TextEvent':
              raw = [0xff, 0x01].concat(data);
              break;
            case 'SequenceTrackName':
              raw = [0xff, 0x03].concat(data);
              break;
            case 'CopyrightNotice':
              raw = [0xff, 0x02].concat(data);
              break;
            case 'InsturumentName':
              raw = [0xff, 0x04].concat(data);
              break;
            case 'SetTempo':
              raw = [0xff, 0x51].concat(data);
              break;
            case 'TimeSignature':
              raw = [0xff, 0x58].concat(data);
              break;
            case 'EndOfTrack':
              raw = [0xff, 0x2f];
              break;
          }
        } else if (event instanceof SystemExclusiveEvent) {
          raw = [0xf0, 0x05].concat(event.data);
        }
        rawEvents = rawEvents.concat(new Uint8Array(raw));
      }
      rawTrackEvents = rawTrackEvents.concat(rawEvents);

      this.plainTracks[i] = rawTrackEvents;
    }
  }
}
