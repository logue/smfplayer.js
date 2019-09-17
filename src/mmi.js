import PSGConverter from './PSGConverter';
import MakiMabiSequence from './mms';
import { MetaEvent, ChannelEvent, SystemExclusiveEvent } from './midi_event';
/**
 * @classdesc   MabiIcco MML File Parser
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2019 Logue <https://logue.dev/> All rights reserved.
 * @license     MIT
 */
export default class MabiIcco extends MakiMabiSequence {
  /**
   * パース処理
   */
  parse() {
    this.parseHeader();
    this.parseTracks();
    this.toPlainTrack();
  };
  /**
   * ヘッダーメタ情報をパース
   */
  parseHeader() {
    /** @type {TextEncoder} */
    this.encoder = new TextEncoder('utf-8');
    /** @param {string} タイトル */
    this.title = this.input['mml-score'].title;
    /** @param {string} 著者情報 */
    this.author = this.input['mml-score'].author;
    /** @param {number} 解像度 */
    this.timeDivision = 96;
    // 拍子記号
    const timeSig = this.input['mml-score'].author.split('/');

    // TODO: 合奏対応のmmiファイルの処理

    /** @type {array}  */
    const headerTrack = [];
    // GM Reset
    headerTrack.push(new SystemExclusiveEvent('SystemExclusive', 0, 0, [0x7e, 0x7f, 0x09, 0x01]));
    // 曲名と著者情報を付加
    headerTrack.push(new MetaEvent('SequenceTrackName', 0, 0, [this.title]));
    headerTrack.push(new MetaEvent('CopyrightNotice', 0, 0, [this.author]));
    headerTrack.push(new MetaEvent('TimeSignature', 0, 0, [timeSig[0] | 0 || 4, timeSig[1] | 0 || 4, 0, 0]));
    headerTrack.push(new MetaEvent('EndOfTrack', 0, 0));
    this.tracks.push(headerTrack);

    // infomationおよびmms-fileを取り除く
    delete this.input['mml-score'].author;
    delete this.input['mml-score'].version;
    delete this.input['mml-score'].title;
    delete this.input['mml-score'].time;
    delete this.input['mml-score'].tempo;
  };
  /**
   * MML parse
   */
  parseTracks() {
    const input = this.input;
    /** @type {array} MIDIイベント */
    let track = [];
    /** @type {array} 終了時間比較用 */
    const endTimes = [];
    /** @type {number} チャンネル */
    let ch = 0;

    for (const item in input) {
      if (input.hasOwnProperty(item)) {
        if (!input[item]['mml-track'].match(/^(?:MML@)(.*)/gm)) {
          continue;
        }

        /** @param {array} MMLの配列（簡易マッチ） */
        const mmls = RegExp.$1.split(',');

        // 楽器名
        track.push(new MetaEvent('InsturumentName', 0, 48, input[item]['name']));
        // プログラムチェンジ
        track.push(new ChannelEvent('ProgramChange', 0, 96, ch, input[item]['program'] | 0));
        if (input[item]['songProgram'] !== -1) {
          // コーラス用
          track.push(new ChannelEvent('ProgramChange', 0, 112, 15, input[item]['songProgram'] | 0));
        }
        // パン(CC:0x10)
        track.push(new ChannelEvent('ControlChange', 0, 154, ch, 10, input[item]['panpot'] | 0));

        // MMLの各チャンネルの処理
        for (let chord = 0; chord < mmls.length; chord++) {
          if (chord === 3 && input[item]['songProgram'] !== -1) {
            // ch 16はコーラス用
            ch = 15;
          }
          if (mmls[chord] === void 0) {
            continue;
          }

          /** @param {PSGConverter} */
          const mml2Midi = new PSGConverter({ timeDivision: this.timeDivision, channel: ch, timeOffset: 386, mml: mmls[chord] });
          // トラックにマージ
          track = track.concat(mml2Midi.events);
          endTimes.push(mml2Midi.endTime);
        }
        ch++;
        // トラック終了
        track.concat(new MetaEvent('EndOfTrack', 0, Math.max(endTimes)));
        this.tracks.push(track);
      }
    }
    this.numberOfTracks = this.tracks.length;
  }
}
