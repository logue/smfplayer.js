import PSGConverter from './PSGConverter';
import MakiMabiSequence from './mms';

import { MetaEvent } from '@/midi_event';

/**
 * @classdesc MapleStory2 Mml Parser
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019,2023 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */
export default class MapleStory2Mml extends MakiMabiSequence {
  /**
   * @param {Uint8Array} input
   * @param {Object} optParams
   */
  constructor(input, optParams = {}) {
    super(input, optParams);
    /** @type {DOMParser} */
    const parser = new DOMParser();
    /** @type {Document} */
    const doc = parser.parseFromString(
      String.fromCharCode.apply('', new Uint16Array(input)),
      'text/xml'
    );
    /** @param {NodeList} */
    this.input = doc.querySelectorAll('ms2 > *');
    /** @type {Object[][]} 全トラックの演奏情報 */
    this.tracks = [];
    /** @type {Uint8Array[][]} WMLに送る生のMIDIイベント */
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
    /** @type {import('../midi_event').MidiEvent[][]} MIDIイベント */
    let track = [];
    /** @type {number[]} 終了時間比較用 */
    const endTimes = [];

    this.input.forEach(element => {
      /** @param {PSGConverter} */
      const mml2Midi = new PSGConverter({
        timeDivision: this.timeDivision,
        channel: 0,
        timeOffset: 0,
        mml: element.textContent.trim(),
        ignoreTempo: false,
      });
      track = track.concat(mml2Midi.events);
      endTimes.push(mml2Midi.endTime);
    });

    // トラック終了
    track.concat(new MetaEvent('EndOfTrack', 0, Math.max(endTimes)));
    this.tracks.push(track);
  }
}
