import PSGConverter from './PSGConverter';
import Mld from './mld';

/**
 * MapleStory2 Mml Parser
 *
 * @author Logue <logue@hotmail.co.jp>
 * @copyright 2007-2013,2018,2019 Logue <http://logue.be/> All rights reserved.
 * @license MIT
 */
export default class Ms2Mml extends Mld {
  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  constructor(input, optParams) {
    super(input, optParams);
    /** @type {ByteArray} */
    this.input = input;
    /** @type {Array.<Array.<Object>>} */
    this.tracks = [];
  }
  /**
   */
  parse() {
    this.parseHeader();
    // this.parseDataInformation();
    this.parseTracks();
  };
  /**
   */
  parseHeader() {
    /** @type {DOMParser} */
    const parser = new DOMParser();
    /** @type {Document} */
    const doc = parser.parseFromString(String.fromCharCode.apply('', new Uint16Array(this.input)), 'text/xml');
    /** @param {Element} */
    this.trackElements = doc.querySelectorAll('ms2 > *');
    /** @param {array} */
    this.tracks = [];
    /** @param {number} */
    this.timeDivision = 96;

    this.dataInformation = [];

    this.plainTracks = [];
  };
  /**
   * MML parse
   */
  parseTracks() {
    let track = [];
    let plainTrack = [];
    for (let i = 0; i < this.trackElements.length; i++) {
      /** @param {PSGConverter} */
      const mml2Midi = new PSGConverter({ timeDivision: this.timeDivision });
      /** @param {array} */
      const events = mml2Midi.parse(this.trackElements[i].textContent.trim(), 0);
      track = track.concat(events);
      const plainEvents = mml2Midi.toPlainTrack(events);
      plainTrack = plainTrack.concat(plainEvents);
    }

    // channel.push(new MetaEvent('EndOfTrack', 0, mml2Midi.time));
    this.tracks.push(track);
    this.plainTracks.push(plainTrack);
  }
}
