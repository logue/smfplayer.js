import PSGConverter from './PSGConverter';
import MakiMabiSequence from './mms';

import { MetaEvent, ChannelEvent, SystemExclusiveEvent } from '@/midi_event';

/**
 * @classdesc MabiIcco MML File Parser
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019,2023 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */
export default class MabiIcco extends MakiMabiSequence {
  /** @type {string[]} 各トラックごと複数存在する変数名 */
  static multipleKeys = [
    'mml-track',
    'name',
    'program',
    'songProgram',
    'panpot',
  ];

  /**
   * @param {ArrayBuffer} input
   * @param {Object=} optParams
   */
  constructor(input, optParams = {}) {
    super(input, optParams);
    /** @type {Array<string>} 入力データ。行ごとに配列化 */
    this.input = this.source.split(/\r\n|\r|\n/) || [];
    /** @type {Array.<Array.<Object>>} 全トラックの演奏情報 */
    this.tracks = [];
    /** @type {Array.<Array.<Uint8Array>>} WMLに送る生のMIDIイベント */
    this.plainTracks = [];
    /** @type {number} トラック数 */
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
    const ret = {};
    /** @type {number} トラック番号（ヘッダー情報があるので初期値は-1） */
    let trackNo = -1;
    ret.track = [];

    for (let i = 0; i < this.input.length; i++) {
      /** @type {string} */
      const line = this.input[i].trim();
      // ヘッダーチェック
      if (i === 0 && line !== '[mml-score]') {
        throw new Error('Not MabiIcco File.');
      }
      /** @type {string[]} キーと値 */
      const [key, value] = line.split('=');

      if (MabiIcco.multipleKeys.includes(key)) {
        // トラックごとの処理
        if (key === 'mml-track') {
          trackNo++;
          ret.track[trackNo] = {};
          // 「-」が含まれる名前を変数名として使うと面倒なので・・・。
          ret.track[trackNo].mml = value;
        } else {
          ret.track[trackNo][key] = key === 'name' ? value : value | 0;
        }
      } else {
        ret[key] = value;
      }
    }

    // MabiIccoはUTF-8フォーマットなので変換処理は挟まない

    /** @type {string} タイトル */
    this.title = ret.title;
    /** @type {string} 著者情報 */
    this.author = ret.author;
    /** @type {number[]} グローバルテンポ情報（テンポ変更のTickとテンポ？） */
    const mmiTempo = ret.tempo !== '' ? ret.tempo.split('T') : [0, 120];
    /** @type {number} 分解能 */
    this.timeDivision = 96;
    /** @type {number} テンポ */
    this.tempo = parseInt(mmiTempo[1]) || 120;
    /** @type {number[]} 拍子記号 */
    const timeSig = ret.time.split('/');
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
    // 曲名と著者情報を付加
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
        parseInt(timeSig[0]) || 4,
        parseInt(timeSig[1]) || 4,
        0,
        0,
      ])
    );
    headerTrack.push(
      new MetaEvent('SetTempo', 0, 0, [Math.floor(60000000 / this.tempo)])
    );
    headerTrack.push(new MetaEvent('EndOfTrack', 0, 0));
    this.tracks.push(headerTrack);

    this.input = ret.track;
  }

  /**
   * MML parse
   */
  parseTracks() {
    /** @type {import('../midi_event.js').MidiEvent[]} MIDIイベント */
    let track = [];
    /** @type {number[]} 終了時間比較用 */
    const endTimes = [];

    for (let ch = 0; ch < this.input.length; ch++) {
      /** @type {array} 現在のチャンネルの情報 */
      const current = this.input[ch];
      /** @type {string[]} */
      const mml = current.mml.match(/^(?:MML@)(.*)/gm);
      if (!mml) {
        continue;
      }
      /** @type {string[]} MMLの配列（簡易マッチ） */
      const mmls = mml[0].split(',');

      // 楽器名
      track.push(
        new MetaEvent('InsturumentName', 0, 48, [
          this.encoder.encode(current.name),
        ])
      );
      // プログラムチェンジ
      track.push(new ChannelEvent('ProgramChange', 0, 96, ch, current.program));
      if (current.songProgram !== -1) {
        // コーラス用
        track.push(
          new ChannelEvent('ProgramChange', 0, 112, 15, current.songProgram)
        );
      }
      // パン(CC:0x10)
      track.push(
        new ChannelEvent('ControlChange', 0, 154, ch, 10, current.panpot)
      );

      // MMLの各チャンネルの処理
      for (let chord = 0; chord < current.mml.length; chord++) {
        let currentCh = ch;
        if (chord === 3 && current.songProgram !== -1) {
          // ch 16はコーラス用
          // TODO: 現在の実装では一人しかコーラスを反映させることができない。（男女のコーラスを同時に鳴らせない）
          // 複数の奏者でコーラスが指定されていた場合、男性女性用関係なく一番うしろのコーラスで指定された音色でマージされる。
          currentCh = 15;
        }
        if (!mmls[chord]) {
          continue;
        }

        /** @param {PSGConverter} */
        const mml2Midi = new PSGConverter({
          timeDivision: this.timeDivision,
          channel: currentCh,
          timeOffset: 386,
          mml: mmls[chord],
          igonoreTempo: currentCh === 1,
        });
        // トラックにマージ
        track = track.concat(mml2Midi.events);
        endTimes.push(mml2Midi.endTime);
      }

      // トラック終了
      track.concat(new MetaEvent('EndOfTrack', 0, Math.max(endTimes)));
      this.tracks.push(track);
    }
    this.numberOfTracks = this.tracks.length;
  }
}
