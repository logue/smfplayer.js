import PSGConverter from './PSGConverter';
import MakiMabiSequence from './mms';
import { MetaEvent } from './midi_event';
/**
 * MapleStory2 Mml Parser
 *
 * @author Logue <logue@hotmail.co.jp>
 * @copyright 2019 Logue <http://logue.be/> All rights reserved.
 * @license MIT
 */
export default class Ms2Mml extends MakiMabiSequence {
  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  constructor(input, optParams = {}) {
    super(input, optParams);
    /** @type {DOMParser} */
    const parser = new DOMParser();
    /** @type {Document} */
    const doc = parser.parseFromString(String.fromCharCode.apply('', new Uint16Array(input)), 'text/xml');
    /** @param {Element} */
    this.input = doc.querySelectorAll('ms2 > *');
    /** @type {number} 解像度 */
    this.timeDivision = optParams.timeDivision || 96;
    /** @type {Array.<Array.<Object>>} 変換結果 */
    this.tracks = [];
    /** @type {array} WML用変換結果 */
    this.plainTracks = [];
    /** @type {array} */
    this.dataInformation = [];
  }
  /**
   */
  parse() {
    // this.parseHeader();
    // this.parseDataInformation();
    this.parseTracks();

    this.toPlainTrack();

    console.log(this);
  };

  /**
   * MML parse
   */
  parseTracks() {
    /** @type {array} MIDIイベント */
    let track = [];
    /** @type {array} 終了時間比較用 */
    const endTimes = [];

    for (let i = 0; i < this.input.length; i++) {
      /** @param {PSGConverter} */
      const mml2Midi = new PSGConverter({ timeDivision: this.timeDivision, channel: 0, mml: this.input[i].textContent.trim() });
      track = track.concat(mml2Midi.events);
      endTimes.push(mml2Midi.endTime);
    }

    // トラック終了
    track.concat(new MetaEvent('EndOfTrack', 0, Math.max(endTimes)));
    this.tracks.push(track);
  }
}
