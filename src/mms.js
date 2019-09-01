import PSGConverter from './PSGConverter';
import Mld from './mld';
import Ini from 'ini';
import { MetaEvent, ChannelEvent } from './midi_event';
/**
 * MakiMabi Sequence file Parser
 *
 * @author Logue <logue@hotmail.co.jp>
 * @copyright 2019 Logue <http://logue.be/> All rights reserved.
 * @license MIT
 */
export default class MakiMabiSequence extends Mld {
  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  constructor(input, optParams = {}) {
    super(input, optParams);
    /** @type {string} */
    const string = String.fromCharCode.apply('', new Uint16Array(input));
    /** @type {Ini} */
    this.input = Ini.parse(string);

    /** @type {Array.<Array.<Object>>} */
    this.tracks = [];
    this.dataInformation = [];

    this.plainTracks = [];
  }
  /**
   */
  parse() {
    this.parseHeader();
    // this.parseDataInformation();
    this.parseTracks();

    this.toPlainTrack();

    console.log(this);
  };
  /**
   */
  parseHeader() {
    const header = this.input.infomation; // informationじゃない
    /** @param {string} */
    this.title = header.title;
    /** @param {string} */
    this.author = header.auther; // authorじゃない。
    /** @param {number} */
    this.timeDivision = parseInt(header.timeBase);
    // informationおよびmms-fileを取り除く
    delete this.input['infomation'];
    delete this.input['mms-file'];
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
    let channel = 0;

    for (const part in input) {
      if (input.hasOwnProperty(part)) {
        /** @param {array} */
        const mmls = [input[part].ch0_mml, input[part].ch1_mml, input[part].ch2_mml];

        // 楽器
        // track.push(new MetaEvent('InstrumentName', 0, 48, [input[part].name]));
        track.push(new ChannelEvent('ProgramChange', 0, 96, channel, parseInt(input[part].instrument)));
        // パン
        track.push(new ChannelEvent('ControlChange', 0, 154, channel, parseInt(input[part].panpot)));

        // MMLの各チャンネルの処理
        for (let chord = 0; chord < mmls.length; chord++) {
          /** @param {PSGConverter} */
          const mml2Midi = new PSGConverter({ timeDivision: this.timeDivision, channel: channel, timeOffset: 386, mml: mmls[chord] });
          // トラックにマージ
          track = track.concat(mml2Midi.events);
          endTimes.push(mml2Midi.endTime);
        }
        // トラック終了
        track.concat(new MetaEvent('EndOfTrack', 0, Math.max(endTimes)));
        this.tracks.push(track);
        channel++;
      }
    }
  }

  /**
   * WebMidiLink信号に変換
   */
  toPlainTrack() {
    /** @type {array} */
    const rawEvents = [];

    console.log(this.tracks);
    for (let i = 0; i < this.tracks.length; i++) {
      /** @type {array} */
      const events = this.tracks[i];

      for (let j = 0; j < events.length; j++) {
        /** @type {Event} */
        const event = events[j];
        /** @var {Uint8Array} */
        let raw;

        if (event instanceof ChannelEvent) {
          switch (event.subtype) {
            case 'NoteOn':
              // console.log(event);
              if ((event).parameter2 === 0) {
                raw = new Uint8Array([0x80 | event.channel, event.parameter1, event.parameter2]);
              } else {
                raw = new Uint8Array([0x90 | event.channel, event.parameter1, event.parameter2]);
              }
              break;
            case 'NoteOff':
              raw = new Uint8Array([0x80 | event.channel, event.parameter1, event.parameter2]);
              break;
            case 'ControlChange':
              raw = new Uint8Array([0xB | event.channel, event.parameter1, event.parameter2]);
              break;
            case 'ProgramChange':
              raw = new Uint8Array([0xC | event.channel, event.parameter1, event.parameter2]);
              break;
          }
        } else if (event instanceof MetaEvent) {
          switch (event.subtype) {
            case 'SetTempo':
              // TODO: 影響ないが間違っている
              raw = new Uint8Array([0xFF, 0x51, 0x03, 0x07, 0xA1, 0x20]);
              break;
          }
        }
        rawEvents.push(raw);
      }
    }
    this.plainTracks.push(rawEvents);
  }
}


