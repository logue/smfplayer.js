import MakiMabiSequence from './MakiMabiSequenceParser';

import { MetaEvent, MidiEvent } from '@/MidiEvent';
import PSGConverter from '@/PSGConverter';

/**
 * @classdesc MapleStory2 Mml Parser
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019,2023,2026 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */
export default class MapleStory2Mml extends MakiMabiSequence {
  ms2Input: NodeList;

  constructor(input: Uint8Array) {
    super(input);

    const parser = new DOMParser();
    const doc = parser.parseFromString(
      String.fromCodePoint.apply(
        '',
        Array.from(new Uint16Array(input.buffer as ArrayBuffer))
      ),
      'text/xml'
    );
    this.ms2Input = doc.querySelectorAll('ms2 > *');
  }

  protected parseTracks(): void {
    let track: MidiEvent[] = [];
    const endTimes: number[] = [];

    this.ms2Input.forEach(element => {
      const mml2Midi = new PSGConverter({
        timeDivision: this.timeDivision,
        channel: 0,
        timeOffset: 0,
        mml: (element as Element).textContent?.trim() ?? '',
        ignoreTempo: false,
      });
      track = track.concat(mml2Midi.events);
      endTimes.push(mml2Midi.endTime);
    });

    track.concat(new MetaEvent('EndOfTrack', 0, Math.max(...endTimes)));
    this.tracks.push(track);
  }
}
