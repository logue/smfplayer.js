goog.provide('Mld.Parser');

goog.require('Typedef');

goog.scope(function() {

/**
 * @param {ByteArray} input
 * @param {Object=} opt_params
 * @constructor
 */
Mld.Parser = function(input, opt_params) {
  opt_params = opt_params || {};
  /** @type {ByteArray} */
  this.input = input;
  /** @type {number} */
  this.ip = opt_params.index || 0;
  /** @type {Object} */
  this.header;
  /** @type {Object} */
  this.dataInformation;
  /** @type {Array.<Array.<Object>>} */
  this.tracks;
};

Mld.Parser.prototype.parse = function() {
  this.parseHeader();
  this.parseDataInformation();
  this.parseTracks();
};

Mld.Parser.prototype.parseHeader = function() {
  /** @type {ByteArray} */
  var input = this.input;
  /** @type {number} */
  var ip = this.ip;
  /** @type {Object} */
  var header = this.header = {};
  /** @type {string} */
  var signature =
    String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]);

  if (signature !== 'melo') {
    throw new Error('invalid MFi signature:' + signature);
  }

  header.fileLength = (
    (input[ip++] << 24) | (input[ip++] << 16) |
    (input[ip++] <<  8) |  input[ip++]
  ) >>> 0;

  header.trackOffset = (
    (input[ip++] << 16) | input[ip++]
  ) + ip;

  header.dataMajorType = input[ip++];
  header.dataMinorType = input[ip++];
  header.numberOfTracks = input[ip++];

  this.ip = ip;
};

Mld.Parser.prototype.parseDataInformation = function() {
  /** @type {ByteArray} */
  var input = this.input;
  /** @type {number} */
  var ip = this.ip;
  /** @type {Object} */
  var dataInformation = this.dataInformation = {};
  /** @type {string} */
  var type;
  /** @type {number} */
  var size;

  while (ip < this.header.trackOffset) {
    type =
      String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]);
    size = (input[ip++] << 8) | input[ip++];

    switch(type) {
      case 'titl': /* FALLTHROUGH */
      case 'copy': /* FALLTHROUGH */
      case 'vers': /* FALLTHROUGH */
      case 'date': /* FALLTHROUGH */
      case 'prot':
        dataInformation[type] = String.fromCharCode.apply(
          null,
          input.subarray(ip, ip += size)
        );
        break;
      case 'sorc':
        dataInformation[type] = input[ip++];
        break;
      case 'note':
        dataInformation[type] = (input[ip++] << 8) | input[ip++];
        break;
      case 'exst': /* FALLTHROUGH */
        break;
      default:
        dataInformation[type] = input.subarray(ip, ip += size);
        break;

    }
  }

  this.ip = ip;
};

Mld.Parser.prototype.parseTracks = function() {
  /** @type {ByteArray} */
  var input = this.input;
  /** @type {number} */
  var ip = this.ip;
  /** @type {string} */
  var signature;
  /** @type {number} */
  var size;
  /** @type {number} */
  var limit;
  /** @type {number} */
  var deltaTime;
  /** @type {number} */
  var status;
  /** @type {number} */
  var noteLength;
  /** @type {number} */
  var extendStatus;
  /** @type {Object} */
  var message;
  /** @type {Array.<Array.<Object>>} */
  var tracks = this.tracks = [];
  /** @type {Array.<Object>} */
  var track;
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;

  for (i = 0, il = this.header.numberOfTracks; i < il; ++i) {
    signature =
      String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]);

    if (signature !== 'trac') {
      throw new Error('invalid track signature:' + signature);
    }

    size =
      (input[ip++] << 24) | (input[ip++] << 16) |
      (input[ip++] <<  8) |  input[ip++];

    limit = ip + size;

    track = tracks[i] = [];

    while (ip < limit) {
      message = {};

      // delta time
      message.deltaTime = deltaTime = input[ip++];

      // status
      status = input[ip++];
      if (status !== 0xff) {
        message.type = 'note';
        message.subType = 'Note';
        message.voice = status >> 6;
        message.key = status & 0x3f;

        // note length
        noteLength = message.length = input[ip++];

        // extend status
        if (this.dataInformation.note === 1) {
          extendStatus = input[ip++];
          message.velocity = extendStatus >> 2;
          message.octaveShift = extendStatus & 0x3;
        }
      } else {
        message.type = 'meta';

        // status
        status = input[ip++];
        switch (status >> 4) {
          // system message
          case 0xb:
            switch (status & 0xf) {
              case 0x0:
                message.subType = 'MasterVolume';
                message.value = input[ip++];
                break;
              case 0xa:
                message.subType = 'DrumScale';
                message.value = {
                  'channel': (input[ip] >> 3) & 0x7,
                  'drum': input[ip++] & 0x1
                };
                break;
              default:
                throw new Error('unknown message type:' + status.toString(16));
            }
            break;
          // tempo message
          case 0xc:
            message.subType = 'SetTempo';
            message.value = {
              'timeBase': (status & 0x7) === 7 ?
                NaN :
                Math.pow(2, status & 0x7) * ((status & 0x8) === 0 ? 6 : 15),
              'tempo': input[ip++]
            };
            break;
          // control message
          case 0xd:
            switch (status & 0xf) {
              case 0x0:
                message.subType = 'Point';
                message.value = input[ip++];
                break;
              case 0xd:
                message.subType = 'Loop';
                message.value = {
                  'id': input[ip] >> 6,
                  'count': input[ip] >> 2 & 0xf,
                  'point': input[ip++] & 0x3
                };
                break;
              case 0xe:
                message.subType = 'Nop';
                message.value = input[ip++];
                break;
              case 0xf:
                message['subType'] = 'EndOfTrack';
                message['value'] = input[ip++];
                break;
              default:
                throw new Error('unkwnon message type:' + status.toString(16));
            }
            break;
          // instrument
          case 0xe:
            switch (status & 0xf) {
              case 0x0:
                message['subType'] = 'InstrumentLowPart';
                message['value'] = {
                  'part': input[ip] >> 6,
                  'instrument': input[ip++] & 0x3f
                };
                break;
              case 0x1:
                message['subType'] = 'InstrumentHighPart';
                message['value'] = {
                  'part': input[ip] >> 6,
                  'instrument': input[ip++] & 0x1
                };
                break;
              case 0x2:
                message['subType'] = 'Volume';
                message['value'] = {
                  'part': input[ip] >> 6,
                  'volume': input[ip++] & 0x3f
                };
                break;
              case 0x3:
                message['subType'] = 'Valance';
                message['value'] = {
                  'part': input[ip] >> 6,
                  'valance': input[ip++] & 0x3f
                };
                break;
              case 0x4:
                message['subType'] = 'PitchBend';
                message['value'] = {
                  'part': input[ip] >> 6,
                  'value': input[ip++] & 0x3f
                };
                break;
              case 0x5:
                message['subType'] = 'ChannelAssign';
                message['value'] = {
                  'part': input[ip] >> 6,
                  'channel': input[ip++] & 0x3f
                };
                break;
              case 0x6:
                message['subType'] = 'VolumeChange';
                message['value'] = {
                  'part': input[ip] >> 6,
                  'volume': (input[ip++] & 0x3f)  << 26 >> 26
                };
                break;
              case 0x7:
                message['subType'] = 'PitchBendRange';
                message['value'] = {
                  'part': input[ip] >> 6,
                  'value': (input[ip++] & 0x3f)
                };
                break;
              // TODO: 未遭遇
              /*
              case 0x8:
                message['subType'] = 'MasterFineTuning';
                message['value'] = {
                  'part': input[ip] >> 6,
                  'value': (input[ip++] & 0x3f)
                };
                break;
              */
              // TODO: あってるか自信ない
              case 0x9:
                message['subType'] = 'MasterCoarseTuning';
                message['value'] = {
                  'part': input[ip] >> 6,
                  'value': (input[ip++] & 0x3f)
                };
                break;
              case 0xA:
                message['subType'] = 'Modulation';
                message['value'] = {
                  'part': input[ip] >> 6,
                  'depth': (input[ip++] & 0x3f)
                };
                break;
              default:
                throw new Error('unkwnon message type:' + status.toString(16));
            }
            break;
          // extended information
          case 0xf:
            switch (status & 0xf) {
              case 0x0:
                message['subType'] = 'EditInstrument';
                message['value'] = parseEditInstrument();
                break;
              case 0x1:
                message['subType'] = 'Vibrato';
                message['value'] = parseVibrato();
                break;
              case 0xf:
                message['subType'] = 'DeviceSpecific';
                message['value'] = parseDeviceSpecific();
                break;
              default:
                throw new Error('unkwnon message type:' + status.toString(16));
            }
            break;
          default:
            throw new Error('unkwnon message type:' + status.toString(16));
        }
      }

      track.push(message);
    }
    ip = limit;
  }

  /**
   * @return {Array.<Object>}
   */
  function parseEditInstrument() {
    /** @type {number} */
    var length = (input[ip++] << 8) | input[ip++];
    /** @type {number} */
    var limit = ip + length;
    /** @type {Array.<Object>} */
    var result = [];
    /** @type {Object} */
    var info;

    // const
    if (input[ip++] !== 1) {
      throw new Error('invalid EditInstrument const value:' + input[ip-1]);
    }

    while (ip < limit) {
      info = {};

      info['part'] = (input[ip++] >> 4) & 0x3;
      info['modulator'] = {
        'ML': input[ip] >> 5,
        'VIV': (input[ip] >> 4) & 0x1,
        'EG': (input[ip] >> 3) & 0x1,
        'SUS': (input[ip] >> 2) & 0x1,
        'RR': ((input[ip++] & 0x3) << 2) | (input[ip] >> 6),
        'DR': (input[ip] >> 4) & 0xf,
        'AR': ((input[ip++] & 0x3) << 2) | (input[ip] >> 6),
        'SL': (input[ip] >> 4) & 0xf,
        'TL': ((input[ip++] & 0x3) << 4) | (input[ip] >> 4),
        'WF': (input[ip] >> 3) & 0x1,
        'FB': input[ip++] & 0x7
      };
      info['carrier'] = {
        'ML': input[ip] >> 5,
        'VIV': (input[ip] >> 4) & 0x1,
        'EG': (input[ip] >> 3) & 0x1,
        'SUS': (input[ip] >> 2) & 0x1,
        'RR': ((input[ip++] & 0x3) << 2) | (input[ip] >> 6),
        'DR': (input[ip] >> 4) & 0xf,
        'AR': ((input[ip++] & 0x3) << 2) | (input[ip] >> 6),
        'SL': (input[ip] >> 4) & 0xf,
        'TL': ((input[ip++] & 0x3) << 4) | (input[ip] >> 4),
        'WF': (input[ip] >> 3) & 0x1,
        'FB': input[ip++] & 0x7
      };
      info['octaveSelect'] = input[ip++] & 0x3;

      result.push(info);
    }

    return result;
  }

  /**
   * @return {{part: number, switch: number}}
   */
  function parseVibrato() {
    /** @type {number} */
    var length = (input[ip++] << 8) | input[ip++];

    // const
    if (input[ip++] !== 1) {
      throw new Error('invalid Vibrato const value:' + input[ip-1]);
    }

    return {
      'part': (input[ip++] >> 5) & 0x3,
      'switch': (input[ip++] >> 6)
    };
  }

  /**
   * @return {{data: ByteArray}}
   */
  function parseDeviceSpecific() {
    /** @type {number} */
    var length = (input[ip++] << 8) | input[ip++];
    /** @type {number} */
    var limit = ip + length;

    // const
    if (input[ip++] !== 0x11) {
      throw new Error('invalid DeviceSpecific const value:' + input[ip-1]);
    }

    return {
      'data': input.subarray(ip, ip += limit - ip)
    };
  }

  this.ip = ip;
};

/**
 * @return {Object}
 */
Mld.Parser.prototype.convertToMidiTracks = function() {
  /** @type {Object} */
  var result = {'timeDivision': 48};
  /** @type {Array.<Array.<Object>>} */
  var tracks = result['tracks'] = [];
  /** @type {Array.<Array.<Array.<number>>>} */
  var plainTracks = result['plainTracks'] = [];
  /** @type {Array.<Array.<Object>>} */
  var mfiTracks = this.tracks;
  /** @type {Array.<Object>} */
  var mfiTrack;
  /** @type {Object} */
  var mfiEvent;
  /** @type {Object} */
  var prevEvent;
  /** @type {Array.<Object>} */
  var tmpTrack;
  /** @type {number} */
  var time;
  /** @type {number} */
  var pos;
  /** @type {number} */
  var key;
  /** @type {number} */
  var tmp;
  /** @type {string} */
  var str;
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;
  /** @type {number} */
  var j;
  /** @type {number} */
  var jl;
  /** @type {Array.<number>} */
  var channelTime = [];
  /** @type {number} */
  var channel;

  for (i = 0; i < 16; ++i) {
    plainTracks[i] = [];
    channelTime[i] = 0;
  }

  // 変換しにくい形式を平坦化する
  for (i = 0, il = mfiTracks.length; i < il; ++i) {
    mfiTrack = mfiTracks[i];
    tmpTrack = [];

    // note の処理
    for (time = pos = j = 0, jl = mfiTrack.length; j < jl; ++j) {
      mfiEvent = mfiTrack[j];
      time += mfiEvent['deltaTime'];
      mfiEvent['id'] = pos;
      mfiEvent['time'] = time;

      switch (mfiEvent['subType']) {
        case 'Nop':
          break;
        case 'Note':
          tmpTrack[pos++] = mfiEvent;
          // TODO: value: ... 形式になおす　
          tmpTrack[pos] = {
            'id': pos,
            'type': 'internal',
            'subType': 'NoteOff',
            'time': time + mfiEvent['length'],
            'key': mfiEvent['key'],
            'voice': mfiEvent['voice'],
            'velocity': mfiEvent['velocity'],
            'octaveShift': mfiEvent['octaveShift']
          };
          pos++;
          break;
        case 'InstrumentHighPart':
          prevEvent = mfiEvent;
          mfiEvent = mfiTrack[++j];
          if (mfiEvent['subType'] !== 'InstrumentLowPart') {
            throw new Error('broken instrument');
          }
          // TODO: value: ... 形式になおす　
          tmpTrack[pos] = {
            'id': pos,
            'type': 'internal',
            'subType': 'ProgramChange',
            'time': time,
            'part': mfiEvent['value']['part'],
            'instrument': (prevEvent['value']['instrument'] << 6) | mfiEvent['value']['instrument']
          };
          pos++;
          break;
        default:
          tmpTrack[pos++] = mfiEvent;
          break;
      }
    }
    tmpTrack.sort(function(a, b) {
      return a['time'] > b['time'] ? 1 : a['time'] < b['time'] ? -1
           : a['id']   > b['id']   ? 1 : a['id']   < b['id']   ? -1
           : 0;
    });

    // MIDI トラックに作成
    tracks[i] = [];
    for (time = j = 0, jl = tmpTrack.length; j < jl; ++j) {
      mfiEvent = tmpTrack[j];
      time = mfiEvent['time'];

      switch (mfiEvent['subType']) {
        case 'Note':
          // NoteOn: 9n kk vv
          key = this.applyOctaveShift(mfiEvent['key'] + 45, mfiEvent['octaveShift']);
          channel = i * 4 + mfiEvent['voice'];

          // TODO: リズムトラックの時は Key が -10 されているような気がする
          if (channel === 9) {
            key -= 10;
          }
          plainTracks[channel].push(
            this.deltaTimeToByteArray(time - channelTime[channel]).concat(
              0x90 | channel,
              key,
              mfiEvent['velocity'] * 2
            )
          );
          break;
        case 'NoteOff':
          // NoteOff: 8n kk vv
          key = this.applyOctaveShift(mfiEvent['key'] + 45, mfiEvent['octaveShift']);
          channel = i * 4 + mfiEvent['voice'];

          // TODO: リズムトラックの時は Key が -10 されているような気がする
          if (channel === 9) {
            key -= 10;
          }
          plainTracks[channel].push(
            this.deltaTimeToByteArray(time - channelTime[channel]).concat(
              0x80 | channel,
              key,
              mfiEvent['velocity'] * 2
            )
          );
          break;
        case 'ProgramChange':
          // Program Change: Cn pp
          channel = i * 4 + mfiEvent['part'];
          plainTracks[channel].push(
            this.deltaTimeToByteArray(time - channelTime[channel]).concat(
              0xC0 | channel,
              mfiEvent['instrument']
            )
          );
          break;
        case 'SetTempo':
          // SetTempo: FF 51 03 tt tt tt
          tmp = 2880000000 / (mfiEvent['value']['tempo'] * mfiEvent['value']['timeBase']);
          channel = 0; // SetTempo は必ず先頭のトラックに配置する
          plainTracks[channel].push(
            this.deltaTimeToByteArray(time - channelTime[channel]).concat(
              0xFF,
              0x51,
              0x03,
              (tmp >> 16) & 0xff, (tmp >> 8) & 0xff, tmp & 0xff
            )
          );
          break;
        case 'Loop':
          // Marker: FF 06 ll ss ss ss ...
          tmp = mfiEvent['value']['count'];
          str = 'LOOP_'+
            (mfiEvent['value']['point'] === 0 ? 'START' : 'END') +
            '=ID:' + mfiEvent['value']['id'] +
            ',COUNT:' + (tmp === 0 ? -1 : tmp);
          channel = 0;
          plainTracks[channel].push(
            this.deltaTimeToByteArray(time - channelTime[channel]).concat(
              [
                0xFF,
                0x06,
                str.length
              ],
              str.split('').map(function(a) {
                return a.charCodeAt(0);
              })
            )
          );
          break;
        case 'MasterVolume':
          // Master Volume: F0 7F ee 04 01 dl dm F7
          tmp = mfiEvent['value'];
          channel = 0;

          plainTracks[channel].push(
            this.deltaTimeToByteArray(time - channelTime[channel]).concat(
              0xF0,
              0x07, // length
              0x7F, 0x7F, 0x04, 0x01, tmp, tmp, 0xF7
            )
          );
          break;
        case 'Modulation':
          // CC#1 Modulation: Bn 01 dd
          channel = i * 4 + mfiEvent['value']['part'];
          plainTracks[channel].push(
            this.deltaTimeToByteArray(time - channelTime[channel]).concat(
              0xB0 | channel,
              0x01,
              mfiEvent['value']['depth'] * 2
            )
          );
          break;
        case 'Volume':
          // CC#7 Volume: Bn 07 dd
          channel = i * 4 + mfiEvent['value']['part'];
          plainTracks[channel].push(
            this.deltaTimeToByteArray(time - channelTime[channel]).concat(
              0xB0 | channel,
              0x07,
              mfiEvent['value']['volume'] * 2
            )
          );
          break;
        case 'Valance':
          // CC#10 Panpot: Bn 0A dd
          channel = i * 4 + mfiEvent['value']['part'];
          plainTracks[channel].push(
            this.deltaTimeToByteArray(time - channelTime[channel]).concat(
              0xB0 | channel,
              0x0A,
              (mfiEvent['value']['valance'] - 32) * 2 + 64
            )
          );
          break;
        case 'PitchBend':
          // Pitch Bend: En dl dm
          // TODO: LSB = MSB で良いか不明
          channel = i * 4 + mfiEvent['value']['part'];
          plainTracks[channel].push(
            this.deltaTimeToByteArray(time - channelTime[channel]).concat(
              0xE0 | channel,
              mfiEvent['value']['value'] * 2,
              mfiEvent['value']['value'] * 2
            )
          );
          break;
        case 'PitchBendRange':
          // Pitch Bend: CC#100=0 CC#101=0 CC#6
          // Bn 64 00 Bn 65 00 Bn 06 vv
          channel = i * 4 + mfiEvent['value']['part'];
          plainTracks[channel].push(
            this.deltaTimeToByteArray(time - channelTime[channel]).concat(
              0xB0 | channel,
              0x64, 0x00
            ),
            [
              0x00,
              0xB0 | channel,
              0x65, 0x00
            ],
            [
              0x00,
              0xB0 | channel,
              0x06, mfiEvent['value']['value'] * 2
            ]
          );
          break;
        case 'MasterCoarseTuning':
          // MasterCoarseTuning: CC#100=0 CC#101=2 CC#6
          // Bn 64 01 Bn 65 02 Bn 06 vv
          channel = i * 4 + mfiEvent['value']['part'];
          plainTracks[channel].push(
            this.deltaTimeToByteArray(time - channelTime[channel]).concat(
              0xB0 | channel,
              0x64, 0x00
            ),
            [
              0x00,
              0xB0 | channel,
              0x65, 0x02
            ],
            [
              0x00,
              0xB0 | channel,
              0x06, mfiEvent['value']['value'] * 2
            ]
          );
          break;
        default:
          continue;
      }

      channelTime[channel] = mfiEvent['time'];
    }
  }

  return this.toSMF(plainTracks);
};

/**
 * @param {number} key
 * @param {number} octaveShift
 * @returns {number}
 */
Mld.Parser.prototype.applyOctaveShift = function(key, octaveShift) {
  /** @type {Array.<number>} */
  var table = [0, 12, -24, -12];

  if (table[octaveShift] !== void 0) {
    return key + table[octaveShift];
  }

  throw new Error('invalid OctaveShift value:' + octaveShift);
};

/**
 * @param {Array.<Array.<ByteArray>>} plainTracks
 * @returns {ByteArray}
 */
Mld.Parser.prototype.toSMF = function(plainTracks) {
  /** @type {number} @const */
  var TimeDivision = 48;
  /** @type {Array.<number>} */
  var trackHeader;
  /** @type {Array.<number>} */
  var trackData;
  /** @type {ByteArray} */
  var result = [
    0x4D, 0x54, 0x68, 0x64, // "MThd"
    0x00, 0x00, 0x00, 0x06, // Size
    0x00, 0x01, // Format
    0x00, 0x10, // number of track
    (TimeDivision >> 8) & 0xff, TimeDivision & 0xff // Data
  ];
  /** @type {number} */
  var i;
  /** @type {number} */
  var il;
  /** @type {number} */
  var j;
  /** @type {number} */
  var jl;

  /**
   * @param {string} str
   * @returns {Array.<number>}
   */
  function stringToArray(str) {
    /** @type {number} */
    var i;
    /** @type {number} */
    var il = str.length;
    /** @type {Array.<number>} */
    var array = new Array(il);

    for (i = 0; i < il; ++i) {
      array[i] = str.charCodeAt(i);
    }

    return array;
  }

  if (this.dataInformation['copy'] !== void 0) {
    /** @type {Array.<number>} */
    var copy = stringToArray(this.dataInformation['copy']);

    il = copy.length;
    copy = [0x00, 0xff, 0x02].concat(
      this.deltaTimeToByteArray(il),
      copy
    );
    plainTracks[0].unshift(copy);
  }

  /*
  if (this.dataInformation['titl'] !== void 0) {
    var title = stringToArray(this.dataInformation['titl']);
    il = title.length;
    title = [0x00, 0xff, 0x03].concat(
      this.deltaTimeToByteArray(il),
      title
    );
    plainTracks[0].unshift(title);
  }
  */

  for (i = 0, il = plainTracks.length; i < il; ++i) {
    var track = plainTracks[i];
    trackData = [];
    for (j = 0, jl = track.length; j < jl; ++j) {
      Array.prototype.push.apply(trackData, track[j]);
    }

    jl = trackData.length;
    trackHeader = [
      0x4D, 0x54, 0x72, 0x6B, // "MTrk"
      (jl >> 24) & 0xff, (jl >> 16) & 0xff,
      (jl >>  8) & 0xff, (jl      ) & 0xff
    ];
    result = result.concat(trackHeader, trackData);
  }

  return new Uint8Array(result);
};

/**
 * @param {number} deltaTime
 * @return {Array.<number>}
 */
Mld.Parser.prototype.deltaTimeToByteArray = function(deltaTime) {
  /** @type {Array.<number>} */
  var array = [];

  while (deltaTime >= 0x80) {
    array.unshift(deltaTime & 0x7f | (array.length === 0 ? 0 : 0x80));
    deltaTime >>>= 7;
  }
  array.unshift(deltaTime | (array.length === 0 ? 0 : 0x80));

  return array;
};

});
