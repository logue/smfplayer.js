/*! @logue/smfplayer v0.3.5 | imaya / GREE Inc. / Logue | license: MIT | build: 2021-09-19T04:13:29.856Z */
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
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/3mle.js":
/*!*********************!*\
  !*** ./src/3mle.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ThreeMacroLanguageEditor)
/* harmony export */ });
/* harmony import */ var _PSGConverter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PSGConverter */ "./src/PSGConverter.js");
/* harmony import */ var _midi_event__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./midi_event */ "./src/midi_event.js");
/* harmony import */ var _mms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mms */ "./src/mms.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




/**
 * @classdesc   Three Macro Language Editor (3MLE) mml file Parser
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license     MIT
 */

var ThreeMacroLanguageEditor = /*#__PURE__*/function (_MakiMabiSequence) {
  _inherits(ThreeMacroLanguageEditor, _MakiMabiSequence);

  var _super = _createSuper(ThreeMacroLanguageEditor);

  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  function ThreeMacroLanguageEditor(input) {
    var optParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, ThreeMacroLanguageEditor);

    return _super.call(this, input, optParams);
  }
  /**
   */


  _createClass(ThreeMacroLanguageEditor, [{
    key: "parse",
    value: function parse() {
      this.parseHeader();
      this.parseTracks();
      this.toPlainTrack();
    }
    /**
     */

  }, {
    key: "parseHeader",
    value: function parseHeader() {
      var header = this.input.Settings;
      /** @type {TextEncoder} */

      this.encoder = new TextEncoder(header.Encoding || 'shift_jis');
      /** @param {string} */

      this.title = header.Title;
      /** @param {string} */

      this.author = header.Source;
      /** @param {number} */

      this.timeDivision = header.TimeBase | 0 || 32; // 曲名と著者情報を付加

      /** @type {array}  */

      var headerTrack = []; // GM Reset

      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__.SystemExclusiveEvent('SystemExclusive', 0, 0, [0x7e, 0x7f, 0x09, 0x01]));
      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__.MetaEvent('SequenceTrackName', 0, 0, [this.title]));
      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__.MetaEvent('CopyrightNotice', 0, 0, [this.author]));
      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__.MetaEvent('TextEvent', 0, 0, [header.Memo]));
      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__.MetaEvent('TimeSignature', 0, 0, [header.TimeSignatureNN | 0 || 4, header.TimeSignatureDD | 0 || 4, 0, 0]));
      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__.MetaEvent('EndOfTrack', 0, 0));
      this.tracks.push(headerTrack); // 3MLE EXTENSION、Settingsを取り除く

      delete this.input['3MLE EXTENSION'];
      delete this.input.Settings;
    }
    /**
     * MML parse
     */

  }, {
    key: "parseTracks",
    value: function parseTracks() {
      var input = this.input;
      /** @type {array} 終了時間比較用 */

      var endTimes = [];
      /** @type {array} 各ブロックのMML */

      var mmls = [];
      /** @type {array} 各ブロックの演奏情報 */

      var settings = [];

      for (var block in this.input) {
        if (!Object.prototype.hasOwnProperty.call(this.input, block)) {
          continue;
        }

        if (block.match(/^Channel(\d+)$/i)) {
          // MMLは[Channel[n]]ブロックのキー
          // ひどいファイル形式だ・・・。
          mmls[(RegExp.$1 | 0) - 1] = Object.keys(input[block]).join('').replace(/\/\*([^*]|\*[^/])*\*\//g, '');
        }

        if (block.match(/^ChannelProperty(\d+)$/i)) {
          // 各パートの楽器情報などは[ChannelProperty[n]]に格納されている
          settings[(RegExp.$1 | 0) - 1] = {
            name: input[block].Name,
            instrument: input[block].Patch | 0,
            panpot: input[block].Pan | 0
          };
        }
      }
      /** @type {array} 整形済みデータ */


      var data = []; // データを整形

      for (var no in mmls) {
        if (!Object.prototype.hasOwnProperty.call(mmls, no)) {
          continue;
        }

        if (settings[no] !== void 0) {
          data[no] = {
            mml: mmls[no],
            name: settings[no].name || '',
            instrument: settings[no].instrument || 0,
            panpot: settings[no].panpot || 64
          };
        } else {
          data[no] = {
            mml: mmls[no],
            name: '',
            instrument: 0,
            panpot: 64
          };
        }
      } // console.log(data);


      for (var part in data) {
        if (!Object.prototype.hasOwnProperty.call(data, part)) {
          continue;
        }
        /** @type {number} */


        var ch = part | 0;
        /** @type {array} MIDIイベント */

        var track = [];

        if (data[part].mml === '') {
          // 空っぽのMMLトラックの場合処理しない
          return;
        } // 楽器名


        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__.MetaEvent('InsturumentName', 0, 48, [data[part].name])); // プログラムチェンジ

        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__.ChannelEvent('ProgramChange', 0, 96, ch, data[part].instrument)); // パン

        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_1__.ChannelEvent('ControlChange', 0, 154, ch, 10, data[part].panpot));
        /** @param {PSGConverter} */

        var mml2Midi = new _PSGConverter__WEBPACK_IMPORTED_MODULE_0__["default"]({
          timeDivision: this.timeDivision,
          channel: ch,
          timeOffset: 386,
          mml: data[part].mml
        }); // トラックにマージ

        track = track.concat(mml2Midi.events); // 演奏時間を更新

        endTimes.push(mml2Midi.endTime); // トラック終了

        track.concat(new _midi_event__WEBPACK_IMPORTED_MODULE_1__.MetaEvent('EndOfTrack', 0, Math.max(endTimes)));
        this.tracks.push(track);
      }

      this.numberOfTracks = this.tracks.length;
    }
  }]);

  return ThreeMacroLanguageEditor;
}(_mms__WEBPACK_IMPORTED_MODULE_2__["default"]);



/***/ }),

/***/ "./src/PSGConverter.js":
/*!*****************************!*\
  !*** ./src/PSGConverter.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PSGConverter)
/* harmony export */ });
/* harmony import */ var _midi_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./midi_event */ "./src/midi_event.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }


/**
 * @class       PSGConverter
 * @classdesc   Mabinogi MML and Maple Story 2 MML to MIDI Converter.
 * @version     3.0.2
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license     MIT
 */

var PSGConverter = /*#__PURE__*/function () {
  /**
   * Constructor
   * @param {array} optParams
   */
  function PSGConverter() {
    var optParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, PSGConverter);

    /** @type {number} 分解能 */
    this.timeDivision = optParams.timeDivision | 0 || 96;
    /** @type {number} チャンネル（0～15） */

    this.channel = optParams.channel | 0;
    /** @type {number} 演奏開始までのオフセット時間 */

    this.timeOffset = optParams.timeOffset | 0;
    /** @type {string} MMLのチャンネルごとのマッチパターン */

    this.PATTERN = /[a-glnortv<>][+#-]?[0-9]*\.?&?/g;
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

    this.noteOffNegativeOffset = 2;
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


  _createClass(PSGConverter, [{
    key: "parse",
    value: function parse() {
      /** @type {Array} MMLストリーム */
      var mmls = [];

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


      var time = this.timeOffset;
      /** @type {number} 現在の音の長さ */

      var currentSoundLength = this.timeDivision;
      /** @type {number} 現在の音階 */

      var currentNote = 0;
      /** @type {number} ベロシティ(0～15) */

      var currentVelocity = 8;
      /** @type {number} オクターブ(0~8) */

      var currentOctave = 4;
      /** @type {bool} タイ記号 */

      var tieEnabled = false;
      /** @type {array} MIDIイベント */

      var events = []; // MMLを命令単位でパース

      var _iterator = _createForOfIteratorHelper(mmls),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var message = _step.value;

          /** @type {number} すすめるtick数 */
          var tick = currentSoundLength | 0;
          /** @type {string} コマンド */

          var command = '';
          /** @type {number} 値 */

          var value = 0; // 音長(L)、オクターブ(O<>)、テンポ（T）、ベロシティ（V）をパース

          if (message.match(/([lotv<>])([1-9][0-9]*|0?)(\.?)(&?)/)) {
            command = RegExp.$1.toLowerCase();
            value = RegExp.$2 | 0;

            if (tieEnabled && RegExp.$4 !== '&') {
              // タイ記号
              tieEnabled = false;
              events.push(new _midi_event__WEBPACK_IMPORTED_MODULE_0__.ChannelEvent('NoteOff', 0, time - this.noteOffNegativeOffset, this.channel, currentNote));
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
                events.push(new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('SetTempo', 0, time, [Math.floor(60000000 / value)]));
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
            var note = 0;
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
                while (note < this.minNote) {
                  note = note + 12;
                }

                while (note > this.maxNote) {
                  note = note - 12;
                }

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
              events.push(new _midi_event__WEBPACK_IMPORTED_MODULE_0__.ChannelEvent('NoteOn', 0, time, this.channel, note, currentVelocity * this.VELOCITY_MAGNIFICATION));
            } else if (note !== currentNote) {
              // c&dなど無効なタイの処理
              events.push(new _midi_event__WEBPACK_IMPORTED_MODULE_0__.ChannelEvent('NoteOff', 0, time - this.noteOffNegativeOffset, this.channel, currentNote));
              tieEnabled = false;
            } // タイムカウンタを音符の長さだけ進める


            time += tick; // ノートオフ命令の追加

            if (RegExp.$5 === '&') {
              // タイ記号の処理
              tieEnabled = true;
              currentNote = note; // 直前の音階を保存
            } else {
              tieEnabled = false; // 発音と消音が同じ時間の場合、そこのノートが再生されないため、消音時にtimeを-1する。

              events.push(new _midi_event__WEBPACK_IMPORTED_MODULE_0__.ChannelEvent('NoteOff', 0, time - this.noteOffNegativeOffset, this.channel, note));
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

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.events = events; // 演奏完了時間を代入

      this.endTime = time;
    }
  }]);

  return PSGConverter;
}();



/***/ }),

/***/ "./src/meta.js":
/*!*********************!*\
  !*** ./src/meta.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// This file is auto-generated by the build system.
var Meta = {
  version: '0.3.5',
  date: '2021-09-19T04:13:21.442Z'
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Meta);

/***/ }),

/***/ "./src/midi_event.js":
/*!***************************!*\
  !*** ./src/midi_event.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ChannelEvent": () => (/* binding */ ChannelEvent),
/* harmony export */   "SystemExclusiveEvent": () => (/* binding */ SystemExclusiveEvent),
/* harmony export */   "MetaEvent": () => (/* binding */ MetaEvent)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Midi Event abstract Structure
 */
var Event =
/**
 * @param {string} subtype event subtype name.
 * @param {number} deltaTime delta time.
 * @param {number} time time.
 */
function Event(subtype, deltaTime, time) {
  _classCallCheck(this, Event);

  /** @type {string} */
  this.subtype = subtype;
  /** @type {number} */

  this.deltaTime = deltaTime;
  /** @type {number} */

  this.time = time;
};
/**
 * Midi Channel Event Structure
 * @extends {Event}
 */


var ChannelEvent = /*#__PURE__*/function (_Event) {
  _inherits(ChannelEvent, _Event);

  var _super = _createSuper(ChannelEvent);

  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {number} channel
   * @param {number=} optParameter1
   * @param {number=} optParameter2
   */
  function ChannelEvent(subtype, deltaTime, time, channel, optParameter1, optParameter2) {
    var _this;

    _classCallCheck(this, ChannelEvent);

    _this = _super.call(this, subtype, deltaTime, time);
    /** @type {number} */

    _this.channel = channel;
    /** @type {(number|undefined)} */

    _this.parameter1 = optParameter1;
    /** @type {(number|undefined)} */

    _this.parameter2 = optParameter2;
    return _this;
  }

  return ChannelEvent;
}(Event);
/**
 * System Exclusive Event Structure
 * @extends {Event}
 */


var SystemExclusiveEvent = /*#__PURE__*/function (_Event2) {
  _inherits(SystemExclusiveEvent, _Event2);

  var _super2 = _createSuper(SystemExclusiveEvent);

  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {ByteArray} data
   */
  function SystemExclusiveEvent(subtype, deltaTime, time, data) {
    var _this2;

    _classCallCheck(this, SystemExclusiveEvent);

    _this2 = _super2.call(this, subtype, deltaTime, time);
    /** @type {ByteArray} */

    _this2.data = data;
    return _this2;
  }

  return SystemExclusiveEvent;
}(Event);
/**
 * Midi Meta Event Structure
 * @extends {Event}
 */


var MetaEvent = /*#__PURE__*/function (_Event3) {
  _inherits(MetaEvent, _Event3);

  var _super3 = _createSuper(MetaEvent);

  /**
   * @param {string} subtype
   * @param {number} deltaTime delta time.
   * @param {number} time time.
   * @param {Array.<*>} data meta data.
   */
  function MetaEvent(subtype, deltaTime, time, data) {
    var _this3;

    _classCallCheck(this, MetaEvent);

    _this3 = _super3.call(this, subtype, deltaTime, time);
    /** @type {Array.<*>} */

    _this3.data = data;
    return _this3;
  }

  return MetaEvent;
}(Event);



/***/ }),

/***/ "./src/mld.js":
/*!********************!*\
  !*** ./src/mld.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Mld)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Mld Parser Class
 */
var Mld = /*#__PURE__*/function () {
  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  function Mld(input) {
    var optParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Mld);

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


  _createClass(Mld, [{
    key: "parse",
    value: function parse() {
      this.parseHeader();
      this.parseDataInformation();
      this.parseTracks();
    }
    /**
     */

  }, {
    key: "parseHeader",
    value: function parseHeader() {
      /** @type {ByteArray} */
      var input = this.input;
      /** @type {number} */

      var ip = this.ip;
      /** @type {Object} */

      var header = this.header = {};
      /** @type {string} */

      var signature = String.fromCharCode(input[ip++], input[ip++], input[ip++], input[ip++]);

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

  }, {
    key: "parseDataInformation",
    value: function parseDataInformation() {
      /** @type {ByteArray} */
      var input = this.input;
      /** @type {number} */

      var ip = this.ip;
      /** @type {Object} */

      var dataInformation = this.dataInformation = {
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

      var type;
      /** @type {number} */

      var size;

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

  }, {
    key: "parseTracks",
    value: function parseTracks() {
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

      var status;
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
      /**
       * @return {Array.<Object>}
       */

      var parseEditInstrument = function parseEditInstrument() {
        /** @type {number} */
        var length = input[ip++] << 8 | input[ip++];
        /** @type {number} */

        var limit = ip + length;
        /** @type {Array.<Object>} */

        var result = [];
        /** @type {Object} */

        var info; // const

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


      var parseVibrato = function parseVibrato() {
        // const
        if (input[ip++] !== 1) {
          throw new Error('invalid Vibrato const value:' + input[ip - 1]);
        }

        return {
          part: input[ip++] >> 5 & 0x3,
          "switch": input[ip++] >> 6
        };
      };
      /**
       * @return {{data: ByteArray}}
       */


      var parseDeviceSpecific = function parseDeviceSpecific() {
        /** @type {number} */
        var length = input[ip++] << 8 | input[ip++];
        /** @type {number} */

        var limit = ip + length; // const

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

          message.deltaTime = input[ip++]; // status

          status = input[ip++];

          if (status !== 0xff) {
            message.type = 'note';
            message.subType = 'Note';
            message.voice = status >> 6;
            message.key = status & 0x3f; // note length
            // noteLength = message.length = input[ip++];
            // extend status

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

                  /*
                  case 0x8:
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

                  case 0xa:
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

  }, {
    key: "convertToMidiTracks",
    value: function convertToMidiTracks() {
      /** @type {Object} */
      var result = {
        timeDivision: this.timeDivision,
        trac: [],
        tracks: [],
        plainTracks: []
      };
      /** @type {Array.<Array.<Object>>} */

      var tracks = result.tracks;
      /** @type {Array.<Array.<Array.<number>>>} */

      var plainTracks = result.plainTracks;
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

        tmpTrack.sort(function (a, b) {
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
              plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xc0 | channel, mfiEvent.instrument));
              break;

            case 'SetTempo':
              // SetTempo: FF 51 03 tt tt tt
              tmp = 2880000000 / (mfiEvent.value.tempo * mfiEvent.value.timeBase);
              channel = 0; // SetTempo は必ず先頭のトラックに配置する

              plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xff, 0x51, 0x03, tmp >> 16 & 0xff, tmp >> 8 & 0xff, tmp & 0xff));
              break;

            case 'Loop':
              // Marker: FF 06 ll ss ss ss ...
              tmp = mfiEvent.value.count;
              str = 'LOOP_' + (mfiEvent.value.point === 0 ? 'START' : 'END') + '=ID:' + mfiEvent.value.id + ',COUNT:' + (tmp === 0 ? -1 : tmp);
              channel = 0;
              plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat([0xff, 0x06, str.length], str.split('').map(function (a) {
                return a.charCodeAt(0);
              })));
              break;

            case 'MasterVolume':
              // Master Volume: F0 7F ee 04 01 dl dm F7
              tmp = mfiEvent.value;
              channel = 0;
              plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xf0, 0x07, // length
              0x7f, 0x7f, 0x04, 0x01, tmp, tmp, 0xf7));
              break;

            case 'Modulation':
              // CC#1 Modulation: Bn 01 dd
              channel = i * 4 + mfiEvent.value.part;
              plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xb0 | channel, 0x01, mfiEvent.value.depth * 2));
              break;

            case 'Volume':
              // CC#7 Volume: Bn 07 dd
              channel = i * 4 + mfiEvent.value.part;
              plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xb0 | channel, 0x07, mfiEvent.value.volume * 2));
              break;

            case 'Valance':
              // CC#10 Panpot: Bn 0A dd
              channel = i * 4 + mfiEvent.value.part;
              plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xb0 | channel, 0x0a, (mfiEvent.value.valance - 32) * 2 + 64));
              break;

            case 'PitchBend':
              // Pitch Bend: En dl dm
              // TODO: LSB = MSB で良いか不明
              channel = i * 4 + mfiEvent.value.part;
              plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xe0 | channel, mfiEvent.value.value * 2, mfiEvent.value.value * 2));
              break;

            case 'PitchBendRange':
              // Pitch Bend: CC#100=0 CC#101=0 CC#6
              // Bn 64 00 Bn 65 00 Bn 06 vv
              channel = i * 4 + mfiEvent.value.part;
              plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xb0 | channel, 0x64, 0x00), [0x00, 0xb0 | channel, 0x65, 0x00], [0x00, 0xb0 | channel, 0x06, mfiEvent.value.value * 2]);
              break;

            case 'MasterCoarseTuning':
              // MasterCoarseTuning: CC#100=0 CC#101=2 CC#6
              // Bn 64 01 Bn 65 02 Bn 06 vv
              channel = i * 4 + mfiEvent.value.part;
              plainTracks[channel].push(this.deltaTimeToByteArray(time - channelTime[channel]).concat(0xb0 | channel, 0x64, 0x00), [0x00, 0xb0 | channel, 0x65, 0x02], [0x00, 0xb0 | channel, 0x06, mfiEvent.value.value * 2]);
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

  }, {
    key: "applyOctaveShift",
    value: function applyOctaveShift(key, octaveShift) {
      /** @type {Array.<number>} */
      var table = [0, 12, -24, -12];

      if (table[octaveShift] !== void 0) {
        return key + table[octaveShift];
      }

      throw new Error('invalid OctaveShift value:' + octaveShift);
    }
    /**
     * @param {Array.<Array.<ByteArray>>} plainTracks
     * @return {ByteArray}
     */

  }, {
    key: "toSMF",
    value: function toSMF(plainTracks) {
      /** @type {number} @const */
      var TimeDivision = 48;
      /** @type {Array.<number>} */

      var trackHeader;
      /** @type {Array.<number>} */

      var trackData;
      /** @type {ByteArray} */

      var result = [0x4d, 0x54, 0x68, 0x64, // "MThd"
      0x00, 0x00, 0x00, 0x06, // Size
      0x00, 0x01, // Format
      0x00, 0x10, // number of track
      TimeDivision >> 8 & 0xff, TimeDivision & 0xff // Data
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
       * @return {Array.<number>}
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

      if (this.dataInformation.copy !== void 0) {
        /** @type {Array.<number>} */
        var copy = stringToArray(this.dataInformation.copy);
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
        var track = plainTracks[i];
        trackData = [];

        for (j = 0, jl = track.length; j < jl; ++j) {
          Array.prototype.push.apply(trackData, track[j]);
        }

        jl = trackData.length;
        trackHeader = [0x4d, 0x54, 0x72, 0x6b, // "MTrk"
        jl >> 24 & 0xff, jl >> 16 & 0xff, jl >> 8 & 0xff, jl & 0xff];
        result = result.concat(trackHeader, trackData);
      }

      return new Uint8Array(result);
    }
    /**
     * @param {number} deltaTime
     * @return {Array.<number>}
     */

  }, {
    key: "deltaTimeToByteArray",
    value: function deltaTimeToByteArray(deltaTime) {
      /** @type {Array.<number>} */
      var array = [];

      while (deltaTime >= 0x80) {
        array.unshift(deltaTime & 0x7f | (array.length === 0 ? 0 : 0x80));
        deltaTime >>>= 7;
      }

      array.unshift(deltaTime | (array.length === 0 ? 0 : 0x80));
      return array;
    }
  }]);

  return Mld;
}();



/***/ }),

/***/ "./src/mmi.js":
/*!********************!*\
  !*** ./src/mmi.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MabiIcco)
/* harmony export */ });
/* harmony import */ var _PSGConverter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PSGConverter */ "./src/PSGConverter.js");
/* harmony import */ var _mms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mms */ "./src/mms.js");
/* harmony import */ var _midi_event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./midi_event */ "./src/midi_event.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




/**
 * @classdesc   MabiIcco MML File Parser
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license     MIT
 */

var MabiIcco = /*#__PURE__*/function (_MakiMabiSequence) {
  _inherits(MabiIcco, _MakiMabiSequence);

  var _super = _createSuper(MabiIcco);

  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  function MabiIcco(input) {
    var _this;

    var optParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MabiIcco);

    _this = _super.call(this, input, optParams);
    /** @type {array} 入力データ。行ごとに配列化 */

    _this.input = String.fromCharCode.apply('', new Uint16Array(input)).split(/\r\n|\r|\n/) || [];
    /** @type {Array.<Array.<Object>>} 全トラックの演奏情報 */

    _this.tracks = [];
    /** @type {Array.<Array.<Uint8Array>>} WMLに送る生のMIDIイベント */

    _this.plainTracks = [];
    /** @param {number} トラック数 */

    _this.numberOfTracks = 1;
    /** @type {number} 分解能 */

    _this.timeDivision = optParams.timeDivision || 96;
    return _this;
  }
  /**
   * パース処理
   */


  _createClass(MabiIcco, [{
    key: "parse",
    value: function parse() {
      this.parseHeader();
      this.parseTracks();
      this.toPlainTrack();
    }
    /**
     * ヘッダーメタ情報をパース
     */

  }, {
    key: "parseHeader",
    value: function parseHeader() {
      /** @type {TextEncoder} */
      this.encoder = new TextEncoder('utf-8');
      /** @type {array} 各トラックごと複数存在する変数名 */

      var multipleKeys = ['mml-track', 'name', 'program', 'songProgram', 'panpot'];
      var ret = {};
      /** @type {number} トラック番号（ヘッダー情報があるので初期値は-1） */

      var trackNo = -1;
      ret.track = [];

      for (var i = 0; i < this.input.length; i++) {
        var line = this.input[i].trim();

        if (i === 0) {
          if (line !== '[mml-score]') {
            throw new Error('Not MabiIcco File.');
          }

          continue;
        }

        var _line$split = line.split('='),
            _line$split2 = _slicedToArray(_line$split, 2),
            key = _line$split2[0],
            value = _line$split2[1];

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


      this.title = ret.title;
      /** @param {string} 著者情報 */

      this.author = ret.author;
      /** @param {array} グローバルテンポ情報（テンポ変更のTickとテンポ？） */

      var mmiTempo = ret.tempo !== '' ? ret.tempo.split('T') : [0, 120];
      /** @param {number} 分解能 */

      this.timeDivision = 96;
      /** @param {number} テンポ */

      this.tempo = mmiTempo[1] | 0;
      /** @param {array} 拍子記号 */

      var timeSig = ret.time.split('/');
      /** @type {array}  */

      var headerTrack = []; // GM Reset

      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.SystemExclusiveEvent('SystemExclusive', 0, 0, [0x7e, 0x7f, 0x09, 0x01])); // 曲名と著者情報を付加

      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent('SequenceTrackName', 0, 0, [this.title]));
      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent('CopyrightNotice', 0, 0, [this.author]));
      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent('TimeSignature', 0, 0, [timeSig[0] | 0 || 4, timeSig[1] | 0 || 4, 0, 0]));
      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent('SetTempo', 0, 0, [Math.floor(60000000 / this.tempo)]));
      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent('EndOfTrack', 0, 0));
      this.tracks.push(headerTrack);
      this.input = ret.track; // console.log(this);
    }
    /**
     * MML parse
     */

  }, {
    key: "parseTracks",
    value: function parseTracks() {
      /** @type {array} MIDIイベント */
      var track = [];
      /** @type {array} 終了時間比較用 */

      var endTimes = [];

      for (var ch = 0; ch < this.input.length; ch++) {
        /** @type {array} 現在のチャンネルの情報 */
        var current = this.input[ch];

        if (!current.mml.match(/^(?:MML@)(.*)/gm)) {
          continue;
        }
        /** @type {array} MMLの配列（簡易マッチ） */


        var mmls = RegExp.$1.split(','); // 楽器名

        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent('InsturumentName', 0, 48, [current.name])); // プログラムチェンジ

        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.ChannelEvent('ProgramChange', 0, 96, ch, current.program));

        if (current.songProgram !== -1) {
          // コーラス用
          track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.ChannelEvent('ProgramChange', 0, 112, 15, current.songProgram));
        } // パン(CC:0x10)


        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.ChannelEvent('ControlChange', 0, 154, ch, 10, current.panpot)); // MMLの各チャンネルの処理

        for (var chord = 0; chord < current.mml.length; chord++) {
          var currentCh = ch;

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


          var mml2Midi = new _PSGConverter__WEBPACK_IMPORTED_MODULE_0__["default"]({
            timeDivision: this.timeDivision,
            channel: currentCh,
            timeOffset: 386,
            mml: mmls[chord],
            igonoreTempo: currentCh === 1
          }); // トラックにマージ

          track = track.concat(mml2Midi.events);
          endTimes.push(mml2Midi.endTime);
        } // トラック終了


        track.concat(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent('EndOfTrack', 0, Math.max(endTimes)));
        this.tracks.push(track);
      }

      this.numberOfTracks = this.tracks.length;
    }
  }]);

  return MabiIcco;
}(_mms__WEBPACK_IMPORTED_MODULE_1__["default"]);



/***/ }),

/***/ "./src/mms.js":
/*!********************!*\
  !*** ./src/mms.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MakiMabiSequence)
/* harmony export */ });
/* harmony import */ var _PSGConverter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PSGConverter */ "./src/PSGConverter.js");
/* harmony import */ var ini__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ini */ "./node_modules/ini/ini.js");
/* harmony import */ var ini__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ini__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _midi_event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./midi_event */ "./src/midi_event.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




/**
 * @classdesc   MakiMabi Sequence File Parser
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license     MIT
 */

var MakiMabiSequence = /*#__PURE__*/function () {
  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  function MakiMabiSequence(input) {
    var optParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MakiMabiSequence);

    /** @type {string} */
    var string = String.fromCharCode.apply('', new Uint16Array(input));
    /** @type {Ini} MMSファイルをパースしたもの */

    this.input = ini__WEBPACK_IMPORTED_MODULE_1___default().parse(string) || {};
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


  _createClass(MakiMabiSequence, [{
    key: "parse",
    value: function parse() {
      this.parseHeader();
      this.parseTracks();
      this.toPlainTrack();
    }
    /**
     * ヘッダーメタ情報をパース
     */

  }, {
    key: "parseHeader",
    value: function parseHeader() {
      /** @type {TextEncoder} */
      this.encoder = new TextEncoder('shift_jis');
      /** @type {object} インフォメーション情報 */

      var header = this.input.infomation; // informationじゃない

      /** @type {string} タイトル */

      this.title = header.title;
      /** @type {string} 著者情報 */

      this.author = header.auther; // authorじゃない。

      /** @param {number} 解像度 */

      this.timeDivision = header.timeBase | 0 || 96;
      /** @type {array} まきまびしーくの楽器番号変換テーブル（MabiIccoのMMSFile.javaのテーブルを流用） */

      this.mmsInstTable = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 18]; // 曲名と著者情報を付加

      /** @type {array}  */

      var headerTrack = []; // GM Reset

      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.SystemExclusiveEvent('SystemExclusive', 0, 0, [0x7e, 0x7f, 0x09, 0x01]));
      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent('SequenceTrackName', 0, 0, [this.title]));
      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent('CopyrightNotice', 0, 0, [this.author]));
      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent('TimeSignature', 0, 0, [header.rythmNum | 0 || 4, header.rythmBase | 0 || 4, 0, 0]));
      headerTrack.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent('EndOfTrack', 0, 0));
      this.tracks.push(headerTrack); // infomationおよびmms-fileを取り除く

      delete this.input.infomation;
      delete this.input['mms-file'];
    }
    /**
     * MML parse
     */

  }, {
    key: "parseTracks",
    value: function parseTracks() {
      /** @type {array} MIDIイベント */
      var track = [];
      /** @type {array} 終了時間比較用 */

      var endTimes = [];
      /** @type {number} チャンネル */

      var ch = 0;

      for (var part in this.input) {
        if (!Object.prototype.hasOwnProperty.call(this.input, part)) {
          continue;
        }

        var currentPart = this.input[part];
        /** @param {array} MMLの配列 */

        var mmls = [currentPart.ch0_mml, currentPart.ch1_mml, currentPart.ch2_mml];
        /** @param {number} パンポット */

        var panpot = Number(currentPart.panpot) + 64; // 楽器名

        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent('InsturumentName', 0, 48, [currentPart.name])); // プログラムチェンジ

        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.ChannelEvent('ProgramChange', 0, 96, ch, this.mmsInstTable[currentPart.instrument] | 0)); // パン

        track.push(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.ChannelEvent('ControlChange', 0, 154, ch, 10, panpot)); // MMLの各チャンネルの処理

        for (var chord in mmls) {
          if (!Object.prototype.hasOwnProperty.call(mmls, chord)) {
            continue;
          }
          /** @param {PSGConverter} */


          var mml2Midi = new _PSGConverter__WEBPACK_IMPORTED_MODULE_0__["default"]({
            timeDivision: this.timeDivision,
            channel: ch,
            timeOffset: 386,
            mml: mmls[chord]
          }); // トラックにマージ

          track = track.concat(mml2Midi.events);
          endTimes.push(mml2Midi.endTime);
        }

        ch++; // トラック終了

        track.concat(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent('EndOfTrack', 0, Math.max(endTimes)));
        this.tracks.push(track);
      }

      this.numberOfTracks = this.tracks.length;
    }
    /**
     * WebMidiLink信号に変換
     */

  }, {
    key: "toPlainTrack",
    value: function toPlainTrack() {
      for (var i = 0; i < this.tracks.length; i++) {
        /** @type {array} トラックのイベント */
        var rawTrackEvents = [];
        /** @type {array} 全イベント */

        var rawEvents = [];
        /** @type {array} */

        var events = this.tracks[i];

        var _iterator = _createForOfIteratorHelper(events),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var event = _step.value;

            /** @var {Uint8Array} WebMidiLink信号 */
            var raw = void 0;

            if (event instanceof _midi_event__WEBPACK_IMPORTED_MODULE_2__.ChannelEvent) {
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
                  raw = new Uint8Array([0xb0 | event.channel, event.parameter1, event.parameter2]);
                  break;

                case 'ProgramChange':
                  raw = new Uint8Array([0xc0 | event.channel, event.parameter1]);
                  break;
              }
            } else if (event instanceof _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent) {
              // Metaイベントの内容は実際使われない。単なる配列の数合わせのためのプレースホルダ（音を鳴らすことには関係ない処理だから）

              /** @type {Uint8Array} */
              var data = this.encoder.encode(event.data);

              switch (event.subtype) {
                case 'TextEvent':
                  raw = new Uint8Array([0xff, 0x01].concat(data));
                  break;

                case 'SequenceTrackName':
                  raw = new Uint8Array([0xff, 0x03].concat(data));
                  break;

                case 'CopyrightNotice':
                  raw = new Uint8Array([0xff, 0x02].concat(data));
                  break;

                case 'InsturumentName':
                  raw = new Uint8Array([0xff, 0x04].concat(data));
                  break;

                case 'SetTempo':
                  raw = new Uint8Array([0xff, 0x51].concat(data));
                  break;

                case 'TimeSignature':
                  raw = new Uint8Array([0xff, 0x58].concat(data));
                  break;

                case 'EndOfTrack':
                  raw = new Uint8Array([0xff, 0x2f]);
                  break;
              }
            } else if (event instanceof _midi_event__WEBPACK_IMPORTED_MODULE_2__.SystemExclusiveEvent) {
              raw = new Uint8Array([0xf0, 0x05].concat(event.data));
            }

            rawEvents = rawEvents.concat(raw);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        rawTrackEvents = rawTrackEvents.concat(rawEvents);
        this.plainTracks[i] = rawTrackEvents;
      }
    }
  }]);

  return MakiMabiSequence;
}();



/***/ }),

/***/ "./src/ms2mml.js":
/*!***********************!*\
  !*** ./src/ms2mml.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MapleStory2Mml)
/* harmony export */ });
/* harmony import */ var _PSGConverter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PSGConverter */ "./src/PSGConverter.js");
/* harmony import */ var _mms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mms */ "./src/mms.js");
/* harmony import */ var _midi_event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./midi_event */ "./src/midi_event.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




/**
 * @classdesc   MapleStory2 Mml Parser
 *
 * @author      Logue <logue@hotmail.co.jp>
 * @copyright   2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license     MIT
 */

var MapleStory2Mml = /*#__PURE__*/function (_MakiMabiSequence) {
  _inherits(MapleStory2Mml, _MakiMabiSequence);

  var _super = _createSuper(MapleStory2Mml);

  /**
   * @param {ByteArray} input
   * @param {Object=} optParams
   */
  function MapleStory2Mml(input) {
    var _this;

    var optParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MapleStory2Mml);

    _this = _super.call(this, input, optParams);
    /** @type {TextEncoder} */

    _this.encoder = new TextEncoder('utf-8');
    /** @type {DOMParser} */

    var parser = new DOMParser();
    /** @type {Document} */

    var doc = parser.parseFromString(String.fromCharCode.apply('', new Uint16Array(input)), 'text/xml');
    /** @param {Element} */

    _this.input = doc.querySelectorAll('ms2 > *');
    /** @type {Array.<Array.<Object>>} 全トラックの演奏情報 */

    _this.tracks = [];
    /** @type {Array.<Array.<Uint8Array>>} WMLに送る生のMIDIイベント */

    _this.plainTracks = [];
    /** @param {number} トラック数 */

    _this.numberOfTracks = 1;
    /** @type {number} 解像度 */

    _this.timeDivision = optParams.timeDivision || 96;
    return _this;
  }
  /**
   */


  _createClass(MapleStory2Mml, [{
    key: "parse",
    value: function parse() {
      // this.parseHeader();
      // this.parseDataInformation();
      this.parseTracks();
      this.toPlainTrack();
    }
    /**
     * MML parse
     */

  }, {
    key: "parseTracks",
    value: function parseTracks() {
      /** @type {array} MIDIイベント */
      var track = [];
      /** @type {array} 終了時間比較用 */

      var endTimes = [];

      var _iterator = _createForOfIteratorHelper(this.input),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var i = _step.value;

          /** @param {PSGConverter} */
          var mml2Midi = new _PSGConverter__WEBPACK_IMPORTED_MODULE_0__["default"]({
            timeDivision: this.timeDivision,
            channel: 0,
            mml: this.input[i].textContent.trim(),
            ignoreTempo: false
          });
          track = track.concat(mml2Midi.events);
          endTimes.push(mml2Midi.endTime);
        } // トラック終了

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      track.concat(new _midi_event__WEBPACK_IMPORTED_MODULE_2__.MetaEvent('EndOfTrack', 0, Math.max(endTimes)));
      this.tracks.push(track);
    }
  }]);

  return MapleStory2Mml;
}(_mms__WEBPACK_IMPORTED_MODULE_1__["default"]);



/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Player": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _mmi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mmi */ "./src/mmi.js");
/* harmony import */ var _mms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mms */ "./src/mms.js");
/* harmony import */ var _ms2mml__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ms2mml */ "./src/ms2mml.js");
/* harmony import */ var _meta__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./meta */ "./src/meta.js");
/* harmony import */ var _mld__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mld */ "./src/mld.js");
/* harmony import */ var _smf__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./smf */ "./src/smf.js");
/* harmony import */ var _3mle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./3mle */ "./src/3mle.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }








/**
 * Midi Player Class
 */

var Player = /*#__PURE__*/function () {
  /**
   * @param {string} target WML attach dom
   */
  function Player() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#wml';

    _classCallCheck(this, Player);

    /** @type {number} */
    this.tempo = 500000; // default

    /** @type {HTMLIFrameElement} */

    this.webMidiLin = null;
    /** @type {number} */

    this.resume = 0;
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

    this.timeTotal = 0;
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


  _createClass(Player, [{
    key: "setCC111Loop",
    value: function setCC111Loop(enable) {
      this.enableCC111Loop = enable;
    }
    /**
     * @param {boolean} enable
     */

  }, {
    key: "setFalcomLoop",
    value: function setFalcomLoop(enable) {
      this.enableFalcomLoop = enable;
    }
    /**
     * @param {boolean} enable
     */

  }, {
    key: "setMFiLoop",
    value: function setMFiLoop(enable) {
      this.enableMFiLoop = enable;
    }
    /**
     * @param {boolean} enable
     */

  }, {
    key: "setLoop",
    value: function setLoop(enable) {
      this.enableLoop = enable;
    }
    /**
     */

  }, {
    key: "stop",
    value: function stop() {
      /** @type {number} */
      var i;
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

  }, {
    key: "getWebMidiLink",
    value: function getWebMidiLink() {
      return this.webMidiLink;
    }
    /**
     */

  }, {
    key: "init",
    value: function init() {
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

      var player = this;

      if (this.ready) {
        this.sendInitMessage();
      } else {
        this.window.addEventListener('message', function (ev) {
          if (ev.data === 'link,ready') {
            player.sendInitMessage();
          }
        }, false);
      }
    }
    /**
     */

  }, {
    key: "initSequence",
    value: function initSequence() {
      this.tempo = 500000;
      this.position = 0;
      this.sendInitMessage();
      this.pause = false;
    }
    /**
     */

  }, {
    key: "play",
    value: function play() {
      var _this = this;

      /** @type {Player} */
      var player = this;

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
        this.window.addEventListener('message', function (ev) {
          if (ev.data === 'link,ready') {
            player.ready = true;
            player.webMidiLink.style.height = _this.webMidiLink.contentWindow.document.body.scrollHeight + 'px';
            player.playSequence();
          }
        }, false);
      }
    }
    /**
     */

  }, {
    key: "ended",
    value: function ended() {
      this.player.window.postMessage('endoftrack', '*');
    }
    /**
     */

  }, {
    key: "sendInitMessage",
    value: function sendInitMessage() {
      /** @type {Window} */
      var win = this.webMidiLink.contentWindow;
      /** @type {number} */

      var i;

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

  }, {
    key: "setWebMidiLink",
    value: function setWebMidiLink() {
      var _this2 = this;

      var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './wml.html';

      /** @type {Player} */
      var player = this;

      var process = function process(ev) {
        if (typeof ev.data === 'string') {
          var msg = ev.data.split(',');

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


        var iframe = this.webMidiLink = this.window.document.createElement('iframe');
        iframe.src = port;
        iframe.className = 'wml';
        this.target.appendChild(iframe);
        this.window.addEventListener('message', process, false);

        var resizeHeight = function resizeHeight() {
          iframe.style.height = _this2.webMidiLink.contentWindow.document.body.scrollHeight + 'px';
        };

        this.window.addEventListener('load', resizeHeight, false);
        var timer = 0;
        this.window.addEventListener('resize', function () {
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

  }, {
    key: "setMasterVolume",
    value: function setMasterVolume(volume) {
      this.masterVolume = volume;

      if (this.webMidiLink) {
        this.webMidiLink.contentWindow.postMessage('midi,f0,7f,7f,04,01,' + [('0' + (volume & 0x7f).toString(16)).substr(-2), ('0' + (volume >> 7 & 0x7f).toString(16)).substr(-2), '7f'].join(','), '*');
      }
    }
    /**
     * @param {number} tempo
     */

  }, {
    key: "setTempoRate",
    value: function setTempoRate(tempo) {
      this.tempoRate = tempo;
    }
    /**
     */

  }, {
    key: "playSequence",
    value: function playSequence() {
      /** @type {Player} */
      var player = this;
      /** @type {number} */

      var timeDivision = this.sequence.timeDivision;
      /** @type {Array.<Object>} */

      var mergedTrack = this.track;
      /** @type {Window} */

      var webMidiLink = this.webMidiLink.contentWindow;
      /** @type {number} */

      var pos = this.position || 0;
      /** @type {Array.<?{pos: number}>} */

      var mark = [];

      var update = function update() {
        /** @type {number} */
        var time = mergedTrack[pos].time;
        /** @type {number} */

        var length = mergedTrack.length;
        /** @type {Object} TODO */

        var event;
        /** @type {?Array.<string>} */

        var match;
        /** @type {*} */

        var tmp;
        /** @type {number} */

        var procTime = Date.now();

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
        this.timer = player.window.setTimeout(update, this.tempo / 1000 * timeDivision * this.track[0].time);
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

  }, {
    key: "loadMidiFile",
    value: function loadMidiFile(buffer) {
      /** @type {SMF} */
      var parser = new _smf__WEBPACK_IMPORTED_MODULE_5__["default"](buffer);
      this.init();
      parser.parse();
      this.mergeMidiTracks(parser);
    }
    /**
     * @param {ArrayBuffer} buffer
     */

  }, {
    key: "loadMldFile",
    value: function loadMldFile(buffer) {
      /** @type {Mld} */
      var parser = new _mld__WEBPACK_IMPORTED_MODULE_4__["default"](buffer);
      this.init();
      parser.parse();
      this.mergeMidiTracks(parser.convertToMidiTracks());
    }
    /**
     * @param {ArrayBuffer} buffer
     */

  }, {
    key: "loadMs2MmlFile",
    value: function loadMs2MmlFile(buffer) {
      /** @type {MapleStory2Mml} */
      var parser = new _ms2mml__WEBPACK_IMPORTED_MODULE_2__["default"](buffer);
      this.init();
      parser.parse();
      this.mergeMidiTracks(parser);
    }
    /**
     * @param {ArrayBuffer} buffer
     */

  }, {
    key: "loadMakiMabiSequenceFile",
    value: function loadMakiMabiSequenceFile(buffer) {
      /** @type {MakiMabiSequence} */
      var parser = new _mms__WEBPACK_IMPORTED_MODULE_1__["default"](buffer);
      this.init();
      parser.parse();
      this.mergeMidiTracks(parser);
    }
    /**
     * @param {ArrayBuffer} buffer
     */

  }, {
    key: "load3MleFile",
    value: function load3MleFile(buffer) {
      /** @type {ThreeMacroLanguageEditor} */
      var parser = new _3mle__WEBPACK_IMPORTED_MODULE_6__["default"](buffer);
      this.init();
      parser.parse();
      this.mergeMidiTracks(parser);
    }
    /**
     * @param {ArrayBuffer} buffer
     */

  }, {
    key: "loadMabiIccoFile",
    value: function loadMabiIccoFile(buffer) {
      /** @type {MabiIcco} */
      var parser = new _mmi__WEBPACK_IMPORTED_MODULE_0__["default"](buffer);
      this.init();
      parser.parse();
      this.mergeMidiTracks(parser);
    }
    /**
     * @param {Object} midi
     */

  }, {
    key: "mergeMidiTracks",
    value: function mergeMidiTracks(midi) {
      /** @type {Array.<Object>} */
      var mergedTrack = this.track = [];
      /** @type {Array.<Array.<Object>>} */

      var tracks = midi.tracks;
      /** @type {Array.<number>} */

      var trackPosition = new Array(tracks.length);
      /** @type {Array.<Array.<Array.<number>>>} */

      var plainTracks = midi.plainTracks;
      /** @type {Array.<Object>} */

      var track;
      /** @type {number} */

      var i;
      /** @type {number} */

      var il;
      /** @type {number} */

      var j;
      /** @type {number} */

      var jl; // initialize

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
            webMidiLink: 'midi,' + Array.prototype.map.call(plainTracks[i][j], function (a) {
              return a.toString(16);
            }).join(',')
          });
        }
      } // sort


      mergedTrack.sort(function (a, b) {
        return a.time > b.time ? 1 : a.time < b.time ? -1 : a.track > b.track ? 1 : a.track < b.track ? -1 : a.eventId > b.eventId ? 1 : a.eventId < b.eventId ? -1 : 0;
      }); // トータルの演奏時間

      this.timeTotal = mergedTrack.slice(-1)[0].time;
      this.sequence = midi;
    }
    /**
     * @return {?string}
     */

  }, {
    key: "getSequenceName",
    value: function getSequenceName() {
      return this.sequenceName;
    }
    /**
     * @return {?string}
     */

  }, {
    key: "getCopyright",
    value: function getCopyright() {
      return this.copyright;
    }
    /**
     * @return {?string}
     */

  }, {
    key: "getLyrics",
    value: function getLyrics() {
      return this.lyrics;
    }
    /**
     * @return {?string}
     */

  }, {
    key: "getTextEvent",
    value: function getTextEvent() {
      return this.textEvent;
    }
    /**
     * @return {number}
     */

  }, {
    key: "getPosition",
    value: function getPosition() {
      return this.position;
    }
    /**
     * @param {number} pos
     */

  }, {
    key: "setPosition",
    value: function setPosition(pos) {
      this.position = pos;
    }
    /**
     * @return {number}
     */

  }, {
    key: "getLength",
    value: function getLength() {
      return this.length;
    }
    /**
     */

  }, {
    key: "sendGmReset",
    value: function sendGmReset() {
      if (this.webMidiLink) {
        // F0 7E 7F 09 01 F7
        this.webMidiLink.contentWindow.postMessage('midi,F0,7E,7F,09,01,F7', '*');
      }
    }
    /**
     */

  }, {
    key: "sendAllSoundOff",
    value: function sendAllSoundOff() {
      if (this.webMidiLink) {
        this.webMidiLink.contentWindow.postMessage('midi,b0,78,0', '*');
      }
    }
    /**
     * TODO: ちゃんと動いていない
     * @param {number} time
     * @return {string}
     */

  }, {
    key: "getTime",
    value: function getTime(time) {
      var secs = this.tempo / 6000000 * time;
      var hours = Math.floor(secs / (60 * 60));
      var divisorForMinutes = secs % (60 * 60);
      var minutes = Math.floor(divisorForMinutes / 60);
      var divisorForSeconds = divisorForMinutes % 60;
      var seconds = Math.ceil(divisorForSeconds);
      return hours + ':' + ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2);
    }
  }]);

  return Player;
}();

/***/ }),

/***/ "./src/riff.js":
/*!*********************!*\
  !*** ./src/riff.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Riff)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Riff Parser class
 */
var Riff = /*#__PURE__*/function () {
  /**
   * @param {ByteArray} input input buffer.
   * @param {Object=} optParams option parameters.
   */
  function Riff(input) {
    var optParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Riff);

    /** @type {ByteArray} */
    this.input = input;
    /** @type {number} */

    this.ip = optParams.index || 0;
    /** @type {number} */

    this.length = optParams.length || input.length - this.ip;
    /** @type {Array.<RiffChunk>} */

    this.chunkList = [];
    /** @type {number} */

    this.offset = this.ip;
    /** @type {boolean} */

    this.padding = optParams.padding !== void 0 ? optParams.padding : true;
    /** @type {boolean} */

    this.bigEndian = optParams.bigEndian !== void 0 ? optParams.bigEndian : false;
  }
  /**
   */


  _createClass(Riff, [{
    key: "parse",
    value: function parse() {
      /** @type {number} */
      var length = this.length + this.offset;
      this.chunkList = [];

      while (this.ip < length) {
        this.parseChunk();
      }
    }
    /**
     */

  }, {
    key: "parseChunk",
    value: function parseChunk() {
      /** @type {ByteArray} */
      var input = this.input;
      /** @type {number} */

      var ip = this.ip;
      /** @type {number} */

      var size;
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

  }, {
    key: "getChunk",
    value: function getChunk(index) {
      /** @type {RiffChunk} */
      var chunk = this.chunkList[index];

      if (chunk === void 0) {
        return null;
      }

      return chunk;
    }
    /**
     * @return {number}
     */

  }, {
    key: "getNumberOfChunks",
    value: function getNumberOfChunks() {
      return this.chunkList.length;
    }
  }]);

  return Riff;
}();
/**
 * Riff Chunk Structure
 * @interface
 */




var RiffChunk =
/**
 * @param {string} type
 * @param {number} size
 * @param {number} offset
 */
function RiffChunk(type, size, offset) {
  _classCallCheck(this, RiffChunk);

  /** @type {string} */
  this.type = type;
  /** @type {number} */

  this.size = size;
  /** @type {number} */

  this.offset = offset;
};

/***/ }),

/***/ "./src/smf.js":
/*!********************!*\
  !*** ./src/smf.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SMF)
/* harmony export */ });
/* harmony import */ var _midi_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./midi_event */ "./src/midi_event.js");
/* harmony import */ var _meta__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./meta */ "./src/meta.js");
/* harmony import */ var _riff__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./riff */ "./src/riff.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




/**
 * Standard Midi File Parser class
 */

var SMF = /*#__PURE__*/function () {
  /**
   * @param {ByteArray} input input buffer.
   * @param {Object=} optParams option parameters.
   */
  function SMF(input) {
    var optParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, SMF);

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


  _createClass(SMF, [{
    key: "parse",
    value: function parse() {
      /** @type {number} */
      var i = 0;
      /** @type {number} */

      var il = 0; // parse riff chunks

      this.riffParser_.parse(); // parse header chunk

      this.parseHeaderChunk(); // parse track chunks

      for (i = 0, il = this.numberOfTracks; i < il; ++i) {
        this.parseTrackChunk();
      }
    }
    /**
     */

  }, {
    key: "parseHeaderChunk",
    value: function parseHeaderChunk() {
      /** @type {?{type: string, size: number, offset: number}} */
      var chunk = this.riffParser_.getChunk(this.chunkIndex++);
      /** @type {ByteArray} */

      var data = this.input;
      /** @type {number} */

      var ip = chunk.offset;

      if (!chunk || chunk.type !== 'MThd') {
        throw new Error('invalid header signature');
      }

      this.formatType = data[ip++] << 8 | data[ip++];
      this.numberOfTracks = data[ip++] << 8 | data[ip++];
      this.timeDivision = data[ip++] << 8 | data[ip++];
    }
    /**
     */

  }, {
    key: "parseTrackChunk",
    value: function parseTrackChunk() {
      /** @type {?{type: string, size: number, offset: number}} */
      var chunk = this.riffParser_.getChunk(this.chunkIndex++);
      /** @type {ByteArray} */

      var data = this.input;
      /** @type {number} */

      var ip = chunk.offset;
      /** @type {number} */

      var size = 0;
      /** @type {number} */

      var deltaTime = 0;
      /** @type {number} */

      var eventType = 0;
      /** @type {number} */

      var channel = 0;
      /** @type {number} */

      var prevEventType = -1;
      /** @type {number} */

      var prevChannel = -1;
      /** @type {number} */

      var tmp = 0;
      /** @type {number} */

      var totalTime = 0;
      /** @type {number} */

      var offset = 0;
      /** @type {number} */

      var length = 0;
      /** @type {number} */

      var status = 0;
      /** @type {Event} */

      var event;
      /** @type {ByteArray} */

      var plainBytes;
      /** @return {number} */

      var readNumber = function readNumber() {
        /** @type {number} */
        var result = 0;
        tmp = 0;

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
      var eventQueue = [];
      var plainQueue = [];

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


        var table = [null, null, null, null, null, null, null, null, 'NoteOff', // 0x8
        'NoteOn', 'NoteAftertouch', 'ControlChange', 'ProgramChange', 'ChannelAftertouch', 'PitchBend'];

        switch (eventType) {
          // channel events
          case 0x8:
          /* FALLTHROUGH */

          case 0x9:
          /* FALLTHROUGH */

          case 0xa:
          /* FALLTHROUGH */

          case 0xb:
          /* FALLTHROUGH */

          case 0xd:
          /* FALLTHROUGH */

          case 0xe:
            event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.ChannelEvent(table[eventType], deltaTime, totalTime, channel, data[ip++], data[ip++]);
            break;

          case 0xc:
            event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.ChannelEvent(table[eventType], deltaTime, totalTime, channel, data[ip++]);
            break;
          // meta events, system exclusive event

          case 0xf:
            switch (channel) {
              // SysEx event
              case 0x0:
                tmp = readNumber();

                if (data[ip + tmp - 1] !== 0xf7) {
                  throw new Error('invalid SysEx event');
                }

                event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.SystemExclusiveEvent('SystemExclusive', deltaTime, totalTime, data.subarray(ip, (ip += tmp) - 1));
                break;

              case 0x7:
                tmp = readNumber();
                event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.SystemExclusiveEvent('SystemExclusive(F7)', deltaTime, totalTime, data.subarray(ip, ip += tmp));
                break;
              // meta event

              case 0xf:
                eventType = data[ip++];
                tmp = readNumber();

                switch (eventType) {
                  case 0x00:
                    // sequence number
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('SequenceNumber', deltaTime, totalTime, [data[ip++], data[ip++]]);
                    break;

                  case 0x01:
                    // text event
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('TextEvent', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]);
                    break;

                  case 0x02:
                    // copyright notice
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('CopyrightNotice', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]);
                    break;

                  case 0x03:
                    // sequence/track name
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('SequenceTrackName', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]);
                    break;

                  case 0x04:
                    // instrument name
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('InstrumentName', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]);
                    break;

                  case 0x05:
                    // lyrics
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('Lyrics', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]);
                    break;

                  case 0x06:
                    // marker
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('Marker', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]);
                    break;

                  case 0x07:
                    // cue point
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('CuePoint', deltaTime, totalTime, [String.fromCharCode.apply(null, data.subarray(ip, ip += tmp))]);
                    break;

                  case 0x20:
                    // midi channel prefix
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('MidiChannelPrefix', deltaTime, totalTime, [data[ip++]]);
                    break;

                  case 0x2f:
                    // end of track
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('EndOfTrack', deltaTime, totalTime, []);
                    break;

                  case 0x51:
                    // set tempo
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('SetTempo', deltaTime, totalTime, [data[ip++] << 16 | data[ip++] << 8 | data[ip++]]);
                    break;

                  case 0x54:
                    // smpte offset
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('SmpteOffset', deltaTime, totalTime, [data[ip++], data[ip++], data[ip++], data[ip++], data[ip++]]);
                    break;

                  case 0x58:
                    // time signature
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('TimeSignature', deltaTime, totalTime, [data[ip++], data[ip++], data[ip++], data[ip++]]);
                    break;

                  case 0x59:
                    // key signature
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('KeySignature', deltaTime, totalTime, [data[ip++], data[ip++]]);
                    break;

                  case 0x7f:
                    // sequencer specific
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('SequencerSpecific', deltaTime, totalTime, [data.subarray(ip, ip += tmp)]);
                    break;

                  default:
                    // unknown
                    event = new _midi_event__WEBPACK_IMPORTED_MODULE_0__.MetaEvent('Unknown', deltaTime, totalTime, [eventType, data.subarray(ip, ip += tmp)]);
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

        if (event instanceof _midi_event__WEBPACK_IMPORTED_MODULE_0__.ChannelEvent && event.subtype === 'NoteOn' &&
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
  }]);

  return SMF;
}();



/***/ }),

/***/ "./node_modules/ini/ini.js":
/*!*********************************!*\
  !*** ./node_modules/ini/ini.js ***!
  \*********************************/
/***/ ((module) => {

const { hasOwnProperty } = Object.prototype

const eol = typeof process !== 'undefined' &&
  process.platform === 'win32' ? '\r\n' : '\n'

const encode = (obj, opt) => {
  const children = []
  let out = ''

  if (typeof opt === 'string') {
    opt = {
      section: opt,
      whitespace: false,
    }
  } else {
    opt = opt || Object.create(null)
    opt.whitespace = opt.whitespace === true
  }

  const separator = opt.whitespace ? ' = ' : '='

  for (const k of Object.keys(obj)) {
    const val = obj[k]
    if (val && Array.isArray(val)) {
      for (const item of val)
        out += safe(k + '[]') + separator + safe(item) + '\n'
    } else if (val && typeof val === 'object')
      children.push(k)
    else
      out += safe(k) + separator + safe(val) + eol
  }

  if (opt.section && out.length)
    out = '[' + safe(opt.section) + ']' + eol + out

  for (const k of children) {
    const nk = dotSplit(k).join('\\.')
    const section = (opt.section ? opt.section + '.' : '') + nk
    const { whitespace } = opt
    const child = encode(obj[k], {
      section,
      whitespace,
    })
    if (out.length && child.length)
      out += eol

    out += child
  }

  return out
}

const dotSplit = str =>
  str.replace(/\1/g, '\u0002LITERAL\\1LITERAL\u0002')
    .replace(/\\\./g, '\u0001')
    .split(/\./)
    .map(part =>
      part.replace(/\1/g, '\\.')
        .replace(/\2LITERAL\\1LITERAL\2/g, '\u0001'))

const decode = str => {
  const out = Object.create(null)
  let p = out
  let section = null
  //          section     |key      = value
  const re = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i
  const lines = str.split(/[\r\n]+/g)

  for (const line of lines) {
    if (!line || line.match(/^\s*[;#]/))
      continue
    const match = line.match(re)
    if (!match)
      continue
    if (match[1] !== undefined) {
      section = unsafe(match[1])
      if (section === '__proto__') {
        // not allowed
        // keep parsing the section, but don't attach it.
        p = Object.create(null)
        continue
      }
      p = out[section] = out[section] || Object.create(null)
      continue
    }
    const keyRaw = unsafe(match[2])
    const isArray = keyRaw.length > 2 && keyRaw.slice(-2) === '[]'
    const key = isArray ? keyRaw.slice(0, -2) : keyRaw
    if (key === '__proto__')
      continue
    const valueRaw = match[3] ? unsafe(match[4]) : true
    const value = valueRaw === 'true' ||
      valueRaw === 'false' ||
      valueRaw === 'null' ? JSON.parse(valueRaw)
      : valueRaw

    // Convert keys with '[]' suffix to an array
    if (isArray) {
      if (!hasOwnProperty.call(p, key))
        p[key] = []
      else if (!Array.isArray(p[key]))
        p[key] = [p[key]]
    }

    // safeguard against resetting a previously defined
    // array by accidentally forgetting the brackets
    if (Array.isArray(p[key]))
      p[key].push(value)
    else
      p[key] = value
  }

  // {a:{y:1},"a.b":{x:2}} --> {a:{y:1,b:{x:2}}}
  // use a filter to return the keys that have to be deleted.
  const remove = []
  for (const k of Object.keys(out)) {
    if (!hasOwnProperty.call(out, k) ||
        typeof out[k] !== 'object' ||
        Array.isArray(out[k]))
      continue

    // see if the parent section is also an object.
    // if so, add it to that, and mark this one for deletion
    const parts = dotSplit(k)
    let p = out
    const l = parts.pop()
    const nl = l.replace(/\\\./g, '.')
    for (const part of parts) {
      if (part === '__proto__')
        continue
      if (!hasOwnProperty.call(p, part) || typeof p[part] !== 'object')
        p[part] = Object.create(null)
      p = p[part]
    }
    if (p === out && nl === l)
      continue

    p[nl] = out[k]
    remove.push(k)
  }
  for (const del of remove)
    delete out[del]

  return out
}

const isQuoted = val =>
  (val.charAt(0) === '"' && val.slice(-1) === '"') ||
    (val.charAt(0) === "'" && val.slice(-1) === "'")

const safe = val =>
  (typeof val !== 'string' ||
    val.match(/[=\r\n]/) ||
    val.match(/^\[/) ||
    (val.length > 1 &&
     isQuoted(val)) ||
    val !== val.trim())
    ? JSON.stringify(val)
    : val.replace(/;/g, '\\;').replace(/#/g, '\\#')

const unsafe = (val, doUnesc) => {
  val = (val || '').trim()
  if (isQuoted(val)) {
    // remove the single quotes before calling JSON.parse
    if (val.charAt(0) === "'")
      val = val.substr(1, val.length - 2)

    try {
      val = JSON.parse(val)
    } catch (_) {}
  } else {
    // walk the val to find the first not-escaped ; character
    let esc = false
    let unesc = ''
    for (let i = 0, l = val.length; i < l; i++) {
      const c = val.charAt(i)
      if (esc) {
        if ('\\;#'.indexOf(c) !== -1)
          unesc += c
        else
          unesc += '\\' + c

        esc = false
      } else if (';#'.indexOf(c) !== -1)
        break
      else if (c === '\\')
        esc = true
      else
        unesc += c
    }
    if (esc)
      unesc += '\\'

    return unesc.trim()
  }
  return val
}

module.exports = {
  parse: decode,
  decode,
  stringify: encode,
  encode,
  safe,
  unsafe,
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("smf_player." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("7c6979b1683078d33c0d")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "SMF:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises;
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 					blockingPromises.push(promise);
/******/ 					waitForBlockingPromises(function () {
/******/ 						return setStatus("ready");
/******/ 					});
/******/ 					return promise;
/******/ 				case "prepare":
/******/ 					blockingPromises.push(promise);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises.length === 0) return fn();
/******/ 			var blocker = blockingPromises;
/******/ 			blockingPromises = [];
/******/ 			return Promise.all(blocker).then(function () {
/******/ 				return waitForBlockingPromises(fn);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						blockingPromises = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error("apply() is only allowed in ready status");
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			"smf.player": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId) {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		(typeof self !== 'undefined' ? self : this)["webpackHotUpdateSMF"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						!__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						__webpack_require__.o(installedChunks, chunkId) &&
/******/ 						installedChunks[chunkId] !== undefined
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	var __webpack_exports__ = __webpack_require__("./src/player.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=smf.player.js.map