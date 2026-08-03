import type PSGConverterOptions from '@/interfaces/PSGConverterOptions';

import { ChannelEvent, MetaEvent, MidiEvent } from '@/MidiEvent';
import OctaveMode, { type OctaveModeType } from '@/types/OctaveMode';

/**
 * @class     PSGConverter
 * @classdesc Mabinogi MML and Maple Story 2 MML to MIDI Converter.
 * @version   4.0.0
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2007-2026 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */

export default class PSGConverter implements PSGConverterOptions {
  static readonly PATTERN = /[a-glnortv<>][+#-]?\d*\.?&?/g;
  static readonly NOTE_TABLE: Record<string, number> = {
    c: 0,
    d: 2,
    e: 4,
    f: 5,
    g: 7,
    a: 9,
    b: 11,
  };
  static readonly VELOCITY_MAGNIFICATION = 7;

  timeDivision: number = 96;
  channel: number = 0;
  timeOffset: number = 0;
  mml: string = '';
  ignoreTempo: boolean = false;
  maxOctave: number = 8;
  minOctave: number = 0;

  MINIM: number;
  SEMIBREVE: number;

  events: MidiEvent[];
  endTime: number;
  noteOffNegativeOffset: number;

  octaveMode: OctaveModeType;
  minNote: number;
  maxNote: number;

  constructor(optParams: Partial<PSGConverterOptions>) {
    this.timeDivision = optParams.timeDivision
      ? Number(optParams.timeDivision)
      : 96;
    this.channel = optParams.channel ? Number(optParams.channel) : 0;
    this.timeOffset = optParams.timeOffset ? Number(optParams.timeOffset) : 0;

    this.MINIM = this.timeDivision * 2;
    this.SEMIBREVE = this.timeDivision * 4;

    this.mml = optParams.mml ?? '';
    this.events = [];
    this.endTime = 0;
    this.noteOffNegativeOffset = 2;
    this.ignoreTempo = optParams.ignoreTempo ?? false;
    this.maxOctave = optParams.maxOctave ?? 8;
    this.minOctave = optParams.minOctave ?? 0;
    this.octaveMode = optParams.octaveMode ?? OctaveMode.DEFAULT;
    this.minNote = optParams.minNote ?? 12;
    this.maxNote = optParams.maxNote ?? 98;

    this.parse();
  }

  parse(): void {
    let mmls: string[] = [];
    try {
      const pattern = new RegExp(
        PSGConverter.PATTERN.source,
        PSGConverter.PATTERN.flags
      );
      let match: RegExpExecArray | null;

      while ((match = pattern.exec(this.mml.toLowerCase())) !== null) {
        mmls.push(match[0]);
      }
    } catch (e) {
      console.error(e);
      throw new Error(`[PSGConverter] Could not parse MML: ${this.mml}`, {
        cause: e,
      });
    }

    if (mmls.length === 0) return;

    let time = this.timeOffset;
    let currentSoundLength = this.timeDivision;
    let currentNote = 0;
    let currentVelocity = 8;
    let currentOctave = 4;
    let tieEnabled = false;

    const events: MidiEvent[] = [];

    mmls.forEach(message => {
      let tick = currentSoundLength;

      const matches = /([lotv<>])([1-9]\d*|0?)(\.?)(&?)/.exec(message);

      if (matches) {
        const command = matches[1].toLowerCase();
        const value = Number.parseInt(matches[2]);

        if (tieEnabled && matches[4] !== '&') {
          tieEnabled = false;
          events.push(
            new ChannelEvent(
              'NoteOff',
              0,
              time - this.noteOffNegativeOffset,
              this.channel,
              currentNote
            )
          );
        }

        switch (command) {
          case 'l':
            if (value >= 1 && value <= this.MINIM) {
              currentSoundLength = Math.floor(this.SEMIBREVE / value);
              if (matches[3] === '.') {
                currentSoundLength = Math.floor(currentSoundLength * 1.5);
              }
            }
            break;
          case 'o':
            if (value >= this.minOctave && value <= this.maxOctave) {
              currentOctave = value;
            }
            break;
          case 't':
            events.push(
              new MetaEvent('SetTempo', 0, time, [Math.floor(60000000 / value)])
            );
            break;
          case 'v':
            if (value >= 0 && value <= 15) {
              currentVelocity = value;
            }
            break;
          case '<':
            currentOctave =
              currentOctave <= this.minOctave
                ? this.minOctave
                : currentOctave - 1;
            break;
          case '>':
            currentOctave =
              currentOctave >= this.maxOctave
                ? this.maxOctave
                : currentOctave + 1;
            break;
        }
      } else {
        const noteMatch = /([a-gn])([+#-]?)(\d*)(\.?)(&?)/.exec(message);
        if (noteMatch) {
          let note = 0;
          const command = noteMatch[1].toLowerCase();
          const value = Number(noteMatch[3] || 0);

          if (command === 'n') {
            note = value;
          } else {
            if (value >= 1 && value <= this.MINIM) {
              tick = Math.floor(this.SEMIBREVE / value);
            }
            if (noteMatch[4] === '.') {
              tick = Math.floor(tick * 1.5);
            }

            if (this.octaveMode !== 2) {
              note = 12 * currentOctave + PSGConverter.NOTE_TABLE[command];
              if (noteMatch[2] === '+' || noteMatch[2] === '#') {
                note++;
              } else if (noteMatch[2] === '-') {
                note--;
              }
            }
          }

          switch (this.octaveMode) {
            case OctaveMode.ONLY_ONE:
              while (note < this.minNote) note = note + 12;
              while (note > this.maxNote) note = note - 12;
              note += 12;
              break;
            case OctaveMode.IGNORE:
              note = this.maxNote;
              break;
            default:
              note += 12;
              break;
          }

          if (!tieEnabled) {
            events.push(
              new ChannelEvent(
                'NoteOn',
                0,
                time,
                this.channel,
                note,
                currentVelocity * PSGConverter.VELOCITY_MAGNIFICATION
              )
            );
          } else if (note !== currentNote) {
            events.push(
              new ChannelEvent(
                'NoteOff',
                0,
                time - this.noteOffNegativeOffset,
                this.channel,
                currentNote
              )
            );
          }

          time += tick;

          if (noteMatch[5] === '&') {
            tieEnabled = true;
            currentNote = note;
          } else {
            tieEnabled = false;
            events.push(
              new ChannelEvent(
                'NoteOff',
                0,
                time - this.noteOffNegativeOffset,
                this.channel,
                note
              )
            );
          }
        } else {
          const restMatch = /R(\d*)(\.?)/i.exec(message);
          if (restMatch) {
            const value = Number(restMatch[1] || 0);

            if (value >= 1 && value <= this.MINIM) {
              tick = Math.floor(this.SEMIBREVE / value);
            }
            if (restMatch[2] === '.') {
              tick = Math.floor(tick * 1.5);
            }
            time += tick;
          } else {
            console.warn('unknown signeture.', message);
          }
        }
      }
    });

    this.events = events;
    this.endTime = time;
  }
}
