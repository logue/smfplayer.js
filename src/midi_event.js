/**
 * @classdesc Midi Event abstract Structure
 * @author    imaya
 * @license   MIT
 */
class MidiEvent {
  /** @type {Record<number, string>} Event Name */
  static events = {};
  /**
   * @param {string} subtype event subtype name.
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   */
  constructor(subtype, deltaTime, time) {
    /** @type {string} */
    this.subtype = subtype;
    /** @type {number} */
    this.deltaTime = deltaTime;
    /** @type {number} */
    this.time = time;
  }
}

/**
 * Midi Channel Event Structure
 * @extends {MidiEvent}
 */
class ChannelEvent extends MidiEvent {
  /** @type {Record<number, string>} Event Name */
  static table = {
    0x8: 'NoteOff',
    0x9: 'NoteOn',
    0xa: 'PolyPressure',
    0xb: 'ControllerChange',
    0xc: 'ProgramChange',
    0xd: 'ChannelPressure',
    0xe: 'PitchBend',
    0xf: 'SystemCommonMessage',
  };

  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {number} channel
   * @param {number} optParameter1
   * @param {number} optParameter2
   */
  constructor(
    subtype,
    deltaTime,
    time,
    channel,
    optParameter1 = undefined,
    optParameter2 = undefined
  ) {
    super(subtype, deltaTime, time);
    /** @type {number} */
    this.channel = channel;
    /** @type {number | undefined} */
    this.parameter1 = optParameter1;
    /** @type {number | undefined} */
    this.parameter2 = optParameter2;
  }
}

/**
 * System Exclusive Event Structure
 * @extends {MidiEvent}
 */
class SystemExclusiveEvent extends MidiEvent {
  /** @type {Record<number, string>} Event Name */
  static table = {
    0x0: 'SystemExclusive',
    0x1: 'TimeCode',
    0x2: 'SongPosition',
    0x3: 'SongSelect',
    0x4: undefined,
    0x5: undefined,
    0x6: 'TuneRequest',
    0x7: 'SystemExclusive(F7)',
    0x8: 'TimingClock',
    0x9: undefined,
    0xa: 'Start',
    0xb: 'Continue',
    0xc: 'Stop',
    0xd: undefined,
    0xe: 'ActiveSensing',
  };

  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {Uint8Array} data
   */
  constructor(subtype, deltaTime, time, data) {
    super(subtype, deltaTime, time);
    /** @type {Uint8Array} */
    this.data = data;
  }
}

/**
 * Midi Meta Event Structure
 * @extends {MidiEvent}
 */
class MetaEvent extends MidiEvent {
  /** @type {Record<number, string>} Event Name */
  static table = {
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
    0x4b: 'M-LiveTag', // Not standard (for MidiKit and QMidi)
    0x51: 'SetTempo',
    0x54: 'SmpteOffset',
    0x58: 'TimeSignature',
    0x59: 'KeySignature',
    0x7f: 'SequencerSpecific',
  };
  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {Uint8Array[]} data meta data.
   */
  constructor(subtype, deltaTime, time, data) {
    super(subtype, deltaTime, time);
    /** @type {Uint8Array[]} */
    this.data = data;
  }
}

export { MidiEvent, ChannelEvent, SystemExclusiveEvent, MetaEvent };
