goog.provide('SMF.Player');

goog.require('SMF.Parser');
goog.require('Mld.Parser');

goog.scope(function () {

  /**
   * @constructor
   */
  SMF.Player = function (target = '#wml') {
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
    this.track;
    /** @type {number} */
    this.timer;
    /** @type {Object} TODO: 最低限のプロパティは記述する */
    this.sequence;
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
    this.sequenceName;
    /** @type {Array.<string>} */
    this.copyright;
    /** @type {HTMLIFrameElement} */
    this.webMidiLink;
    /** @type {number} */
    this.length;
    /** @type {number} */
    this.time;
    /** @type {number} */
    this.timeTotal;
    /** @type {number} */
    this.loaded;
    /** @type {Window} */
    this.window = goog.global.window;
    /** @type {Element} */
    this.target = document.body.querySelector(target);
  };

  /**
   * @param {boolean} enable
   */
  SMF.Player.prototype.setCC111Loop = function (enable) {
    this.enableCC111Loop = enable;
  };

  /**
   * @param {boolean} enable
   */
  SMF.Player.prototype.setFalcomLoop = function (enable) {
    this.enableFalcomLoop = enable;
  };

  /**
   * @param {boolean} enable
   */
  SMF.Player.prototype.setMFiLoop = function (enable) {
    this.enableMFiLoop = enable;
  };

  /**
   * @param {boolean} enable
   */
  SMF.Player.prototype.setLoop = function (enable) {
    this.enableLoop = enable;
  };

  SMF.Player.prototype.stop = function () {
    /** @type {number} */
    var i;

    this.pause = true;
    this.resume = Date.now();

    if (this.webMidiLink) {
      for (i = 0; i < 16; ++i) {
        this.webMidiLink.contentWindow.postMessage('midi,b' + i.toString(16) + ',78,0', '*');
      }
    }
  };

  SMF.Player.prototype.getWebMidiLink = function () {
    return this.webMidiLink;
  };

  SMF.Player.prototype.init = function () {
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

    /** @type {SMF.Player} */
    var player = this;
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

  SMF.Player.prototype.initSequence = function () {
    this.tempo = 500000;
    this.position = 0;

    this.sendInitMessage();
    this.pause = false;
  };

  SMF.Player.prototype.play = function () {
    /** @type {SMF.Player} */
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
        goog.global.console.warn('Midi file is not loaded.');
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

  SMF.Player.prototype.sendInitMessage = function () {
    /** @type {Window} */
    var win = this.webMidiLink.contentWindow;
    /** @type {number} */
    var i;

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
   * @param {string} url WebMidiLink url.
   */
  SMF.Player.prototype.setWebMidiLink = function (url = '//cdn.rawgit.com/logue/smfplayer.js/gh-pages/wml.html') {
    /** @type {SMF.Player} */
    var player = this;
    /** @type {HTMLIFrameElement} */
    var iframe;

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
    iframe.src = url;
    iframe.className = 'wml';

    this.target.appendChild(iframe);

    this.window.addEventListener('message', (function (ev) {
      if (typeof ev.data === 'string') {
        var msg = ev.data.split(',');

        if (msg[0] === 'link') {
          //        goog.global.console.log(ev.data);
          if (msg[1] === 'ready') {
            player.ready = true;
            player.loaded = 100;
            player.setMasterVolume(player.masterVolume);
          } else if (msg[1] === 'progress') {
            //          goog.global.console.log(msg[2]);
            player.loaded = Math.round((msg[2] / msg[3]) * 10000);
          }
        }
      }
    }), false);
  };

  /**
   * @param {number} volume
   */
  SMF.Player.prototype.setMasterVolume = function (volume) {

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
  SMF.Player.prototype.setTempoRate = function (tempo) {
    this.tempoRate = tempo;
  };

  SMF.Player.prototype.playSequence = function () {
    /** @type {SMF.Player} */
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

    if (!this.pause) {
      this.timer = this.window.setTimeout(
        update,
        this.tempo / 1000 * timeDivision * this.track[0]['time']
      );
    } else {
      // resume
      this.timer = this.window.setTimeout(
        update,
        this.resume
      );
      this.pause = false;
      this.resume = -1;
    }

    function update() {
      /** @type {number} */
      var time = mergedTrack[pos]['time'];
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
        player.window.postMessage('endoftrack', '*');
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
  };

  SMF.Player.prototype.loadMidiFile = function (buffer) {
    /** @type {SMF.Parser} */
    var parser = new SMF.Parser(buffer);

    this.init();
    parser.parse();

    this.mergeMidiTracks(parser);
  };

  SMF.Player.prototype.loadMldFile = function (buffer) {
    /** @type {Mld.Parser} */
    var parser = new Mld.Parser(buffer);

    this.init();
    parser.parse();

    //this.mergeMidiTracks(parser.convertToMidiTracks());
    this.loadMidiFile(parser.convertToMidiTracks());
  };

  /**
   * @param {Object} midi
   */
  SMF.Player.prototype.mergeMidiTracks = function (midi) {
    /** @type {Array.<Object>} */
    var mergedTrack = this.track = [];
    /** @type {Array.<number>} */
    var trackPosition;
    /** @type {Array.<Array.<Object>>} */
    var tracks;
    /** @type {Array.<Object>} */
    var track;
    /** @type {Array.<Array.<Array.<number>>>} */
    var plainTracks;
    /** @type {Array.<string>} */
    var copys = this.copyright = [];
    /** @type {number} */
    var i;
    /** @type {number} */
    var il;
    /** @type {number} */
    var j;
    /** @type {number} */
    var jl;

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
  SMF.Player.prototype.getSequenceName = function () {
    return this.sequenceName;
  };

  /**
   * @return {Array.<string>}
   */
  SMF.Player.prototype.getCopyright = function () {
    return this.copyright;
  };

  /**
   * @return {number}
   */
  SMF.Player.prototype.getPosition = function () {
    return this.position;
  }

  /**
   * @param {number} pos
   */
  SMF.Player.prototype.setPosition = function (pos) {
    this.position = pos;
  }

  /**
   * @return {number}
   */
  SMF.Player.prototype.getLength = function () {
    return this.length;
  }

  SMF.Player.prototype.sendGmReset = function () {
    if (this.webMidiLink) {
      // F0 7E 7F 09 01 F7
      this.webMidiLink.contentWindow.postMessage('midi,F0,7E,7F,09,01,F7', '*');
    }
  }

  SMF.Player.prototype.sendAllSoundOff = function () {
    if (this.webMidiLink) {
      this.webMidiLink.contentWindow.postMessage('midi,b0,78,0', '*');
    }
  }

  /**
   * @param {number} time
   * @return {string}
   */
  SMF.Player.prototype.getTime = function (time) {
    var secs = (this.tempo / 6000000) * time;
    
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    return hours + ':' + ('00' + minutes).slice(-2) + ':' + ('00' + seconds).slice(-2);
  }
});