goog.provide('SMF.Player');

goog.require('SMF.Parser');
goog.require('Mld.Parser');

goog.scope(function() {

/**
 * @constructor
 */
SMF.Player = function() {
  /** @type {number} */
  this.tempo = 500000; // default
  /** @type {HTMLIFrameElement} */
  this.webMidiLink;
  /** @type {number} */
  this.resume;
  /** @type {boolean} */
  this.pause;
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
  /** @type {number} */
  this.length;
  /** @type {Window} */
  this.window = window;
};

/**
 * @param {boolean} enable
 */
SMF.Player.prototype.setCC111Loop = function(enable) {
  this.enableCC111Loop = enable;
};

/**
 * @param {boolean} enable
 */
SMF.Player.prototype.setFalcomLoop = function(enable) {
  this.enableFalcomLoop = enable;
};

/**
 * @param {boolean} enable
 */
SMF.Player.prototype.setMFiLoop = function(enable) {
  this.enableMFiLoop = enable;
};

/**
 * @param {boolean} enable
 */
SMF.Player.prototype.setLoop = function(enable) {
  this.enableLoop = enable;
};

SMF.Player.prototype.stop = function() {
  /** @type {Window} */
  var window;
  /** @type {number} */
  var i;

  this.pause = true;
  this.resume = Date.now();

  if (this.webMidiLink) {
    window = this.webMidiLink.contentWindow;
    for (i = 0; i < 16; ++i) {
      window.postMessage('midi,b' + i.toString(16) + ',78,0', '*');
    }
  }
};

SMF.Player.prototype.getWebMidiLink = function() {
  return this.webMidiLink;
};

SMF.Player.prototype.init = function() {
  this.stop();
  this.initSequence();
  this.pause = false;
  this.track = null;
  this.resume = -1;
  this.sequence = null;
  this.sequenceName = null;
  this.copyright = null;
  this.length = 0;

  clearTimeout(this.timer);

  /** @type {SMF.Player} */
  var player = this;
  if (this.ready) {
    this.sendInitMessage();
  } else {
    this.window.addEventListener('message', (function(ev) {
      if (ev.data === 'link,ready') {
        player.sendInitMessage();
      }
    }), false);
  }
};

SMF.Player.prototype.initSequence = function() {
  this.tempo = 500000;
  this.position = 0;
};

SMF.Player.prototype.play = function() {
  /** @type {SMF.Player} */
  var player = this;

  if (!this.webMidiLink) {
    throw new Error('WebMidiLink not found');
  }

  if (this.ready) {
    this.length = this.track.length;
    if (this.track instanceof Array && this.position >= this.length) {
      this.position = 0;
    }
    this.playSequence();
  } else {
    this.window.addEventListener('message', (function(ev) {
      if (ev.data === 'link,ready') {
        player.ready = true;
        player.playSequence();
      }
    }), false);
  }
};

SMF.Player.prototype.sendInitMessage = function() {
  /** @type {Window} */
  var window = this.webMidiLink.contentWindow;
  /** @type {number} */
  var i;

  for (i = 0; i < 16; ++i) {
    // volume
    window.postMessage('midi,b' + i.toString(16) + ',07,64', '*');
    // panpot
    window.postMessage('midi,b' + i.toString(16) + ',0a,40', '*');
    // pitch bend
    window.postMessage('midi,e' + i.toString(16) + ',00,40', '*');
    // pitch bend range
    window.postMessage('midi,b' + i.toString(16) + ',64,00', '*');
    window.postMessage('midi,b' + i.toString(16) + ',65,00', '*');
    window.postMessage('midi,b' + i.toString(16) + ',06,02', '*');
    window.postMessage('midi,b' + i.toString(16) + ',26,00', '*');

  }
};

/**
 * @param {string} url WebMidiLink url.
 */
SMF.Player.prototype.setWebMidiLink = function(url, attachpoint) {
  /** @type {SMF.Player} */
  var player = this;
  /** @type {HTMLIFrameElement} */
  var iframe;

  if (this.webMidiLink) {
    document.body.removeChild(this.webMidiLink);
    this.webMidiLink = null;
  }

  var dom = !attachpoint ? document.body : document.getElementById(attachpoint);

  iframe = this.webMidiLink =
    /** @type {HTMLIFrameElement} */(document.createElement('iframe'));
  iframe.src = url || 'https://cdn.rawgit.com/logue/smfplayer.js/gh-pages/wml.html';
  iframe.className = 'wml';

  dom.appendChild(iframe);

  this.window.addEventListener('message', (function(ev) {
    if (ev.data === 'link,ready') {
      player.ready = true;
      player.setMasterVolume(player.masterVolume);
    }
  }), false);
};

/**
 * @param {number} volume
 */
SMF.Player.prototype.setMasterVolume = function(volume) {
  var window;

  this.masterVolume = volume;

  if (this.webMidiLink) {
    window = this.webMidiLink.contentWindow;
    window.postMessage(
      'midi,f0,7f,7f,04,01,' +
      [
        ('0' + ((volume     ) & 0x7f).toString(16)).substr(-2),
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
SMF.Player.prototype.setTempoRate = function(tempo) {
  this.tempoRate = tempo;
};

SMF.Player.prototype.playSequence = function() {
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
    this.timer = setTimeout(
      update,
      this.tempo / 1000 * timeDivision * this.track[0]['time']
    );
  } else {
    // resume
    this.timer = setTimeout(
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
        mark[0] = {'pos': pos};
      }

      // Ys Eternal 2 Loop
      if (event.subtype === 'Marker') {
        // mark
        if (event.data[0] === 'A') {
          mark[0] = {'pos': pos};
        }
        // jump
        if (event.data[0] === 'B' && player.enableFalcomLoop &&
            mark[0] && typeof mark[0]['pos'] === 'number') {
          pos = mark[0]['pos'];
          player.timer = setTimeout(update, 0);
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
              player.timer = setTimeout(update, 0);
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
      player.timer = setTimeout(
        update,
        player.tempo / (1000 * timeDivision) * (mergedTrack[pos]['time'] - time - procTime) * (1 / player.tempoRate)
      );
    } else {
      // loop
      this.window.postMessage('endoftrack','*');
      if (player.enableCC111Loop && mark[0] && typeof mark[0]['pos'] === 'number') {
        pos = mark[0]['pos'];
        player.timer = setTimeout(update, 0);
      } else if (player.enableLoop) {
        player.initSequence();
        player.playSequence();
      }
    }

    player.position = pos;
  }
};

SMF.Player.prototype.loadMidiFile = function(buffer) {
  /** @type {SMF.Parser} */
  var parser = new SMF.Parser(buffer);

  this.init();
  parser.parse();

  this.mergeMidiTracks(parser);
};

SMF.Player.prototype.loadMldFile = function(buffer) {
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
SMF.Player.prototype.mergeMidiTracks = function(midi) {
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
        'webMidiLink':
          'midi,' +
            Array.prototype.map.call(
              plainTracks[i][j],
              function(a) {
                return a.toString(16);
              }
            ).join(',')
      });
    }
  }

  // sort
  mergedTrack.sort(function(a, b) {
    return a['time']    > b['time']    ? 1 : a['time']    < b['time']    ? -1
         : a['track']   > b['track']   ? 1 : a['track']   < b['track']   ? -1
         : a['eventId'] > b['eventId'] ? 1 : a['eventId'] < b['eventId'] ? -1
         : 0;
  });

  this.sequence = midi;
};

/**
 * @return {?string}
 */
SMF.Player.prototype.getSequenceName = function() {
  return this.sequenceName;
};

/**
 * @return {Array.<string>}
 */
SMF.Player.prototype.getCopyright = function() {
  return this.copyright;
};

});