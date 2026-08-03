import { convert } from 'encoding-japanese';
import { parse } from 'ini';

import {
  MetaEvent,
  ChannelEvent,
  SystemExclusiveEvent,
  MidiEvent,
} from '@/MidiEvent';
import PSGConverter from '@/PSGConverter';
import ParserOptions from '@/interfaces/ParserOptions';
import AbstractParser from '@/parser/AbstractParser';

/**
 * @classdesc MakiMabi Sequence File Parser
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019,2023,2026 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */

interface MmsInformation {
  /** タイトル */
  title: string;
  /** 作者 */
  auther: string; // mms側のスペルミスでautherになっている。
  /** 分解能 */
  timeBase: string;
  /** 拍子の分子 */
  rythmNum: string;
  /** 拍子の分母ｓ */
  rythmBase: string;
}

export default class MakiMabiSequence extends AbstractParser<ParserOptions> {
  static readonly mmsInstTable = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 65, 66, 67,
    68, 69, 70, 71, 72, 73, 74, 75, 76, 18,
  ];

  protected encoder: TextEncoder;

  protected title: string = '';
  protected author: string = '';
  protected source: Record<string, Record<string, string>> = {};
  public tracks: MidiEvent[][] = [];
  public numberOfTracks: number = 0;

  public timeDivision: number = 96;

  constructor(input: Uint8Array, options?: ParserOptions) {
    super(input, options);
    this.encoder = new TextEncoder();
    this.source = parse(
      convert(input, {
        to: 'UNICODE',
        from: 'AUTO',
        type: 'string',
      }) as string
    );
  }

  public parse(): void {
    this.parseHeader();
    this.parseTracks();
    this.toPlainTrack();
  }

  protected parseHeader(): void {
    const header = (this.source.infomation ?? {}) as unknown as MmsInformation; // mms側のスペルミスでinfomationになっている
    this.title = header.title ?? '';
    this.author = header.auther ?? '';
    this.timeDivision = header.timeBase ? Number.parseInt(header.timeBase) : 96;

    const headerTrack: MidiEvent[] = [];
    headerTrack.push(
      new SystemExclusiveEvent(
        'SystemExclusive',
        0,
        0,
        [0x7e, 0x7f, 0x09, 0x01]
      )
    );
    headerTrack.push(
      new MetaEvent('SequenceTrackName', 0, 0, [
        this.encoder.encode(this.title),
      ])
    );
    headerTrack.push(
      new MetaEvent('CopyrightNotice', 0, 0, [this.encoder.encode(this.author)])
    );
    headerTrack.push(
      new MetaEvent('TimeSignature', 0, 0, [
        Number.parseInt(header.rythmNum ?? '4') || 4,
        Number.parseInt(header.rythmBase ?? '4') || 4,
        0,
        0,
      ])
    );
    headerTrack.push(new MetaEvent('EndOfTrack', 0, this.timeDivision));
    this.tracks.push(headerTrack);

    delete this.source.infomation;
    delete this.source['mms-file'];
  }

  protected parseTracks(): void {
    let track: MidiEvent[] = [];
    const endTimes: number[] = [];
    let ch = 0;

    for (const part in this.source) {
      if (!Object.hasOwn(this.source, part)) continue;

      const currentPart = this.source[part];
      const mmls = [
        currentPart.ch0_mml,
        currentPart.ch1_mml,
        currentPart.ch2_mml,
      ];
      const panpot = Number.parseInt(currentPart.panpot) + 64;

      track.push(
        new MetaEvent('InsturumentName', 0, 48, [
          this.encoder.encode(currentPart.name),
        ])
      );
      track.push(
        new ChannelEvent(
          'ProgramChange',
          0,
          96,
          ch,
          MakiMabiSequence.mmsInstTable[Number(currentPart.instrument)]
        )
      );
      track.push(new ChannelEvent('ControlChange', 0, 154, ch, 10, panpot));

      mmls.forEach(chord => {
        const mml2Midi = new PSGConverter({
          timeDivision: this.timeDivision,
          channel: ch,
          timeOffset: 386,
          mml: chord,
        });
        track = track.concat(mml2Midi.events);
        endTimes.push(mml2Midi.endTime);
      });

      ch++;
      track.concat(new MetaEvent('EndOfTrack', 0, Math.max(...endTimes)));
      this.tracks.push(track);
    }
    this.numberOfTracks = this.tracks.length;
  }

  protected toPlainTrack(): void {
    const channelEventRevTable = Object.fromEntries(
      Object.entries(ChannelEvent.table).map(([key, value]) => [
        value,
        Number(key),
      ])
    );
    const metaEventRevTable = Object.fromEntries(
      Object.entries(MetaEvent.table).map(([key, value]) => [
        value,
        Number(key),
      ])
    );

    for (let i = 0; i < this.tracks.length; i++) {
      let rawTrackEvents: number[] = [];
      let rawEvents: number[] = [];

      this.tracks[i].forEach(event => {
        let raw: number[];

        if (event instanceof ChannelEvent) {
          if (event.subtype === 'NoteOn') {
            raw = [
              (event.parameter2 === 0 ? 0x80 : 0x90) | event.channel,
              event.parameter1,
              event.parameter2 ?? 0,
            ];
          } else {
            raw = [
              channelEventRevTable[event.subtype] | event.channel,
              event.parameter1,
              event.parameter2 ?? 0,
            ];
          }
        } else if (event instanceof MetaEvent) {
          raw = [
            0xff,
            metaEventRevTable[event.subtype],
            ...(event.data as number[]),
          ];
        } else if (event instanceof SystemExclusiveEvent) {
          raw = [0xf0, 0x05, ...(event.data as number[])];
        } else {
          raw = [];
        }

        rawEvents = rawEvents.concat(Array.from(new Uint8Array(raw)));
      });

      rawTrackEvents = rawTrackEvents.concat(rawEvents);
      // Store the flat byte array as a single-element array for compatibility
      this.plainTracks[i] = [new Uint8Array(rawTrackEvents)];
    }
  }
}
