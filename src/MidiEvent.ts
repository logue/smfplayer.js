/**
 * @classdesc Midi Event abstract Structure
 * @author    imaya
 * @license   MIT
 */
export abstract class MidiEvent {
  public data: Array<number | Uint8Array | ArrayBuffer | string> = [];

  constructor(
    public subType: string,
    public deltaTime: number,
    public time: number
  ) {}
}

/**
 * Midi Channel Event Structure
 */
export class ChannelEvent extends MidiEvent {
  static readonly table: Record<number, string> = {
    0x80: 'NoteOff',
    0x90: 'NoteOn',
    0xa0: 'PolyPressure',
    0xb0: 'ControllerChange',
    0xc0: 'ProgramChange',
    0xd0: 'ChannelPressure',
    0xe0: 'PitchBend',
    0xf0: 'SystemCommonMessage',
  };

  constructor(
    subType: string,
    deltaTime: number,
    time: number,
    public channel: number,
    public parameter1: number = 0,
    public parameter2: number = 0
  ) {
    super(subType, deltaTime, time);
  }
}

/**
 * System Exclusive Event Structure
 */
export class SystemExclusiveEvent extends MidiEvent {
  static readonly table: Record<number, string | null> = {
    0x0: 'SystemExclusive',
    0x1: 'TimeCode',
    0x2: 'SongPosition',
    0x3: 'SongSelect',
    0x4: null,
    0x5: null,
    0x6: 'TuneRequest',
    0x7: 'SystemExclusive(F7)',
    0x8: 'TimingClock',
    0x9: null,
    0xa: 'Start',
    0xb: 'Continue',
    0xc: 'Stop',
    0xd: null,
    0xe: 'ActiveSensing',
  };

  constructor(
    subType: string,
    deltaTime: number,
    time: number,
    data: Array<number | Uint8Array | ArrayBuffer | string>
  ) {
    super(subType, deltaTime, time);
    this.data = data;
  }
}

/**
 * Midi Meta Event Structure
 */
export class MetaEvent extends MidiEvent {
  static readonly table: Record<number, string> = {
    0x00: 'SequenceNumber',
    0x01: 'TextEvent',
    0x02: 'CopyrightNotice',
    0x03: 'SequenceTrackName',
    0x04: 'InstrumentName',
    0x05: 'Lyrics',
    0x06: 'Marker',
    0x07: 'CuePoint',
    0x08: 'ProgramName',
    0x09: 'DeviceName',
    0x20: 'MidiChannelPrefix',
    0x21: 'ChannelPrefixOrPort',
    0x2f: 'EndOfTrack',
    0x4b: 'M-LiveTag',
    0x51: 'SetTempo',
    0x54: 'SmpteOffset',
    0x58: 'TimeSignature',
    0x59: 'KeySignature',
    0x7f: 'SequencerSpecific',
  };

  constructor(
    subType: string,
    deltaTime: number,
    time: number,
    data: Array<number | Uint8Array | ArrayBuffer | string> = []
  ) {
    super(subType, deltaTime, time);
    this.data = data;
  }
}
