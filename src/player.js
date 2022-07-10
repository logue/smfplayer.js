import ThreeMacroLanguageEditor from './3mle';
import MapleStory2Mml from './ms2mml';
import MakiMabiSequence from './mms';
import MabiIcco from './mmi';
import Meta from './meta';
import Mld from './mld';
import SMF from './smf';

/**
 * @classdesc Midi Player Class
 * @author    imaya
 * @license   MIT
 */
export default class Player {
  /**
   * @param {string} target WML attach dom
   */
  constructor(target = '#wml') {
    /** @type {number} テンポ（マイクロ秒）*/
    this.tempo = 500000; // default = 0.5[ms] = 120[bpm]
    /** @type {HTMLIFrameElement} */
    this.webMidiLink = null;
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
    this.version = Meta.version;
    /** @type {string} */
    this.build = Meta.build;
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
    this.resume = window.performance.now();

    if (this.webMidiLink) {
      for (i = 0; i < 16; ++i) {
        this.webMidiLink.contentWindow.postMessage(
          'midi,b' + i.toString(16) + ',78,0',
          '*'
        );
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
      this.window.addEventListener(
        'message',
        ev => {
          if (ev.data === 'link,ready') {
            player.sendInitMessage();
          }
        },
        false
      );
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
      this.window.addEventListener(
        'message',
        ev => {
          if (ev.data === 'link,ready') {
            player.ready = true;
            player.webMidiLink.style.height =
              this.webMidiLink.contentWindow.document.body.scrollHeight + 'px';
            player.playSequence();
          }
        },
        false
      );
    }
  }

  /**
   * シーケンス終了時
   */
  onSequenceEnd() {
    this.webMidiLink.contentWindow.postMessage('endoftrack', '*');
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
            player.loaded = Math.round((msg[2] / msg[3]) * 10000);
          }
        }
      }
    };

    if (typeof port === 'string') {
      // Clear self
      if (this.webMidiLink) {
        this.webMidiLink.parentNode.removeChild(this.webMidiLink);
      }

      // Clear parent DOM
      if (this.target.firstChild) {
        this.target.removeChild(this.target.firstChild);
      }

      /** @type {HTMLIFrameElement} */
      const iframe = (this.webMidiLink =
        /** @type {HTMLIFrameElement} */
        (this.window.document.createElement('iframe')));
      iframe.src = port;
      iframe.className = 'wml';

      this.target.appendChild(iframe);
      this.window.addEventListener('message', process, false);

      const resizeHeight = () => {
        iframe.style.height =
          this.webMidiLink.contentWindow.document.body.scrollHeight + 'px';
      };

      this.window.addEventListener('load', resizeHeight, false);

      let timer = 0;
      this.window.addEventListener(
        'resize',
        () => {
          if (timer > 0) {
            clearTimeout(timer);
          }
          timer = setTimeout(resizeHeight, 100);
        },
        false
      );
    } else {
      // Worker Mode
      this.webMidiLink.addEventListener('message', process, false);
    }
  }

  /**
   * マスターボリュームを変更
   * @param {number} volume
   */
  setMasterVolume(volume) {
    this.masterVolume = volume;

    if (this.webMidiLink) {
      this.webMidiLink.contentWindow.postMessage(
        'midi,f0,7f,7f,04,01,' +
          [
            ('0' + (volume & 0x7f).toString(16)).substr(-2),
            ('0' + ((volume >> 7) & 0x7f).toString(16)).substr(-2),
            '7f',
          ].join(','),
        '*'
      );
    }
  }

  /**
   * テンポ変更
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
    /** @type {number} 分解能 */
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
      const time = mergedTrack[pos].time;
      /** @type {number} */
      const length = mergedTrack.length;
      /** @type {Object} TODO */
      let event;
      /** @type {?Array.<string>} */
      let match;
      /** @type {*} */
      let tmp;
      /** @type {number} */
      let procTime = window.performance.now();

      if (player.pause) {
        player.resume = procTime - player.resume;
        return;
      }

      do {
        event = mergedTrack[pos].event;

        switch (event.subtype) {
          case 'TextEvent': // 0x01
            // 主に歌詞などが入っている。MIDI作成者によってはデバッグ情報やお遊びも・・・。
            player.textEvent = event.data[0];
            break;
          case 'Lyrics': // 0x05
            // カラオケデーターが入っている。Textとの違いは、どの位置で表示するかやページ送りなどの制御コードが含まれている。
            // とはいっても、単なるテキストデータ。
            // KAR形式とYAMAHA独自のXF形式というカラオケ専用の書式がある。
            // カラオケのパーサーは本プログラムでは実装しない。
            // KAR形式：https://www.mixagesoftware.com/en/midikit/help/HTML/karaoke_formats.html
            // XF形式：https://jp.yamaha.com/files/download/other_assets/7/321757/xfspc.pdf
            player.lyrics = event.data[0];
            break;
          case 'Maker': // 0x06
            if (player.enableFalcomLoop) {
              // A-B Loop (Ys Eternal 2 Loop)
              switch (event.data[0]) {
                case 'A':
                  mark[0] = {
                    pos: pos,
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
              match = event.data[0].match(
                /^LOOP_(START|END)=ID:(\d+),COUNT:(-?\d+)$/
              );
              if (match) {
                if (match[1] === 'START') {
                  mark[match[2] | 0] = mark[match[2]] || {
                    pos: pos,
                    count: match[3] | 0,
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
          case 'SetTempo': // 0x51
            player.tempo = event.data[0];
            break;
        }

        // CC#111 Loop
        if (event.subtype === 'ControlChange' && event.parameter1 === 111) {
          mark[0] = {
            pos: pos,
          };
        }

        // send message
        webMidiLink.postMessage(mergedTrack[pos++].webMidiLink, '*');
      } while (pos < length && mergedTrack[pos].time === time);

      if (pos < length) {
        procTime = window.performance.now() - procTime;
        player.timer = player.window.setTimeout(
          update,
          (player.tempo / (1000 * timeDivision)) *
            (mergedTrack[pos].time - time - procTime) *
            (1 / player.tempoRate)
        );
      } else {
        // loop
        player.pause = true;
        if (
          player.enableCC111Loop &&
          mark[0] &&
          typeof mark[0].pos === 'number'
        ) {
          // ループ
          pos = mark[0].pos;
        } else if (player.enableLoop) {
          player.initSequence();
          player.playSequence();
        }
      }

      player.position = pos;
      player.time = time;

      if (this.timeTotal === time) {
        // 最後まで演奏した
        this.onSequenceEnd();
        return 2;
      }
    };

    if (!this.pause) {
      this.timer = player.window.setTimeout(
        update,
        (this.tempo / 1000) * timeDivision * this.track[0].time
      );
    } else {
      // resume
      this.timer = player.window.setTimeout(update, this.resume);
      this.pause = false;
      this.resume = -1;
    }
  }

  /**
   * MIDIファイルをロード
   * @param {ArrayBuffer} buffer
   */
  loadMidiFile(buffer) {
    /** @type {SMF} */
    const parser = new SMF(buffer);

    this.init();
    parser.parse();

    this.mergeMidiTracks(parser);
  }

  /**
   * MLD形式（着メロ）のファイルをロード
   * @param {ArrayBuffer} buffer
   */
  loadMldFile(buffer) {
    /** @type {Mld} */
    const parser = new Mld(buffer);

    this.init();
    parser.parse();

    this.mergeMidiTracks(parser.convertToMidiTracks());
  }

  /**
   * MapleStory2のMMLをロード
   * @param {ArrayBuffer} buffer
   */
  loadMs2MmlFile(buffer) {
    /** @type {MapleStory2Mml} */
    const parser = new MapleStory2Mml(buffer);

    this.init();
    parser.parse();

    this.mergeMidiTracks(parser);
  }

  /**
   * まきまびしーく形式のMMLをロード
   * @param {ArrayBuffer} buffer
   */
  loadMakiMabiSequenceFile(buffer) {
    /** @type {MakiMabiSequence} */
    const parser = new MakiMabiSequence(buffer);

    this.init();
    parser.parse();

    this.mergeMidiTracks(parser);
  }

  /**
   * Three Macro Language Editor形式のMMLファイルをロード
   * @param {ArrayBuffer} buffer
   */
  load3MleFile(buffer) {
    /** @type {ThreeMacroLanguageEditor} */
    const parser = new ThreeMacroLanguageEditor(buffer);

    this.init();
    parser.parse();

    this.mergeMidiTracks(parser);
  }

  /**
   * まびっこ形式のファイルをロード
   * @param {ArrayBuffer} buffer
   */
  loadMabiIccoFile(buffer) {
    /** @type {MabiIcco} */
    const parser = new MabiIcco(buffer);

    this.init();
    parser.parse();

    this.mergeMidiTracks(parser);
  }

  /**
   * @param {Object} midi
   */
  mergeMidiTracks(midi) {
    /** @type {Array.<Object>} */
    const mergedTrack = (this.track = []);
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
    let jl;

    // initialize
    for (i = 0, il = tracks.length; i < il; ++i) {
      trackPosition[i] = 0;
    }

    // merge
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
          webMidiLink:
            'midi,' +
            Array.prototype.map
              .call(plainTracks[i][j], a => {
                return a.toString(16);
              })
              .join(','),
        });
      }
    }

    // sort
    mergedTrack.sort((a, b) => {
      return a.time > b.time
        ? 1
        : a.time < b.time
        ? -1
        : a.track > b.track
        ? 1
        : a.track < b.track
        ? -1
        : a.eventId > b.eventId
        ? 1
        : a.eventId < b.eventId
        ? -1
        : 0;
    });

    // トータルの演奏時間
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
   * GMリセットを送信
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
   * 現在のテンポ
   * @return {number}
   */
  getTempo() {
    return Math.floor(60 / (this.tempo / 1000000));
  }
  /**
   * Tick数を時間に変換
   * @param {number} tick
   * @returns {string}
   */
  tick2time(tick) {
    // １拍あたりの秒（T120 = 0.5s）
    const s = this.tempo / 1000000;
    // 1Tickあたりの秒
    const div = s / this.sequence.timeDivision;
    // トータル秒
    const seconds = (tick * div) | 0;
    // 分
    const divisorForMinutes = seconds % 3600;
    // 秒
    const divisorForSeconds = divisorForMinutes % 60;

    return (
      // 時間
      Math.floor(seconds / 3600) +
      ':' +
      // 分
      Math.floor(divisorForMinutes / 60)
        .toString()
        .padStart(2, '0') +
      ':' +
      // 秒
      Math.ceil(divisorForSeconds).toString().padStart(2, '0')
    );
  }
  /**
   * 現在の時間
   * @return {string}
   */
  getTime() {
    return this.tick2time(this.time);
  }
  /**
   * 演奏時間
   * @return {string}
   */
  getTotalTime() {
    return this.tick2time(this.timeTotal);
  }
}
