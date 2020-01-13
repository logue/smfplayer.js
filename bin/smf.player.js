/*! @logue/smfplayer v0.3.4 | imaya / GREE Inc. / Logue | license: MIT | build: 2020-01-13T02:21:55.338Z */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("SMF", [], factory);
	else if(typeof exports === 'object')
		exports["SMF"] = factory();
	else
		root["SMF"] = factory();
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

/***/ "./node_modules/ini/ini.js":
/*!*********************************!*\
  !*** ./node_modules/ini/ini.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.parse = exports.decode = decode

exports.stringify = exports.encode = encode

exports.safe = safe
exports.unsafe = unsafe

var eol = typeof process !== 'undefined' &&
  process.platform === 'win32' ? '\r\n' : '\n'

function encode (obj, opt) {
  var children = []
  var out = ''

  if (typeof opt === 'string') {
    opt = {
      section: opt,
      whitespace: false
    }
  } else {
    opt = opt || {}
    opt.whitespace = opt.whitespace === true
  }

  var separator = opt.whitespace ? ' = ' : '='

  Object.keys(obj).forEach(function (k, _, __) {
    var val = obj[k]
    if (val && Array.isArray(val)) {
      val.forEach(function (item) {
        out += safe(k + '[]') + separator + safe(item) + '\n'
      })
    } else if (val && typeof val === 'object') {
      children.push(k)
    } else {
      out += safe(k) + separator + safe(val) + eol
    }
  })

  if (opt.section && out.length) {
    out = '[' + safe(opt.section) + ']' + eol + out
  }

  children.forEach(function (k, _, __) {
    var nk = dotSplit(k).join('\\.')
    var section = (opt.section ? opt.section + '.' : '') + nk
    var child = encode(obj[k], {
      section: section,
      whitespace: opt.whitespace
    })
    if (out.length && child.length) {
      out += eol
    }
    out += child
  })

  return out
}

function dotSplit (str) {
  return str.replace(/\1/g, '\u0002LITERAL\\1LITERAL\u0002')
    .replace(/\\\./g, '\u0001')
    .split(/\./).map(function (part) {
      return part.replace(/\1/g, '\\.')
      .replace(/\2LITERAL\\1LITERAL\2/g, '\u0001')
    })
}

function decode (str) {
  var out = {}
  var p = out
  var section = null
  //          section     |key      = value
  var re = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i
  var lines = str.split(/[\r\n]+/g)

  lines.forEach(function (line, _, __) {
    if (!line || line.match(/^\s*[;#]/)) return
    var match = line.match(re)
    if (!match) return
    if (match[1] !== undefined) {
      section = unsafe(match[1])
      p = out[section] = out[section] || {}
      return
    }
    var key = unsafe(match[2])
    var value = match[3] ? unsafe(match[4]) : true
    switch (value) {
      case 'true':
      case 'false':
      case 'null': value = JSON.parse(value)
    }

    // Convert keys with '[]' suffix to an array
    if (key.length > 2 && key.slice(-2) === '[]') {
      key = key.substring(0, key.length - 2)
      if (!p[key]) {
        p[key] = []
      } else if (!Array.isArray(p[key])) {
        p[key] = [p[key]]
      }
    }

    // safeguard against resetting a previously defined
    // array by accidentally forgetting the brackets
    if (Array.isArray(p[key])) {
      p[key].push(value)
    } else {
      p[key] = value
    }
  })

  // {a:{y:1},"a.b":{x:2}} --> {a:{y:1,b:{x:2}}}
  // use a filter to return the keys that have to be deleted.
  Object.keys(out).filter(function (k, _, __) {
    if (!out[k] ||
      typeof out[k] !== 'object' ||
      Array.isArray(out[k])) {
      return false
    }
    // see if the parent section is also an object.
    // if so, add it to that, and mark this one for deletion
    var parts = dotSplit(k)
    var p = out
    var l = parts.pop()
    var nl = l.replace(/\\\./g, '.')
    parts.forEach(function (part, _, __) {
      if (!p[part] || typeof p[part] !== 'object') p[part] = {}
      p = p[part]
    })
    if (p === out && nl === l) {
      return false
    }
    p[nl] = out[k]
    return true
  }).forEach(function (del, _, __) {
    delete out[del]
  })

  return out
}

function isQuoted (val) {
  return (val.charAt(0) === '"' && val.slice(-1) === '"') ||
    (val.charAt(0) === "'" && val.slice(-1) === "'")
}

function safe (val) {
  return (typeof val !== 'string' ||
    val.match(/[=\r\n]/) ||
    val.match(/^\[/) ||
    (val.length > 1 &&
     isQuoted(val)) ||
    val !== val.trim())
      ? JSON.stringify(val)
      : val.replace(/;/g, '\\;').replace(/#/g, '\\#')
}

function unsafe (val, doUnesc) {
  val = (val || '').trim()
  if (isQuoted(val)) {
    // remove the single quotes before calling JSON.parse
    if (val.charAt(0) === "'") {
      val = val.substr(1, val.length - 2)
    }
    try { val = JSON.parse(val) } catch (_) {}
  } else {
    // walk the val to find the first not-escaped ; character
    var esc = false
    var unesc = ''
    for (var i = 0, l = val.length; i < l; i++) {
      var c = val.charAt(i)
      if (esc) {
        if ('\\;#'.indexOf(c) !== -1) {
          unesc += c
        } else {
          unesc += '\\' + c
        }
        esc = false
      } else if (';#'.indexOf(c) !== -1) {
        break
      } else if (c === '\\') {
        esc = true
      } else {
        unesc += c
      }
    }
    if (esc) {
      unesc += '\\'
    }
    return unesc.trim()
  }
  return val
}


/***/ }),

/***/ "./src/3mle.js":
/*!*********************!*\
  !*** ./src/3mle.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ThreeMacroLanguageEditor; });
/* harmony import */ var _PSGConverter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PSGConverter */ "./src/PSGConverter.js");
/* harmony import */ var _midi_event__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./midi_event */ "./src/midi_event.js");
/* harmony import */ var _mms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mms */ "./src/mms.js");



/**
 * @classdesc   Three Macro Language Editor (3MLE) mml file Parser
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2019-2020 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license     MIT
 */

class ThreeMacroLanguageEditor extends _mms__WEBPACK_IMPORTED_MODULE_2__["default"] {
  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  constructor(input, optParams = {}) {
    super(input, optParams);
  }
  /**
   */


  parse() {
    this.parseHeader();
    this.parseTracks();
    this.toPlainTrack();
  }

  /**
   */
  parseHeader() {
    const header = this.input.Settings;
    /** @type {TextEncoder} */

    this.encoder = new TextEncoder(header.Encoding || 'shift_jis');
    /** @param {string} */

    this.title = header.Title || '';
    /** @param {string} */

    this.author = header.Source || '';
    /** @param {number} */

    this.timeDivision = header.TimeBase | 0 || 32; // 曲名と著者情報を付加

    /** @type {array}  */

    const headerTrack = []; // GM Reset

    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__["SystemExclusiveEvent"]('SystemExclusive', 0, 0, [0x7e, 0x7f, 0x09, 0x01]));
    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"]('SequenceTrackName', 0, 0, [this.title]));
    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"]('CopyrightNotice', 0, 0, [this.author]));
    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"]('TextEvent', 0, 0, [header.Memo || '']));
    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"]('TimeSignature', 0, 0, [header.TimeSignatureNN | 0 || 4, header.TimeSignatureDD | 0 || 4, 0, 0]));
    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"]('EndOfTrack', 0, 0));
    this.tracks.push(headerTrack); // 3MLE EXTENSION、Settingsを取り除く

    delete this.input['3MLE EXTENSION'];
    delete this.input.Settings;
  }

  /**
   * MML parse
   */
  parseTracks() {
    const input = this.input;
    /** @type {array} 終了時間比較用 */

    const endTimes = [];
    /** @type {array} 各ブロックのMML */

    const mmls = [];
    /** @type {array} 各ブロックの演奏情報 */

    const settings = [];

    for (const block in input) {
      if (input.hasOwnProperty(block)) {
        // なお、3MLEは各チャンネルごとに和音を表現できない上に、ドラムチャンネルである10チャンネルを使えないため、
        // 事実上15和音までしか使えない。
        if (block.match(/^Channel(\d+)$/i)) {
          // MMLは[Channel[n]]ブロックのキー
          // ひどいファイル形式だ・・・。
          mmls[(RegExp.$1 | 0) - 1] = Object.keys(input[block]).join('').replace(/\/\*([^*]|\*[^\/])*\*\//g, '');
        }

        if (block.match(/^ChannelProperty(\d+)$/i)) {
          // 各パートの楽器情報などは[ChannelProperty[n]]に格納されている
          settings[(RegExp.$1 | 0) - 1] = {
            name: input[block].Name || `Channel${(RegExp.$1 | 0) - 1}`,
            instrument: input[block].Patch | 0,
            panpot: input[block].Pan | 0
          };
        }
      }
    }
    /** @type {array} 整形済みデータ */


    const data = []; // データを整形

    for (const no in mmls) {
      if (mmls.hasOwnProperty(no)) {
        if (settings[no] !== void 0) {
          data[no] = {
            mml: mmls[no],
            name: settings[no].name,
            instrument: settings[no].instrument || 0,
            panpot: settings[no].panpot || 64
          };
        } else {
          data[no] = {
            mml: mmls[no],
            name: `Channel${ch}`,
            instrument: 0,
            panpot: 64
          };
        }
      }
    } // console.log(data);


    for (const part in data) {
      if (data.hasOwnProperty(part)) {
        /** @type {number} */
        const ch = part | 0;
        /** @type {array} MIDIイベント */

        let track = [];

        if (data[part].mml === '') {
          // 空っぽのMMLトラックの場合処理しない
          continue;
        } // 楽器名


        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"]('InsturumentName', 0, 48, [data[part].name])); // プログラムチェンジ

        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__["ChannelEvent"]('ProgramChange', 0, 96, ch, data[part].instrument)); // パン

        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__["ChannelEvent"]('ControlChange', 0, 154, ch, 10, data[part].panpot));
        /** @param {PSGConverter} */

        const mml2Midi = new _PSGConverter__WEBPACK_IMPORTED_MODULE_0__["default"]({
          timeDivision: this.timeDivision,
          channel: ch,
          timeOffset: 386,
          mml: data[part].mml
        }); // トラックにマージ

        track = track.concat(mml2Midi.events); // 演奏時間を更新

        endTimes.push(mml2Midi.endTime); // トラック終了

        track.concat(new _midi_event__WEBPACK_IMPORTED_MODULE_1__["MetaEvent"]('EndOfTrack', 0, Math.max(endTimes)));
        this.tracks.push(track);
      }
    }

    this.numberOfTracks = this.tracks.length;
  }

}

/***/ }),

/***/ "./src/PSGConverter.js":
/*!*****************************!*\
  !*** ./src/PSGConverter.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PSGConverter; });
/* harmony import */ var _midi_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./midi_event */ "./src/midi_event.js");

/**
 * @class       PSGConverter
 * @classdesc   Mabinogi MML and Maple Story 2 MML to MIDI Converter.
 * @version     3.0.2
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2019-2020 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license     MIT
 */

class PSGConverter {
  /**
   * Constructor
   * @param {array} optParams
   */
  constructor(optParams = {}) {
    /** @type {number} 分解能 */
    this.timeDivision = optParams.timeDivision | 0 || 96;
    /** @type {number} チャンネル（0～15） */

    this.channel = optParams.channel | 0;
    /** @type {number} 演奏開始までのオフセット時間 */

    this.timeOffset = optParams.timeOffset | 0;
    /** @type {string} MMLのチャンネルごとのマッチパターン */

    this.PATTERN = /[a-glnortv<>][+#-]?\d*\.?&?/g;
    /** @type {Array<string, number>} ノートのマッチングテーブル */

    this.NOTE_TABLE = {
      c: 0,
      d: 2,
      e: 4,
      f: 5,
      g: 7,
      a: 9,
      b: 11
    };
    /** @type {number} １拍（Tick連動） */

    this.MINIM = this.timeDivision * 2;
    /** @type {number} 1小節 */

    this.SEMIBREVE = this.timeDivision * 4;
    /** @type {number} ベロシティの倍率 */

    this.VELOCITY_MAGNIFICATION = 7; // 127÷15≒8.4

    /** @type {array} MMLデータ */

    this.mml = optParams.mml;
    /** @type {array} イベント */

    this.events = [];
    /** @type {array} WML送信用イベント */

    this.plainEvents = [];
    /** @type {number} 終了時間 */

    this.endTime = 0;
    /** @type {number} ノートオフの逆オフセット(tick指定) */

    this.noteOffNegativeOffset = 1;
    /** @type {bool} テンポ命令を無視する */

    this.ignoreTempo = optParams.igonreTempo | false;
    /** @type {number} 最大オクターブ */

    this.maxOctave = optParams.maxOctave | 8;
    /** @type {number} 最小オクターブ */

    this.minOctave = optParams.minOctave | 0;
    /** @type {number} オクターブモード（0：処理しない。1：外れる音階はその前後のオクターブをループする。2：常に同じ音を鳴らす */

    this.octaveMode = optParams.octaveMode | 0;
    /** @type {number} 最低音階（octaveModeが0の場合は無視されます。デフォルトはピアノの音階。GM音源で再生するとき用） */

    this.minNote = optParams.minNote | 12;
    /** @type {number} 最高音階（octaveModeが0の場合は無視されます。デフォルトはピアノの音階。GM音源で再生するとき用） */

    this.maxNote = optParams.minNote | 98; // 変換実行

    this.parse();
  }
  /**
   * Parse MML
   */


  parse() {
    /** @type {Array} MMLストリーム */
    let mmls = [];

    try {
      // 小文字に変換した後正規表現で命令単位で分割する。
      mmls = this.mml.toLowerCase().match(this.PATTERN);
    } catch (e) {
      console.warn('Could not parse MML.', this.mml);
      return;
    }

    if (!mmls) {
      // 空欄の場合処理しない
      return;
    }
    /** @type {number} タイムスタンプ */


    let time = this.timeOffset;
    /** @type {number} 現在の音の長さ */

    let currentSoundLength = this.timeDivision;
    /** @type {number} 現在の音階 */

    let currentNote = 0;
    /** @type {number} ベロシティ(0～15) */

    let currentVelocity = 8;
    /** @type {number} オクターブ(0~8) */

    let currentOctave = 4;
    /** @type {bool} タイ記号 */

    let tieEnabled = false;
    /** @type {array} MIDIイベント */

    const events = []; // MMLを命令単位でパース

    for (const message of mmls) {
      /** @type {number} すすめるtick数 */
      let tick = currentSoundLength | 0;
      /** @type {string} コマンド */

      let command = '';
      /** @type {number} 値 */

      let value = 0; // 音長(L)、オクターブ(O<>)、テンポ（T）、ベロシティ（V）をパース

      if (message.match(/([lotv<>])([1-9][0-9]*|0?)(\.?)(&?)/)) {
        command = RegExp.$1.toLowerCase();
        value = RegExp.$2 | 0;

        if (tieEnabled && RegExp.$4 !== '&') {
          // タイ記号
          tieEnabled = false;
          events.push(new _midi_event__WEBPACK_IMPORTED_MODULE_0__["ChannelEvent"]('NoteOff', 0, time - this.noteOffNegativeOffset, this.channel, currentNote));
        }

        switch (command) {
          case 'l':
            // 音長設定 Ln[.] (n=1～192)
            if (value >= 1 && value <= this.MINIM) {
              currentSoundLength = Math.floor(this.SEMIBREVE / value);

              if (RegExp.$3 === '.') {
                // 付点の場合音長を1.5倍する
                currentSoundLength = Math.floor(currentSoundLength * 1.5);
              }
            }

            break;

          case 'o':
            // オクターブ設定 On (n=1～8)
            if (value >= this.minOctave && value <= this.maxOctave) {
              currentOctave = value;
            }

            break;

          case 't':
            // テンポ設定 Tn (n=32～255)
            events.push(new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('SetTempo', 0, time, [Math.floor(60000000 / value)]));
            break;

          case 'v':
            // ベロシティ調整
            if (value >= 0 && value <= 15) {
              currentVelocity = value;
            }

            break;
          // 簡易オクターブ設定 {<>}

          case '<':
            currentOctave = currentOctave <= this.minOctave ? this.minOctave : currentOctave - 1;
            break;

          case '>':
            currentOctave = currentOctave >= this.maxOctave ? this.maxOctave : currentOctave + 1;
            break;
        }
      } else if (message.match(/([a-gn])([+#-]?)([0-9]*)(\.?)(&?)/)) {
        // ノート命令（CDEFGAB）、絶対音階指定（N）をパース

        /** @type {number} 音階 */
        let note = 0;
        command = RegExp.$1.toLowerCase();
        value = RegExp.$3 | 0;

        if (command === 'n') {
          // Nn：絶対音階指定 Lで指定した長さに設定
          note = value;
        } else {
          // [A-G]：音名表記
          // 音符の長さ指定: n分音符→128分音符×tick数
          if (value >= 1 && value <= this.MINIM) {
            tick = Math.floor(this.SEMIBREVE / value); // L1 -> 384tick .. L64 -> 6tick
          }

          if (RegExp.$4 === '.') {
            tick = Math.floor(tick * 1.5); // 付点つき -> 1.5倍
          }

          if (this.octaveMode !== 2) {
            // 音名→音階番号変換(C1 -> 12, C4 -> 48, ..)
            note = 12 * currentOctave + this.NOTE_TABLE[command]; // 調音記号の処理

            if (RegExp.$2 === '+' || RegExp.$2 === '#') {
              note++;
            } else if (RegExp.$2 === '-') {
              note--;
            }
          }
        } // オクターブ調整（楽器の音域エミュレーション。通常は0。GM互換モード時のみ使用）


        switch (this.octaveMode) {
          case 1:
            // オクターブループモード
            while (note < this.minNote) note = note + 12;

            while (note > this.maxNote) note = note - 12;

            note += 12;
            break;

          case 2:
            // ワンショットモード（音階の強制指定）
            note = this.maxNote;
            break;

          default:
            // 通常モード（非GMモードでは常にこれ）
            note += 12;
            break;
        }

        if (!tieEnabled) {
          // 前回タイ記号が無いときのみノートオン
          events.push(new _midi_event__WEBPACK_IMPORTED_MODULE_0__["ChannelEvent"]('NoteOn', 0, time, this.channel, note, currentVelocity * this.VELOCITY_MAGNIFICATION));
        } else if (note !== currentNote) {
          // c&dなど無効なタイの処理
          events.push(new _midi_event__WEBPACK_IMPORTED_MODULE_0__["ChannelEvent"]('NoteOff', 0, time - this.noteOffNegativeOffset, this.channel, currentNote));
          tieEnabled = false;
        } // タイムカウンタを音符の長さだけ進める


        time += tick; // ノートオフ命令の追加

        if (RegExp.$5 === '&') {
          // タイ記号の処理
          tieEnabled = true;
          currentNote = note; // 直前の音階を保存
        } else {
          tieEnabled = false; // 発音と消音が同じ時間の場合、そこのノートが再生されないため、消音時にtimeを-1する。

          events.push(new _midi_event__WEBPACK_IMPORTED_MODULE_0__["ChannelEvent"]('NoteOff', 0, time - this.noteOffNegativeOffset, this.channel, note));
        }
      } else if (message.match(/R([0-9]*)(\.?)/i)) {
        // 休符設定 R[n][.] (n=1～64)
        value = RegExp.$1 | 0;

        if (value >= 1 && value <= this.MINIM) {
          // L1 -> 128tick .. L64 -> 2tick
          tick = Math.floor(this.SEMIBREVE / value);
        }

        if (RegExp.$2 === '.') {
          // 付点つき -> 1.5倍
          tick = Math.floor(tick * 1.5);
        }

        time += tick; // タイムカウンタを休符の長さだけ進める
      } else {
        console.warn('unknown signeture.', message);
      }
    } // イベントを代入


    this.events = events; // 演奏完了時間を代入

    this.endTime = time;
  }
  /**
   * ドラムのマッピング
   * @param {number} note ノート
   * @return {number}
   */


  getGmDrum(note) {
    // TODO
    return note;
  }

}

/***/ }),

/***/ "./src/meta.js":
/*!*********************!*\
  !*** ./src/meta.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// This file is auto-generated by the build system.
const Meta = {
  version: '0.3.4',
  date: '2020-01-13T02:21:55.338Z'
};
/* harmony default export */ __webpack_exports__["default"] = (Meta);

/***/ }),

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
/**
 * Midi Event abstract Structure
 */
class Event {
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
 * @extends {Event}
 */


class ChannelEvent extends Event {
  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {number} channel
   * @param {number=} optParameter1
   * @param {number=} optParameter2
   */
  constructor(subtype, deltaTime, time, channel, optParameter1, optParameter2) {
    super(subtype, deltaTime, time);
    /** @type {number} */

    this.channel = channel;
    /** @type {(number|undefined)} */

    this.parameter1 = optParameter1;
    /** @type {(number|undefined)} */

    this.parameter2 = optParameter2;
  }

}
/**
 * System Exclusive Event Structure
 * @extends {Event}
 */


class SystemExclusiveEvent extends Event {
  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {ByteArray} data
   */
  constructor(subtype, deltaTime, time, data) {
    super(subtype, deltaTime, time);
    /** @type {ByteArray} */

    this.data = data;
  }

}
/**
 * Midi Meta Event Structure
 * @extends {Event}
 */


class MetaEvent extends Event {
  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {Array.<*>} data meta data.
   */
  constructor(subtype, deltaTime, time, data) {
    super(subtype, deltaTime, time);
    /** @type {Array.<*>} */

    this.data = data;
  }

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
/**
 * Mld Parser Class
 */
class Mld {
  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  constructor(input, optParams = {}) {
    /** @type {ByteArray} */
    this.input = input;
    /** @type {number} */

    this.ip = optParams.index || 0;
    /** @type {number} */

    this.timeDivision = optParams.timeDivision || 48;
    /** @type {Object} */

    this.header;
    /** @type {Object} */

    this.dataInformation;
    /** @type {Array.<Array.<Object>>} */

    this.tracks;
  }

  /**
   */
  parse() {
    this.parseHeader();
    this.parseDataInformation();
    this.parseTracks();
  }

  /**
   */
  parseHeader() {
    /** @type {ByteArray} */
    const input = this.input;
    /** @type {number} */

    let ip = this.ip;
    /** @type {Object} */

    const header = this.header = {};
    /** @type {string} */

    const signature = String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]);

    if (signature !== 'melo') {
      throw new Error('invalid MFi signature:' + signature);
    }

    header.fileLength = (input[ip++] << 24 | input[ip++] << 16 | input[ip++] << 8 | input[ip++]) >>> 0;
    header.trackOffset = (input[ip++] << 16 | input[ip++]) + ip;
    header.dataMajorType = input[ip++];
    header.dataMinorType = input[ip++];
    header.numberOfTracks = input[ip++];
    this.ip = ip;
  }

  /**
   */
  parseDataInformation() {
    /** @type {ByteArray} */
    const input = this.input;
    /** @type {number} */

    let ip = this.ip;
    /** @type {Object} */

    const dataInformation = this.dataInformation = {
      copy: null,
      date: null,
      exst: null,
      note: null,
      prot: null,
      sorc: null,
      titl: null,
      trac: null,
      vers: null
    };
    /** @type {string} */

    let type;
    /** @type {number} */

    let size;

    while (ip < this.header.trackOffset) {
      type = String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]);
      size = input[ip++] << 8 | input[ip++];

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
          dataInformation[type] = String.fromCharCode.apply(null, input.subarray(ip, ip += size));
          break;

        case 'sorc':
          dataInformation[type] = input[ip++];
          break;

        case 'note':
          dataInformation[type] = input[ip++] << 8 | input[ip++];
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
  }
  /**
   */


  parseTracks() {
    /** @type {ByteArray} */
    const input = this.input;
    /** @type {number} */

    let ip = this.ip;
    /** @type {string} */

    let signature;
    /** @type {number} */

    let size;
    /** @type {number} */

    let limit;
    /** @type {number} */

    let status;
    /** @type {number} */

    let extendStatus;
    /** @type {Object} */

    let message;
    /** @type {Array.<Array.<Object>>} */

    const tracks = this.tracks = [];
    /** @type {Array.<Object>} */

    let track;
    /** @type {number} */

    let i;
    /** @type {number} */

    let il;
    /**
     * @return {Array.<Object>}
     */

    const parseEditInstrument = () => {
      /** @type {number} */
      const length = input[ip++] << 8 | input[ip++];
      /** @type {number} */

      const limit = ip + length;
      /** @type {Array.<Object>} */

      const result = [];
      /** @type {Object} */

      let info; // const

      if (input[ip++] !== 1) {
        throw new Error('invalid EditInstrument const value:' + input[ip - 1]);
      }

      while (ip < limit) {
        info = {};
        info.part = input[ip++] >> 4 & 0x3;
        info.modulator = {
          ML: input[ip] >> 5,
          VIV: input[ip] >> 4 & 0x1,
          EG: input[ip] >> 3 & 0x1,
          SUS: input[ip] >> 2 & 0x1,
          RR: (input[ip++] & 0x3) << 2 | input[ip] >> 6,
          DR: input[ip] >> 4 & 0xf,
          AR: (input[ip++] & 0x3) << 2 | input[ip] >> 6,
          SL: input[ip] >> 4 & 0xf,
          TL: (input[ip++] & 0x3) << 4 | input[ip] >> 4,
          WF: input[ip] >> 3 & 0x1,
          FB: input[ip++] & 0x7
        };
        info.carrier = {
          ML: input[ip] >> 5,
          VIV: input[ip] >> 4 & 0x1,
          EG: input[ip] >> 3 & 0x1,
          SUS: input[ip] >> 2 & 0x1,
          RR: (input[ip++] & 0x3) << 2 | input[ip] >> 6,
          DR: input[ip] >> 4 & 0xf,
          AR: (input[ip++] & 0x3) << 2 | input[ip] >> 6,
          SL: input[ip] >> 4 & 0xf,
          TL: (input[ip++] & 0x3) << 4 | input[ip] >> 4,
          WF: input[ip] >> 3 & 0x1,
          FB: input[ip++] & 0x7
        };
        info.octaveSelect = input[ip++] & 0x3;
        result.push(info);
      }

      return result;
    };
    /**
     * @return {{part: number, switch: number}}
     */


    const parseVibrato = () => {
      // const
      if (input[ip++] !== 1) {
        throw new Error('invalid Vibrato const value:' + input[ip - 1]);
      }

      return {
        part: input[ip++] >> 5 & 0x3,
        switch: input[ip++] >> 6
      };
    };
    /**
     * @return {{data: ByteArray}}
     */


    const parseDeviceSpecific = () => {
      /** @type {number} */
      const length = input[ip++] << 8 | input[ip++];
      /** @type {number} */

      const limit = ip + length; // const

      if (input[ip++] !== 0x11) {
        throw new Error('invalid DeviceSpecific const value:' + input[ip - 1]);
      }

      return {
        data: input.subarray(ip, ip += limit - ip)
      };
    };

    for (i = 0, il = this.header.numberOfTracks; i < il; ++i) {
      signature = String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]);

      if (signature !== 'trac') {
        throw new Error('invalid track signature:' + signature);
      }

      size = input[ip++] << 24 | input[ip++] << 16 | input[ip++] << 8 | input[ip++];
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
        }; // delta time

        message.deltaTime = deltaTime = input[ip++]; // status

        status = input[ip++];

        if (status !== 0xff) {
          message.type = 'note';
          message.subType = 'Note';
          message.voice = status >> 6;
          message.key = status & 0x3f; // note length

          noteLength = message.length = input[ip++]; // extend status

          if (this.dataInformation.note === 1) {
            extendStatus = input[ip++];
            message.velocity = extendStatus >> 2;
            message.octaveShift = extendStatus & 0x3;
          }
        } else {
          message.type = 'meta'; // status

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
                    channel: input[ip] >> 3 & 0x7,
                    drum: input[ip++] & 0x1
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
                timeBase: (status & 0x7) === 7 ? NaN : Math.pow(2, status & 0x7) * ((status & 0x8) === 0 ? 6 : 15),
                tempo: input[ip++]
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
                    id: input[ip] >> 6,
                    count: input[ip] >> 2 & 0xf,
                    point: input[ip++] & 0x3
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
                    part: input[ip] >> 6,
                    instrument: input[ip++] & 0x3f
                  };
                  break;

                case 0x1:
                  message.subType = 'InstrumentHighPart';
                  message.value = {
                    part: input[ip] >> 6,
                    instrument: input[ip++] & 0x1
                  };
                  break;

                case 0x2:
                  message.subType = 'Volume';
                  message.value = {
                    part: input[ip] >> 6,
                    volume: input[ip++] & 0x3f
                  };
                  break;

                case 0x3:
                  message.subType = 'Valance';
                  message.value = {
                    part: input[ip] >> 6,
                    valance: input[ip++] & 0x3f
                  };
                  break;

                case 0x4:
                  message.subType = 'PitchBend';
                  message.value = {
                    part: input[ip] >> 6,
                    value: input[ip++] & 0x3f
                  };
                  break;

                case 0x5:
                  message.subType = 'ChannelAssign';
                  message.value = {
                    part: input[ip] >> 6,
                    channel: input[ip++] & 0x3f
                  };
                  break;

                case 0x6:
                  message.subType = 'VolumeChange';
                  message.value = {
                    part: input[ip] >> 6,
                    volume: (input[ip++] & 0x3f) << 26 >> 26
                  };
                  break;

                case 0x7:
                  message.subType = 'PitchBendRange';
                  message.value = {
                    part: input[ip] >> 6,
                    value: input[ip++] & 0x3f
                  };
                  break;

                case 0x8:
                /*
                // TODO: 未遭遇
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
                    part: input[ip] >> 6,
                    value: input[ip++] & 0x3f
                  };
                  break;

                case 0xA:
                  message.subType = 'Modulation';
                  message.value = {
                    part: input[ip] >> 6,
                    depth: input[ip++] & 0x3f
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

    this.ip = ip;
  }
  /**
   * @return {Object}
   */


  convertToMidiTracks() {
    /** @type {Object} */
    const result = {
      timeDivision: this.timeDivision,
      trac: [],
      tracks: [],
      plainTracks: []
    };
    /** @type {Array.<Array.<Object>>} */

    const tracks = result.tracks;
    /** @type {Array.<Array.<Array.<number>>>} */

    const plainTracks = result.plainTracks;
    /** @type {Array.<Array.<Object>>} */

    const mfiTracks = this.tracks;
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

    const channelTime = [];
    /** @type {number} */

    let channel;

    for (i = 0; i < 16; ++i) {
      plainTracks[i] = [];
      channelTime[i] = 0;
    } // 変換しにくい形式を平坦化する


    for (i = 0, il = mfiTracks.length; i < il; ++i) {
      mfiTrack = mfiTracks[i];
      tmpTrack = []; // note の処理

      for (time = pos = j = 0, jl = mfiTrack.length; j < jl; ++j) {
        mfiEvent = mfiTrack[j];
        time += mfiEvent.deltaTime;
        mfiEvent.id = pos;
        mfiEvent.time = time;

        switch (mfiEvent.subType) {
          case 'Nop':
            break;

          case 'Note':
            tmpTrack[pos++] = mfiEvent; // TODO: value: ... 形式になおす

            tmpTrack[pos] = {
              id: pos,
              type: 'internal',
              subType: 'NoteOff',
              time: time + mfiEvent.length,
              key: mfiEvent.key,
              voice: mfiEvent.voice,
              velocity: mfiEvent.velocity,
              octaveShift: mfiEvent.octaveShift
            };
            pos++;
            break;

          case 'InstrumentHighPart':
            prevEvent = mfiEvent;
            mfiEvent = mfiTrack[++j];

            if (mfiEvent.subType !== 'InstrumentLowPart') {
              throw new Error('broken instrument');
            } // TODO: value: ... 形式になおす


            tmpTrack[pos] = {
              id: pos,
              type: 'internal',
              subType: 'ProgramChange',
              time: time,
              part: mfiEvent.value.part,
              instrument: prevEvent.value.instrument << 6 | mfiEvent.value.instrument
            };
            pos++;
            break;

          default:
            tmpTrack[pos++] = mfiEvent;
            break;
        }
      }

      tmpTrack.sort((a, b) => {
        return a.time > b.time ? 1 : a.time < b.time ? -1 : a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
      }); // MIDI トラックに作成

      tracks[i] = [];

      for (time = j = 0, jl = tmpTrack.length; j < jl; ++j) {
        mfiEvent = tmpTrack[j];
        time = mfiEvent.time;

        switch (mfiEvent.subType) {
          case 'Note':
            // NoteOn: 9n kk vv
            key = this.applyOctaveShift(mfiEvent.key + 45, mfiEvent.octaveShift);
            channel = i * 4 + mfiEvent.voice; // TODO: リズムトラックの時は Key が -10 されているような気がする

            if (channel === 9) {
              key -= 10;
            }

            plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0x90 | channel, key, mfiEvent.velocity * 2));
            break;

          case 'NoteOff':
            // NoteOff: 8n kk vv
            key = this.applyOctaveShift(mfiEvent.key + 45, mfiEvent.octaveShift);
            channel = i * 4 + mfiEvent.voice; // TODO: リズムトラックの時は Key が -10 されているような気がする

            if (channel === 9) {
              key -= 10;
            }

            plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0x80 | channel, key, mfiEvent.velocity * 2));
            break;

          case 'ProgramChange':
            // Program Change: Cn pp
            channel = i * 4 + mfiEvent.part;
            plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xC0 | channel, mfiEvent.instrument));
            break;

          case 'SetTempo':
            // SetTempo: FF 51 03 tt tt tt
            tmp = 2880000000 / (mfiEvent.value.tempo * mfiEvent.value.timeBase);
            channel = 0; // SetTempo は必ず先頭のトラックに配置する

            plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xFF, 0x51, 0x03, tmp >> 16 & 0xff, tmp >> 8 & 0xff, tmp & 0xff));
            break;

          case 'Loop':
            // Marker: FF 06 ll ss ss ss ...
            tmp = mfiEvent.value.count;
            str = 'LOOP_' + (mfiEvent.value.point === 0 ? 'START' : 'END') + '=ID:' + mfiEvent.value.id + ',COUNT:' + (tmp === 0 ? -1 : tmp);
            channel = 0;
            plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat([0xFF, 0x06, str.length], str.split('').map(a => {
              return a.charCodeAt(0);
            })));
            break;

          case 'MasterVolume':
            // Master Volume: F0 7F ee 04 01 dl dm F7
            tmp = mfiEvent.value;
            channel = 0;
            plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xF0, 0x07, // length
            0x7F, 0x7F, 0x04, 0x01, tmp, tmp, 0xF7));
            break;

          case 'Modulation':
            // CC#1 Modulation: Bn 01 dd
            channel = i * 4 + mfiEvent.value.part;
            plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xB0 | channel, 0x01, mfiEvent.value.depth * 2));
            break;

          case 'Volume':
            // CC#7 Volume: Bn 07 dd
            channel = i * 4 + mfiEvent.value.part;
            plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xB0 | channel, 0x07, mfiEvent.value.volume * 2));
            break;

          case 'Valance':
            // CC#10 Panpot: Bn 0A dd
            channel = i * 4 + mfiEvent.value.part;
            plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xB0 | channel, 0x0A, (mfiEvent.value.valance - 32) * 2 + 64));
            break;

          case 'PitchBend':
            // Pitch Bend: En dl dm
            // TODO: LSB = MSB で良いか不明
            channel = i * 4 + mfiEvent.value.part;
            plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xE0 | channel, mfiEvent.value.value * 2, mfiEvent.value.value * 2));
            break;

          case 'PitchBendRange':
            // Pitch Bend: CC#100=0 CC#101=0 CC#6
            // Bn 64 00 Bn 65 00 Bn 06 vv
            channel = i * 4 + mfiEvent.value.part;
            plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xB0 | channel, 0x64, 0x00), [0x00, 0xB0 | channel, 0x65, 0x00], [0x00, 0xB0 | channel, 0x06, mfiEvent.value.value * 2]);
            break;

          case 'MasterCoarseTuning':
            // MasterCoarseTuning: CC#100=0 CC#101=2 CC#6
            // Bn 64 01 Bn 65 02 Bn 06 vv
            channel = i * 4 + mfiEvent.value.part;
            plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xB0 | channel, 0x64, 0x00), [0x00, 0xB0 | channel, 0x65, 0x02], [0x00, 0xB0 | channel, 0x06, mfiEvent.value.value * 2]);
            break;

          default:
            continue;
        }

        channelTime[channel] = mfiEvent.time;
      }
    }

    return this.toSMF(plainTracks);
  }
  /**
   * @param {number} key
   * @param {number} octaveShift
   * @return {number}
   */


  applyOctaveShift(key, octaveShift) {
    /** @type {Array.<number>} */
    const table = [0, 12, -24, -12];

    if (table[octaveShift] !== void 0) {
      return key + table[octaveShift];
    }

    throw new Error('invalid OctaveShift value:' + octaveShift);
  }
  /**
   * @param {Array.<Array.<ByteArray>>} plainTracks
   * @return {ByteArray}
   */


  toSMF(plainTracks) {
    /** @type {number} @const */
    const TimeDivision = 48;
    /** @type {Array.<number>} */

    let trackHeader;
    /** @type {Array.<number>} */

    let trackData;
    /** @type {ByteArray} */

    let result = [0x4D, 0x54, 0x68, 0x64, // "MThd"
    0x00, 0x00, 0x00, 0x06, // Size
    0x00, 0x01, // Format
    0x00, 0x10, // number of track
    TimeDivision >> 8 & 0xff, TimeDivision & 0xff // Data
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
     * @return {Array.<number>}
     */

    function stringToArray(str) {
      /** @type {number} */
      let i;
      /** @type {number} */

      const il = str.length;
      /** @type {Array.<number>} */

      const array = new Array(il);

      for (i = 0; i < il; ++i) {
        array[i] = str.charCodeAt(i);
      }

      return array;
    }

    if (this.dataInformation.copy !== void 0) {
      /** @type {Array.<number>} */
      let copy = stringToArray(this.dataInformation.copy);
      il = copy.length;
      copy = [0x00, 0xff, 0x02].concat(this.deltaTimeToByteArray(il), copy);
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
      const track = plainTracks[i];
      trackData = [];

      for (j = 0, jl = track.length; j < jl; ++j) {
        Array.prototype.push.apply(trackData, track[j]);
      }

      jl = trackData.length;
      trackHeader = [0x4D, 0x54, 0x72, 0x6B, // "MTrk"
      jl >> 24 & 0xff, jl >> 16 & 0xff, jl >> 8 & 0xff, jl & 0xff];
      result = result.concat(trackHeader, trackData);
    }

    return new Uint8Array(result);
  }
  /**
   * @param {number} deltaTime
   * @return {Array.<number>}
   */


  deltaTimeToByteArray(deltaTime) {
    /** @type {Array.<number>} */
    const array = [];

    while (deltaTime >= 0x80) {
      array.unshift(deltaTime & 0x7f | (array.length === 0 ? 0 : 0x80));
      deltaTime >>>= 7;
    }

    array.unshift(deltaTime | (array.length === 0 ? 0 : 0x80));
    return array;
  }

}

/***/ }),

/***/ "./src/mmi.js":
/*!********************!*\
  !*** ./src/mmi.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MabiIcco; });
/* harmony import */ var _PSGConverter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PSGConverter */ "./src/PSGConverter.js");
/* harmony import */ var _mms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mms */ "./src/mms.js");
/* harmony import */ var _midi_event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./midi_event */ "./src/midi_event.js");



/**
 * @classdesc   MabiIcco MML File Parser
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2019-2020 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license     MIT
 */

class MabiIcco extends _mms__WEBPACK_IMPORTED_MODULE_1__["default"] {
  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  constructor(input, optParams = {}) {
    super(input, optParams);
    /** @type {array} 入力データ。行ごとに配列化 */

    this.input = String.fromCharCode.apply('', new Uint16Array(input)).split(/\r\n|\r|\n/);
    /** @type {Array.<Array.<Object>>} 全トラックの演奏情報 */

    this.tracks = [];
    /** @type {Array.<Array.<Uint8Array>>} WMLに送る生のMIDIイベント */

    this.plainTracks = [];
    /** @param {number} トラック数 */

    this.numberOfTracks = 1;
    /** @type {number} 分解能 */

    this.timeDivision = optParams.timeDivision || 96;
  }
  /**
   * パース処理
   */


  parse() {
    this.parseHeader();
    this.parseTracks();
    this.toPlainTrack();
  }
  /**
   * ヘッダーメタ情報をパース
   */


  parseHeader() {
    /** @type {TextEncoder} */
    this.encoder = new TextEncoder('utf-8');
    /** @type {array} 各トラックごと複数存在する変数名 */

    const multipleKeys = ['mml-track', 'name', 'program', 'songProgram', 'panpot'];
    const ret = {};
    /** @type {number} トラック番号（ヘッダー情報があるので初期値は-1） */

    let trackNo = -1;
    ret.track = [];

    for (let i = 0; i < this.input.length; i++) {
      const line = this.input[i].trim();

      if (i === 0) {
        if (line !== '[mml-score]') {
          throw new Error('Not MabiIcco File.');
        }

        continue;
      }

      const [key, value] = line.split('=');

      if (multipleKeys.includes(key)) {
        if (key === 'mml-track') {
          trackNo++;
          ret.track[trackNo] = {}; // 「-」が含まれる名前を変数名として使うと面倒なので・・・。

          ret.track[trackNo].mml = value;
        } else {
          ret.track[trackNo][key] = key === 'name' ? value : value | 0;
        }
      } else {
        ret[key] = value;
      }
    }
    /** @param {string} タイトル */


    this.title = ret.title || '';
    /** @param {string} 著者情報 */

    this.author = ret.author || '';
    /** @param {array} グローバルテンポ情報（テンポ変更のTickとテンポ？） */

    const mmiTempo = ret.tempo !== '' ? ret.tempo.split('T') : [0, 120];
    /** @param {number} 分解能 */

    this.timeDivision = 96;
    /** @param {number} テンポ */

    this.tempo = mmiTempo[1] | 0;
    /** @param {array} 拍子記号 */

    const timeSig = ret.time.split('/');
    /** @type {array}  */

    const headerTrack = []; // GM Reset

    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["SystemExclusiveEvent"]('SystemExclusive', 0, 0, [0x7e, 0x7f, 0x09, 0x01])); // 曲名と著者情報を付加

    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]('SequenceTrackName', 0, 0, [this.title]));
    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]('CopyrightNotice', 0, 0, [this.author]));
    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]('TimeSignature', 0, 0, [timeSig[0] | 0 || 4, timeSig[1] | 0 || 4, 0, 0]));
    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]('SetTempo', 0, 0, [Math.floor(60000000 / this.tempo)]));
    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]('EndOfTrack', 0, 0));
    this.tracks.push(headerTrack);
    this.input = ret.track; // console.log(this);
  }
  /**
   * MML parse
   */


  parseTracks() {
    /** @type {array} MIDIイベント */
    let track = [];
    /** @type {array} 終了時間比較用 */

    const endTimes = [];

    for (let ch = 0; ch < this.input.length; ch++) {
      /** @type {array} 現在のチャンネルの情報 */
      const current = this.input[ch];

      if (!current.mml.match(/^(?:MML@)(.*)/gm)) {
        continue;
      }
      /** @type {array} MMLの配列（簡易マッチ） */


      const mmls = RegExp.$1.split(','); // 楽器名

      track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]('InsturumentName', 0, 48, [current.name])); // プログラムチェンジ

      track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["ChannelEvent"]('ProgramChange', 0, 96, ch, current.program));

      if (current.songProgram !== -1) {
        // コーラス用
        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["ChannelEvent"]('ProgramChange', 0, 112, 15, current.songProgram));
      } // パン(CC:0x10)


      track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["ChannelEvent"]('ControlChange', 0, 154, ch, 10, current.panpot)); // MMLの各チャンネルの処理

      for (let chord = 0; chord < current.mml.length; chord++) {
        let currentCh = ch;

        if (chord === 3 && current.songProgram !== -1) {
          // ch 16はコーラス用
          // TODO: 現在の実装では一人しかコーラスを反映させることができない。（男女のコーラスを同時に鳴らせない）
          // 複数の奏者でコーラスが指定されていた場合、男性女性用関係なく一番うしろのコーラスで指定された音色でマージされる。
          currentCh = 15;
        }

        if (mmls[chord] === void 0) {
          continue;
        }
        /** @param {PSGConverter} */


        const mml2Midi = new _PSGConverter__WEBPACK_IMPORTED_MODULE_0__["default"]({
          timeDivision: this.timeDivision,
          channel: currentCh,
          timeOffset: 386,
          mml: mmls[chord],
          igonoreTempo: currentCh === 1
        }); // トラックにマージ

        track = track.concat(mml2Midi.events);
        endTimes.push(mml2Midi.endTime);
      } // トラック終了


      track.concat(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]('EndOfTrack', 0, Math.max(endTimes)));
      this.tracks.push(track);
    }

    this.numberOfTracks = this.tracks.length;
  }

}

/***/ }),

/***/ "./src/mms.js":
/*!********************!*\
  !*** ./src/mms.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MakiMabiSequence; });
/* harmony import */ var _PSGConverter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PSGConverter */ "./src/PSGConverter.js");
/* harmony import */ var ini__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ini */ "./node_modules/ini/ini.js");
/* harmony import */ var ini__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ini__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _midi_event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./midi_event */ "./src/midi_event.js");



/**
 * @classdesc   MakiMabi Sequence File Parser
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2019-2020 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license     MIT
 */

class MakiMabiSequence {
  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  constructor(input, optParams = {}) {
    /** @type {string} */
    const string = String.fromCharCode.apply('', new Uint16Array(input));
    /** @type {Ini} MMSファイルをパースしたもの */

    this.input = ini__WEBPACK_IMPORTED_MODULE_1___default.a.parse(string);
    /** @type {Array.<Array.<Object>>} 全トラックの演奏情報 */

    this.tracks = [];
    /** @type {Array.<Array.<Uint8Array>>} WMLに送る生のMIDIイベント */

    this.plainTracks = [];
    /** @param {number} トラック数 */

    this.numberOfTracks = 1;
    /** @type {number} 分解能 */

    this.timeDivision = optParams.timeDivision || 96;
  }
  /**
   * パース処理
   */


  parse() {
    this.parseHeader();
    this.parseTracks();
    this.toPlainTrack();
  }

  /**
   * ヘッダーメタ情報をパース
   */
  parseHeader() {
    /** @type {TextEncoder} */
    this.encoder = new TextEncoder('shift_jis');
    /** @type {object} インフォメーション情報 */

    const header = this.input.infomation; // informationじゃない

    /** @type {string} タイトル */

    this.title = header.title || '';
    /** @type {string} 著者情報 */

    this.type = header.auther || ''; // authorじゃない。

    /** @param {number} 解像度 */

    this.timeDivision = header.timeBase | 0 || 96;
    /** @type {array} まきまびしーくの楽器番号変換テーブル（MabiIccoのMMSFile.javaのテーブルを流用） */

    this.mmsInstTable = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 18]; // 曲名と著者情報を付加

    /** @type {array}  */

    const headerTrack = []; // GM Reset

    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["SystemExclusiveEvent"]('SystemExclusive', 0, 0, [0x7e, 0x7f, 0x09, 0x01]));
    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]('SequenceTrackName', 0, 0, [this.title]));
    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]('CopyrightNotice', 0, 0, [this.author]));
    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]('TimeSignature', 0, 0, [header.rythmNum | 0 || 4, header.rythmBase | 0 || 4, 0, 0]));
    headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]('EndOfTrack', 0, 0));
    this.tracks.push(headerTrack); // infomationおよびmms-fileを取り除く

    delete this.input.infomation;
    delete this.input['mms-file'];
  }

  /**
   * MML parse
   */
  parseTracks() {
    const input = this.input;
    /** @type {array} MIDIイベント */

    let track = [];
    /** @type {array} 終了時間比較用 */

    const endTimes = [];
    /** @type {number} チャンネル */

    let ch = 0;

    for (const part in input) {
      if (input.hasOwnProperty(part)) {
        /** @param {array} MMLの配列 */
        const mmls = [input[part].ch0_mml, input[part].ch1_mml, input[part].ch2_mml];
        /** @param {number} パンポット */

        const panpot = Number(input[part].panpot) + 64; // 楽器名

        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]('InsturumentName', 0, 48, [input[part].name])); // プログラムチェンジ

        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["ChannelEvent"]('ProgramChange', 0, 96, ch, this.mmsInstTable[input[part].instrument] | 0)); // パン

        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["ChannelEvent"]('ControlChange', 0, 154, ch, 10, panpot)); // MMLの各チャンネルの処理

        for (let chord = 0; chord < mmls.length; chord++) {
          /** @param {PSGConverter} */
          const mml2Midi = new _PSGConverter__WEBPACK_IMPORTED_MODULE_0__["default"]({
            timeDivision: this.timeDivision,
            channel: ch,
            timeOffset: 386,
            mml: mmls[chord]
          }); // トラックにマージ

          track = track.concat(mml2Midi.events);
          endTimes.push(mml2Midi.endTime);
        }

        ch++; // トラック終了

        track.concat(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]('EndOfTrack', 0, Math.max(endTimes)));
        this.tracks.push(track);
      }
    }

    this.numberOfTracks = this.tracks.length;
  }
  /**
   * WebMidiLink信号に変換
   */


  toPlainTrack() {
    for (let i = 0; i < this.tracks.length; i++) {
      /** @type {array} トラックのイベント */
      let rawTrackEvents = [];
      /** @type {array} 全イベント */

      let rawEvents = [];
      /** @type {array} */

      const events = this.tracks[i];

      for (let j = 0; j < events.length; j++) {
        /** @type {Event} イベント */
        const event = events[j];
        /** @var {Uint8Array} WebMidiLink信号 */

        let raw;

        if (event instanceof _midi_event__WEBPACK_IMPORTED_MODULE_2__["ChannelEvent"]) {
          switch (event.subtype) {
            case 'NoteOn':
              // console.log(event);
              if (event.parameter2 === 0) {
                raw = new Uint8Array([0x80 | event.channel, event.parameter1, event.parameter2]);
              } else {
                raw = new Uint8Array([0x90 | event.channel, event.parameter1, event.parameter2]);
              }

              break;

            case 'NoteOff':
              raw = new Uint8Array([0x80 | event.channel, event.parameter1, event.parameter2]);
              break;

            case 'ControlChange':
              raw = new Uint8Array([0xB0 | event.channel, event.parameter1, event.parameter2]);
              break;

            case 'ProgramChange':
              raw = new Uint8Array([0xC0 | event.channel, event.parameter1]);
              break;
          }
        } else if (event instanceof _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]) {
          // Metaイベントの内容は実際使われない。単なる配列の数合わせのためのプレースホルダ（音を鳴らすことには関係ない処理だから）

          /** @type {Uint8Array} */
          const data = this.encoder.encode(event.data);

          switch (event.subtype) {
            case 'TextEvent':
              raw = new Uint8Array([0xFF, 0x01].concat(data));
              break;

            case 'SequenceTrackName':
              raw = new Uint8Array([0xFF, 0x03].concat(data));
              break;

            case 'CopyrightNotice':
              raw = new Uint8Array([0xFF, 0x02].concat(data));
              break;

            case 'InsturumentName':
              raw = new Uint8Array([0xFF, 0x04].concat(data));
              break;

            case 'SetTempo':
              raw = new Uint8Array([0xFF, 0x51].concat(data));
              break;

            case 'TimeSignature':
              raw = new Uint8Array([0xFF, 0x58].concat(data));
              break;

            case 'EndOfTrack':
              raw = new Uint8Array([0xFF, 0x2F]);
              break;
          }
        } else if (event instanceof _midi_event__WEBPACK_IMPORTED_MODULE_2__["SystemExclusiveEvent"]) {
          raw = new Uint8Array([0xF0, 0x05].concat(event.data));
        }

        rawEvents = rawEvents.concat(raw);
      }

      rawTrackEvents = rawTrackEvents.concat(rawEvents);
      this.plainTracks[i] = rawTrackEvents;
    }
  }

}

/***/ }),

/***/ "./src/ms2mml.js":
/*!***********************!*\
  !*** ./src/ms2mml.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MapleStory2Mml; });
/* harmony import */ var _PSGConverter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PSGConverter */ "./src/PSGConverter.js");
/* harmony import */ var _mms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mms */ "./src/mms.js");
/* harmony import */ var _midi_event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./midi_event */ "./src/midi_event.js");



/**
 * @classdesc   MapleStory2 Mml Parser
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license     MIT
 */

class MapleStory2Mml extends _mms__WEBPACK_IMPORTED_MODULE_1__["default"] {
  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  constructor(input, optParams = {}) {
    super(input, optParams);
    /** @type {TextEncoder} */

    this.encoder = new TextEncoder('utf-8');
    /** @type {DOMParser} */

    const parser = new DOMParser();
    /** @type {Document} */

    const doc = parser.parseFromString(String.fromCharCode.apply('', new Uint16Array(input)), 'text/xml');
    /** @param {Element} */

    this.input = doc.querySelectorAll('ms2 > *');
    /** @type {Array.<Array.<Object>>} 全トラックの演奏情報 */

    this.tracks = [];
    /** @type {Array.<Array.<Uint8Array>>} WMLに送る生のMIDIイベント */

    this.plainTracks = [];
    /** @param {number} トラック数 */

    this.numberOfTracks = 1;
    /** @type {number} 解像度 */

    this.timeDivision = optParams.timeDivision || 96;
  }
  /**
   */


  parse() {
    // this.parseHeader();
    // this.parseDataInformation();
    this.parseTracks();
    this.toPlainTrack();
  }

  /**
   * MML parse
   */
  parseTracks() {
    /** @type {array} MIDIイベント */
    let track = [];
    /** @type {array} 終了時間比較用 */

    const endTimes = [];

    for (let i = 0; i < this.input.length; i++) {
      /** @param {PSGConverter} */
      const mml2Midi = new _PSGConverter__WEBPACK_IMPORTED_MODULE_0__["default"]({
        timeDivision: this.timeDivision,
        channel: 0,
        mml: this.input[i].textContent.trim(),
        ignoreTempo: false
      });
      track = track.concat(mml2Midi.events);
      endTimes.push(mml2Midi.endTime);
    } // トラック終了


    track.concat(new _midi_event__WEBPACK_IMPORTED_MODULE_2__["MetaEvent"]('EndOfTrack', 0, Math.max(endTimes)));
    this.tracks.push(track);
  }

}

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
/* harmony import */ var _mmi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mmi */ "./src/mmi.js");
/* harmony import */ var _mms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mms */ "./src/mms.js");
/* harmony import */ var _ms2mml__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ms2mml */ "./src/ms2mml.js");
/* harmony import */ var _meta__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./meta */ "./src/meta.js");
/* harmony import */ var _mld__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mld */ "./src/mld.js");
/* harmony import */ var _smf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./smf */ "./src/smf.js");
/* harmony import */ var _3mle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./3mle */ "./src/3mle.js");







/**
 * Midi Player Class
 */

class Player {
  /**
   * @param {string} target WML attach dom
   */
  constructor(target = '#wml') {
    /** @type {number} */
    this.tempo = 500000; // default

    /** @type {HTMLIFrameElement} */

    this.webMidiLink;
    /** @type {number} */

    this.resume;
    /** @type {boolean} */

    this.pause = true;
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

    this.textEvent = '';
    /** @type {?string} */

    this.sequenceName = '';
    /** @type {?string} */

    this.copyright = '';
    /** @type {?string} */

    this.lyrics = '';
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
    /** @type {number} */

    this.version = _meta__WEBPACK_IMPORTED_MODULE_3__["default"].version;
    /** @type {string} */

    this.build = _meta__WEBPACK_IMPORTED_MODULE_3__["default"].build;
  }
  /**
   * @param {boolean} enable
   */


  setCC111Loop(enable) {
    this.enableCC111Loop = enable;
  }
  /**
   * @param {boolean} enable
   */


  setFalcomLoop(enable) {
    this.enableFalcomLoop = enable;
  }
  /**
   * @param {boolean} enable
   */


  setMFiLoop(enable) {
    this.enableMFiLoop = enable;
  }
  /**
   * @param {boolean} enable
   */


  setLoop(enable) {
    this.enableLoop = enable;
  }
  /**
   */


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
  }
  /**
   * @return {HTMLIframeElement}
   */


  getWebMidiLink() {
    return this.webMidiLink;
  }
  /**
   */


  init() {
    this.stop();
    this.initSequence();
    this.pause = true;
    this.track = null;
    this.resume = -1;
    this.text = null;
    this.sequence = null;
    this.sequenceName = null;
    this.copyright = null;
    this.lyrics = null;
    this.textEvent = null;
    this.length = 0;
    this.position = 0;
    this.time = 0;
    this.timeTotal = 0;
    this.window.clearTimeout(this.timer);
    /** @type {Player} */

    const player = this;

    if (this.ready) {
      this.sendInitMessage();
    } else {
      this.window.addEventListener('message', ev => {
        if (ev.data === 'link,ready') {
          player.sendInitMessage();
        }
      }, false);
    }
  }

  /**
   */
  initSequence() {
    this.tempo = 500000;
    this.position = 0;
    this.sendInitMessage();
    this.pause = false;
  }
  /**
   */


  play() {
    /** @type {Player} */
    const player = this;

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
      this.window.addEventListener('message', ev => {
        if (ev.data === 'link,ready') {
          player.ready = true;
          player.webMidiLink.style.height = this.webMidiLink.contentWindow.document.body.scrollHeight + 'px';
          player.playSequence();
        }
      }, false);
    }
  }

  /**
   */
  ended() {
    player.window.postMessage('endoftrack', '*');
  }
  /**
   */


  sendInitMessage() {
    /** @type {Window} */
    const win = this.webMidiLink.contentWindow;
    /** @type {number} */

    let i;

    for (i = 0; i < 16; ++i) {
      // all sound off
      win.postMessage('midi,b' + i.toString(16) + ',128,0', '*'); // volume

      win.postMessage('midi,b' + i.toString(16) + ',07,64', '*'); // panpot

      win.postMessage('midi,b' + i.toString(16) + ',0a,40', '*'); // pitch bend

      win.postMessage('midi,e' + i.toString(16) + ',00,40', '*'); // pitch bend range

      win.postMessage('midi,b' + i.toString(16) + ',64,00', '*');
      win.postMessage('midi,b' + i.toString(16) + ',65,00', '*');
      win.postMessage('midi,b' + i.toString(16) + ',06,02', '*');
      win.postMessage('midi,b' + i.toString(16) + ',26,00', '*');
    }

    this.sendGmReset();
  }

  /**
   * @param {string|Worker} port WebMidiLink url.
   */
  setWebMidiLink(port = './wml.html') {
    /** @type {Player} */
    const player = this;

    const process = ev => {
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
            player.loaded = Math.round(msg[2] / msg[3] * 10000);
          }
        }
      }
    };

    if (typeof port === 'string') {
      // Clear self
      if (this.webMidiLink) {
        this.webMidiLink.parentNode.removeChild(this.webMidiLink);
      } // Clear parent DOM


      if (this.target.firstChild) {
        this.target.removeChild(this.target.firstChild);
      }
      /** @type {HTMLIFrameElement} */


      const iframe = this.webMidiLink =
      /** @type {HTMLIFrameElement} */
      this.window.document.createElement('iframe');
      iframe.src = port;
      iframe.className = 'wml';
      this.target.appendChild(iframe);
      this.window.addEventListener('message', process, false);

      const resizeHeight = () => {
        iframe.style.height = this.webMidiLink.contentWindow.document.body.scrollHeight + 'px';
      };

      this.window.addEventListener('load', resizeHeight, false);
      let timer = 0;
      this.window.addEventListener('resize', () => {
        if (timer > 0) {
          clearTimeout(timer);
        }

        timer = setTimeout(resizeHeight, 100);
      }, false);
    } else {
      // Worker Mode
      this.webMidiLink.addEventListener('message', process, false);
    }
  }

  /**
   * @param {number} volume
   */
  setMasterVolume(volume) {
    this.masterVolume = volume;

    if (this.webMidiLink) {
      this.webMidiLink.contentWindow.postMessage('midi,f0,7f,7f,04,01,' + [('0' + (volume & 0x7f).toString(16)).substr(-2), ('0' + (volume >> 7 & 0x7f).toString(16)).substr(-2), '7f'].join(','), '*');
    }
  }

  /**
   * @param {number} tempo
   */
  setTempoRate(tempo) {
    this.tempoRate = tempo;
  }

  /**
   */
  playSequence() {
    /** @type {Player} */
    const player = this;
    /** @type {number} */

    const timeDivision = this.sequence.timeDivision;
    /** @type {Array.<Object>} */

    const mergedTrack = this.track;
    /** @type {Window} */

    const webMidiLink = this.webMidiLink.contentWindow;
    /** @type {number} */

    let pos = this.position || 0;
    /** @type {Array.<?{pos: number}>} */

    const mark = [];

    const update = () => {
      /** @type {number} */
      const time = mergedTrack[pos].time || 0;
      /** @type {number} */

      const length = mergedTrack.length;
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
        event = mergedTrack[pos].event;

        switch (event.subtype) {
          case 'TextEvent':
            // 0x01
            // 主に歌詞などが入っている。MIDI作成者によってはデバッグ情報やお遊びも・・・。
            player.textEvent = event.data[0];
            break;

          case 'Lyrics':
            // 0x05
            // カラオケデーターが入っている。Textとの違いは、どの位置で表示するかやページ送りなどの制御コードが含まれている。
            // とはいっても、単なるテキストデータ。
            // KAR形式とYAMAHA独自のXF形式というカラオケ専用の書式がある。
            // カラオケのパーサーは本プログラムでは実装しない。
            // KAR形式：https://www.mixagesoftware.com/en/midikit/help/HTML/karaoke_formats.html
            // XF形式：https://jp.yamaha.com/files/download/other_assets/7/321757/xfspc.pdf
            player.lyrics = event.data[0];
            break;

          case 'Maker':
            // 0x06
            if (player.enableFalcomLoop) {
              // A-B Loop (Ys Eternal 2 Loop)
              switch (event.data[0]) {
                case 'A':
                  mark[0] = {
                    pos: pos
                  };
                  break;

                case 'B':
                  if (mark[0] && typeof mark[0].pos === 'number') {
                    pos = mark[0].pos;
                    player.timer = player.window.setTimeout(update, 0);
                    player.position = pos;
                    return;
                  }

                  break;
              }
            }

            if (player.enableMFiLoop) {
              // MFi Loop
              match = event.data[0].match(/^LOOP_(START|END)=ID:(\d+),COUNT:(-?\d+)$/);

              if (match) {
                if (match[1] === 'START') {
                  mark[match[2] | 0] = mark[match[2]] || {
                    pos: pos,
                    count: match[3] | 0
                  };
                } else if (match[1] === 'END' && player.enableMFiLoop) {
                  tmp = mark[match[2] | 0];

                  if (tmp.count !== 0) {
                    // loop jump
                    if (tmp.count > 0) {
                      tmp.count--;
                    }

                    pos = tmp.pos;
                    player.timer = player.window.setTimeout(update, 0);
                    player.position = pos;
                    return;
                  } else {
                    // loop end
                    mark[match[2] | 0] = null;
                  }
                }
              }
            }

            break;

          case 'SetTempo':
            // 0x51
            player.tempo = event.data[0];
            break;
        } // CC#111 Loop


        if (event.subtype === 'ControlChange' && event.parameter1 === 111) {
          mark[0] = {
            pos: pos
          };
        } // send message


        webMidiLink.postMessage(mergedTrack[pos++].webMidiLink, '*');
      } while (pos < length && mergedTrack[pos].time === time);

      if (pos < length) {
        procTime = Date.now() - procTime;
        player.timer = player.window.setTimeout(update, player.tempo / (1000 * timeDivision) * (mergedTrack[pos].time - time - procTime) * (1 / player.tempoRate));
      } else {
        // loop
        player.ended();
        player.pause = true;

        if (player.enableCC111Loop && mark[0] && typeof mark[0].pos === 'number') {
          pos = mark[0].pos;
        } else if (player.enableLoop) {
          player.initSequence();
          player.playSequence();
        }
      }

      player.position = pos;
      player.time = time;
    };

    if (!this.pause) {
      this.timer = player.window.setTimeout(update, this.tempo / 1000 * timeDivision * this.track[0].time || 0);
    } else {
      // resume
      this.timer = player.window.setTimeout(update, this.resume);
      this.pause = false;
      this.resume = -1;
    }
  }

  /**
   * @param {ArrayBuffer} buffer
   */
  loadMidiFile(buffer) {
    /** @type {SMF} */
    const parser = new _smf__WEBPACK_IMPORTED_MODULE_5__["default"](buffer);
    this.init();
    parser.parse();
    this.mergeMidiTracks(parser);
  }

  /**
   * @param {ArrayBuffer} buffer
   */
  loadMldFile(buffer) {
    /** @type {Mld} */
    const parser = new _mld__WEBPACK_IMPORTED_MODULE_4__["default"](buffer);
    this.init();
    parser.parse();
    this.mergeMidiTracks(parser.convertToMidiTracks());
  }
  /**
   * @param {ArrayBuffer} buffer
   */


  loadMs2MmlFile(buffer) {
    /** @type {MapleStory2Mml} */
    const parser = new _ms2mml__WEBPACK_IMPORTED_MODULE_2__["default"](buffer);
    this.init();
    parser.parse();
    this.mergeMidiTracks(parser);
  }
  /**
   * @param {ArrayBuffer} buffer
   */


  loadMakiMabiSequenceFile(buffer) {
    /** @type {MakiMabiSequence} */
    const parser = new _mms__WEBPACK_IMPORTED_MODULE_1__["default"](buffer);
    this.init();
    parser.parse();
    this.mergeMidiTracks(parser);
  }
  /**
   * @param {ArrayBuffer} buffer
   */


  load3MleFile(buffer) {
    /** @type {ThreeMacroLanguageEditor} */
    const parser = new _3mle__WEBPACK_IMPORTED_MODULE_6__["default"](buffer);
    this.init();
    parser.parse();
    this.mergeMidiTracks(parser);
  }
  /**
   * @param {ArrayBuffer} buffer
   */


  loadMabiIccoFile(buffer) {
    /** @type {MabiIcco} */
    const parser = new _mmi__WEBPACK_IMPORTED_MODULE_0__["default"](buffer);
    this.init();
    parser.parse();
    this.mergeMidiTracks(parser);
  }
  /**
   * @param {Object} midi
   */


  mergeMidiTracks(midi) {
    /** @type {Array.<Object>} */
    const mergedTrack = this.track = [];
    /** @type {Array.<Array.<Object>>} */

    const tracks = midi.tracks;
    /** @type {Array.<number>} */

    const trackPosition = new Array(tracks.length);
    /** @type {Array.<Array.<Array.<number>>>} */

    const plainTracks = midi.plainTracks;
    /** @type {Array.<Object>} */

    let track;
    /** @type {number} */

    let i;
    /** @type {number} */

    let il;
    /** @type {number} */

    let j;
    /** @type {number} */

    let jl; // initialize

    for (i = 0, il = tracks.length; i < il; ++i) {
      trackPosition[i] = 0;
    } // merge


    for (i = 0, il = tracks.length; i < il; ++i) {
      track = tracks[i];

      for (j = 0, jl = track.length; j < jl; ++j) {
        if (midi.formatType === 0 || i === 0) {
          // 著作権情報と曲名を取得
          // SMF1のときは先頭のトラックから情報を取得する。
          if (track[j].subtype === 'SequenceTrackName') {
            this.sequenceName = track[j].data[0];
          } else if (track[j].subtype === 'CopyrightNotice') {
            this.copyright = track[j].data[0];
          }
        }

        mergedTrack.push({
          track: i,
          eventId: j,
          time: track[j].time,
          event: track[j],
          webMidiLink: 'midi,' + Array.prototype.map.call(plainTracks[i][j], a => {
            return a.toString(16);
          }).join(',')
        });
      }
    } // sort


    mergedTrack.sort((a, b) => {
      return a.time > b.time ? 1 : a.time < b.time ? -1 : a.track > b.track ? 1 : a.track < b.track ? -1 : a.eventId > b.eventId ? 1 : a.eventId < b.eventId ? -1 : 0;
    }); // トータルの演奏時間

    this.timeTotal = mergedTrack.slice(-1)[0].time;
    this.sequence = midi;
  }

  /**
   * @return {?string}
   */
  getSequenceName() {
    return this.sequenceName;
  }

  /**
   * @return {?string}
   */
  getCopyright() {
    return this.copyright;
  }

  /**
   * @return {?string}
   */
  getLyrics() {
    return this.lyrics;
  }
  /**
   * @return {?string}
  */


  getTextEvent() {
    return this.textEvent;
  }
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
  /**
   */


  sendGmReset() {
    if (this.webMidiLink) {
      // F0 7E 7F 09 01 F7
      this.webMidiLink.contentWindow.postMessage('midi,F0,7E,7F,09,01,F7', '*');
    }
  }
  /**
   */


  sendAllSoundOff() {
    if (this.webMidiLink) {
      this.webMidiLink.contentWindow.postMessage('midi,b0,78,0', '*');
    }
  }
  /**
   * TODO: ちゃんと動いていない
   * @param {number} time
   * @return {string}
   */


  getTime(time) {
    const secs = this.tempo / 6000000 * time;
    const hours = Math.floor(secs / (60 * 60));
    const divisorForMinutes = secs % (60 * 60);
    const minutes = Math.floor(divisorForMinutes / 60);
    const divisorForSeconds = divisorForMinutes % 60;
    const seconds = Math.ceil(divisorForSeconds);
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
/**
 * Riff Parser class
 */
class Riff {
  /**
   * @param {ByteArray} input input buffer.
   * @param {Object=} optParams option parameters.
   */
  constructor(input, optParams = {}) {
    /** @type {ByteArray} */
    this.input = input;
    /** @type {number} */

    this.ip = optParams.index || 0;
    /** @type {number} */

    this.length = optParams.length || input.length - this.ip;
    /** @type {Array.<RiffChunk>} */

    this.chunkList;
    /** @type {number} */

    this.offset = this.ip;
    /** @type {boolean} */

    this.padding = optParams.padding !== void 0 ? optParams.padding : true;
    /** @type {boolean} */

    this.bigEndian = optParams.bigEndian !== void 0 ? optParams.bigEndian : false;
  }
  /**
   */


  parse() {
    /** @type {number} */
    const length = this.length + this.offset;
    this.chunkList = [];

    while (this.ip < length) {
      this.parseChunk();
    }
  }
  /**
   */


  parseChunk() {
    /** @type {ByteArray} */
    const input = this.input;
    /** @type {number} */

    let ip = this.ip;
    /** @type {number} */

    let size;
    this.chunkList.push(new RiffChunk(String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]), size = this.bigEndian ? (input[ip++] << 24 | input[ip++] << 16 | input[ip++] << 8 | input[ip++]) >>> 0 : (input[ip++] | input[ip++] << 8 | input[ip++] << 16 | input[ip++] << 24) >>> 0, ip));
    ip += size; // padding

    if (this.padding && (ip - this.offset & 1) === 1) {
      ip++;
    }

    this.ip = ip;
  }
  /**
   * @param {number} index chunk index.
   * @return {?RiffChunk}
   */


  getChunk(index) {
    /** @type {RiffChunk} */
    const chunk = this.chunkList[index];

    if (chunk === void 0) {
      return null;
    }

    return chunk;
  }
  /**
   * @return {number}
   */


  getNumberOfChunks() {
    return this.chunkList.length;
  }

}
/**
 * Riff Chunk Structure
 * @interface
 */

class RiffChunk {
  /**
   * @param {string} type
   * @param {number} size
   * @param {number} offset
   */
  constructor(type, size, offset) {
    /** @type {string} */
    this.type = type;
    /** @type {number} */

    this.size = size;
    /** @type {number} */

    this.offset = offset;
  }

}

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
/* harmony import */ var _midi_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./midi_event */ "./src/midi_event.js");
/* harmony import */ var _meta__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./meta */ "./src/meta.js");
/* harmony import */ var _riff__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./riff */ "./src/riff.js");



/**
 * Standard Midi File Parser class
 */

class SMF {
  /**
   * @param {ByteArray} input input buffer.
   * @param {Object=} optParams option parameters.
   */
  constructor(input, optParams = {}) {
    optParams.padding = false;
    optParams.bigEndian = true;
    /** @type {ByteArray} */

    this.input = input;
    /** @type {number} */

    this.ip = optParams.index || 0;
    /** @type {number} */

    this.chunkIndex = 0;
    /**
     * @type {Riff}
     * @private
     */

    this.riffParser_ = new _riff__WEBPACK_IMPORTED_MODULE_2__["default"](input, optParams); // MIDI File Information

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
    /** @type {number} */

    this.version = _meta__WEBPACK_IMPORTED_MODULE_1__["default"].version;
    /** @type {string} */

    this.build = _meta__WEBPACK_IMPORTED_MODULE_1__["default"].build;
  }

  /**
   */
  parse() {
    /** @type {number} */
    let i = 0;
    /** @type {number} */

    let il = 0; // parse riff chunks

    this.riffParser_.parse(); // parse header chunk

    this.parseHeaderChunk(); // parse track chunks

    for (i = 0, il = this.numberOfTracks; i < il; ++i) {
      this.parseTrackChunk();
    }
  }

  /**
   */
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

    this.formatType = data[ip++] << 8 | data[ip++];
    this.numberOfTracks = data[ip++] << 8 | data[ip++];
    this.timeDivision = data[ip++] << 8 | data[ip++];
  }

  /**
   */
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
        result = result << 7 | tmp & 0x7f;
      } while ((tmp & 0x80) !== 0);

      return result;
    };

    if (!chunk || chunk.type !== 'MTrk') {
      throw new Error('invalid header signature');
    }

    size = chunk.offset + chunk.size;
    const eventQueue = [];
    const plainQueue = [];

    while (ip < size) {
      // delta time
      deltaTime = readNumber();
      totalTime += deltaTime; // offset

      offset = ip; // event type value, midi channel

      status = data[ip++];
      eventType = status >> 4 & 0xf;
      channel = status & 0xf; // run status rule

      if (eventType < 8) {
        eventType = prevEventType;
        channel = prevChannel;
        status = prevEventType << 4 | prevChannel;
        ip--;
        offset--;
      } else {
        prevEventType = eventType;
        prevChannel = channel;
      } // TODO


      const table = [,,,,,,,, 'NoteOff', // 0x8
      'NoteOn', 'NoteAftertouch', 'ControlChange', 'ProgramChange', 'ChannelAftertouch', 'PitchBend'];

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
          event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["ChannelEvent"](table[eventType], deltaTime, totalTime, channel, data[ip++], data[ip++]);
          break;

        case 0xC:
          event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["ChannelEvent"](table[eventType], deltaTime, totalTime, channel, data[ip++]);
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

              event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["SystemExclusiveEvent"]('SystemExclusive', deltaTime, totalTime, data.subarray(ip, (ip += tmp) - 1));
              break;

            case 0x7:
              tmp = readNumber();
              event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["SystemExclusiveEvent"]('SystemExclusive(F7)', deltaTime, totalTime, data.subarray(ip, ip += tmp));
              break;
            // meta event

            case 0xF:
              eventType = data[ip++];
              tmp = readNumber();

              switch (eventType) {
                case 0x00:
                  // sequence number
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('SequenceNumber', deltaTime, totalTime, [data[ip++], data[ip++]]);
                  break;

                case 0x01:
                  // text event
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('TextEvent', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]);
                  break;

                case 0x02:
                  // copyright notice
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('CopyrightNotice', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]);
                  break;

                case 0x03:
                  // sequence/track name
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('SequenceTrackName', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]);
                  break;

                case 0x04:
                  // instrument name
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('InstrumentName', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]);
                  break;

                case 0x05:
                  // lyrics
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('Lyrics', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]);
                  break;

                case 0x06:
                  // marker
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('Marker', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]);
                  break;

                case 0x07:
                  // cue point
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('CuePoint', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]);
                  break;

                case 0x20:
                  // midi channel prefix
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('MidiChannelPrefix', deltaTime, totalTime, [data[ip++]]);
                  break;

                case 0x2f:
                  // end of track
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('EndOfTrack', deltaTime, totalTime, []);
                  break;

                case 0x51:
                  // set tempo
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('SetTempo', deltaTime, totalTime, [data[ip++] << 16 | data[ip++] << 8 | data[ip++]]);
                  break;

                case 0x54:
                  // smpte offset
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('SmpteOffset', deltaTime, totalTime, [data[ip++], data[ip++], data[ip++], data[ip++], data[ip++]]);
                  break;

                case 0x58:
                  // time signature
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('TimeSignature', deltaTime, totalTime, [data[ip++], data[ip++], data[ip++], data[ip++]]);
                  break;

                case 0x59:
                  // key signature
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('KeySignature', deltaTime, totalTime, [data[ip++], data[ip++]]);
                  break;

                case 0x7f:
                  // sequencer specific
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('SequencerSpecific', deltaTime, totalTime, [data.subarray(ip, ip += tmp)]);
                  break;

                default:
                  // unknown
                  event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__["MetaEvent"]('Unknown', deltaTime, totalTime, [eventType, data.subarray(ip, ip += tmp)]);
              }

              break;

            default:
              console.warn('unknown message:', status.toString(16));
          }

          break;
        // error

        default:
          throw new Error('invalid status');
      } // plain queue


      length = ip - offset;
      plainBytes = data.subarray(offset, offset + length);
      plainBytes[0] = status;

      if (event instanceof _midi_event__WEBPACK_IMPORTED_MODULE_0__["ChannelEvent"] && event.subtype === 'NoteOn' &&
      /** @type {ChannelEvent} */
      event.parameter2 === 0) {
        event.subtype = table[8];
        plainBytes = new Uint8Array([0x80 | event.channel, event.parameter1, event.parameter2]);
      }

      plainQueue.push(plainBytes); // event queue

      eventQueue.push(event);
    }

    this.tracks.push(eventQueue);
    this.plainTracks.push(plainQueue);
  }

}
;

/***/ })

/******/ });
});
//# sourceMappingURL=smf.player.js.map