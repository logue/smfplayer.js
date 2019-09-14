import SMF from './smf';
import Mld from './mld';
import Ms2Mml from './ms2mml';
import MakiMabiSequence from './mms';
import ThreeMacroLanguageEditor from './3mle';
/**
 * Midi Player Class
 */
export class Player {
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
    this.sequence = null;
    this.sequenceName = null;
    this.copyright = null;
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
      this.window.addEventListener('message', (ev) => {
        if (ev.data === 'link,ready') {
          player.sendInitMessage();
        }
      }, false);
    }
  };

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
      this.window.addEventListener('message', (ev) => {
        if (ev.data === 'link,ready') {
          player.ready = true;
          player.webMidiLink.style.height = this.webMidiLink.contentWindow.document.body.scrollHeight + 'px';
          player.playSequence();
        }
      }, false);
    }
  };

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
      const iframe = this.webMidiLink =
        /** @type {HTMLIFrameElement} */
        (this.window.document.createElement('iframe'));
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
          '7f',
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
      const time = mergedTrack[pos]['time'];
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
        event = mergedTrack[pos]['event'];

        // set tempo
        if (event.subtype === 'SetTempo') {
          player.tempo = event.data[0];
        }

        // CC#111 Loop
        if (event.subtype === 'ControlChange' && event.parameter1 === 111) {
          mark[0] = {
            'pos': pos,
          };
        }

        // Ys Eternal 2 Loop
        if (event.subtype === 'Marker') {
          // mark
          if (event.data[0] === 'A') {
            mark[0] = {
              'pos': pos,
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
                'count': match[3] | 0,
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
    };

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

  /**
   * @param {ArrayBuffer} buffer
   */
  loadMidiFile(buffer) {
    /** @type {SMF} */
    const parser = new SMF(buffer);

    this.init();
    parser.parse();

    console.log(parser);

    this.mergeMidiTracks(parser);
  };

  /**
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
   * @param {ArrayBuffer} buffer
   */
  loadMs2MmlFile(buffer) {
    /** @type {Ms2Mml} */
    const parser = new Ms2Mml(buffer);

    this.init();
    parser.parse();

    this.mergeMidiTracks(parser);
  }

  /**
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
   * @param {ArrayBuffer} buffer
   */
  load3MleFile(buffer) {
    /** @type {MakiMabiSequence} */
    const parser = new ThreeMacroLanguageEditor(buffer);

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
    /** @type {Array.<string>} */
    const copys = this.copyright = [];
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
        if (midi.formatType === 0 && track[j].subtype === 'SequenceTrackName') {
          this.sequenceName = track[j].data[0];
        }

        if (track[j].subtype === 'CopyrightNotice') {
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
              (a) => {
                return a.toString(16);
              }
            ).join(','),
        });
      }
    }

    // sort
    mergedTrack.sort((a, b) => {
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
    const secs = (this.tempo / 6000000) * time;

    const hours = Math.floor(secs / (60 * 60));

    const divisorForMinutes = secs % (60 * 60);
    const minutes = Math.floor(divisorForMinutes / 60);

    const divisorForSeconds = divisorForMinutes % 60;
    const seconds = Math.ceil(divisorForSeconds);

    return hours + ':' + ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2);
  }
}
