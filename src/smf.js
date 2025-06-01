import { convert } from 'encoding-japanese';

import { ChannelEvent, SystemExclusiveEvent, MetaEvent } from '@/midi_event';
import Riff from '@/riff';

/**
 * @classdesc Standard Midi File Parser class
 * @author    imaya, Logue
 * @license   MIT
 */
export default class Parser {
  /**
   * @param {Uint8Array} input input buffer.
   * @param {object} optParams option parameters.
   */
  constructor(input, optParams = {}) {
    optParams.padding = false;
    optParams.bigEndian = true;

    /** @type {Uint8Array} */
    this.input = input;
    /** @type {number} */
    this.ip = optParams.index || 0;
    /** @type {number} */
    this.chunkIndex = 0;
    /**
     * @type {Riff}
     * @private
     */
    this.riffParser_ = new Riff(input, optParams);

    // MIDI File Information

    /** @type {number} */
    this.formatType = 0;
    /** @type {number} */
    this.numberOfTracks = 0;
    /** @type {number} */
    this.timeDivision = 480;
    /** @type {import('./midi_event').MidiEvent[][]} */
    this.tracks = [];
    /** @type {Uint8Array[][]} */
    this.plainTracks = [];
  }

  /**
   */
  parse() {
    /** @type {number} */
    let i = 0;
    /** @type {number} */
    let il = 0;

    // parse riff chunks
    this.riffParser_.parse();

    // parse header chunk
    this.parseHeaderChunk();

    // parse track chunks
    for (i = 0, il = this.numberOfTracks; i < il; ++i) {
      this.parseTrackChunk();
    }
  }

  /**
   */
  parseHeaderChunk() {
    /** @type {?{type: string, size: number, offset: number}} */
    const chunk = this.riffParser_.getChunk(this.chunkIndex++);
    /** @type {Uint8Array} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;

    if (!chunk || chunk.type !== 'MThd') {
      throw new Error('invalid header signature');
    }

    this.formatType = (data[ip++] << 8) | data[ip++];
    this.numberOfTracks = (data[ip++] << 8) | data[ip++];
    this.timeDivision = (data[ip++] << 8) | data[ip++];
  }

  /**
   */
  parseTrackChunk() {
    /** @type {?{type: string, size: number, offset: number}} */
    const chunk = this.riffParser_.getChunk(this.chunkIndex++);
    /** @type {Uint8Array} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {number} */
    let size = 0;
    /** @type {number} */
    let deltaTime = 0;
    /** @type {number} */
    let eventType = 0;
    /** @type {number} */
    let channel = 0;
    /** @type {number} */
    let prevEventType = -1;
    /** @type {number} */
    let prevChannel = -1;
    /** @type {number} */
    let tmp = 0;
    /** @type {number} */
    let totalTime = 0;
    /** @type {number} */
    let offset = 0;
    /** @type {number} */
    let length = 0;
    /** @type {number} */
    let status = 0;
    /** @type {import('./midi_event').MidiEvent} */
    let event;
    /** @type {Uint8Array} */
    let plainBytes;

    /** @return {number} */
    const readNumber = () => {
      /** @type {number} */
      let result = 0;

      tmp = 0;

      do {
        tmp = data[ip++];
        result = (result << 7) | (tmp & 0x7f);
      } while ((tmp & 0x80) !== 0);

      return result;
    };

    if (!chunk || chunk.type !== 'MTrk') {
      throw new Error('invalid header signature');
    }

    size = chunk.offset + chunk.size;
    const eventQueue = [];
    const plainQueue = [];

    while (ip < size) {
      // delta time
      deltaTime = readNumber();
      totalTime += deltaTime;

      // offset
      offset = ip;

      // event type value, midi channel
      status = data[ip++];
      eventType = (status >> 4) & 0xf;
      channel = status & 0xf;

      // run status rule
      if (eventType < 8) {
        eventType = prevEventType;
        channel = prevChannel;
        status = (prevEventType << 4) | prevChannel;
        ip--;
        offset--;
      } else {
        prevEventType = eventType;
        prevChannel = channel;
      }

      // Channel Event
      if (eventType !== 0xf) {
        event = new ChannelEvent(
          ChannelEvent.table[eventType],
          deltaTime,
          totalTime,
          channel,
          data[ip++],
          eventType === 0xc ? undefined : data[ip++]
        );
      } else {
        if (channel !== 0xf) {
          tmp = readNumber();
          if (channel === 0x0 && data[ip + tmp - 1] !== 0xf7) {
            throw new Error('invalid SysEx event');
          }
          event = new SystemExclusiveEvent(
            SystemExclusiveEvent.table[channel],
            deltaTime,
            totalTime,
            data.subarray(ip, (ip += tmp) - 1)
          );
        } else {
          eventType = data[ip++];
          tmp = readNumber();
          switch (eventType) {
            case 0x00: // sequence number
              event = new MetaEvent('SequenceNumber', deltaTime, totalTime, [
                data[ip++],
                data[ip++],
              ]);
              break;
            case 0x01: // text event
            case 0x02: // copyright notice
            case 0x03: // sequence/track name
            case 0x04: // instrument name
            case 0x05: // lyrics
            case 0x06: // marker
            case 0x07: {
              // cue point
              const buffer = data.subarray(ip, (ip += tmp));

              event = new MetaEvent(
                MetaEvent.table[eventType],
                deltaTime,
                totalTime,
                [
                  // UTF-8にして登録
                  convert(buffer, {
                    to: 'UTF-8',
                    from: 'AUTO',
                    type: 'arraybuffer',
                  }),
                ]
              );

              break;
            }
            case 0x2f: // end of track
              event = new MetaEvent('EndOfTrack', deltaTime, totalTime, []);
              break;
            case 0x51: // set tempo
              event = new MetaEvent('SetTempo', deltaTime, totalTime, [
                (data[ip++] << 16) | (data[ip++] << 8) | data[ip++],
              ]);
              break;
            case 0x54: // smpte offset
              event = new MetaEvent('SmpteOffset', deltaTime, totalTime, [
                data[ip++],
                data[ip++],
                data[ip++],
                data[ip++],
                data[ip++],
              ]);
              break;
            case 0x58: // time signature
              event = new MetaEvent('TimeSignature', deltaTime, totalTime, [
                data[ip++],
                data[ip++],
                data[ip++],
                data[ip++],
              ]);
              break;
            case 0x59: // key signature
              event = new MetaEvent('KeySignature', deltaTime, totalTime, [
                data[ip++],
                data[ip++],
              ]);
              break;
            case 0x7f: // sequencer specific
              event = new MetaEvent('SequencerSpecific', deltaTime, totalTime, [
                data.subarray(ip, (ip += tmp)),
              ]);
              break;
            default:
              // unknown
              event = new MetaEvent(
                MetaEvent.table[eventType],
                deltaTime,
                totalTime,
                [eventType, data.subarray(ip, (ip += tmp))]
              );
          }
        }
      }

      // plain queue
      length = ip - offset;
      plainBytes = data.subarray(offset, offset + length);
      plainBytes[0] = status;
      if (
        event instanceof ChannelEvent &&
        event.subtype === 'NoteOn' &&
        /** @type {ChannelEvent} */
        (event).parameter2 === 0
      ) {
        event.subtype = ChannelEvent.table[8];
        plainBytes = new Uint8Array([
          0x80 | event.channel,
          event.parameter1,
          event.parameter2,
        ]);
      }
      plainQueue.push(plainBytes);

      // event queue
      eventQueue.push(event);
    }

    this.tracks.push(eventQueue);
    this.plainTracks.push(plainQueue);
  }
}
