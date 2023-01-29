import { ChannelEvent, SystemExclusiveEvent, MetaEvent } from './midi_event';
import Meta from './meta';
import Riff from './riff';

/**
 * @classdesc Standard Midi File Parser class
 * @author    imaya
 * @license   MIT
 */
export default class Parser {
  /**
   * @param {ArrayBuffer} input input buffer.
   * @param {Object=} optParams option parameters.
   */
  constructor(input, optParams = {}) {
    optParams.padding = false;
    optParams.bigEndian = true;

    /** @type {ArrayBuffer} */
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
    /** @type {MidiEvent[][]} */
    this.tracks = [];
    /** @type {ArrayBuffer[][]} */
    this.plainTracks = [];

    /** @type {number} */
    this.version = Meta.version;
    /** @type {string} */
    this.build = Meta.build;
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
    /** @type {ArrayBuffer} */
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
    /** @type {ArrayBuffer} */
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
    /** @type {MidiEvent} */
    let event;
    /** @type {ArrayBuffer} */
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

      // TODO
      const table = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        'NoteOff', // 0x8
        'NoteOn',
        'NoteAftertouch',
        'ControlChange',
        'ProgramChange',
        'ChannelAftertouch',
        'PitchBend',
      ];

      switch (eventType) {
        // channel events
        case 0x8:
        /* FALLTHROUGH */
        case 0x9:
        /* FALLTHROUGH */
        case 0xa:
        /* FALLTHROUGH */
        case 0xb:
        /* FALLTHROUGH */
        case 0xd:
        /* FALLTHROUGH */
        case 0xe:
          event = new ChannelEvent(
            table[eventType],
            deltaTime,
            totalTime,
            channel,
            data[ip++],
            data[ip++]
          );
          break;
        case 0xc:
          event = new ChannelEvent(
            table[eventType],
            deltaTime,
            totalTime,
            channel,
            data[ip++]
          );
          break;
        // meta events, system exclusive event
        case 0xf:
          switch (channel) {
            // SysEx event
            case 0x0:
              tmp = readNumber();
              if (data[ip + tmp - 1] !== 0xf7) {
                throw new Error('invalid SysEx event');
              }
              event = new SystemExclusiveEvent(
                'SystemExclusive',
                deltaTime,
                totalTime,
                data.subarray(ip, (ip += tmp) - 1)
              );
              break;
            case 0x7:
              tmp = readNumber();
              event = new SystemExclusiveEvent(
                'SystemExclusive(F7)',
                deltaTime,
                totalTime,
                data.subarray(ip, (ip += tmp))
              );
              break;
            // meta event
            case 0xf:
              eventType = data[ip++];
              tmp = readNumber();
              switch (eventType) {
                case 0x00: // sequence number
                  event = new MetaEvent(
                    'SequenceNumber',
                    deltaTime,
                    totalTime,
                    [data[ip++], data[ip++]]
                  );
                  break;
                case 0x01: // text event
                  event = new MetaEvent('TextEvent', deltaTime, totalTime, [
                    String.fromCharCode.apply(
                      null,
                      data.subarray(ip, (ip += tmp))
                    ),
                  ]);
                  break;
                case 0x02: // copyright notice
                  event = new MetaEvent(
                    'CopyrightNotice',
                    deltaTime,
                    totalTime,
                    [
                      String.fromCharCode.apply(
                        null,
                        data.subarray(ip, (ip += tmp))
                      ),
                    ]
                  );
                  break;
                case 0x03: // sequence/track name
                  event = new MetaEvent(
                    'SequenceTrackName',
                    deltaTime,
                    totalTime,
                    [
                      String.fromCharCode.apply(
                        null,
                        data.subarray(ip, (ip += tmp))
                      ),
                    ]
                  );
                  break;
                case 0x04: // instrument name
                  event = new MetaEvent(
                    'InstrumentName',
                    deltaTime,
                    totalTime,
                    [
                      String.fromCharCode.apply(
                        null,
                        data.subarray(ip, (ip += tmp))
                      ),
                    ]
                  );
                  break;
                case 0x05: // lyrics
                  event = new MetaEvent('Lyrics', deltaTime, totalTime, [
                    String.fromCharCode.apply(
                      null,
                      data.subarray(ip, (ip += tmp))
                    ),
                  ]);
                  break;
                case 0x06: // marker
                  event = new MetaEvent('Marker', deltaTime, totalTime, [
                    String.fromCharCode.apply(
                      null,
                      data.subarray(ip, (ip += tmp))
                    ),
                  ]);
                  break;
                case 0x07: // cue point
                  event = new MetaEvent('CuePoint', deltaTime, totalTime, [
                    String.fromCharCode.apply(
                      null,
                      data.subarray(ip, (ip += tmp))
                    ),
                  ]);
                  break;
                case 0x20: // midi channel prefix
                  event = new MetaEvent(
                    'MidiChannelPrefix',
                    deltaTime,
                    totalTime,
                    [data[ip++]]
                  );
                  break;
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
                  event = new MetaEvent(
                    'SequencerSpecific',
                    deltaTime,
                    totalTime,
                    [data.subarray(ip, (ip += tmp))]
                  );
                  break;
                default:
                  // unknown
                  event = new MetaEvent('Unknown', deltaTime, totalTime, [
                    eventType,
                    data.subarray(ip, (ip += tmp)),
                  ]);
              }
              break;
            default:
              console.warn('unknown message:', status.toString(16));
          }
          break;
        // error
        default:
          throw new Error('invalid status');
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
        event.subtype = table[8];
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
