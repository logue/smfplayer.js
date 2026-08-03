import MakiMabiSequence from './MakiMabiSequenceParser';

import {
  MetaEvent,
  ChannelEvent,
  SystemExclusiveEvent,
  MidiEvent,
} from '@/MidiEvent';
import PSGConverter from '@/PSGConverter';

/**
 * @classdesc MabiIcco MML File Parser
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019,2023,2026 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */

export interface MabiIccoTrack {
  mml: string;
  name: string;
  program: number;
  songProgram: number;
  panpot: number;
  [key: string]: string | number;
}

export default class MabiIcco extends MakiMabiSequence {
  static readonly multipleKeys = [
    'mml-track',
    'name',
    'program',
    'songProgram',
    'panpot',
  ];

  mmiLines: string[] = [];
  mmiTracks: MabiIccoTrack[] = [];

  constructor(input: Uint8Array) {
    super(input);
    // Ensure source is treated as a string before splitting (fixes TS errors when
    // `this.source` may be typed as a Record or other non-string)
    this.mmiLines = String(this.source).split(/\r\n|\r|\n/);
    this.mmiTracks = [];
    this.tracks = [];
    this.plainTracks = [];
    this.numberOfTracks = 1;
    this.timeDivision = 96;
    this.tempo = 120;
  }

  parse(): void {
    this.parseHeader();
    this.parseTracks();
    this.toPlainTrack();
  }

  parseHeader(): void {
    const ret: Record<string, unknown> & { track: MabiIccoTrack[] } = {
      track: [],
    };
    let trackNo = -1;

    const lines = this.mmiLines;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (i === 0 && line !== '[mml-score]') {
        throw new Error('Not MabiIcco File.');
      }
      const [key, value] = line.split('=');

      if (MabiIcco.multipleKeys.includes(key)) {
        if (key === 'mml-track') {
          trackNo++;
          ret.track[trackNo] = {} as MabiIccoTrack;
          ret.track[trackNo].mml = value;
        } else {
          (ret.track[trackNo] as Record<string, unknown>)[key] =
            key === 'name' ? value : Number(value) || 0;
        }
      } else {
        ret[key] = value;
      }
    }

    this.title = (ret.title as string) ?? '';
    this.author = (ret.author as string) ?? '';
    const mmiTempo =
      ret.tempo === '' ? ['0', '120'] : (ret.tempo as string).split('T');
    this.timeDivision = 96;
    this.tempo = Number.parseInt(mmiTempo[1]) || 120;
    const timeSig = ((ret.time as string) ?? '4/4').split('/');

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
        Number.parseInt(timeSig[0]) || 4,
        Number.parseInt(timeSig[1]) || 4,
        0,
        0,
      ])
    );
    headerTrack.push(
      new MetaEvent('SetTempo', 0, 0, [Math.floor(60000000 / this.tempo)])
    );
    headerTrack.push(new MetaEvent('EndOfTrack', 0, 0));
    this.tracks.push(headerTrack);

    this.mmiTracks = ret.track;
  }

  parseTracks(): void {
    let track: MidiEvent[] = [];
    const endTimes: number[] = [];

    for (let ch = 0; ch < this.mmiTracks.length; ch++) {
      const current = this.mmiTracks[ch];
      const mmlMatch = current.mml.match(/^(?:MML@)(.*)/gm);
      if (!mmlMatch) continue;

      const mmls = mmlMatch[0].split(',');

      track.push(
        new MetaEvent('InsturumentName', 0, 48, [
          this.encoder.encode(current.name),
        ])
      );
      track.push(new ChannelEvent('ProgramChange', 0, 96, ch, current.program));
      if (current.songProgram !== -1) {
        track.push(
          new ChannelEvent('ProgramChange', 0, 112, 15, current.songProgram)
        );
      }
      track.push(
        new ChannelEvent('ControlChange', 0, 154, ch, 10, current.panpot)
      );

      for (let chord = 0; chord < current.mml.length; chord++) {
        let currentCh = ch;
        if (chord === 3 && current.songProgram !== -1) {
          currentCh = 15;
        }
        if (!mmls[chord]) continue;

        const mml2Midi = new PSGConverter({
          timeDivision: this.timeDivision,
          channel: currentCh,
          timeOffset: 386,
          mml: mmls[chord],
          ignoreTempo: currentCh === 1,
        });
        track = track.concat(mml2Midi.events);
        endTimes.push(mml2Midi.endTime);
      }

      track.concat(new MetaEvent('EndOfTrack', 0, Math.max(...endTimes)));
      this.tracks.push(track);
    }
    this.numberOfTracks = this.tracks.length;
  }
}
