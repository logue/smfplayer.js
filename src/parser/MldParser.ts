import { MidiEvent } from '@/MidiEvent';
import AbstractParser from './AbstractParser';

import type ParserOptions from '@/interfaces/ParserOptions';
/**
 * @classdesc Mld Parser Class
 * @author    imaya
 * @license   MIT
 */

export interface MldHeader {
  fileLength: number;
  trackOffset: number;
  dataMajorType: number;
  dataMinorType: number;
  numberOfTracks: number;
}

export interface MldDataInformation {
  copy: string;
  date: string;
  exst: Uint8Array;
  note: number;
  prot: string;
  sorc: number;
  titl: string;
  trac: Uint8Array;
  vers: string;
  [key: string]: string | number | Uint8Array;
}

export interface MfiMessage extends MidiEvent {
  id: number;
  deltaTime: number;
  type: 'note' | 'meta' | 'internal';
  key: number;
  length: number;
  octaveShift: number;
  velocity: number;
  voice: number;
  value: unknown;
  part?: number;
  instrument?: number;
}

export interface MldMidiTracks {
  timeDivision: number;
  track: unknown[];
  tracks: MfiMessage[][];
  plainTracks: number[][][];
}

interface EditInstrumentOperator {
  ML: number;
  VIV: number;
  EG: number;
  SUS: number;
  RR: number;
  DR: number;
  AR: number;
  SL: number;
  TL: number;
  WF: number;
  FB: number;
}

interface EditInstrumentInfo {
  part: number;
  modulator: EditInstrumentOperator;
  carrier: EditInstrumentOperator;
  octaveSelect: number;
}

export default class MldParser extends AbstractParser<
  ParserOptions,
  MfiMessage
> {
  private readonly header: MldHeader;
  dataInformation: Partial<MldDataInformation> = {};

  constructor(input: Uint8Array, options?: ParserOptions) {
    super(input, options);

    const signature = String.fromCodePoint(
      input[this.ip++],
      input[this.ip++],
      input[this.ip++],
      input[this.ip++]
    );
    if (signature !== 'melo') {
      throw new Error('invalid MFi signature:' + signature);
    }

    const fileLength =
      ((input[this.ip++] << 24) |
        (input[this.ip++] << 16) |
        (input[this.ip++] << 8) |
        input[this.ip++]) >>>
      0;
    const trackOffset = ((input[this.ip++] << 16) | input[this.ip++]) + this.ip;
    const dataMajorType = input[this.ip++];
    const dataMinorType = input[this.ip++];
    const numberOfTracks = input[this.ip++];

    this.header = {
      fileLength,
      trackOffset,
      dataMajorType,
      dataMinorType,
      numberOfTracks,
    };
  }

  parseHeader(): void {
    const input = this.input;
    let ip = this.ip;
    const dataInformation: Partial<MldDataInformation> = (this.dataInformation =
      {
        copy: undefined,
        date: undefined,
        exst: undefined,
        note: undefined,
        prot: undefined,
        sorc: undefined,
        titl: undefined,
        trac: undefined,
        vers: undefined,
      });

    while (ip < this.header.trackOffset) {
      const type = String.fromCodePoint(
        input[ip++],
        input[ip++],
        input[ip++],
        input[ip++]
      );
      const size = (input[ip++] << 8) | input[ip++];

      switch (type) {
        case 'titl':
        case 'copy':
        case 'vers':
        case 'date':
        case 'prot':
          dataInformation[type] = String.fromCodePoint.apply(
            null,
            Array.from(input.subarray(ip, (ip += size)))
          );
          break;
        case 'sorc':
          dataInformation[type] = input[ip++];
          break;
        case 'note':
          dataInformation[type] = (input[ip++] << 8) | input[ip++];
          break;
        case 'exst':
          break;
        default:
          dataInformation[type] = input.subarray(ip, (ip += size));
          break;
      }
    }

    this.ip = ip;
  }

  parseTracks(): void {
    const input = this.input;
    let ip = this.ip;
    this.tracks = [];
    const tracks = this.tracks;

    const parseEditInstrument = (): EditInstrumentInfo[] => {
      const length = (input[ip++] << 8) | input[ip++];
      const limit = ip + length;
      const result: EditInstrumentInfo[] = [];

      if (input[ip++] !== 1) {
        throw new Error('invalid EditInstrument const value:' + input[ip - 1]);
      }

      while (ip < limit) {
        result.push({
          part: (input[ip++] >> 4) & 0x3,
          modulator: {
            ML: input[ip] >> 5,
            VIV: (input[ip] >> 4) & 0x1,
            EG: (input[ip] >> 3) & 0x1,
            SUS: (input[ip] >> 2) & 0x1,
            RR: ((input[ip++] & 0x3) << 2) | (input[ip] >> 6),
            DR: (input[ip] >> 4) & 0xf,
            AR: ((input[ip++] & 0x3) << 2) | (input[ip] >> 6),
            SL: (input[ip] >> 4) & 0xf,
            TL: ((input[ip++] & 0x3) << 4) | (input[ip] >> 4),
            WF: (input[ip] >> 3) & 0x1,
            FB: input[ip++] & 0x7,
          },
          carrier: {
            ML: input[ip] >> 5,
            VIV: (input[ip] >> 4) & 0x1,
            EG: (input[ip] >> 3) & 0x1,
            SUS: (input[ip] >> 2) & 0x1,
            RR: ((input[ip++] & 0x3) << 2) | (input[ip] >> 6),
            DR: (input[ip] >> 4) & 0xf,
            AR: ((input[ip++] & 0x3) << 2) | (input[ip] >> 6),
            SL: (input[ip] >> 4) & 0xf,
            TL: ((input[ip++] & 0x3) << 4) | (input[ip] >> 4),
            WF: (input[ip] >> 3) & 0x1,
            FB: input[ip++] & 0x7,
          },
          octaveSelect: input[ip++] & 0x3,
        });
      }
      return result;
    };

    const parseVibrato = (): { part: number; switch: number } => {
      if (input[ip++] !== 1) {
        throw new Error('invalid Vibrato const value:' + input[ip - 1]);
      }
      return { part: (input[ip++] >> 5) & 0x3, switch: input[ip++] >> 6 };
    };

    const parseDeviceSpecific = (): { data: Uint8Array } => {
      const length = (input[ip++] << 8) | input[ip++];
      const limit = ip + length;
      if (input[ip++] !== 0x11) {
        throw new Error('invalid DeviceSpecific const value:' + input[ip - 1]);
      }
      return { data: input.subarray(ip, (ip += limit - ip)) };
    };

    for (let i = 0; i < this.header.numberOfTracks; ++i) {
      const signature = String.fromCodePoint(
        input[ip++],
        input[ip++],
        input[ip++],
        input[ip++]
      );
      if (signature !== 'trac') {
        throw new Error('invalid track signature:' + signature);
      }

      const size =
        (input[ip++] << 24) |
        (input[ip++] << 16) |
        (input[ip++] << 8) |
        input[ip++];
      const limit = ip + size;
      const track: MfiMessage[] = [];
      tracks[i] = track;

      while (ip < limit) {
        const message: MfiMessage = {
          id: 0,
          key: 0,
          length: 0,
          octaveShift: 0,
          subType: 'Note',
          type: 'note',
          value: {},
          velocity: 100,
          voice: 0,
          deltaTime: 0,
          time: 0,
          data: [],
        };

        message.deltaTime = input[ip++];
        let status = input[ip++];

        if (status !== 0xff) {
          message.type = 'note';
          message.subType = 'Note';
          message.voice = status >> 6;
          message.key = status & 0x3f;
          if (this.dataInformation.note === 1) {
            const extendStatus = input[ip++];
            message.velocity = extendStatus >> 2;
            message.octaveShift = extendStatus & 0x3;
          }
        } else {
          message.type = 'meta';
          status = input[ip++];

          switch (status >> 4) {
            case 0xb:
              switch (status & 0xf) {
                case 0x0:
                  message.subType = 'MasterVolume';
                  message.value = input[ip++];
                  break;
                case 0xa:
                  message.subType = 'DrumScale';
                  message.value = {
                    channel: (input[ip] >> 3) & 0x7,
                    drum: input[ip++] & 0x1,
                  };
                  break;
                default:
                  throw new Error(
                    'unknown message type:' + status.toString(16)
                  );
              }
              break;
            case 0xc:
              message.subType = 'SetTempo';
              message.value = {
                timeBase:
                  (status & 0x7) === 7
                    ? Number.NaN
                    : Math.pow(2, status & 0x7) *
                      ((status & 0x8) === 0 ? 6 : 15),
                tempo: input[ip++],
              };
              break;
            case 0xd:
              switch (status & 0xf) {
                case 0x0:
                  message.subType = 'Point';
                  message.value = input[ip++];
                  break;
                case 0xd:
                  message.subType = 'Loop';
                  message.value = {
                    id: input[ip] >> 6,
                    count: (input[ip] >> 2) & 0xf,
                    point: input[ip++] & 0x3,
                  };
                  break;
                case 0xe:
                  message.subType = 'Nop';
                  message.value = input[ip++];
                  break;
                case 0xf:
                  message.subType = 'EndOfTrack';
                  message.value = input[ip++];
                  break;
                default:
                  throw new Error(
                    'unkwnon message type:' + status.toString(16)
                  );
              }
              break;
            case 0xe:
              switch (status & 0xf) {
                case 0x0:
                  message.subType = 'InstrumentLowPart';
                  message.value = {
                    part: input[ip] >> 6,
                    instrument: input[ip++] & 0x3f,
                  };
                  break;
                case 0x1:
                  message.subType = 'InstrumentHighPart';
                  message.value = {
                    part: input[ip] >> 6,
                    instrument: input[ip++] & 0x1,
                  };
                  break;
                case 0x2:
                  message.subType = 'Volume';
                  message.value = {
                    part: input[ip] >> 6,
                    volume: input[ip++] & 0x3f,
                  };
                  break;
                case 0x3:
                  message.subType = 'Valance';
                  message.value = {
                    part: input[ip] >> 6,
                    valance: input[ip++] & 0x3f,
                  };
                  break;
                case 0x4:
                  message.subType = 'PitchBend';
                  message.value = {
                    part: input[ip] >> 6,
                    value: input[ip++] & 0x3f,
                  };
                  break;
                case 0x5:
                  message.subType = 'ChannelAssign';
                  message.value = {
                    part: input[ip] >> 6,
                    channel: input[ip++] & 0x3f,
                  };
                  break;
                case 0x6:
                  message.subType = 'VolumeChange';
                  message.value = {
                    part: input[ip] >> 6,
                    volume: ((input[ip++] & 0x3f) << 26) >> 26,
                  };
                  break;
                case 0x7:
                  message.subType = 'PitchBendRange';
                  message.value = {
                    part: input[ip] >> 6,
                    value: input[ip++] & 0x3f,
                  };
                  break;
                case 0x9:
                  message.subType = 'MasterCoarseTuning';
                  message.value = {
                    part: input[ip] >> 6,
                    value: input[ip++] & 0x3f,
                  };
                  break;
                case 0xa:
                  message.subType = 'Modulation';
                  message.value = {
                    part: input[ip] >> 6,
                    depth: input[ip++] & 0x3f,
                  };
                  break;
                default:
                  throw new Error(
                    'unkwnon message type:' + status.toString(16)
                  );
              }
              break;
            case 0xf:
              switch (status & 0xf) {
                case 0x0:
                  message.subType = 'EditInstrument';
                  message.value = parseEditInstrument();
                  break;
                case 0x1:
                  message.subType = 'Vibrato';
                  message.value = parseVibrato();
                  break;
                case 0xf:
                  message.subType = 'DeviceSpecific';
                  message.value = parseDeviceSpecific();
                  break;
                default:
                  throw new Error(
                    '[smfplayer.js] unkwnon message type:' + status.toString(16)
                  );
              }
              break;
            default:
              throw new Error(
                '[smfplayer.js] unkwnon message type:' + status.toString(16)
              );
          }
        }

        track.push(message);
      }
      ip = limit;
    }

    this.ip = ip;
  }

  /**
   * Convert MLD tracks to SMF-compatible track structure
   */
  convertToMidiTracks(): MldMidiTracks {
    const result: MldMidiTracks = {
      timeDivision: this.timeDivision,
      track: [],
      tracks: [],
      plainTracks: [],
    };

    const tracks = result.tracks;
    const plainTracks = result.plainTracks;
    const mfiTracks = this.tracks;
    const channelTime: number[] = [];

    for (let i = 0; i < 16; ++i) {
      plainTracks[i] = [];
      channelTime[i] = 0;
    }

    for (let i = 0; i < mfiTracks.length; ++i) {
      const mfiTrack = mfiTracks[i];
      const tmpTrack: Partial<MfiMessage>[] = [];
      let time = 0;
      let pos = 0;

      for (let j = 0; j < mfiTrack.length; ++j) {
        const mfiEvent = mfiTrack[j];
        time += mfiEvent.deltaTime ?? 0;
        mfiEvent.id = pos;
        mfiEvent.time = time;

        switch (mfiEvent.subType) {
          case 'Nop':
            break;
          case 'Note':
            tmpTrack[pos++] = mfiEvent;
            tmpTrack[pos] = {
              id: pos,
              type: 'internal',
              subType: 'NoteOff',
              time: time + (mfiEvent.length ?? 0),
              key: mfiEvent.key,
              voice: mfiEvent.voice,
              velocity: mfiEvent.velocity,
              octaveShift: mfiEvent.octaveShift,
              deltaTime: 0,
              length: undefined,
              value: {},
            };
            pos++;
            break;
          case 'InstrumentHighPart': {
            const prevEvent = mfiEvent;
            const nextEvent = mfiTrack[++j];
            if (nextEvent.subType !== 'InstrumentLowPart') {
              throw new Error('[smfplayer.js] broken instrument');
            }
            const prevVal = prevEvent.value as { instrument: number };
            const nextVal = nextEvent.value as {
              part: number;
              instrument: number;
            };
            tmpTrack[pos] = {
              id: pos,
              type: 'internal',
              subType: 'ProgramChange',
              time,
              part: nextVal.part,
              instrument: (prevVal.instrument << 6) | nextVal.instrument,
              deltaTime: 0,
              key: undefined,
              length: undefined,
              octaveShift: undefined,
              velocity: undefined,
              voice: undefined,
              value: {},
            };
            pos++;
            break;
          }
          default:
            tmpTrack[pos++] = mfiEvent;
            break;
        }
      }

      tmpTrack.sort((a, b) => {
        const aTime = a.time ?? 0;
        const bTime = b.time ?? 0;
        if (aTime > bTime) return 1;
        if (aTime < bTime) return -1;

        const aId = a.id ?? 0;
        const bId = b.id ?? 0;
        if (aId > bId) return 1;
        if (aId < bId) return -1;

        return 0;
      });

      tracks[i] = [] as MfiMessage[];
      let channel: number; // populated in loop below

      for (const element of tmpTrack) {
        const mfiEvent = element;
        time = mfiEvent.time ?? 0;

        switch (mfiEvent.subType) {
          case 'Note': {
            let key = this.applyOctaveShift(
              (mfiEvent.key ?? 0) + 45,
              mfiEvent.octaveShift ?? 0
            );
            channel = i * 4 + (mfiEvent.voice ?? 0);
            if (channel === 9) key -= 10;
            plainTracks[channel].push(
              this.deltaTimeToByteArray(time - channelTime[channel]).concat(
                0x90 | channel,
                key,
                (mfiEvent.velocity ?? 0) * 2
              )
            );
            break;
          }
          case 'NoteOff': {
            let key = this.applyOctaveShift(
              (mfiEvent.key ?? 0) + 45,
              mfiEvent.octaveShift ?? 0
            );
            channel = i * 4 + (mfiEvent.voice ?? 0);
            if (channel === 9) key -= 10;
            plainTracks[channel].push(
              this.deltaTimeToByteArray(time - channelTime[channel]).concat(
                0x80 | channel,
                key,
                (mfiEvent.velocity ?? 0) * 2
              )
            );
            break;
          }
          case 'ProgramChange':
            channel = i * 4 + (mfiEvent.part ?? 0);
            plainTracks[channel].push(
              this.deltaTimeToByteArray(time - channelTime[channel]).concat(
                0xc0 | channel,
                mfiEvent.instrument ?? 0
              )
            );
            break;
          case 'SetTempo': {
            const val = mfiEvent.value as { tempo: number; timeBase: number };
            const tmp = 2880000000 / (val.tempo * val.timeBase);
            channel = 0;
            plainTracks[channel].push(
              this.deltaTimeToByteArray(time - channelTime[channel]).concat(
                0xff,
                0x51,
                0x03,
                (tmp >> 16) & 0xff,
                (tmp >> 8) & 0xff,
                tmp & 0xff
              )
            );
            break;
          }
          case 'Loop': {
            const val = mfiEvent.value as {
              count: number;
              point: number;
              id: number;
            };
            const tmp = val.count;
            const str =
              'LOOP_' +
              (val.point === 0 ? 'START' : 'END') +
              '=ID:' +
              val.id +
              ',COUNT:' +
              (tmp === 0 ? -1 : tmp);
            channel = 0;
            plainTracks[channel].push(
              this.deltaTimeToByteArray(time - channelTime[channel]).concat(
                [0xff, 0x06, str.length],
                str.split('').map(a => a.codePointAt(0) ?? 0)
              )
            );
            break;
          }
          case 'MasterVolume': {
            const tmp = mfiEvent.value as number;
            channel = 0;
            plainTracks[channel].push(
              this.deltaTimeToByteArray(time - channelTime[channel]).concat(
                0xf0,
                0x07,
                0x7f,
                0x7f,
                0x04,
                0x01,
                tmp,
                tmp,
                0xf7
              )
            );
            break;
          }
          case 'Modulation': {
            const val = mfiEvent.value as { part: number; depth: number };
            channel = i * 4 + val.part;
            plainTracks[channel].push(
              this.deltaTimeToByteArray(time - channelTime[channel]).concat(
                0xb0 | channel,
                0x01,
                val.depth * 2
              )
            );
            break;
          }
          case 'Volume': {
            const val = mfiEvent.value as { part: number; volume: number };
            channel = i * 4 + val.part;
            plainTracks[channel].push(
              this.deltaTimeToByteArray(time - channelTime[channel]).concat(
                0xb0 | channel,
                0x07,
                val.volume * 2
              )
            );
            break;
          }
          case 'Valance': {
            const val = mfiEvent.value as { part: number; valance: number };
            channel = i * 4 + val.part;
            plainTracks[channel].push(
              this.deltaTimeToByteArray(time - channelTime[channel]).concat(
                0xb0 | channel,
                0x0a,
                (val.valance - 32) * 2 + 64
              )
            );
            break;
          }
          case 'PitchBend': {
            const val = mfiEvent.value as { part: number; value: number };
            channel = i * 4 + val.part;
            plainTracks[channel].push(
              this.deltaTimeToByteArray(time - channelTime[channel]).concat(
                0xe0 | channel,
                val.value * 2,
                val.value * 2
              )
            );
            break;
          }
          case 'PitchBendRange': {
            const val = mfiEvent.value as { part: number; value: number };
            channel = i * 4 + val.part;
            plainTracks[channel].push(
              this.deltaTimeToByteArray(time - channelTime[channel]).concat(
                0xb0 | channel,
                0x64,
                0x00
              ),
              [0x00, 0xb0 | channel, 0x65, 0x00],
              [0x00, 0xb0 | channel, 0x06, val.value * 2]
            );
            break;
          }
          case 'MasterCoarseTuning': {
            const val = mfiEvent.value as { part: number; value: number };
            channel = i * 4 + val.part;
            plainTracks[channel].push(
              this.deltaTimeToByteArray(time - channelTime[channel]).concat(
                0xb0 | channel,
                0x64,
                0x00
              ),
              [0x00, 0xb0 | channel, 0x65, 0x02],
              [0x00, 0xb0 | channel, 0x06, val.value * 2]
            );
            break;
          }
          default:
            continue;
        }

        channelTime[channel] = mfiEvent.time ?? 0;
      }
    }

    return result;
  }

  applyOctaveShift(key: number, octaveShift: number): number {
    const table = [0, 12, -24, -12];
    if (table[octaveShift] !== undefined) {
      return key + table[octaveShift];
    }
    throw new Error('invalid OctaveShift value:' + octaveShift);
  }

  /**
   * Convert plain track data to a raw SMF Uint8Array
   */
  toSMF(plainTracks: number[][][]): Uint8Array {
    const TimeDivision = 48;
    let result: number[] = [
      0x4d,
      0x54,
      0x68,
      0x64,
      0x00,
      0x00,
      0x00,
      0x06,
      0x00,
      0x01,
      0x00,
      0x10,
      (TimeDivision >> 8) & 0xff,
      TimeDivision & 0xff,
    ];

    const stringToArray = (str: string): number[] => {
      const array: number[] = new Array(str.length);
      for (let i = 0; i < str.length; ++i) {
        array[i] = str.codePointAt(i) ?? 0;
      }
      return array;
    };

    if (this.dataInformation.copy) {
      let copy = stringToArray(this.dataInformation.copy);
      const il = copy.length;
      copy = ([0x00, 0xff, 0x02] as number[]).concat(
        this.deltaTimeToByteArray(il),
        copy
      );
      plainTracks[0].unshift(copy);
    }

    for (const element of plainTracks) {
      const track = element;
      let trackData: number[] = [];
      for (const element of track) {
        Array.prototype.push.apply(trackData, element);
      }
      const jl = trackData.length;
      const trackHeader = [
        0x4d,
        0x54,
        0x72,
        0x6b,
        (jl >> 24) & 0xff,
        (jl >> 16) & 0xff,
        (jl >> 8) & 0xff,
        jl & 0xff,
      ];
      result = result.concat(trackHeader, trackData);
    }

    return new Uint8Array(result);
  }

  deltaTimeToByteArray(deltaTime: number): number[] {
    const array: number[] = [];
    while (deltaTime >= 0x80) {
      array.unshift((deltaTime & 0x7f) | (array.length === 0 ? 0 : 0x80));
      deltaTime >>>= 7;
    }
    array.unshift(deltaTime | (array.length === 0 ? 0 : 0x80));
    return array;
  }
}
