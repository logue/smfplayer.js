/*! smfplayer.js vundefined | imaya / GREE Inc. / Logue | license: MIT */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Smf", [], factory);
	else if(typeof exports === 'object')
		exports["Smf"] = factory();
	else
		root["Smf"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/player.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/midi_event.js":
/*!***************************!*\
  !*** ./src/midi_event.js ***!
  \***************************/
/*! exports provided: ChannelEvent, SystemExclusiveEvent, MetaEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChannelEvent", function() { return ChannelEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SystemExclusiveEvent", function() { return SystemExclusiveEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MetaEvent", function() { return MetaEvent; });
class Event {
  /**
   * @param {string} subtype event subtype name.
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @constructor
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

class ChannelEvent extends Event {
  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {number} channel
   * @param {number=} opt_parameter1
   * @param {number=} opt_parameter2
   * @constructor
   * @extends {Event}
   */
  constructor(subtype, deltaTime, time, channel, opt_parameter1, opt_parameter2) {
    super(subtype, deltaTime, time);
    /** @type {number} */
    this.channel = channel;
    /** @type {(number|undefined)} */
    this.parameter1 = opt_parameter1;
    /** @type {(number|undefined)} */
    this.parameter2 = opt_parameter2;
  }
}

class SystemExclusiveEvent extends Event {
  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {ByteArray} data
   * @constructor
   * @extends {Event}
   */
  constructor(subtype, deltaTime, time, data) {
    super(subtype, deltaTime, time);
    /** @type {ByteArray} */
    this.data = data;
  }
}

class MetaEvent extends Event {
  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {Array.<*>} data meta data.
   * @constructor
   * @extends {Event}
   */
  constructor(subtype, deltaTime, time, data) {
    super(subtype, deltaTime, time);
    /** @type {Array.<*>} */
    this.data = data;
  };
}



/***/ }),

/***/ "./src/mld.js":
/*!********************!*\
  !*** ./src/mld.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Mld; });
class Mld {
  /**
   * @param {ByteArray} input
   * @param {Object=} opt_params
   * @constructor
   */
  constructor(input, opt_params) {
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

  parse() {
    this.parseHeader();
    this.parseDataInformation();
    this.parseTracks();
  };

  parseHeader() {
    /** @type {ByteArray} */
    let input = this.input;
    /** @type {number} */
    let ip = this.ip;
    /** @type {Object} */
    let header = this.header = {};
    /** @type {string} */
    let signature =
      String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]);

    if (signature !== 'melo') {
      throw new Error('invalid MFi signature:' + signature);
    }

    header.fileLength = (
      (input[ip++] << 24) | (input[ip++] << 16) |
      (input[ip++] << 8) | input[ip++]
    ) >>> 0;

    header.trackOffset = (
      (input[ip++] << 16) | input[ip++]
    ) + ip;

    header.dataMajorType = input[ip++];
    header.dataMinorType = input[ip++];
    header.numberOfTracks = input[ip++];

    this.ip = ip;
  };

  parseDataInformation() {
    /** @type {ByteArray} */
    let input = this.input;
    /** @type {number} */
    let ip = this.ip;
    /** @type {Object} */
    let dataInformation = this.dataInformation = {
      'copy': null,
      'date': null,
      'exst': null,
      'note': null,
      'prot': null,
      'sorc': null,
      'titl': null,
      'trac': null,
      'vers': null
    };
    /** @type {string} */
    let type;
    /** @type {number} */
    let size;

    while (ip < this.header.trackOffset) {
      type =
        String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]);
      size = (input[ip++] << 8) | input[ip++];

      switch (type) {
        case 'titl':
        /* FALLTHROUGH */
        case 'copy':
        /* FALLTHROUGH */
        case 'vers':
        /* FALLTHROUGH */
        case 'date':
        /* FALLTHROUGH */
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
        case 'exst':
          /* FALLTHROUGH */
          break;
        default:
          dataInformation[type] = input.subarray(ip, ip += size);
          break;

      }
    }

    this.ip = ip;
  };

  parseTracks() {
    /** @type {ByteArray} */
    let input = this.input;
    /** @type {number} */
    let ip = this.ip;
    /** @type {string} */
    let signature;
    /** @type {number} */
    let size;
    /** @type {number} */
    let limit;
    /** @type {number} */
    let deltaTime;
    /** @type {number} */
    let status;
    /** @type {number} */
    let noteLength;
    /** @type {number} */
    let extendStatus;
    /** @type {Object} */
    let message;
    /** @type {Array.<Array.<Object>>} */
    let tracks = this.tracks = [];
    /** @type {Array.<Object>} */
    let track;
    /** @type {number} */
    let i;
    /** @type {number} */
    let il;

    for (i = 0, il = this.header.numberOfTracks; i < il; ++i) {
      signature =
        String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]);

      if (signature !== 'trac') {
        throw new Error('invalid track signature:' + signature);
      }

      size =
        (input[ip++] << 24) | (input[ip++] << 16) |
        (input[ip++] << 8) | input[ip++];

      limit = ip + size;

      track = tracks[i] = [];

      while (ip < limit) {
        message = {
          key: null,
          length: null,
          octaveShift: null,
          subType: null,
          type: null,
          value: {},
          velocity: null,
          voice: null
        };

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
                  NaN : Math.pow(2, status & 0x7) * ((status & 0x8) === 0 ? 6 : 15),
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
                  message.subType = 'EndOfTrack';
                  message.value = input[ip++];
                  break;
                default:
                  throw new Error('unkwnon message type:' + status.toString(16));
              }
              break;
            // instrument
            case 0xe:
              switch (status & 0xf) {
                case 0x0:
                  message.subType = 'InstrumentLowPart';
                  message.value = {
                    'part': input[ip] >> 6,
                    'instrument': input[ip++] & 0x3f
                  };
                  break;
                case 0x1:
                  message.subType = 'InstrumentHighPart';
                  message.value = {
                    'part': input[ip] >> 6,
                    'instrument': input[ip++] & 0x1
                  };
                  break;
                case 0x2:
                  message.subType = 'Volume';
                  message.value = {
                    'part': input[ip] >> 6,
                    'volume': input[ip++] & 0x3f
                  };
                  break;
                case 0x3:
                  message.subType = 'Valance';
                  message.value = {
                    'part': input[ip] >> 6,
                    'valance': input[ip++] & 0x3f
                  };
                  break;
                case 0x4:
                  message.subType = 'PitchBend';
                  message.value = {
                    'part': input[ip] >> 6,
                    'value': input[ip++] & 0x3f
                  };
                  break;
                case 0x5:
                  message.subType = 'ChannelAssign';
                  message.value = {
                    'part': input[ip] >> 6,
                    'channel': input[ip++] & 0x3f
                  };
                  break;
                case 0x6:
                  message.subType = 'VolumeChange';
                  message.value = {
                    'part': input[ip] >> 6,
                    'volume': (input[ip++] & 0x3f) << 26 >> 26
                  };
                  break;
                case 0x7:
                  message.subType = 'PitchBendRange';
                  message.value = {
                    'part': input[ip] >> 6,
                    'value': (input[ip++] & 0x3f)
                  };
                  break;
                // TODO: 未遭遇
                /*
                case 0x8:
                  message.subType = 'MasterFineTuning';
                  message.value = {
                    'part': input[ip] >> 6,
                    'value': (input[ip++] & 0x3f)
                  };
                  break;
                */
                // TODO: あってるか自信ない
                case 0x9:
                  message.subType = 'MasterCoarseTuning';
                  message.value = {
                    'part': input[ip] >> 6,
                    'value': (input[ip++] & 0x3f)
                  };
                  break;
                case 0xA:
                  message.subType = 'Modulation';
                  message.value = {
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
                  message.subType = 'EditInstrument';
                  message.value = parseEditInstrument();
                  break;
                case 0x1:
                  message.subType = 'Vibrato';
                  message.value = parseVibrato();
                  break;
                case 0xf:
                  message.subType = 'DeviceSpecific';
                  message.value = parseDeviceSpecific();
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
      let length = (input[ip++] << 8) | input[ip++];
      /** @type {number} */
      let limit = ip + length;
      /** @type {Array.<Object>} */
      let result = [];
      /** @type {Object} */
      let info;

      // const
      if (input[ip++] !== 1) {
        throw new Error('invalid EditInstrument const value:' + input[ip - 1]);
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
      let length = (input[ip++] << 8) | input[ip++];

      // const
      if (input[ip++] !== 1) {
        throw new Error('invalid Vibrato const value:' + input[ip - 1]);
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
      let length = (input[ip++] << 8) | input[ip++];
      /** @type {number} */
      let limit = ip + length;

      // const
      if (input[ip++] !== 0x11) {
        throw new Error('invalid DeviceSpecific const value:' + input[ip - 1]);
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
  convertToMidiTracks() {
    /** @type {Object} */
    let result = {
      timeDivision: 48,
      trac: [],
      plainTracks: []
    };
    /** @type {Array.<Array.<Object>>} */
    let tracks = result.tracks;
    /** @type {Array.<Array.<Array.<number>>>} */
    let plainTracks = result.plainTracks;
    /** @type {Array.<Array.<Object>>} */
    let mfiTracks = this.tracks;
    /** @type {Array.<Object>} */
    let mfiTrack;
    /** @type {Object} */
    let mfiEvent;
    /** @type {Object} */
    let prevEvent;
    /** @type {Array.<Object>} */
    let tmpTrack;
    /** @type {number} */
    let time;
    /** @type {number} */
    let pos;
    /** @type {number} */
    let key;
    /** @type {number} */
    let tmp;
    /** @type {string} */
    let str;
    /** @type {number} */
    let i;
    /** @type {number} */
    let il;
    /** @type {number} */
    let j;
    /** @type {number} */
    let jl;
    /** @type {Array.<number>} */
    let channelTime = [];
    /** @type {number} */
    let channel;

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
      tmpTrack.sort(function (a, b) {
        return a['time'] > b['time'] ? 1 : a['time'] < b['time'] ? -1 :
          a['id'] > b['id'] ? 1 : a['id'] < b['id'] ? -1 :
            0;
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
            str = 'LOOP_' +
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
                str.split('').map(function (a) {
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
              ), [
                0x00,
                0xB0 | channel,
                0x65, 0x00
              ], [
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
              ), [
                0x00,
                0xB0 | channel,
                0x65, 0x02
              ], [
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
  applyOctaveShift(key, octaveShift) {
    /** @type {Array.<number>} */
    let table = [0, 12, -24, -12];

    if (table[octaveShift] !== void 0) {
      return key + table[octaveShift];
    }

    throw new Error('invalid OctaveShift value:' + octaveShift);
  };

  /**
   * @param {Array.<Array.<ByteArray>>} plainTracks
   * @returns {ByteArray}
   */
  toSMF(plainTracks) {
    /** @type {number} @const */
    let TimeDivision = 48;
    /** @type {Array.<number>} */
    let trackHeader;
    /** @type {Array.<number>} */
    let trackData;
    /** @type {ByteArray} */
    let result = [
      0x4D, 0x54, 0x68, 0x64, // "MThd"
      0x00, 0x00, 0x00, 0x06, // Size
      0x00, 0x01, // Format
      0x00, 0x10, // number of track
      (TimeDivision >> 8) & 0xff, TimeDivision & 0xff // Data
    ];
    /** @type {number} */
    let i;
    /** @type {number} */
    let il;
    /** @type {number} */
    let j;
    /** @type {number} */
    let jl;

    /**
     * @param {string} str
     * @returns {Array.<number>}
     */
    function stringToArray(str) {
      /** @type {number} */
      let i;
      /** @type {number} */
      let il = str.length;
      /** @type {Array.<number>} */
      let array = new Array(il);

      for (i = 0; i < il; ++i) {
        array[i] = str.charCodeAt(i);
      }

      return array;
    }

    if (this.dataInformation['copy'] !== void 0) {
      /** @type {Array.<number>} */
      let copy = stringToArray(this.dataInformation['copy']);

      il = copy.length;
      copy = [0x00, 0xff, 0x02].concat(
        this.deltaTimeToByteArray(il),
        copy
      );
      plainTracks[0].unshift(copy);
    }

    /*
    if (this.dataInformation['titl'] !== void 0) {
      let title = stringToArray(this.dataInformation['titl']);
      il = title.length;
      title = [0x00, 0xff, 0x03].concat(
        this.deltaTimeToByteArray(il),
        title
      );
      plainTracks[0].unshift(title);
    }
    */

    for (i = 0, il = plainTracks.length; i < il; ++i) {
      let track = plainTracks[i];
      trackData = [];
      for (j = 0, jl = track.length; j < jl; ++j) {
        Array.prototype.push.apply(trackData, track[j]);
      }

      jl = trackData.length;
      trackHeader = [
        0x4D, 0x54, 0x72, 0x6B, // "MTrk"
        (jl >> 24) & 0xff, (jl >> 16) & 0xff,
        (jl >> 8) & 0xff, (jl) & 0xff
      ];
      result = result.concat(trackHeader, trackData);
    }

    return new Uint8Array(result);
  };

  /**
   * @param {number} deltaTime
   * @return {Array.<number>}
   */
  deltaTimeToByteArray(deltaTime) {
    /** @type {Array.<number>} */
    let array = [];

    while (deltaTime >= 0x80) {
      array.unshift(deltaTime & 0x7f | (array.length === 0 ? 0 : 0x80));
      deltaTime >>>= 7;
    }
    array.unshift(deltaTime | (array.length === 0 ? 0 : 0x80));

    return array;
  };

};

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/*! exports provided: Player */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Player", function() { return Player; });
/* harmony import */ var _smf__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./smf */ "./src/smf.js");
/* harmony import */ var _mld__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mld */ "./src/mld.js");



class Player {

  /**
   * @param {string} target WML attach dom
   * @constructor
   */
  constructor(target = "#wml") {
    /** @type {number} */
    this.tempo = 500000; // default
    /** @type {HTMLIFrameElement} */
    this.webMidiLink;
    /** @type {number} */
    this.resume;
    /** @type {boolean} */
    this.pause = true;;
    /** @type {boolean} */
    this.ready = false;
    /** @type {number} */
    this.position = 0;
    /** @type {Array.<Object>} */
    this.track = [];
    /** @type {number} */
    this.timer = 0;
    /** @type {Object} TODO: 最低限のプロパティは記述する */
    this.sequence = {};
    /** @type {boolean} */
    this.enableCC111Loop = false;
    /** @type {boolean} */
    this.enableFalcomLoop = false;
    /** @type {boolean} */
    this.enableMFiLoop = false;
    /** @type {boolean} */
    this.enableLoop = false;
    /** @type {number} */
    this.tempoRate = 1;
    /** @type {number} */
    this.masterVolume = 16383;
    /** @type {?string} */
    this.sequenceName = '';
    /** @type {Array.<string>} */
    this.copyright = [];
    /** @type {HTMLIFrameElement|Worker} */
    this.webMidiLink = null;
    /** @type {number} */
    this.length = 0;
    /** @type {number} */
    this.time = 0;
    /** @type {number} */
    this.timeTotal;
    /** @type {number} */
    this.loaded = 0;
    /** @type {Window} */
    this.window = window;
    /** @type {Element} */
    this.target = this.window.document.querySelector(target);
  };

  /**
   * @param {boolean} enable
   */
  setCC111Loop(enable) {
    this.enableCC111Loop = enable;
  };

  /**
   * @param {boolean} enable
   */
  setFalcomLoop(enable) {
    this.enableFalcomLoop = enable;
  };

  /**
   * @param {boolean} enable
   */
  setMFiLoop(enable) {
    this.enableMFiLoop = enable;
  };

  /**
   * @param {boolean} enable
   */
  setLoop(enable) {
    this.enableLoop = enable;
  };

  stop() {
    /** @type {number} */
    let i;

    this.pause = true;
    this.resume = Date.now();

    if (this.webMidiLink) {
      for (i = 0; i < 16; ++i) {
        this.webMidiLink.contentWindow.postMessage('midi,b' + i.toString(16) + ',78,0', '*');
      }
    }
  };

  getWebMidiLink() {
    return this.webMidiLink;
  };

  init() {
    this.stop();
    this.initSequence();
    this.pause = true;
    this.track = null;
    this.resume = -1;
    this.sequence = null;
    this.sequenceName = null;
    this.copyright = null;
    this.length = 0;
    this.position = 0;
    this.time = 0;
    this.timeTotal = 0;

    this.window.clearTimeout(this.timer);

    /** @type {Player} */
    let player = this;
    if (this.ready) {
      this.sendInitMessage();
    } else {
      this.window.addEventListener('message', (function (ev) {
        if (ev.data === 'link,ready') {
          player.sendInitMessage();
        }
      }), false);
    }
  };

  initSequence() {
    this.tempo = 500000;
    this.position = 0;

    this.sendInitMessage();
    this.pause = false;
  };

  play() {
    /** @type {Player} */
    let player = this;

    if (!this.webMidiLink) {
      throw new Error('WebMidiLink not found');
    }

    if (this.ready) {
      if (this.track) {
        this.length = this.track.length;
        if (this.track instanceof Array && this.position >= this.length) {
          this.position = 0;
        }
        this.playSequence();
      } else {
        console.warn('Midi file is not loaded.');
      }
    } else {
      this.window.addEventListener('message', (function (ev) {
        if (ev.data === 'link,ready') {
          player.ready = true;
          player.playSequence();
        }
      }), false);
    }
  };

  ended() {
    player.window.postMessage('endoftrack', '*');
  }

  sendInitMessage() {
    /** @type {Window} */
    let win = this.webMidiLink.contentWindow;
    /** @type {number} */
    let i;

    for (i = 0; i < 16; ++i) {
      // all sound off
      win.postMessage('midi,b' + i.toString(16) + ',128,0', '*');
      // volume
      win.postMessage('midi,b' + i.toString(16) + ',07,64', '*');
      // panpot
      win.postMessage('midi,b' + i.toString(16) + ',0a,40', '*');
      // pitch bend
      win.postMessage('midi,e' + i.toString(16) + ',00,40', '*');
      // pitch bend range
      win.postMessage('midi,b' + i.toString(16) + ',64,00', '*');
      win.postMessage('midi,b' + i.toString(16) + ',65,00', '*');
      win.postMessage('midi,b' + i.toString(16) + ',06,02', '*');
      win.postMessage('midi,b' + i.toString(16) + ',26,00', '*');
    }
    this.sendGmReset();
  };

  /**
   * @param {string|Worker} port WebMidiLink url.
   */
  setWebMidiLink(port = './wml.html') {
    /** @type {Player} */
    const player = this;

    const process = (ev) => {
      if (typeof ev.data === 'string') {
        const msg = ev.data.split(',');

        if (msg[0] === 'link') {
          // console.log(ev.data);
          if (msg[1] === 'ready') {
            player.ready = true;
            player.loaded = 100;
            player.setMasterVolume(player.masterVolume);
          } else if (msg[1] === 'progress') {
            // console.log(msg[2]);
            player.loaded = Math.round((msg[2] / msg[3]) * 10000);
          }
        }
      }
    }

    if (typeof port === 'string') {
      /** @type {HTMLIFrameElement} */
      let iframe;

      // Clear self
      if (this.webMidiLink) {
        this.webMidiLink.parentNode.removeChild(this.webMidiLink);
      }

      // Clear parent DOM
      if (this.target.firstChild) {
        this.target.removeChild(this.target.firstChild);
      }

      iframe = this.webMidiLink =
        /** @type {HTMLIFrameElement} */
        (this.window.document.createElement('iframe'));
      iframe.src = port;
      iframe.className = 'wml';

      this.target.appendChild(iframe);
      this.window.addEventListener('message', process, false);
    } else {
      // Worker Mode
      this.webMidiLink.addEventListener('message', process, false);
    }
  };

  /**
   * @param {number} volume
   */
  setMasterVolume(volume) {

    this.masterVolume = volume;

    if (this.webMidiLink) {
      this.webMidiLink.contentWindow.postMessage(
        'midi,f0,7f,7f,04,01,' + [
          ('0' + ((volume) & 0x7f).toString(16)).substr(-2),
          ('0' + ((volume >> 7) & 0x7f).toString(16)).substr(-2),
          '7f'
        ].join(','),
        '*'
      );
    }
  };

  /**
   * @param {number} tempo
   */
  setTempoRate(tempo) {
    this.tempoRate = tempo;
  };

  playSequence() {
    /** @type {Player} */
    const player = this;
    /** @type {number} */
    let timeDivision = this.sequence.timeDivision;
    /** @type {Array.<Object>} */
    let mergedTrack = this.track;
    /** @type {Window} */
    let webMidiLink = this.webMidiLink.contentWindow;
    /** @type {number} */
    let pos = this.position || 0;
    /** @type {Array.<?{pos: number}>} */
    let mark = [];

    const update = () => {
      /** @type {number} */
      let time = mergedTrack[pos]['time'];
      /** @type {number} */
      let length = mergedTrack.length;
      /** @type {Object} TODO */
      let event;
      /** @type {?Array.<string>} */
      let match;
      /** @type {*} */
      let tmp;
      /** @type {number} */
      let procTime = Date.now();

      if (player.pause) {
        player.resume = Date.now() - player.resume;
        return;
      }

      do {
        event = mergedTrack[pos]['event'];

        // set tempo
        if (event.subtype === 'SetTempo') {
          player.tempo = event.data[0];
        }

        // CC#111 Loop
        if (event.subtype === 'ControlChange' && event.parameter1 === 111) {
          mark[0] = {
            'pos': pos
          };
        }

        // Ys Eternal 2 Loop
        if (event.subtype === 'Marker') {
          // mark
          if (event.data[0] === 'A') {
            mark[0] = {
              'pos': pos
            };
          }
          // jump
          if (event.data[0] === 'B' && player.enableFalcomLoop &&
            mark[0] && typeof mark[0]['pos'] === 'number') {
            pos = mark[0]['pos'];
            player.timer = player.window.setTimeout(update, 0);
            player.position = pos;
            return;
          }
        }

        // MFi Loop
        if (event.subtype === 'Marker') {
          // mark
          match =
            event.data[0].match(/^LOOP_(START|END)=ID:(\d+),COUNT:(-?\d+)$/);
          if (match) {
            if (match[1] === 'START') {
              mark[match[2] | 0] = mark[match[2]] || {
                'pos': pos,
                'count': match[3] | 0
              };
            } else if (match[1] === 'END' && player.enableMFiLoop) {
              tmp = mark[match[2] | 0];
              if (tmp['count'] !== 0) { // loop jump
                if (tmp['count'] > 0) {
                  tmp['count']--;
                }
                pos = tmp['pos'];
                player.timer = player.window.setTimeout(update, 0);
                player.position = pos;
                return;
              } else { // loop end
                mark[match[2] | 0] = null;
              }
            }
          }
        }

        // send message
        webMidiLink.postMessage(mergedTrack[pos++]['webMidiLink'], '*');
      } while (pos < length && mergedTrack[pos]['time'] === time);

      if (pos < length) {
        procTime = Date.now() - procTime;
        player.timer = player.window.setTimeout(
          update,
          player.tempo / (1000 * timeDivision) * (mergedTrack[pos]['time'] - time - procTime) * (1 / player.tempoRate)
        );
      } else {
        // loop
        player.ended();
        player.pause = true;
        if (player.enableCC111Loop && mark[0] && typeof mark[0]['pos'] === 'number') {
          pos = mark[0]['pos'];
        } else if (player.enableLoop) {
          player.initSequence();
          player.playSequence();
        }
      }

      player.position = pos;
      player.time = time;
    }

    if (!this.pause) {
      this.timer = player.window.setTimeout(
        update,
        this.tempo / 1000 * timeDivision * this.track[0]['time']
      );
    } else {
      // resume
      this.timer = player.window.setTimeout(
        update,
        this.resume
      );
      this.pause = false;
      this.resume = -1;
    }
  };

  loadMidiFile(buffer) {
    /** @type {SMF} */
    let parser = new _smf__WEBPACK_IMPORTED_MODULE_0__["default"](buffer);

    this.init();
    parser.parse();

    this.mergeMidiTracks(parser);
  };

  loadMldFile(buffer) {
    /** @type {Mld} */
    let parser = new _mld__WEBPACK_IMPORTED_MODULE_1__["default"](buffer);

    this.init();
    parser.parse();

    //this.mergeMidiTracks(parser.convertToMidiTracks());
    this.loadMidiFile(parser.convertToMidiTracks());
  };

  /**
   * @param {Object} midi
   */
  mergeMidiTracks(midi) {
    /** @type {Array.<Object>} */
    let mergedTrack = this.track = [];
    /** @type {Array.<number>} */
    let trackPosition;
    /** @type {Array.<Array.<Object>>} */
    let tracks;
    /** @type {Array.<Object>} */
    let track;
    /** @type {Array.<Array.<Array.<number>>>} */
    let plainTracks;
    /** @type {Array.<string>} */
    let copys = this.copyright = [];
    /** @type {number} */
    let i;
    /** @type {number} */
    let il;
    /** @type {number} */
    let j;
    /** @type {number} */
    let jl;

    tracks = midi.tracks;
    trackPosition = new Array(tracks.length);
    plainTracks = midi.plainTracks;

    // initialize
    for (i = 0, il = tracks.length; i < il; ++i) {
      trackPosition[i] = 0;
    }

    // merge
    for (i = 0, il = tracks.length; i < il; ++i) {
      track = tracks[i];
      for (j = 0, jl = track.length; j < jl; ++j) {
        if (midi.formatType === 0 && track[j].subtype === "SequenceTrackName") {
          this.sequenceName = track[j].data[0];
        }

        if (track[j].subtype === "CopyrightNotice") {
          copys.push(track[j].data[0]);
        }

        mergedTrack.push({
          'track': i,
          'eventId': j,
          'time': track[j].time,
          'event': track[j],
          'webMidiLink': 'midi,' +
            Array.prototype.map.call(
              plainTracks[i][j],
              function (a) {
                return a.toString(16);
              }
            ).join(',')
        });
      }
    }

    // sort
    mergedTrack.sort(function (a, b) {
      return a['time'] > b['time'] ? 1 : a['time'] < b['time'] ? -1 :
        a['track'] > b['track'] ? 1 : a['track'] < b['track'] ? -1 :
          a['eventId'] > b['eventId'] ? 1 : a['eventId'] < b['eventId'] ? -1 :
            0;
    });

    // トータルの演奏時間
    this.timeTotal = mergedTrack.slice(-1)[0].time;
    this.sequence = midi;
  };

  /**
   * @return {?string}
   */
  getSequenceName() {
    return this.sequenceName;
  };

  /**
   * @return {Array.<string>}
   */
  getCopyright() {
    return this.copyright;
  };

  /**
   * @return {number}
   */
  getPosition() {
    return this.position;
  }

  /**
   * @param {number} pos
   */
  setPosition(pos) {
    this.position = pos;
  }

  /**
   * @return {number}
   */
  getLength() {
    return this.length;
  }

  sendGmReset() {
    if (this.webMidiLink) {
      // F0 7E 7F 09 01 F7
      this.webMidiLink.contentWindow.postMessage('midi,F0,7E,7F,09,01,F7', '*');
    }
  }

  sendAllSoundOff() {
    if (this.webMidiLink) {
      this.webMidiLink.contentWindow.postMessage('midi,b0,78,0', '*');
    }
  }

  /**
   * @param {number} time
   * @return {string}
   */
  getTime(time) {
    let secs = (this.tempo / 6000000) * time;

    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    return hours + ':' + ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2);
  }
}

/***/ }),

/***/ "./src/riff.js":
/*!*********************!*\
  !*** ./src/riff.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Riff; });
class Riff {

  /**
   * @param {ByteArray} input input buffer.
   * @param {Object=} opt_params option parameters.
   * @constructor
   */
  constructor(input, opt_params) {
    opt_params = opt_params || {};
    /** @type {ByteArray} */
    this.input = input;
    /** @type {number} */
    this.ip = opt_params.index || 0;
    /** @type {number} */
    this.length = opt_params.length || input.length - this.ip;
    /** @type {Array.<{type: string, size: number, offset: number}>} */
    this.chunkList;
    /** @type {number} */
    this.offset = this.ip;
    /** @type {boolean} */
    this.padding =
      opt_params.padding !== void 0 ? opt_params.padding : true;
    /** @type {boolean} */
    this.bigEndian =
      opt_params.bigEndian !== void 0 ? opt_params.bigEndian : false;
  };

  parse() {
    /** @type {number} */
    var length = this.length + this.offset;

    this.chunkList = [];

    while (this.ip < length) {
      this.parseChunk();
    }
  };

  parseChunk() {
    /** @type {ByteArray} */
    var input = this.input;
    /** @type {number} */
    var ip = this.ip;
    /** @type {number} */
    var size;

    this.chunkList.push({
      'type': String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]),
      'size': (size = this.bigEndian ?
        ((input[ip++] << 24) | (input[ip++] << 16) |
          (input[ip++] << 8) | (input[ip++])) >>> 0 :
        ((input[ip++]) | (input[ip++] << 8) |
          (input[ip++] << 16) | (input[ip++] << 24)) >>> 0
      ),
      'offset': ip
    });

    ip += size;

    // padding
    if (this.padding && ((ip - this.offset) & 1) === 1) {
      ip++;
    }

    this.ip = ip;
  };

  /**
   * @param {number} index chunk index.
   * @return {?{type: string, size: number, offset: number}}
   */
  getChunk(index) {
    /** @type {{type: string, size: number, offset: number}} */
    var chunk = this.chunkList[index];

    if (chunk === void 0) {
      return null;
    }

    return chunk;
  };

  /**
   * @return {number}
   */
  getNumberOfChunks() {
    return this.chunkList.length;
  };
};


/***/ }),

/***/ "./src/smf.js":
/*!********************!*\
  !*** ./src/smf.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SMF; });
/* harmony import */ var _riff__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./riff */ "./src/riff.js");
/* harmony import */ var _midi_event__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./midi_event */ "./src/midi_event.js");



class SMF {
  /**
   * @param {ByteArray} input input buffer.
   * @param {Object=} opt_params option parameters.
   * @constructor
   */
  constructor(input, opt_params = {}) {
    opt_params.padding = false;
    opt_params.bigEndian = true;

    /** @type {ByteArray} */
    this.input = input;
    /** @type {number} */
    this.ip = opt_params.index || 0;
    /** @type {number} */
    this.chunkIndex = 0;
    /**
     * @type {Riff}
     * @private
     */
    this.riffParser_ = new _riff__WEBPACK_IMPORTED_MODULE_0__["default"](input, opt_params);

    // MIDI File Information

    /** @type {number} */
    this.formatType = 0;
    /** @type {number} */
    this.numberOfTracks = 0;
    /** @type {number} */
    this.timeDivision = 0;
    /** @type {Array.<Array.<Midi.Event>>} */
    this.tracks = [];
    /** @type {Array.<Array.<ByteArray>>} */
    this.plainTracks = [];
  };

  parse() {
    /** @type {number} */
    let i = 0;
    /** @type {number} */
    let il = 0;

    // parse riff chunks
    this.riffParser_.parse();

    // parse header chunk
    this.parseHeaderChunk();

    // parse track chunks
    for (i = 0, il = this.numberOfTracks; i < il; ++i) {
      this.parseTrackChunk();
    }
  };

  parseHeaderChunk() {
    /** @type {?{type: string, size: number, offset: number}} */
    const chunk = this.riffParser_.getChunk(this.chunkIndex++);
    /** @type {ByteArray} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;

    if (!chunk || chunk.type !== 'MThd') {
      throw new Error('invalid header signature');
    }

    this.formatType = (data[ip++] << 8) | data[ip++];
    this.numberOfTracks = (data[ip++] << 8) | data[ip++];
    this.timeDivision = (data[ip++] << 8) | data[ip++];
  };

  parseTrackChunk() {
    /** @type {?{type: string, size: number, offset: number}} */
    const chunk = this.riffParser_.getChunk(this.chunkIndex++);
    /** @type {ByteArray} */
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {number} */
    let size = 0;
    /** @type {number} */
    let deltaTime = 0;
    /** @type {number} */
    let eventType = 0;
    /** @type {number} */
    let channel = 0;
    /** @type {number} */
    let prevEventType = -1;
    /** @type {number} */
    let prevChannel = -1;
    /** @type {number} */
    let tmp = 0;
    /** @type {number} */
    let totalTime = 0;
    /** @type {number} */
    let offset = 0;
    /** @type {number} */
    let length = 0;
    /** @type {number} */
    let status = 0;
    /** @type {Event} */
    let event;
    /** @type {ByteArray} */
    let plainBytes;

    /** @return {number} */
    const readNumber = () => {
      /** @type {number} */
      let result = 0;
      /** @type {number} */
      let tmp = 0;

      do {
        tmp = data[ip++];
        result = (result << 7) | (tmp & 0x7f);
      } while ((tmp & 0x80) !== 0);

      return result;
    }

    if (!chunk || chunk.type !== 'MTrk') {
      throw new Error('invalid header signature');
    }

    size = chunk.offset + chunk.size;
    let eventQueue = [];
    let plainQueue = [];

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
      const table = [, , , , , , , ,
        'NoteOff',
        'NoteOn',
        'NoteAftertouch',
        'ControlChange',
        'ProgramChange',
        'ChannelAftertouch',
        'PitchBend'
      ];

      switch (eventType) {
        // channel events
        case 0x8:
        /* FALLTHROUGH */
        case 0x9:
        /* FALLTHROUGH */
        case 0xA:
        /* FALLTHROUGH */
        case 0xB:
        /* FALLTHROUGH */
        case 0xD:
        /* FALLTHROUGH */
        case 0xE:
          event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["ChannelEvent"](
            table[eventType], deltaTime, totalTime,
            channel, data[ip++], data[ip++]
          );
          break;
        case 0xC:
          event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["ChannelEvent"](
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
              event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["SystemExclusiveEvent"](
                'SystemExclusive', deltaTime, totalTime,
                data.subarray(ip, (ip += tmp) - 1)
              );
              break;
            case 0x7:
              tmp = readNumber();
              event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["SystemExclusiveEvent"](
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
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'SequenceNumber', deltaTime, totalTime, [data[ip++], data[ip++]]
                  );
                  break;
                case 0x01: // text event
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'TextEvent', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]
                  );
                  break;
                case 0x02: // copyright notice
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'CopyrightNotice', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]
                  );
                  break;
                case 0x03: // sequence/track name
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'SequenceTrackName', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]
                  );
                  break;
                case 0x04: // instrument name
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'InstrumentName', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]
                  );
                  break;
                case 0x05: // lyrics
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'Lyrics', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]
                  );
                  break;
                case 0x06: // marker
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'Marker', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]
                  );
                  break;
                case 0x07: // cue point
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'CuePoint', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]
                  );
                  break;
                case 0x20: // midi channel prefix
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'MidiChannelPrefix', deltaTime, totalTime, [data[ip++]]
                  );
                  break;
                case 0x2f: // end of track
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'EndOfTrack', deltaTime, totalTime, []
                  );
                  break;
                case 0x51: // set tempo
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'SetTempo', deltaTime, totalTime, [(data[ip++] << 16) | (data[ip++] << 8) | data[ip++]]
                  );
                  break;
                case 0x54: // smpte offset
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'SmpteOffset', deltaTime, totalTime, [data[ip++], data[ip++], data[ip++], data[ip++], data[ip++]]
                  );
                  break;
                case 0x58: // time signature
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'TimeSignature', deltaTime, totalTime, [data[ip++], data[ip++], data[ip++], data[ip++]]
                  );
                  break;
                case 0x59: // key signature
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'KeySignature', deltaTime, totalTime, [data[ip++], data[ip++]]
                  );
                  break;
                case 0x7f: // sequencer specific
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'SequencerSpecific', deltaTime, totalTime, [data.subarray(ip, ip += tmp)]
                  );
                  break;
                default: // unknown
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"](
                    'Unknown', deltaTime, totalTime, [eventType, data.subarray(ip, ip += tmp)]
                  );
              }
              break;
            default:
              console.log("unknown message:", status.toString(16));
          }
          break;
        // error
        default:
          throw new Error('invalid status');
      }

      // plain queue
      length = ip - offset;
      plainBytes = data.subarray(offset, offset + length);
      plainBytes[0] = status;
      if (
        event instanceof _midi_event__WEBPACK_IMPORTED_MODULE_1__["ChannelEvent"] &&
        event.subtype === 'NoteOn' &&
        /** @type {ChannelEvent} */
        (event).parameter2 === 0
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
  };
};

/***/ })

/******/ });
});
//# sourceMappingURL=smf.player.js.map