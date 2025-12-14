import { convert } from 'encoding-japanese';

import { ChannelEvent, SystemExclusiveEvent, MetaEvent } from '@/midi_event';
import { Riff } from '@/riff';

// Constants
const EVENT_TYPE_MASK = 0xf0;
const CHANNEL_MASK = 0x0f;
const EVENT_TYPE_SHIFT = 4;
const RUNNING_STATUS_THRESHOLD = 0x80;
const META_EVENT_TYPE = 0xf;
const SYSEX_EVENT_TYPE = 0xf;
const SYSEX_END_BYTE = 0xf7;
const VARIABLE_LENGTH_CONTINUE_BIT = 0x80;
const VARIABLE_LENGTH_VALUE_MASK = 0x7f;

// Meta Event Types
const META_EVENT_TYPES = {
  SEQUENCE_NUMBER: 0x00,
  TEXT_EVENT: 0x01,
  COPYRIGHT_NOTICE: 0x02,
  SEQUENCE_TRACK_NAME: 0x03,
  INSTRUMENT_NAME: 0x04,
  LYRICS: 0x05,
  MARKER: 0x06,
  CUE_POINT: 0x07,
  END_OF_TRACK: 0x2f,
  SET_TEMPO: 0x51,
  SMPTE_OFFSET: 0x54,
  TIME_SIGNATURE: 0x58,
  KEY_SIGNATURE: 0x59,
  SEQUENCER_SPECIFIC: 0x7f,
};

/**
 * @classdesc Standard Midi File Parser class
 * @author    imaya, Logue
 * @license   MIT
 */
export default class Parser {
  /**
   * @param {Uint8Array} input input buffer.
   * @param {object} optParams option parameters.
   */
  constructor(input, optParams = {}) {
    optParams.padding = false;
    optParams.bigEndian = true;

    /** @type {Uint8Array} */
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
    /** @type {import('./midi_event').MidiEvent[][]} */
    this.tracks = [];
    /** @type {Uint8Array[][]} */
    this.plainTracks = [];
  }

  /**
   * Parse the SMF file
   */
  parse() {
    // parse riff chunks
    this.riffParser_.parse();

    // parse header chunk
    this.parseHeaderChunk();

    // Calculate actual number of track chunks available
    const totalChunks = this.riffParser_.getNumberOfChunks();
    const availableTracks = totalChunks - this.chunkIndex; // Subtract already parsed header chunk
    const tracksToRead = Math.min(this.numberOfTracks, availableTracks);

    if (tracksToRead < this.numberOfTracks) {
      console.warn(
        `SMF header declares ${this.numberOfTracks} tracks, but only ${tracksToRead} track chunks found in file`
      );
    }

    // parse track chunks
    for (let i = 0; i < tracksToRead; i++) {
      this.parseTrackChunk();
    }
  }

  /**
   * Parse header chunk (MThd)
   * @throws {Error} If header signature is invalid
   */
  parseHeaderChunk() {
    const chunk = this.riffParser_.getChunk(this.chunkIndex++);

    if (!chunk) {
      throw new Error(
        `invalid SMF file: header chunk not found (total chunks: ${this.riffParser_.getNumberOfChunks()})`
      );
    }

    if (chunk.type !== 'MThd') {
      throw new Error(
        `invalid header signature: expected MThd, got "${chunk.type}"`
      );
    }

    const data = this.input;
    let ip = chunk.offset;

    this.formatType = this.readUInt16(data, ip);
    ip += 2;
    this.numberOfTracks = this.readUInt16(data, ip);
    ip += 2;
    const parsedTimeDivision = this.readUInt16(data, ip);
    // timeDivision が不正な値の場合はデフォルト値480を設定
    this.timeDivision = parsedTimeDivision > 0 ? parsedTimeDivision : 480;
  }

  /**
   * Read a 16-bit unsigned integer (big-endian)
   * @param {Uint8Array} data - Data buffer
   * @param {number} offset - Offset in the buffer
   * @returns {number} The 16-bit value
   * @private
   */
  readUInt16(data, offset) {
    return (data[offset] << 8) | data[offset + 1];
  }

  /**
   * Read a 24-bit unsigned integer (big-endian)
   * @param {Uint8Array} data - Data buffer
   * @param {number} offset - Offset in the buffer
   * @returns {number} The 24-bit value
   * @private
   */
  readUInt24(data, offset) {
    return (data[offset] << 16) | (data[offset + 1] << 8) | data[offset + 2];
  }

  /**
   * Read a variable-length quantity
   * @param {Uint8Array} data - Data buffer
   * @param {number} offset - Offset in the buffer
   * @returns {{value: number, bytesRead: number}} The value and number of bytes read
   * @private
   */
  readVariableLength(data, offset) {
    let result = 0;
    let bytesRead = 0;
    let byte;

    do {
      byte = data[offset + bytesRead++];
      result = (result << 7) | (byte & VARIABLE_LENGTH_VALUE_MASK);
    } while ((byte & VARIABLE_LENGTH_CONTINUE_BIT) !== 0);

    return { value: result, bytesRead };
  }

  /**
   * Parse track chunk (MTrk)
   * @throws {Error} If track signature is invalid or SysEx event is malformed
   */
  parseTrackChunk() {
    const chunk = this.riffParser_.getChunk(this.chunkIndex++);

    if (!chunk) {
      throw new Error(
        `invalid track chunk: chunk ${this.chunkIndex - 1} not found (expected ${this.numberOfTracks} tracks, found ${this.riffParser_.getNumberOfChunks()} chunks)`
      );
    }

    if (chunk.type !== 'MTrk') {
      throw new Error(
        `invalid track signature: expected MTrk, got "${chunk.type}" at chunk ${this.chunkIndex - 1}`
      );
    }

    const data = this.input;
    let ip = chunk.offset;
    const endOffset = chunk.offset + chunk.size;

    let totalTime = 0;
    let prevEventType = -1;
    let prevChannel = -1;

    const eventQueue = [];
    const plainQueue = [];

    while (ip < endOffset) {
      const eventData = this.parseEvent(
        data,
        ip,
        totalTime,
        prevEventType,
        prevChannel
      );

      ip = eventData.nextOffset;
      totalTime = eventData.totalTime;
      prevEventType = eventData.eventType;
      prevChannel = eventData.channel;

      eventQueue.push(eventData.event);
      plainQueue.push(eventData.plainBytes);
    }

    this.tracks.push(eventQueue);
    this.plainTracks.push(plainQueue);
  }

  /**
   * Parse a single MIDI event
   * @param {Uint8Array} data - Data buffer
   * @param {number} offset - Current offset in buffer
   * @param {number} totalTime - Accumulated time
   * @param {number} prevEventType - Previous event type for running status
   * @param {number} prevChannel - Previous channel for running status
   * @returns {{event: import('./midi_event').MidiEvent, plainBytes: Uint8Array, nextOffset: number, totalTime: number, eventType: number, channel: number}}
   * @private
   */
  parseEvent(data, offset, totalTime, prevEventType, prevChannel) {
    let ip = offset;

    // Read delta time
    const deltaTimeResult = this.readVariableLength(data, ip);
    const deltaTime = deltaTimeResult.value;
    ip += deltaTimeResult.bytesRead;
    totalTime += deltaTime;

    const eventOffset = ip;

    // Read status byte
    let status = data[ip];
    let eventType = (status >> EVENT_TYPE_SHIFT) & CHANNEL_MASK;
    let channel = status & CHANNEL_MASK;

    // Handle running status
    if (status < RUNNING_STATUS_THRESHOLD) {
      eventType = prevEventType;
      channel = prevChannel;
      status = (prevEventType << EVENT_TYPE_SHIFT) | prevChannel;
    } else {
      ip++;
    }

    let event;
    if (eventType !== META_EVENT_TYPE) {
      // Channel Event
      event = this.parseChannelEvent(
        data,
        ip,
        eventType,
        channel,
        deltaTime,
        totalTime
      );
      ip += eventType === 0xc || eventType === 0xd ? 1 : 2;
    } else if (channel !== 0xf) {
      // System Exclusive Event
      const sysexData = this.parseSysExEvent(data, ip, channel);
      event = new SystemExclusiveEvent(
        SystemExclusiveEvent.table[channel],
        deltaTime,
        totalTime,
        sysexData.data
      );
      ip = sysexData.nextOffset;
    } else {
      // Meta Event
      const metaType = data[ip++];
      const lengthResult = this.readVariableLength(data, ip);
      ip += lengthResult.bytesRead;

      event = this.parseMetaEvent(
        data,
        ip,
        metaType,
        lengthResult.value,
        deltaTime,
        totalTime
      );
      ip += lengthResult.value;
    }

    // Create plain bytes representation
    const plainBytes = this.createPlainBytes(
      data,
      eventOffset,
      ip - eventOffset,
      status,
      event
    );

    return {
      event,
      plainBytes,
      nextOffset: ip,
      totalTime,
      eventType,
      channel,
    };
  }

  /**
   * Parse a channel event
   * @param {Uint8Array} data - Data buffer
   * @param {number} offset - Current offset
   * @param {number} eventType - Event type
   * @param {number} channel - MIDI channel
   * @param {number} deltaTime - Delta time
   * @param {number} totalTime - Total time
   * @returns {ChannelEvent}
   * @private
   */
  parseChannelEvent(data, offset, eventType, channel, deltaTime, totalTime) {
    const param1 = data[offset];
    const param2 =
      eventType === 0xc || eventType === 0xd ? undefined : data[offset + 1];

    return new ChannelEvent(
      ChannelEvent.table[eventType << EVENT_TYPE_SHIFT],
      deltaTime,
      totalTime,
      channel,
      param1,
      param2
    );
  }

  /**
   * Parse a System Exclusive event
   * @param {Uint8Array} data - Data buffer
   * @param {number} offset - Current offset
   * @param {number} channel - Event channel/type
   * @returns {{data: Uint8Array, nextOffset: number}}
   * @throws {Error} If SysEx event is malformed
   * @private
   */
  parseSysExEvent(data, offset, channel) {
    const lengthResult = this.readVariableLength(data, offset);
    const length = lengthResult.value;
    let ip = offset + lengthResult.bytesRead;

    if (channel === 0x0 && data[ip + length - 1] !== SYSEX_END_BYTE) {
      throw new Error('invalid SysEx event: missing terminating 0xF7 byte');
    }

    const sysexData = data.subarray(ip, ip + length - 1);
    ip += length;

    return { data: sysexData, nextOffset: ip };
  }

  /**
   * Parse a meta event
   * @param {Uint8Array} data - Data buffer
   * @param {number} offset - Current offset
   * @param {number} metaType - Meta event type
   * @param {number} length - Data length
   * @param {number} deltaTime - Delta time
   * @param {number} totalTime - Total time
   * @returns {MetaEvent}
   * @private
   */
  parseMetaEvent(data, offset, metaType, length, deltaTime, totalTime) {
    let ip = offset;

    switch (metaType) {
      case META_EVENT_TYPES.SEQUENCE_NUMBER:
        return new MetaEvent('SequenceNumber', deltaTime, totalTime, [
          this.readUInt16(data, ip),
        ]);

      case META_EVENT_TYPES.TEXT_EVENT:
      case META_EVENT_TYPES.COPYRIGHT_NOTICE:
      case META_EVENT_TYPES.SEQUENCE_TRACK_NAME:
      case META_EVENT_TYPES.INSTRUMENT_NAME:
      case META_EVENT_TYPES.LYRICS:
      case META_EVENT_TYPES.MARKER:
      case META_EVENT_TYPES.CUE_POINT: {
        const buffer = data.subarray(ip, ip + length);
        const text = convert(buffer, {
          to: 'UTF-8',
          from: 'AUTO',
          type: 'arraybuffer',
        });
        return new MetaEvent(MetaEvent.table[metaType], deltaTime, totalTime, [
          text,
        ]);
      }

      case META_EVENT_TYPES.END_OF_TRACK:
        return new MetaEvent('EndOfTrack', deltaTime, totalTime, []);

      case META_EVENT_TYPES.SET_TEMPO:
        return new MetaEvent('SetTempo', deltaTime, totalTime, [
          this.readUInt24(data, ip),
        ]);

      case META_EVENT_TYPES.SMPTE_OFFSET:
        return new MetaEvent('SmpteOffset', deltaTime, totalTime, [
          data[ip],
          data[ip + 1],
          data[ip + 2],
          data[ip + 3],
          data[ip + 4],
        ]);

      case META_EVENT_TYPES.TIME_SIGNATURE:
        return new MetaEvent('TimeSignature', deltaTime, totalTime, [
          data[ip],
          data[ip + 1],
          data[ip + 2],
          data[ip + 3],
        ]);

      case META_EVENT_TYPES.KEY_SIGNATURE:
        return new MetaEvent('KeySignature', deltaTime, totalTime, [
          data[ip],
          data[ip + 1],
        ]);

      case META_EVENT_TYPES.SEQUENCER_SPECIFIC:
        return new MetaEvent('SequencerSpecific', deltaTime, totalTime, [
          data.subarray(ip, ip + length),
        ]);

      default:
        // Unknown meta event
        return new MetaEvent(
          MetaEvent.table[metaType] || 'Unknown',
          deltaTime,
          totalTime,
          [metaType, data.subarray(ip, ip + length)]
        );
    }
  }

  /**
   * Create plain bytes representation of an event
   * @param {Uint8Array} data - Original data buffer
   * @param {number} offset - Event start offset
   * @param {number} length - Event length
   * @param {number} status - Status byte
   * @param {import('./midi_event').MidiEvent} event - Parsed event
   * @returns {Uint8Array}
   * @private
   */
  createPlainBytes(data, offset, length, status, event) {
    let plainBytes = data.subarray(offset, offset + length);
    plainBytes[0] = status;

    // Convert NoteOn with velocity 0 to NoteOff
    if (
      event instanceof ChannelEvent &&
      event.subtype === 'NoteOn' &&
      event.parameter2 === 0
    ) {
      event.subtype = ChannelEvent.table[0x80];
      plainBytes = new Uint8Array([
        0x80 | event.channel,
        event.parameter1,
        event.parameter2,
      ]);
    }

    return plainBytes;
  }
}
