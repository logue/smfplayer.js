import { convert } from 'encoding-japanese';

import AbstractParser from './AbstractParser';

import type { RiffOptions } from '@/interfaces/RiffOptions';

import {
  ChannelEvent,
  SystemExclusiveEvent,
  MetaEvent,
  MidiEvent,
} from '@/MidiEvent';
import { Riff } from '@/Riff';
import SmfFormat, { type SmfFormatType } from '@/types/SmfFormat';

/**
 * @classdesc Standard Midi File Parser class
 * @author    imaya, Logue
 * @license   MIT
 */
export default class SmfParser extends AbstractParser<
  Partial<RiffOptions>,
  MidiEvent
> {
  protected chunkIndex: number = 0;
  protected formatType: SmfFormatType = SmfFormat.SMF_0;

  /** Riffパーサー */
  protected parser: Riff;

  constructor(input: Uint8Array, options?: Partial<RiffOptions>) {
    options!.padding = false;
    options!.bigEndian = true;

    super(input, options);
    this.parser = new Riff(input, options);
  }

  protected parseHeader(): void {
    const chunk = this.parser.getChunk(this.chunkIndex++);

    if (chunk?.type !== 'MThd') {
      throw new Error('[smfplayer.js] invalid header signature');
    }

    const data = this.input;
    let ip = chunk.offset;

    this.formatType = (data[ip++] << 8) | data[ip++];
    this.numberOfTracks = (data[ip++] << 8) | data[ip++];
    this.timeDivision = (data[ip] << 8) | data[ip + 1];
  }

  parseTracks(): void {
    const chunk = this.parser.getChunk(this.chunkIndex++);

    if (chunk?.type !== 'MTrk') {
      throw new Error('[smfplayer.js] invalid header signature');
    }

    const data = this.input;
    let ip = chunk.offset;
    let deltaTime: number;
    let eventType: number;
    let channel: number;
    let prevEventType = -1;
    let prevChannel = -1;
    let tmp = 0;
    let totalTime = 0;
    let offset: number;
    let length: number;
    let status: number;
    let event: MidiEvent;
    let plainBytes: Uint8Array;

    const readNumber = (): number => {
      let result = 0;
      tmp = 0;
      do {
        tmp = data[ip++];
        result = (result << 7) | (tmp & 0x7f);
      } while ((tmp & 0x80) !== 0);
      return result;
    };

    const size = chunk.offset + chunk.size;
    const eventQueue: MidiEvent[] = [];
    const plainQueue: Uint8Array[] = [];

    while (ip < size) {
      deltaTime = readNumber();
      totalTime += deltaTime;
      offset = ip;

      status = data[ip++];
      eventType = (status >> 4) & 0xf;
      channel = status & 0xf;

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
            throw new Error('[smfplayer.js] invalid SysEx event');
          }
          event = new SystemExclusiveEvent(
            SystemExclusiveEvent.table[channel] ?? '',
            deltaTime,
            totalTime,
            Array.from(data.subarray(ip, (ip += tmp) - 1))
          );
        } else {
          eventType = data[ip++];
          tmp = readNumber();
          switch (eventType) {
            case 0x00:
              event = new MetaEvent('SequenceNumber', deltaTime, totalTime, [
                data[ip++],
                data[ip++],
              ]);
              break;
            case 0x01:
            case 0x02:
            case 0x03:
            case 0x04:
            case 0x05:
            case 0x06:
            case 0x07: {
              const buffer = data.subarray(ip, (ip += tmp));
              event = new MetaEvent(
                MetaEvent.table[eventType],
                deltaTime,
                totalTime,
                [
                  convert(buffer, {
                    to: 'UTF-8',
                    from: 'AUTO',
                    type: 'arraybuffer',
                  }) as ArrayBuffer,
                ]
              );
              break;
            }
            case 0x2f:
              event = new MetaEvent('EndOfTrack', deltaTime, totalTime, []);
              break;
            case 0x51:
              event = new MetaEvent('SetTempo', deltaTime, totalTime, [
                (data[ip++] << 16) | (data[ip++] << 8) | data[ip++],
              ]);
              break;
            case 0x54:
              event = new MetaEvent('SmpteOffset', deltaTime, totalTime, [
                data[ip++],
                data[ip++],
                data[ip++],
                data[ip++],
                data[ip++],
              ]);
              break;
            case 0x58:
              event = new MetaEvent('TimeSignature', deltaTime, totalTime, [
                data[ip++],
                data[ip++],
                data[ip++],
                data[ip++],
              ]);
              break;
            case 0x59:
              event = new MetaEvent('KeySignature', deltaTime, totalTime, [
                data[ip++],
                data[ip++],
              ]);
              break;
            case 0x7f:
              event = new MetaEvent('SequencerSpecific', deltaTime, totalTime, [
                data.subarray(ip, (ip += tmp)),
              ]);
              break;
            default:
              event = new MetaEvent(
                MetaEvent.table[eventType],
                deltaTime,
                totalTime,
                [eventType, data.subarray(ip, (ip += tmp))]
              );
          }
        }
      }

      length = ip - offset;
      plainBytes = data.subarray(offset, offset + length);
      plainBytes[0] = status;
      if (
        event instanceof ChannelEvent &&
        event.subType === 'NoteOn' &&
        event.parameter2 === 0
      ) {
        event.subType = ChannelEvent.table[8];
        plainBytes = new Uint8Array([
          0x80 | event.channel,
          event.parameter1,
          event.parameter2 ?? 0,
        ]);
      }
      plainQueue.push(plainBytes);
      eventQueue.push(event);
    }

    this.tracks.push(eventQueue);
    this.plainTracks.push(plainQueue);
  }
}
