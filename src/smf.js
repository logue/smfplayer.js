goog.provide('SMF.Parser');

goog.require('Typedef');
goog.require('Riff.Parser');
goog.require('Midi.Event');


goog.scope(function() {

/**
 * @param {ByteArray} input input buffer.
 * @param {Object=} opt_params option parameters.
 * @constructor
 */
SMF.Parser = function(input, opt_params) {
  opt_params = opt_params || {};
  opt_params['padding'] = false;
  opt_params['bigEndian'] = true;

  /** @type {ByteArray} */
  this.input = input;
  /** @type {number} */
  this.ip = opt_params['index'] || 0;
  /** @type {number} */
  this.chunkIndex = 0;
  /**
   * @type {Riff.Parser}
   * @private
   */
  this.riffParser_ = new Riff.Parser(input, opt_params);

  // MIDI File Information

  /** @type {number} */
  this.formatType;
  /** @type {number} */
  this.numberOfTracks;
  /** @type {number} */
  this.timeDivision;
  /** @type {Array.<Array.<Midi.Event>>} */
  this.tracks = [];
  /** @type {Array.<Array.<ByteArray>>} */
  this.plainTracks = [];
};

SMF.Parser.prototype.parse = function() {
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;

  // parse riff chunks
  this.riffParser_.parse();

  // parse header chunk
  this.parseHeaderChunk();

  // parse track chunks
  for (i = 0, il = this.numberOfTracks; i < il; ++i) {
    this.parseTrackChunk();
  }
};

SMF.Parser.prototype.parseHeaderChunk = function() {
  /** @type {?{type: string, size: number, offset: number}} */
  var chunk = this.riffParser_.getChunk(this.chunkIndex++);
  /** @type {ByteArray} */
  var data = this.input;
  /** @type {number} */
  var ip = chunk['offset'];

  if (!chunk || chunk['type'] !== 'MThd') {
    throw new Error('invalid header signature');
  }

  this.formatType     = (data[ip++] << 8) | data[ip++];
  this.numberOfTracks = (data[ip++] << 8) | data[ip++];
  this.timeDivision   = (data[ip++] << 8) | data[ip++];
};

SMF.Parser.prototype.parseTrackChunk = function() {
  /** @type {?{type: string, size: number, offset: number}} */
  var chunk = this.riffParser_.getChunk(this.chunkIndex++);
  /** @type {ByteArray} */
  var data = this.input;
  /** @type {number} */
  var ip = chunk['offset'];
  /** @type {number} */
  var size;
  /** @type {number} */
  var deltaTime;
  /** @type {number} */
  var eventType;
  /** @type {number} */
  var channel;
  /** @type {number} */
  var prevEventType = -1;
  /** @type {number} */
  var prevChannel = -1;
  /** @type {number} */
  var tmp;
  /** @type {number} */
  var totalTime = 0;
  /** @type {number} */
  var offset;
  /** @type {number} */
  var length;
  /** @type {number} */
  var status;
  /** @type {Midi.Event} */
  var event;
  /** @type {ByteArray} */
  var plainBytes;

  if (!chunk || chunk['type'] !== 'MTrk') {
    throw new Error('invalid header signature');
  }

  size = chunk['offset'] + chunk['size'];
  var eventQueue = [];
  var plainQueue = [];

  while (ip < size) {
    // delta time
    deltaTime = readNumber();
    totalTime += deltaTime;

    // offset
    offset = ip;

    // event type value, midi channel
    status = data[ip++];
    eventType = (status >> 4) & 0xf;
    channel = status & 0xf;

    // run status rule
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

    // TODO
    var table = [,,,,,,,,
      'NoteOff', 'NoteOn', 'NoteAftertouch', 'ControlChange',
      'ProgramChange', 'ChannelAftertouch','PitchBend'
    ];

    switch (eventType) {
      // channel events
      case 0x8: /* FALLTHROUGH */
      case 0x9: /* FALLTHROUGH */
      case 0xA: /* FALLTHROUGH */
      case 0xB: /* FALLTHROUGH */
      case 0xD: /* FALLTHROUGH */
      case 0xE:
        event = new Midi.ChannelEvent(
          table[eventType], deltaTime, totalTime,
          channel, data[ip++], data[ip++]
        );
        break;
      case 0xC:
        event = new Midi.ChannelEvent(
          table[eventType], deltaTime, totalTime,
          channel, data[ip++]
        );
        break;
      // meta events, system exclusive event
      case 0xF:
        switch (channel) {
          // SysEx event
          case 0x0:
            tmp = readNumber();
            if (data[ip + tmp - 1] !== 0xf7) {
              throw new Error('invalid SysEx event');
            }
            event = new Midi.SystemExclusiveEvent(
              'SystemExclusive', deltaTime, totalTime,
              data.subarray(ip, (ip += tmp) - 1)
            );
            break;
          case 0x7:
            tmp = readNumber();
            event = new Midi.SystemExclusiveEvent(
              'SystemExclusive(F7)', deltaTime, totalTime,
              data.subarray(ip, (ip += tmp))
            );
            break;
          // meta event
          case 0xF:
            eventType = data[ip++];
            tmp = readNumber();
            switch (eventType) {
              case 0x00: // sequence number
                event = new Midi.MetaEvent(
                  'SequenceNumber', deltaTime, totalTime,
                  [data[ip++], data[ip++]]
                );
                break;
              case 0x01: // text event
                event = new Midi.MetaEvent(
                  'TextEvent', deltaTime, totalTime,
                  [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]
                );
                break;
              case 0x02: // copyright notice
                event = new Midi.MetaEvent(
                  'CopyrightNotice', deltaTime, totalTime,
                  [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]
                );
                break;
              case 0x03: // sequence/track name
                event = new Midi.MetaEvent(
                  'SequenceTrackName', deltaTime, totalTime,
                  [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]
                );
                break;
              case 0x04: // instrument name
                event = new Midi.MetaEvent(
                  'InstrumentName', deltaTime, totalTime,
                  [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]
                );
                break;
              case 0x05: // lyrics
                event = new Midi.MetaEvent(
                  'Lyrics', deltaTime, totalTime,
                  [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]
                );
                break;
              case 0x06: // marker
                event = new Midi.MetaEvent(
                  'Marker', deltaTime, totalTime,
                  [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]
                );
                break;
              case 0x07: // cue point
                event = new Midi.MetaEvent(
                  'CuePoint', deltaTime, totalTime,
                  [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]
                );
                break;
              case 0x20: // midi channel prefix
                event = new Midi.MetaEvent(
                  'MidiChannelPrefix', deltaTime, totalTime,
                  [data[ip++]]
                );
                break;
              case 0x2f: // end of track
                event = new Midi.MetaEvent(
                  'EndOfTrack', deltaTime, totalTime,
                  []
                );
                break;
              case 0x51: // set tempo
                event = new Midi.MetaEvent(
                  'SetTempo', deltaTime, totalTime,
                  [(data[ip++] << 16) | (data[ip++] << 8) | data[ip++]]
                );
                break;
              case 0x54: // smpte offset
                event = new Midi.MetaEvent(
                  'SmpteOffset', deltaTime, totalTime,
                  [data[ip++], data[ip++], data[ip++], data[ip++], data[ip++]]
                );
                break;
              case 0x58: // time signature
                event = new Midi.MetaEvent(
                  'TimeSignature', deltaTime, totalTime,
                  [data[ip++], data[ip++], data[ip++], data[ip++]]
                );
                break;
              case 0x59: // key signature
                event = new Midi.MetaEvent(
                  'KeySignature', deltaTime, totalTime,
                  [data[ip++], data[ip++]]
                );
                break;
              case 0x7f: // sequencer specific
                event = new Midi.MetaEvent(
                  'SequencerSpecific', deltaTime, totalTime,
                  [data.subarray(ip, ip += tmp)]
                );
                break;
              default: // unknown
                event = new Midi.MetaEvent(
                  'Unknown', deltaTime, totalTime,
                  [eventType, data.subarray(ip, ip += tmp)]
                );
            }
            break;
          default:
            goog.global.console.log("unknown message:", status.toString(16));
        }
        break;
      // error
      default:
        throw new Error('invalid status');
    }

    // plain queue
    length = ip - offset;
    plainBytes =  data.subarray(offset, offset + length);
    plainBytes[0] = status;
    if (
      event instanceof Midi.ChannelEvent &&
      event.subtype === 'NoteOn' &&
      /** @type {Midi.ChannelEvent} */(event).parameter2 === 0
    ) {
      event.subtype = table[8];
      plainBytes = new Uint8Array([0x80 | event.channel, event.parameter1, event.parameter2]);
    }
    plainQueue.push(plainBytes);

    // event queue
    eventQueue.push(event);
  }

  this.tracks.push(eventQueue);
  this.plainTracks.push(plainQueue);

  /** @return {number} */
  function readNumber() {
    /** @type {number} */
    var result = 0;
    /** @type {number} */
    var tmp;

    do {
      tmp = data[ip++];
      result = (result << 7) | (tmp & 0x7f);
    } while ((tmp & 0x80) !== 0);

    return result;
  }
};

});