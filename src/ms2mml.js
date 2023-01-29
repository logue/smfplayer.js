import PSGConverter from './PSGConverter';
import { MetaEvent } from './midi_event';
import MakiMabiSequence from './mms';

/**
 * @classdesc MapleStory2 Mml Parser
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */
export default class MapleStory2Mml extends MakiMabiSequence {
  /**
   * @param {ArrayBuffer} input
   * @param {Object=} optParams
   */
  constructor(input, optParams = {}) {
    super(input, optParams);
    /** @type {TextEncoder} */
    this.encoder = new TextEncoder('utf-8');
    /** @type {DOMParser} */
    const parser = new DOMParser();
    /** @type {Document} */
    const doc = parser.parseFromString(
      String.fromCharCode.apply('', new Uint16Array(input)),
      'text/xml'
    );
    /** @param {Element} */
    this.input = doc.querySelectorAll('ms2 > *');
    /** @type {Array.<Array.<Object>>} 全トラックの演奏情報 */
    this.tracks = [];
    /** @type {Array.<Array.<Uint8Array>>} WMLに送る生のMIDIイベント */
    this.plainTracks = [];
    /** @param {number} トラック数 */
    this.numberOfTracks = 1;
    /** @type {number} 解像度 */
    this.timeDivision = optParams.timeDivision || 96;
  }

  /**
   */
  parse() {
    // this.parseHeader();
    // this.parseDataInformation();
    this.parseTracks();

    this.toPlainTrack();
  }

  /**
   * MML parse
   */
  parseTracks() {
    /** @type {MidiEvent[]} MIDIイベント */
    let track = [];
    /** @type {number[]} 終了時間比較用 */
    const endTimes = [];

    for (const i of this.input) {
      /** @param {PSGConverter} */
      const mml2Midi = new PSGConverter({
        timeDivision: this.timeDivision,
        channel: 0,
        mml: this.input[i].textContent.trim(),
        ignoreTempo: false,
      });
      track = track.concat(mml2Midi.events);
      endTimes.push(mml2Midi.endTime);
    }

    // トラック終了
    track.concat(new MetaEvent('EndOfTrack', 0, Math.max(endTimes)));
    this.tracks.push(track);
  }
}
