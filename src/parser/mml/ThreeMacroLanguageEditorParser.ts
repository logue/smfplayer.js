import MakiMabiSequence from './MakiMabiSequenceParser';

import {
  MetaEvent,
  ChannelEvent,
  SystemExclusiveEvent,
  MidiEvent,
} from '@/MidiEvent';
import PSGConverter from '@/PSGConverter';

/**
 * @classdesc Three Macro Language Editor (3MLE) mml file Parser
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019,2023 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */

interface ThreeMleSettings {
  Title: string;
  Source: string;
  TimeBase: string;
  TimeSignatureNN: string;
  TimeSignatureDD: string;
  Memo: string;
  [key: string]: string;
}

interface ThreeMleChannelData {
  mml: string;
  name: string;
  instrument: number;
  panpot: number;
}

export default class ThreeMacroLanguageEditor extends MakiMabiSequence {
  constructor(input: Uint8Array) {
    super(input);
  }

  parseHeader(): void {
    const header = (this.input as unknown as Record<string, ThreeMleSettings>)
      .Settings;
    this.title = header.Title ?? '';
    this.author = header.Source ?? '';
    this.timeDivision = header.TimeBase ? Number.parseInt(header.TimeBase) : 32;

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
      new MetaEvent('TextEvent', 0, 0, [this.encoder.encode(header.Memo ?? '')])
    );
    headerTrack.push(
      new MetaEvent('TimeSignature', 0, 0, [
        header.TimeSignatureNN ? Number.parseInt(header.TimeSignatureNN) : 4,
        header.TimeSignatureDD ? Number.parseInt(header.TimeSignatureDD) : 4,
        0,
        0,
      ])
    );
    headerTrack.push(new MetaEvent('EndOfTrack', 0, 0));
    this.tracks.push(headerTrack);

    const inputRecord = this.input as unknown as Record<string, unknown>;
    delete inputRecord['3MLE EXTENSION'];
    delete inputRecord['Settings'];
  }

  parseTracks(): void {
    const input = this.source;
    const endTimes: number[] = [];
    const mmls: string[] = [];
    const settings: Array<{
      name: string;
      instrument: number;
      panpot: number;
    }> = [];

    for (const block in input) {
      if (!Object.prototype.hasOwnProperty.call(input, block)) continue;

      const channelMatch = /^Channel(\d+)$/i.exec(block);
      if (channelMatch) {
        mmls[(Number(channelMatch[1]) | 0) - 1] = Object.keys(input[block])
          .join('')
          .replace(/\/\*([^*]|\*[^/])*\*\//g, '');
      }

      const propMatch = /^ChannelProperty(\d+)$/i.exec(block);
      if (propMatch) {
        settings[(Number(propMatch[1]) | 0) - 1] = {
          name: input[block].Name,
          instrument: Number.parseInt(input[block].Patch),
          panpot: Number.parseInt(input[block].Pan),
        };
      }
    }

    const data: ThreeMleChannelData[] = [];
    for (const no in mmls) {
      if (!Object.hasOwn(mmls, no)) continue;
      if (settings[Number(no)]) {
        data[Number(no)] = {
          mml: mmls[Number(no)],
          name: settings[Number(no)].name || '',
          instrument: settings[Number(no)].instrument || 0,
          panpot: settings[Number(no)].panpot || 64,
        };
      } else {
        data[Number(no)] = {
          mml: mmls[Number(no)],
          name: '',
          instrument: 0,
          panpot: 64,
        };
      }
    }

    for (const part in data) {
      if (!Object.hasOwn(data, part)) continue;

      const ch = Number(part) || 0;
      let track: MidiEvent[] = [];
      if (data[Number(part)].mml === '') return;

      track.push(
        new MetaEvent('InsturumentName', 0, 48, [
          this.encoder.encode(data[Number(part)].name),
        ])
      );
      track.push(
        new ChannelEvent(
          'ProgramChange',
          0,
          96,
          ch,
          data[Number(part)].instrument
        )
      );
      track.push(
        new ChannelEvent(
          'ControlChange',
          0,
          154,
          ch,
          10,
          data[Number(part)].panpot
        )
      );

      const mml2Midi = new PSGConverter({
        timeDivision: this.timeDivision,
        channel: ch,
        timeOffset: 386,
        mml: data[Number(part)].mml,
      });
      track = track.concat(mml2Midi.events);
      endTimes.push(mml2Midi.endTime);

      track.concat(new MetaEvent('EndOfTrack', 0, Math.max(...endTimes)));
      this.tracks.push(track);
    }

    this.numberOfTracks = this.tracks.length;
  }
}
