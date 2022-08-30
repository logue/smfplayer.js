!(function () {
  const e = document.createElement('link').relList;
  if (!(e && e.supports && e.supports('modulepreload'))) {
    for (const e of document.querySelectorAll('link[rel="modulepreload"]'))
      t(e);
    new MutationObserver(e => {
      for (const i of e)
        if ('childList' === i.type)
          for (const e of i.addedNodes)
            'LINK' === e.tagName && 'modulepreload' === e.rel && t(e);
    }).observe(document, { childList: !0, subtree: !0 });
  }
  function t(e) {
    if (e.ep) return;
    e.ep = !0;
    const t = (function (e) {
      const t = {};
      return (
        e.integrity && (t.integrity = e.integrity),
        e.referrerpolicy && (t.referrerPolicy = e.referrerpolicy),
        'use-credentials' === e.crossorigin
          ? (t.credentials = 'include')
          : 'anonymous' === e.crossorigin
          ? (t.credentials = 'omit')
          : (t.credentials = 'same-origin'),
        t
      );
    })(e);
    fetch(e.href, t);
  }
})();
/**
 * @classdesc Midi Event abstract Structure
 * @author    imaya
 * @license   MIT
 */
class e {
  constructor(e, t, i) {
    (this.subtype = e), (this.deltaTime = t), (this.time = i);
  }
}
class t extends e {
  constructor(e, t, i, s, n, a) {
    super(e, t, i),
      (this.channel = s),
      (this.parameter1 = n),
      (this.parameter2 = a);
  }
}
class i extends e {
  constructor(e, t, i, s) {
    super(e, t, i), (this.data = s);
  }
}
class s extends e {
  constructor(e, t, i, s) {
    super(e, t, i), (this.data = s);
  }
}
/**
 * @class     PSGConverter
 * @classdesc Mabinogi MML and Maple Story 2 MML to MIDI Converter.
 * @version   3.0.3
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019-2021 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */ class n {
  constructor(e = {}) {
    (this.timeDivision = 0 | e.timeDivision || 96),
      (this.channel = 0 | e.channel),
      (this.timeOffset = 0 | e.timeOffset),
      (this.PATTERN = /[a-glnortv<>][+#-]?\d*\.?&?/g),
      (this.NOTE_TABLE = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }),
      (this.MINIM = 2 * this.timeDivision),
      (this.SEMIBREVE = 4 * this.timeDivision),
      (this.VELOCITY_MAGNIFICATION = 7),
      (this.mml = e.mml),
      (this.events = []),
      (this.plainEvents = []),
      (this.endTime = 0),
      (this.noteOffNegativeOffset = 2),
      (this.ignoreTempo = !1 | e.igonreTempo),
      (this.maxOctave = 8 | e.maxOctave),
      (this.minOctave = 0 | e.minOctave),
      (this.octaveMode = 0 | e.octaveMode),
      (this.minNote = 12 | e.minNote),
      (this.maxNote = 98 | e.minNote),
      this.parse();
  }
  parse() {
    let e = [];
    try {
      e = this.mml.toLowerCase().match(this.PATTERN);
    } catch (h) {
      return;
    }
    if (!e) return;
    let i = this.timeOffset,
      n = this.timeDivision,
      a = 0,
      r = 8,
      o = 4,
      c = !1;
    const l = [];
    for (const p of e) {
      let e = 0 | n,
        h = '',
        u = 0;
      if (p.match(/([lotv<>])([1-9]\d*|0?)(\.?)(&?)/))
        switch (
          ((h = RegExp.$1.toLowerCase()),
          (u = 0 | RegExp.$2),
          c &&
            '&' !== RegExp.$4 &&
            ((c = !1),
            l.push(
              new t(
                'NoteOff',
                0,
                i - this.noteOffNegativeOffset,
                this.channel,
                a
              )
            )),
          h)
        ) {
          case 'l':
            u >= 1 &&
              u <= this.MINIM &&
              ((n = Math.floor(this.SEMIBREVE / u)),
              '.' === RegExp.$3 && (n = Math.floor(1.5 * n)));
            break;
          case 'o':
            u >= this.minOctave && u <= this.maxOctave && (o = u);
            break;
          case 't':
            l.push(new s('SetTempo', 0, i, [Math.floor(6e7 / u)]));
            break;
          case 'v':
            u >= 0 && u <= 15 && (r = u);
            break;
          case '<':
            o = o <= this.minOctave ? this.minOctave : o - 1;
            break;
          case '>':
            o = o >= this.maxOctave ? this.maxOctave : o + 1;
        }
      else if (p.match(/([a-gn])([+#-]?)(\d*)(\.?)(&?)/)) {
        let s = 0;
        switch (
          ((h = RegExp.$1.toLowerCase()),
          (u = 0 | RegExp.$3),
          'n' === h
            ? (s = u)
            : (u >= 1 &&
                u <= this.MINIM &&
                (e = Math.floor(this.SEMIBREVE / u)),
              '.' === RegExp.$4 && (e = Math.floor(1.5 * e)),
              2 !== this.octaveMode &&
                ((s = 12 * o + this.NOTE_TABLE[h]),
                '+' === RegExp.$2 || '#' === RegExp.$2
                  ? s++
                  : '-' === RegExp.$2 && s--)),
          this.octaveMode)
        ) {
          case 1:
            for (; s < this.minNote; ) s += 12;
            for (; s > this.maxNote; ) s -= 12;
            s += 12;
            break;
          case 2:
            s = this.maxNote;
            break;
          default:
            s += 12;
        }
        c
          ? s !== a &&
            l.push(
              new t(
                'NoteOff',
                0,
                i - this.noteOffNegativeOffset,
                this.channel,
                a
              )
            )
          : l.push(
              new t(
                'NoteOn',
                0,
                i,
                this.channel,
                s,
                r * this.VELOCITY_MAGNIFICATION
              )
            ),
          (i += e),
          '&' === RegExp.$5
            ? ((c = !0), (a = s))
            : ((c = !1),
              l.push(
                new t(
                  'NoteOff',
                  0,
                  i - this.noteOffNegativeOffset,
                  this.channel,
                  s
                )
              ));
      } else
        p.match(/R(\d*)(\.?)/i) &&
          ((u = 0 | RegExp.$1),
          u >= 1 && u <= this.MINIM && (e = Math.floor(this.SEMIBREVE / u)),
          '.' === RegExp.$2 && (e = Math.floor(1.5 * e)),
          (i += e));
    }
    (this.events = l), (this.endTime = i);
  }
}
const { hasOwnProperty: a } = Object.prototype,
  r =
    ('undefined' != typeof process && process.platform,
    e =>
      e
        .replace(/\1/g, 'LITERAL\\1LITERAL')
        .replace(/\\\./g, '')
        .split(/\./)
        .map(e =>
          e.replace(/\1/g, '\\.').replace(/\2LITERAL\\1LITERAL\2/g, '')
        )),
  o = e => {
    const t = Object.create(null);
    let i = t,
      s = null;
    const n = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i,
      o = e.split(/[\r\n]+/g);
    for (const r of o) {
      if (!r || r.match(/^\s*[;#]/)) continue;
      const e = r.match(n);
      if (!e) continue;
      if (void 0 !== e[1]) {
        if (((s = l(e[1])), '__proto__' === s)) {
          i = Object.create(null);
          continue;
        }
        i = t[s] = t[s] || Object.create(null);
        continue;
      }
      const o = l(e[2]),
        c = o.length > 2 && '[]' === o.slice(-2),
        h = c ? o.slice(0, -2) : o;
      if ('__proto__' === h) continue;
      const p = !e[3] || l(e[4]),
        u = 'true' === p || 'false' === p || 'null' === p ? JSON.parse(p) : p;
      c &&
        (a.call(i, h) ? Array.isArray(i[h]) || (i[h] = [i[h]]) : (i[h] = [])),
        Array.isArray(i[h]) ? i[h].push(u) : (i[h] = u);
    }
    const c = [];
    for (const l of Object.keys(t)) {
      if (!a.call(t, l) || 'object' != typeof t[l] || Array.isArray(t[l]))
        continue;
      const e = r(l);
      i = t;
      const s = e.pop(),
        n = s.replace(/\\\./g, '.');
      for (const t of e)
        '__proto__' !== t &&
          ((a.call(i, t) && 'object' == typeof i[t]) ||
            (i[t] = Object.create(null)),
          (i = i[t]));
      (i === t && n === s) || ((i[n] = t[l]), c.push(l));
    }
    for (const a of c) delete t[a];
    return t;
  },
  c = e =>
    (e.startsWith('"') && e.endsWith('"')) ||
    (e.startsWith("'") && e.endsWith("'")),
  l = (e, t) => {
    if (((e = (e || '').trim()), !c(e))) {
      let t = !1,
        i = '';
      for (let s = 0, n = e.length; s < n; s++) {
        const n = e.charAt(s);
        if (t) -1 !== '\\;#'.indexOf(n) ? (i += n) : (i += '\\' + n), (t = !1);
        else {
          if (-1 !== ';#'.indexOf(n)) break;
          '\\' === n ? (t = !0) : (i += n);
        }
      }
      return t && (i += '\\'), i.trim();
    }
    "'" === e.charAt(0) && (e = e.slice(1, -1));
    try {
      e = JSON.parse(e);
    } catch (i) {}
    return e;
  };
var h = o;
/**
 * @classdesc MakiMabi Sequence File Parser
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */ class p {
  constructor(e, t = {}) {
    const i = String.fromCharCode.apply('', new Uint16Array(e));
    (this.input = h(i) || {}),
      (this.tracks = []),
      (this.plainTracks = []),
      (this.numberOfTracks = 1),
      (this.timeDivision = t.timeDivision || 96);
  }
  parse() {
    this.parseHeader(), this.parseTracks(), this.toPlainTrack();
  }
  parseHeader() {
    this.encoder = new TextEncoder('shift_jis');
    const e = this.input.infomation;
    (this.title = e.title),
      (this.author = e.auther),
      (this.timeDivision = 0 | e.timeBase || 96),
      (this.mmsInstTable = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 65, 66,
        67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 18,
      ]);
    const t = [];
    t.push(new i('SystemExclusive', 0, 0, [126, 127, 9, 1])),
      t.push(new s('SequenceTrackName', 0, 0, [this.title])),
      t.push(new s('CopyrightNotice', 0, 0, [this.author])),
      t.push(
        new s('TimeSignature', 0, 0, [
          0 | e.rythmNum || 4,
          0 | e.rythmBase || 4,
          0,
          0,
        ])
      ),
      t.push(new s('EndOfTrack', 0, 0)),
      this.tracks.push(t),
      delete this.input.infomation,
      delete this.input['mms-file'];
  }
  parseTracks() {
    let e = [];
    const i = [];
    let a = 0;
    for (const r in this.input) {
      if (!Object.prototype.hasOwnProperty.call(this.input, r)) continue;
      const o = this.input[r],
        c = [o.ch0_mml, o.ch1_mml, o.ch2_mml],
        l = Number(o.panpot) + 64;
      e.push(new s('InsturumentName', 0, 48, [o.name])),
        e.push(
          new t('ProgramChange', 0, 96, a, 0 | this.mmsInstTable[o.instrument])
        ),
        e.push(new t('ControlChange', 0, 154, a, 10, l));
      for (const t in c) {
        if (!Object.prototype.hasOwnProperty.call(c, t)) continue;
        const s = new n({
          timeDivision: this.timeDivision,
          channel: a,
          timeOffset: 386,
          mml: c[t],
        });
        (e = e.concat(s.events)), i.push(s.endTime);
      }
      a++, e.concat(new s('EndOfTrack', 0, Math.max(i))), this.tracks.push(e);
    }
    this.numberOfTracks = this.tracks.length;
  }
  toPlainTrack() {
    for (let e = 0; e < this.tracks.length; e++) {
      let n = [],
        a = [];
      const r = this.tracks[e];
      for (const e of r) {
        let n;
        if (e instanceof t)
          switch (e.subtype) {
            case 'NoteOn':
              n =
                0 === e.parameter2
                  ? new Uint8Array([
                      128 | e.channel,
                      e.parameter1,
                      e.parameter2,
                    ])
                  : new Uint8Array([
                      144 | e.channel,
                      e.parameter1,
                      e.parameter2,
                    ]);
              break;
            case 'NoteOff':
              n = new Uint8Array([128 | e.channel, e.parameter1, e.parameter2]);
              break;
            case 'ControlChange':
              n = new Uint8Array([176 | e.channel, e.parameter1, e.parameter2]);
              break;
            case 'ProgramChange':
              n = new Uint8Array([192 | e.channel, e.parameter1]);
          }
        else if (e instanceof s) {
          const t = this.encoder.encode(e.data);
          switch (e.subtype) {
            case 'TextEvent':
              n = new Uint8Array([255, 1].concat(t));
              break;
            case 'SequenceTrackName':
              n = new Uint8Array([255, 3].concat(t));
              break;
            case 'CopyrightNotice':
              n = new Uint8Array([255, 2].concat(t));
              break;
            case 'InsturumentName':
              n = new Uint8Array([255, 4].concat(t));
              break;
            case 'SetTempo':
              n = new Uint8Array([255, 81].concat(t));
              break;
            case 'TimeSignature':
              n = new Uint8Array([255, 88].concat(t));
              break;
            case 'EndOfTrack':
              n = new Uint8Array([255, 47]);
          }
        } else e instanceof i && (n = new Uint8Array([240, 5].concat(e.data)));
        a = a.concat(n);
      }
      (n = n.concat(a)), (this.plainTracks[e] = n);
    }
  }
}
/**
 * @classdesc Three Macro Language Editor (3MLE) mml file Parser
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */ class u extends p {
  constructor(e, t = {}) {
    super(e, t);
  }
  parse() {
    this.parseHeader(), this.parseTracks(), this.toPlainTrack();
  }
  parseHeader() {
    const e = this.input.Settings;
    (this.encoder = new TextEncoder(e.Encoding || 'shift_jis')),
      (this.title = e.Title),
      (this.author = e.Source),
      (this.timeDivision = 0 | e.TimeBase || 32);
    const t = [];
    t.push(new i('SystemExclusive', 0, 0, [126, 127, 9, 1])),
      t.push(new s('SequenceTrackName', 0, 0, [this.title])),
      t.push(new s('CopyrightNotice', 0, 0, [this.author])),
      t.push(new s('TextEvent', 0, 0, [e.Memo])),
      t.push(
        new s('TimeSignature', 0, 0, [
          0 | e.TimeSignatureNN || 4,
          0 | e.TimeSignatureDD || 4,
          0,
          0,
        ])
      ),
      t.push(new s('EndOfTrack', 0, 0)),
      this.tracks.push(t),
      delete this.input['3MLE EXTENSION'],
      delete this.input.Settings;
  }
  parseTracks() {
    const e = this.input,
      i = [],
      a = [],
      r = [];
    for (const t in this.input)
      Object.prototype.hasOwnProperty.call(this.input, t) &&
        (t.match(/^Channel(\d+)$/i) &&
          (a[(0 | RegExp.$1) - 1] = Object.keys(e[t])
            .join('')
            .replace(/\/\*([^*]|\*[^/])*\*\//g, '')),
        t.match(/^ChannelProperty(\d+)$/i) &&
          (r[(0 | RegExp.$1) - 1] = {
            name: e[t].Name,
            instrument: 0 | e[t].Patch,
            panpot: 0 | e[t].Pan,
          }));
    const o = [];
    for (const t in a)
      Object.prototype.hasOwnProperty.call(a, t) &&
        (void 0 !== r[t]
          ? (o[t] = {
              mml: a[t],
              name: r[t].name || '',
              instrument: r[t].instrument || 0,
              panpot: r[t].panpot || 64,
            })
          : (o[t] = { mml: a[t], name: '', instrument: 0, panpot: 64 }));
    for (const c in o) {
      if (!Object.prototype.hasOwnProperty.call(o, c)) continue;
      const e = 0 | c;
      let a = [];
      if ('' === o[c].mml) return;
      a.push(new s('InsturumentName', 0, 48, [o[c].name])),
        a.push(new t('ProgramChange', 0, 96, e, o[c].instrument)),
        a.push(new t('ControlChange', 0, 154, e, 10, o[c].panpot));
      const r = new n({
        timeDivision: this.timeDivision,
        channel: e,
        timeOffset: 386,
        mml: o[c].mml,
      });
      (a = a.concat(r.events)),
        i.push(r.endTime),
        a.concat(new s('EndOfTrack', 0, Math.max(i))),
        this.tracks.push(a);
    }
    this.numberOfTracks = this.tracks.length;
  }
}
/**
 * @classdesc MapleStory2 Mml Parser
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */ class d extends p {
  constructor(e, t = {}) {
    super(e, t), (this.encoder = new TextEncoder('utf-8'));
    const i = new DOMParser().parseFromString(
      String.fromCharCode.apply('', new Uint16Array(e)),
      'text/xml'
    );
    (this.input = i.querySelectorAll('ms2 > *')),
      (this.tracks = []),
      (this.plainTracks = []),
      (this.numberOfTracks = 1),
      (this.timeDivision = t.timeDivision || 96);
  }
  parse() {
    this.parseTracks(), this.toPlainTrack();
  }
  parseTracks() {
    let e = [];
    const t = [];
    for (const i of this.input) {
      const s = new n({
        timeDivision: this.timeDivision,
        channel: 0,
        mml: this.input[i].textContent.trim(),
        ignoreTempo: !1,
      });
      (e = e.concat(s.events)), t.push(s.endTime);
    }
    e.concat(new s('EndOfTrack', 0, Math.max(t))), this.tracks.push(e);
  }
}
/**
 * @classdesc MabiIcco MML File Parser
 *
 * @author    Logue <logue@hotmail.co.jp>
 * @copyright 2019 Masashi Yoshikawa <https://logue.dev/> All rights reserved.
 * @license   MIT
 */ class m extends p {
  constructor(e, t = {}) {
    super(e, t),
      (this.input =
        String.fromCharCode.apply('', new Uint16Array(e)).split(/\r\n|\r|\n/) ||
        []),
      (this.tracks = []),
      (this.plainTracks = []),
      (this.numberOfTracks = 1),
      (this.timeDivision = t.timeDivision || 96);
  }
  parse() {
    this.parseHeader(), this.parseTracks(), this.toPlainTrack();
  }
  parseHeader() {
    this.encoder = new TextEncoder('utf-8');
    const e = ['mml-track', 'name', 'program', 'songProgram', 'panpot'],
      t = {};
    let n = -1;
    t.track = [];
    for (let i = 0; i < this.input.length; i++) {
      const s = this.input[i].trim();
      if (0 === i) {
        if ('[mml-score]' !== s) throw new Error('Not MabiIcco File.');
        continue;
      }
      const [a, r] = s.split('=');
      e.includes(a)
        ? 'mml-track' === a
          ? (n++, (t.track[n] = {}), (t.track[n].mml = r))
          : (t.track[n][a] = 'name' === a ? r : 0 | r)
        : (t[a] = r);
    }
    (this.title = t.title), (this.author = t.author);
    const a = '' !== t.tempo ? t.tempo.split('T') : [0, 120];
    (this.timeDivision = 96), (this.tempo = 0 | a[1]);
    const r = t.time.split('/'),
      o = [];
    o.push(new i('SystemExclusive', 0, 0, [126, 127, 9, 1])),
      o.push(new s('SequenceTrackName', 0, 0, [this.title])),
      o.push(new s('CopyrightNotice', 0, 0, [this.author])),
      o.push(
        new s('TimeSignature', 0, 0, [0 | r[0] || 4, 0 | r[1] || 4, 0, 0])
      ),
      o.push(new s('SetTempo', 0, 0, [Math.floor(6e7 / this.tempo)])),
      o.push(new s('EndOfTrack', 0, 0)),
      this.tracks.push(o),
      (this.input = t.track);
  }
  parseTracks() {
    let e = [];
    const i = [];
    for (let a = 0; a < this.input.length; a++) {
      const r = this.input[a];
      if (!r.mml.match(/^(?:MML@)(.*)/gm)) continue;
      const o = RegExp.$1.split(',');
      e.push(new s('InsturumentName', 0, 48, [r.name])),
        e.push(new t('ProgramChange', 0, 96, a, r.program)),
        -1 !== r.songProgram &&
          e.push(new t('ProgramChange', 0, 112, 15, r.songProgram)),
        e.push(new t('ControlChange', 0, 154, a, 10, r.panpot));
      for (let t = 0; t < r.mml.length; t++) {
        let s = a;
        if ((3 === t && -1 !== r.songProgram && (s = 15), void 0 === o[t]))
          continue;
        const c = new n({
          timeDivision: this.timeDivision,
          channel: s,
          timeOffset: 386,
          mml: o[t],
          igonoreTempo: 1 === s,
        });
        (e = e.concat(c.events)), i.push(c.endTime);
      }
      e.concat(new s('EndOfTrack', 0, Math.max(i))), this.tracks.push(e);
    }
    this.numberOfTracks = this.tracks.length;
  }
}
const f = { version: '0.4.0', date: '2022-07-10T11:19:20.895Z' };
/**
 * @classdesc Mld Parser Class
 * @author    imaya
 * @license   MIT
 */ class g {
  constructor(e, t = {}) {
    (this.input = e),
      (this.ip = t.index || 0),
      (this.timeDivision = t.timeDivision || 48),
      (this.header = {}),
      (this.dataInformation = {}),
      (this.tracks = []);
  }
  parse() {
    this.parseHeader(), this.parseDataInformation(), this.parseTracks();
  }
  parseHeader() {
    const e = this.input;
    let t = this.ip;
    const i = (this.header = {}),
      s = String.fromCharCode(e[t++], e[t++], e[t++], e[t++]);
    if ('melo' !== s) throw new Error('invalid MFi signature:' + s);
    (i.fileLength =
      ((e[t++] << 24) | (e[t++] << 16) | (e[t++] << 8) | e[t++]) >>> 0),
      (i.trackOffset = ((e[t++] << 16) | e[t++]) + t),
      (i.dataMajorType = e[t++]),
      (i.dataMinorType = e[t++]),
      (i.numberOfTracks = e[t++]),
      (this.ip = t);
  }
  parseDataInformation() {
    const e = this.input;
    let t = this.ip;
    const i = (this.dataInformation = {
      copy: null,
      date: null,
      exst: null,
      note: null,
      prot: null,
      sorc: null,
      titl: null,
      trac: null,
      vers: null,
    });
    let s, n;
    for (; t < this.header.trackOffset; )
      switch (
        ((s = String.fromCharCode(e[t++], e[t++], e[t++], e[t++])),
        (n = (e[t++] << 8) | e[t++]),
        s)
      ) {
        case 'titl':
        case 'copy':
        case 'vers':
        case 'date':
        case 'prot':
          i[s] = String.fromCharCode.apply(null, e.subarray(t, (t += n)));
          break;
        case 'sorc':
          i[s] = e[t++];
          break;
        case 'note':
          i[s] = (e[t++] << 8) | e[t++];
          break;
        case 'exst':
          break;
        default:
          i[s] = e.subarray(t, (t += n));
      }
    this.ip = t;
  }
  parseTracks() {
    const e = this.input;
    let t,
      i,
      s,
      n,
      a,
      r,
      o = this.ip;
    const c = (this.tracks = []);
    let l, h, p;
    const u = () => {
        const t = (e[o++] << 8) | e[o++],
          i = o + t,
          s = [];
        let n;
        if (1 !== e[o++])
          throw new Error('invalid EditInstrument const value:' + e[o - 1]);
        for (; o < i; )
          (n = {}),
            (n.part = (e[o++] >> 4) & 3),
            (n.modulator = {
              ML: e[o] >> 5,
              VIV: (e[o] >> 4) & 1,
              EG: (e[o] >> 3) & 1,
              SUS: (e[o] >> 2) & 1,
              RR: ((3 & e[o++]) << 2) | (e[o] >> 6),
              DR: (e[o] >> 4) & 15,
              AR: ((3 & e[o++]) << 2) | (e[o] >> 6),
              SL: (e[o] >> 4) & 15,
              TL: ((3 & e[o++]) << 4) | (e[o] >> 4),
              WF: (e[o] >> 3) & 1,
              FB: 7 & e[o++],
            }),
            (n.carrier = {
              ML: e[o] >> 5,
              VIV: (e[o] >> 4) & 1,
              EG: (e[o] >> 3) & 1,
              SUS: (e[o] >> 2) & 1,
              RR: ((3 & e[o++]) << 2) | (e[o] >> 6),
              DR: (e[o] >> 4) & 15,
              AR: ((3 & e[o++]) << 2) | (e[o] >> 6),
              SL: (e[o] >> 4) & 15,
              TL: ((3 & e[o++]) << 4) | (e[o] >> 4),
              WF: (e[o] >> 3) & 1,
              FB: 7 & e[o++],
            }),
            (n.octaveSelect = 3 & e[o++]),
            s.push(n);
        return s;
      },
      d = () => {
        if (1 !== e[o++])
          throw new Error('invalid Vibrato const value:' + e[o - 1]);
        return { part: (e[o++] >> 5) & 3, switch: e[o++] >> 6 };
      },
      m = () => {
        const t = (e[o++] << 8) | e[o++],
          i = o + t;
        if (17 !== e[o++])
          throw new Error('invalid DeviceSpecific const value:' + e[o - 1]);
        return { data: e.subarray(o, (o += i - o)) };
      };
    for (h = 0, p = this.header.numberOfTracks; h < p; ++h) {
      if (
        ((t = String.fromCharCode(e[o++], e[o++], e[o++], e[o++])),
        'trac' !== t)
      )
        throw new Error('invalid track signature:' + t);
      for (
        i = (e[o++] << 24) | (e[o++] << 16) | (e[o++] << 8) | e[o++],
          s = o + i,
          l = c[h] = [];
        o < s;

      ) {
        if (
          ((r = {
            key: null,
            length: null,
            octaveShift: null,
            subType: null,
            type: null,
            value: {},
            velocity: null,
            voice: null,
          }),
          (r.deltaTime = e[o++]),
          (n = e[o++]),
          255 !== n)
        )
          (r.type = 'note'),
            (r.subType = 'Note'),
            (r.voice = n >> 6),
            (r.key = 63 & n),
            1 === this.dataInformation.note &&
              ((a = e[o++]), (r.velocity = a >> 2), (r.octaveShift = 3 & a));
        else
          switch (((r.type = 'meta'), (n = e[o++]), n >> 4)) {
            case 11:
              switch (15 & n) {
                case 0:
                  (r.subType = 'MasterVolume'), (r.value = e[o++]);
                  break;
                case 10:
                  (r.subType = 'DrumScale'),
                    (r.value = { channel: (e[o] >> 3) & 7, drum: 1 & e[o++] });
                  break;
                default:
                  throw new Error('unknown message type:' + n.toString(16));
              }
              break;
            case 12:
              (r.subType = 'SetTempo'),
                (r.value = {
                  timeBase:
                    7 == (7 & n)
                      ? NaN
                      : Math.pow(2, 7 & n) * (0 == (8 & n) ? 6 : 15),
                  tempo: e[o++],
                });
              break;
            case 13:
              switch (15 & n) {
                case 0:
                  (r.subType = 'Point'), (r.value = e[o++]);
                  break;
                case 13:
                  (r.subType = 'Loop'),
                    (r.value = {
                      id: e[o] >> 6,
                      count: (e[o] >> 2) & 15,
                      point: 3 & e[o++],
                    });
                  break;
                case 14:
                  (r.subType = 'Nop'), (r.value = e[o++]);
                  break;
                case 15:
                  (r.subType = 'EndOfTrack'), (r.value = e[o++]);
                  break;
                default:
                  throw new Error('unkwnon message type:' + n.toString(16));
              }
              break;
            case 14:
              switch (15 & n) {
                case 0:
                  (r.subType = 'InstrumentLowPart'),
                    (r.value = { part: e[o] >> 6, instrument: 63 & e[o++] });
                  break;
                case 1:
                  (r.subType = 'InstrumentHighPart'),
                    (r.value = { part: e[o] >> 6, instrument: 1 & e[o++] });
                  break;
                case 2:
                  (r.subType = 'Volume'),
                    (r.value = { part: e[o] >> 6, volume: 63 & e[o++] });
                  break;
                case 3:
                  (r.subType = 'Valance'),
                    (r.value = { part: e[o] >> 6, valance: 63 & e[o++] });
                  break;
                case 4:
                  (r.subType = 'PitchBend'),
                    (r.value = { part: e[o] >> 6, value: 63 & e[o++] });
                  break;
                case 5:
                  (r.subType = 'ChannelAssign'),
                    (r.value = { part: e[o] >> 6, channel: 63 & e[o++] });
                  break;
                case 6:
                  (r.subType = 'VolumeChange'),
                    (r.value = {
                      part: e[o] >> 6,
                      volume: ((63 & e[o++]) << 26) >> 26,
                    });
                  break;
                case 7:
                  (r.subType = 'PitchBendRange'),
                    (r.value = { part: e[o] >> 6, value: 63 & e[o++] });
                  break;
                case 9:
                  (r.subType = 'MasterCoarseTuning'),
                    (r.value = { part: e[o] >> 6, value: 63 & e[o++] });
                  break;
                case 10:
                  (r.subType = 'Modulation'),
                    (r.value = { part: e[o] >> 6, depth: 63 & e[o++] });
                  break;
                default:
                  throw new Error('unkwnon message type:' + n.toString(16));
              }
              break;
            case 15:
              switch (15 & n) {
                case 0:
                  (r.subType = 'EditInstrument'), (r.value = u());
                  break;
                case 1:
                  (r.subType = 'Vibrato'), (r.value = d());
                  break;
                case 15:
                  (r.subType = 'DeviceSpecific'), (r.value = m());
                  break;
                default:
                  throw new Error('unkwnon message type:' + n.toString(16));
              }
              break;
            default:
              throw new Error('unkwnon message type:' + n.toString(16));
          }
        l.push(r);
      }
      o = s;
    }
    this.ip = o;
  }
  convertToMidiTracks() {
    this.timeDivision;
    const e = [],
      t = [],
      i = this.tracks;
    let s, n, a, r, o, c, l, h, p, u, d, m, f;
    const g = [];
    let w;
    for (u = 0; u < 16; ++u) (t[u] = []), (g[u] = 0);
    for (u = 0, d = i.length; u < d; ++u) {
      for (s = i[u], r = [], o = c = m = 0, f = s.length; m < f; ++m)
        switch (
          ((n = s[m]), (o += n.deltaTime), (n.id = c), (n.time = o), n.subType)
        ) {
          case 'Nop':
            break;
          case 'Note':
            (r[c++] = n),
              (r[c] = {
                id: c,
                type: 'internal',
                subType: 'NoteOff',
                time: o + n.length,
                key: n.key,
                voice: n.voice,
                velocity: n.velocity,
                octaveShift: n.octaveShift,
              }),
              c++;
            break;
          case 'InstrumentHighPart':
            if (((a = n), (n = s[++m]), 'InstrumentLowPart' !== n.subType))
              throw new Error('broken instrument');
            (r[c] = {
              id: c,
              type: 'internal',
              subType: 'ProgramChange',
              time: o,
              part: n.value.part,
              instrument: (a.value.instrument << 6) | n.value.instrument,
            }),
              c++;
            break;
          default:
            r[c++] = n;
        }
      for (
        r.sort((e, t) =>
          e.time > t.time
            ? 1
            : e.time < t.time
            ? -1
            : e.id > t.id
            ? 1
            : e.id < t.id
            ? -1
            : 0
        ),
          e[u] = [],
          o = m = 0,
          f = r.length;
        m < f;
        ++m
      ) {
        switch (((n = r[m]), (o = n.time), n.subType)) {
          case 'Note':
            (l = this.applyOctaveShift(n.key + 45, n.octaveShift)),
              (w = 4 * u + n.voice),
              9 === w && (l -= 10),
              t[w].push(
                this.deltaTimeToByteArray(o - g[w]).concat(
                  144 | w,
                  l,
                  2 * n.velocity
                )
              );
            break;
          case 'NoteOff':
            (l = this.applyOctaveShift(n.key + 45, n.octaveShift)),
              (w = 4 * u + n.voice),
              9 === w && (l -= 10),
              t[w].push(
                this.deltaTimeToByteArray(o - g[w]).concat(
                  128 | w,
                  l,
                  2 * n.velocity
                )
              );
            break;
          case 'ProgramChange':
            (w = 4 * u + n.part),
              t[w].push(
                this.deltaTimeToByteArray(o - g[w]).concat(
                  192 | w,
                  n.instrument
                )
              );
            break;
          case 'SetTempo':
            (h = 288e7 / (n.value.tempo * n.value.timeBase)),
              (w = 0),
              t[w].push(
                this.deltaTimeToByteArray(o - g[w]).concat(
                  255,
                  81,
                  3,
                  (h >> 16) & 255,
                  (h >> 8) & 255,
                  255 & h
                )
              );
            break;
          case 'Loop':
            (h = n.value.count),
              (p =
                'LOOP_' +
                (0 === n.value.point ? 'START' : 'END') +
                '=ID:' +
                n.value.id +
                ',COUNT:' +
                (0 === h ? -1 : h)),
              (w = 0),
              t[w].push(
                this.deltaTimeToByteArray(o - g[w]).concat(
                  [255, 6, p.length],
                  p.split('').map(e => e.charCodeAt(0))
                )
              );
            break;
          case 'MasterVolume':
            (h = n.value),
              (w = 0),
              t[w].push(
                this.deltaTimeToByteArray(o - g[w]).concat(
                  240,
                  7,
                  127,
                  127,
                  4,
                  1,
                  h,
                  h,
                  247
                )
              );
            break;
          case 'Modulation':
            (w = 4 * u + n.value.part),
              t[w].push(
                this.deltaTimeToByteArray(o - g[w]).concat(
                  176 | w,
                  1,
                  2 * n.value.depth
                )
              );
            break;
          case 'Volume':
            (w = 4 * u + n.value.part),
              t[w].push(
                this.deltaTimeToByteArray(o - g[w]).concat(
                  176 | w,
                  7,
                  2 * n.value.volume
                )
              );
            break;
          case 'Valance':
            (w = 4 * u + n.value.part),
              t[w].push(
                this.deltaTimeToByteArray(o - g[w]).concat(
                  176 | w,
                  10,
                  2 * (n.value.valance - 32) + 64
                )
              );
            break;
          case 'PitchBend':
            (w = 4 * u + n.value.part),
              t[w].push(
                this.deltaTimeToByteArray(o - g[w]).concat(
                  224 | w,
                  2 * n.value.value,
                  2 * n.value.value
                )
              );
            break;
          case 'PitchBendRange':
            (w = 4 * u + n.value.part),
              t[w].push(
                this.deltaTimeToByteArray(o - g[w]).concat(176 | w, 100, 0),
                [0, 176 | w, 101, 0],
                [0, 176 | w, 6, 2 * n.value.value]
              );
            break;
          case 'MasterCoarseTuning':
            (w = 4 * u + n.value.part),
              t[w].push(
                this.deltaTimeToByteArray(o - g[w]).concat(176 | w, 100, 0),
                [0, 176 | w, 101, 2],
                [0, 176 | w, 6, 2 * n.value.value]
              );
            break;
          default:
            continue;
        }
        g[w] = n.time;
      }
    }
    return this.toSMF(t);
  }
  applyOctaveShift(e, t) {
    const i = [0, 12, -24, -12];
    if (void 0 !== i[t]) return e + i[t];
    throw new Error('invalid OctaveShift value:' + t);
  }
  toSMF(e) {
    let t,
      i,
      s,
      n,
      a,
      r,
      o = [77, 84, 104, 100, 0, 0, 0, 6, 0, 1, 0, 16, 0, 48];
    if (void 0 !== this.dataInformation.copy) {
      let t = (function (e) {
        let t;
        const i = e.length,
          s = new Array(i);
        for (t = 0; t < i; ++t) s[t] = e.charCodeAt(t);
        return s;
      })(this.dataInformation.copy);
      (n = t.length),
        (t = [0, 255, 2].concat(this.deltaTimeToByteArray(n), t)),
        e[0].unshift(t);
    }
    for (s = 0, n = e.length; s < n; ++s) {
      const n = e[s];
      for (i = [], a = 0, r = n.length; a < r; ++a)
        Array.prototype.push.apply(i, n[a]);
      (r = i.length),
        (t = [
          77,
          84,
          114,
          107,
          (r >> 24) & 255,
          (r >> 16) & 255,
          (r >> 8) & 255,
          255 & r,
        ]),
        (o = o.concat(t, i));
    }
    return new Uint8Array(o);
  }
  deltaTimeToByteArray(e) {
    const t = [];
    for (; e >= 128; )
      t.unshift((127 & e) | (0 === t.length ? 0 : 128)), (e >>>= 7);
    return t.unshift(e | (0 === t.length ? 0 : 128)), t;
  }
}
/**
 * @classdesc Riff Parser class
 * @author    imaya
 * @license   MIT
 */ class w {
  constructor(e, t = {}) {
    (this.input = e),
      (this.ip = t.index || 0),
      (this.length = t.length || e.length - this.ip),
      (this.chunkList = []),
      (this.offset = this.ip),
      (this.padding = void 0 === t.padding || t.padding),
      (this.bigEndian = void 0 !== t.bigEndian && t.bigEndian);
  }
  parse() {
    const e = this.length + this.offset;
    for (this.chunkList = []; this.ip < e; ) this.parseChunk();
  }
  parseChunk() {
    const e = this.input;
    let t,
      i = this.ip;
    this.chunkList.push(
      new y(
        String.fromCharCode(e[i++], e[i++], e[i++], e[i++]),
        (t = this.bigEndian
          ? ((e[i++] << 24) | (e[i++] << 16) | (e[i++] << 8) | e[i++]) >>> 0
          : (e[i++] | (e[i++] << 8) | (e[i++] << 16) | (e[i++] << 24)) >>> 0),
        i
      )
    ),
      (i += t),
      this.padding && 1 == ((i - this.offset) & 1) && i++,
      (this.ip = i);
  }
  getChunk(e) {
    const t = this.chunkList[e];
    return void 0 === t ? null : t;
  }
  getNumberOfChunks() {
    return this.chunkList.length;
  }
}
class y {
  constructor(e, t, i) {
    (this.type = e), (this.size = t), (this.offset = i);
  }
}
/**
 * @classdesc Standard Midi File Parser class
 * @author    imaya
 * @license   MIT
 */ class v {
  constructor(e, t = {}) {
    (t.padding = !1),
      (t.bigEndian = !0),
      (this.input = e),
      (this.ip = t.index || 0),
      (this.chunkIndex = 0),
      (this.riffParser_ = new w(e, t)),
      (this.formatType = 0),
      (this.numberOfTracks = 0),
      (this.timeDivision = 480),
      (this.tracks = []),
      (this.plainTracks = []),
      (this.version = f.version),
      (this.build = f.build);
  }
  parse() {
    let e = 0,
      t = 0;
    for (
      this.riffParser_.parse(),
        this.parseHeaderChunk(),
        e = 0,
        t = this.numberOfTracks;
      e < t;
      ++e
    )
      this.parseTrackChunk();
  }
  parseHeaderChunk() {
    const e = this.riffParser_.getChunk(this.chunkIndex++),
      t = this.input;
    let i = e.offset;
    if (!e || 'MThd' !== e.type) throw new Error('invalid header signature');
    (this.formatType = (t[i++] << 8) | t[i++]),
      (this.numberOfTracks = (t[i++] << 8) | t[i++]),
      (this.timeDivision = (t[i++] << 8) | t[i++]);
  }
  parseTrackChunk() {
    const e = this.riffParser_.getChunk(this.chunkIndex++),
      n = this.input;
    let a,
      r,
      o = e.offset,
      c = 0,
      l = 0,
      h = 0,
      p = 0,
      u = -1,
      d = -1,
      m = 0,
      f = 0,
      g = 0,
      w = 0,
      y = 0;
    const v = () => {
      let e = 0;
      m = 0;
      do {
        (m = n[o++]), (e = (e << 7) | (127 & m));
      } while (0 != (128 & m));
      return e;
    };
    if (!e || 'MTrk' !== e.type) throw new Error('invalid header signature');
    c = e.offset + e.size;
    const k = [],
      b = [];
    for (; o < c; ) {
      (l = v()),
        (f += l),
        (g = o),
        (y = n[o++]),
        (h = (y >> 4) & 15),
        (p = 15 & y),
        h < 8
          ? ((h = u), (p = d), (y = (u << 4) | d), o--, g--)
          : ((u = h), (d = p));
      const e = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        'NoteOff',
        'NoteOn',
        'NoteAftertouch',
        'ControlChange',
        'ProgramChange',
        'ChannelAftertouch',
        'PitchBend',
      ];
      switch (h) {
        case 8:
        case 9:
        case 10:
        case 11:
        case 13:
        case 14:
          a = new t(e[h], l, f, p, n[o++], n[o++]);
          break;
        case 12:
          a = new t(e[h], l, f, p, n[o++]);
          break;
        case 15:
          switch (p) {
            case 0:
              if (((m = v()), 247 !== n[o + m - 1]))
                throw new Error('invalid SysEx event');
              a = new i('SystemExclusive', l, f, n.subarray(o, (o += m) - 1));
              break;
            case 7:
              (m = v()),
                (a = new i(
                  'SystemExclusive(F7)',
                  l,
                  f,
                  n.subarray(o, (o += m))
                ));
              break;
            case 15:
              switch (((h = n[o++]), (m = v()), h)) {
                case 0:
                  a = new s('SequenceNumber', l, f, [n[o++], n[o++]]);
                  break;
                case 1:
                  a = new s('TextEvent', l, f, [
                    String.fromCharCode.apply(null, n.subarray(o, (o += m))),
                  ]);
                  break;
                case 2:
                  a = new s('CopyrightNotice', l, f, [
                    String.fromCharCode.apply(null, n.subarray(o, (o += m))),
                  ]);
                  break;
                case 3:
                  a = new s('SequenceTrackName', l, f, [
                    String.fromCharCode.apply(null, n.subarray(o, (o += m))),
                  ]);
                  break;
                case 4:
                  a = new s('InstrumentName', l, f, [
                    String.fromCharCode.apply(null, n.subarray(o, (o += m))),
                  ]);
                  break;
                case 5:
                  a = new s('Lyrics', l, f, [
                    String.fromCharCode.apply(null, n.subarray(o, (o += m))),
                  ]);
                  break;
                case 6:
                  a = new s('Marker', l, f, [
                    String.fromCharCode.apply(null, n.subarray(o, (o += m))),
                  ]);
                  break;
                case 7:
                  a = new s('CuePoint', l, f, [
                    String.fromCharCode.apply(null, n.subarray(o, (o += m))),
                  ]);
                  break;
                case 32:
                  a = new s('MidiChannelPrefix', l, f, [n[o++]]);
                  break;
                case 47:
                  a = new s('EndOfTrack', l, f, []);
                  break;
                case 81:
                  a = new s('SetTempo', l, f, [
                    (n[o++] << 16) | (n[o++] << 8) | n[o++],
                  ]);
                  break;
                case 84:
                  a = new s('SmpteOffset', l, f, [
                    n[o++],
                    n[o++],
                    n[o++],
                    n[o++],
                    n[o++],
                  ]);
                  break;
                case 88:
                  a = new s('TimeSignature', l, f, [
                    n[o++],
                    n[o++],
                    n[o++],
                    n[o++],
                  ]);
                  break;
                case 89:
                  a = new s('KeySignature', l, f, [n[o++], n[o++]]);
                  break;
                case 127:
                  a = new s('SequencerSpecific', l, f, [
                    n.subarray(o, (o += m)),
                  ]);
                  break;
                default:
                  a = new s('Unknown', l, f, [h, n.subarray(o, (o += m))]);
              }
          }
          break;
        default:
          throw new Error('invalid status');
      }
      (w = o - g),
        (r = n.subarray(g, g + w)),
        (r[0] = y),
        a instanceof t &&
          'NoteOn' === a.subtype &&
          0 === a.parameter2 &&
          ((a.subtype = e[8]),
          (r = new Uint8Array([128 | a.channel, a.parameter1, a.parameter2]))),
        b.push(r),
        k.push(a);
    }
    this.tracks.push(k), this.plainTracks.push(b);
  }
}
/**
 * @classdesc Midi Player Class
 * @author    imaya
 * @license   MIT
 */ const k = {
  Player: class {
    constructor(e = '#wml') {
      (this.tempo = 5e5),
        (this.webMidiLink = null),
        (this.resume = 0),
        (this.pause = !0),
        (this.ready = !1),
        (this.position = 0),
        (this.track = []),
        (this.timer = 0),
        (this.sequence = {}),
        (this.enableCC111Loop = !1),
        (this.enableFalcomLoop = !1),
        (this.enableMFiLoop = !1),
        (this.enableLoop = !1),
        (this.tempoRate = 1),
        (this.masterVolume = 16383),
        (this.textEvent = ''),
        (this.sequenceName = ''),
        (this.copyright = ''),
        (this.lyrics = ''),
        (this.webMidiLink = null),
        (this.length = 0),
        (this.time = 0),
        (this.timeTotal = 0),
        (this.loaded = 0),
        (this.window = window),
        (this.target = this.window.document.querySelector(e)),
        (this.version = f.version),
        (this.build = f.build);
    }
    setCC111Loop(e) {
      this.enableCC111Loop = e;
    }
    setFalcomLoop(e) {
      this.enableFalcomLoop = e;
    }
    setMFiLoop(e) {
      this.enableMFiLoop = e;
    }
    setLoop(e) {
      this.enableLoop = e;
    }
    stop() {
      let e;
      if (
        ((this.pause = !0),
        (this.resume = window.performance.now()),
        this.webMidiLink)
      )
        for (e = 0; e < 16; ++e)
          this.webMidiLink.contentWindow.postMessage(
            'midi,b' + e.toString(16) + ',78,0',
            '*'
          );
    }
    getWebMidiLink() {
      return this.webMidiLink;
    }
    init() {
      this.stop(),
        this.initSequence(),
        (this.pause = !0),
        (this.track = null),
        (this.resume = -1),
        (this.text = null),
        (this.sequence = null),
        (this.sequenceName = null),
        (this.copyright = null),
        (this.lyrics = null),
        (this.textEvent = null),
        (this.length = 0),
        (this.position = 0),
        (this.time = 0),
        (this.timeTotal = 0),
        this.window.clearTimeout(this.timer);
      const e = this;
      this.ready
        ? this.sendInitMessage()
        : this.window.addEventListener(
            'message',
            t => {
              'link,ready' === t.data && e.sendInitMessage();
            },
            !1
          );
    }
    initSequence() {
      (this.tempo = 5e5),
        (this.position = 0),
        this.sendInitMessage(),
        (this.pause = !1);
    }
    play() {
      const e = this;
      if (!this.webMidiLink) throw new Error('WebMidiLink not found');
      this.ready
        ? this.track &&
          ((this.length = this.track.length),
          this.track instanceof Array &&
            this.position >= this.length &&
            (this.position = 0),
          this.playSequence())
        : this.window.addEventListener(
            'message',
            t => {
              'link,ready' === t.data &&
                ((e.ready = !0),
                (e.webMidiLink.style.height =
                  this.webMidiLink.contentWindow.document.body.scrollHeight +
                  'px'),
                e.playSequence());
            },
            !1
          );
    }
    onSequenceEnd() {
      this.webMidiLink.contentWindow.postMessage('endoftrack', '*');
    }
    sendInitMessage() {
      const e = this.webMidiLink.contentWindow;
      let t;
      for (t = 0; t < 16; ++t)
        e.postMessage('midi,b' + t.toString(16) + ',128,0', '*'),
          e.postMessage('midi,b' + t.toString(16) + ',07,64', '*'),
          e.postMessage('midi,b' + t.toString(16) + ',0a,40', '*'),
          e.postMessage('midi,e' + t.toString(16) + ',00,40', '*'),
          e.postMessage('midi,b' + t.toString(16) + ',64,00', '*'),
          e.postMessage('midi,b' + t.toString(16) + ',65,00', '*'),
          e.postMessage('midi,b' + t.toString(16) + ',06,02', '*'),
          e.postMessage('midi,b' + t.toString(16) + ',26,00', '*');
      this.sendGmReset();
    }
    setWebMidiLink(e = './wml.html') {
      const t = this,
        i = e => {
          if ('string' == typeof e.data) {
            const i = e.data.split(',');
            'link' === i[0] &&
              ('ready' === i[1]
                ? ((t.ready = !0),
                  (t.loaded = 100),
                  t.setMasterVolume(t.masterVolume))
                : 'progress' === i[1] &&
                  (t.loaded = Math.round((i[2] / i[3]) * 1e4)));
          }
        };
      if ('string' == typeof e) {
        this.webMidiLink &&
          this.webMidiLink.parentNode.removeChild(this.webMidiLink),
          this.target.firstChild &&
            this.target.removeChild(this.target.firstChild);
        const t = (this.webMidiLink =
          this.window.document.createElement('iframe'));
        (t.src = e),
          (t.className = 'wml'),
          this.target.appendChild(t),
          this.window.addEventListener('message', i, !1);
        const s = () => {
          t.style.height =
            this.webMidiLink.contentWindow.document.body.scrollHeight + 'px';
        };
        this.window.addEventListener('load', s, !1);
        let n = 0;
        this.window.addEventListener(
          'resize',
          () => {
            n > 0 && clearTimeout(n), (n = setTimeout(s, 100));
          },
          !1
        );
      } else this.webMidiLink.addEventListener('message', i, !1);
    }
    setMasterVolume(e) {
      (this.masterVolume = e),
        this.webMidiLink &&
          this.webMidiLink.contentWindow.postMessage(
            'midi,f0,7f,7f,04,01,' +
              [
                ('0' + (127 & e).toString(16)).substr(-2),
                ('0' + ((e >> 7) & 127).toString(16)).substr(-2),
                '7f',
              ].join(','),
            '*'
          );
    }
    setTempoRate(e) {
      this.tempoRate = e;
    }
    playSequence() {
      const e = this,
        t = this.sequence.timeDivision,
        i = this.track,
        s = this.webMidiLink.contentWindow;
      let n = this.position || 0;
      const a = [],
        r = () => {
          const o = i[n].time,
            c = i.length;
          let l,
            h,
            p,
            u = window.performance.now();
          if (!e.pause) {
            do {
              switch (((l = i[n].event), l.subtype)) {
                case 'TextEvent':
                  e.textEvent = l.data[0];
                  break;
                case 'Lyrics':
                  e.lyrics = l.data[0];
                  break;
                case 'Maker':
                  if (e.enableFalcomLoop)
                    switch (l.data[0]) {
                      case 'A':
                        a[0] = { pos: n };
                        break;
                      case 'B':
                        if (a[0] && 'number' == typeof a[0].pos)
                          return (
                            (n = a[0].pos),
                            (e.timer = e.window.setTimeout(r, 0)),
                            void (e.position = n)
                          );
                    }
                  if (
                    e.enableMFiLoop &&
                    ((h = l.data[0].match(
                      /^LOOP_(START|END)=ID:(\d+),COUNT:(-?\d+)$/
                    )),
                    h)
                  )
                    if ('START' === h[1])
                      a[0 | h[2]] = a[h[2]] || { pos: n, count: 0 | h[3] };
                    else if ('END' === h[1] && e.enableMFiLoop) {
                      if (((p = a[0 | h[2]]), 0 !== p.count))
                        return (
                          p.count > 0 && p.count--,
                          (n = p.pos),
                          (e.timer = e.window.setTimeout(r, 0)),
                          void (e.position = n)
                        );
                      a[0 | h[2]] = null;
                    }
                  break;
                case 'SetTempo':
                  e.tempo = l.data[0];
              }
              'ControlChange' === l.subtype &&
                111 === l.parameter1 &&
                (a[0] = { pos: n }),
                s.postMessage(i[n++].webMidiLink, '*');
            } while (n < c && i[n].time === o);
            return (
              n < c
                ? ((u = window.performance.now() - u),
                  (e.timer = e.window.setTimeout(
                    r,
                    (e.tempo / (1e3 * t)) *
                      (i[n].time - o - u) *
                      (1 / e.tempoRate)
                  )))
                : ((e.pause = !0),
                  e.enableCC111Loop && a[0] && 'number' == typeof a[0].pos
                    ? (n = a[0].pos)
                    : e.enableLoop && (e.initSequence(), e.playSequence())),
              (e.position = n),
              (e.time = o),
              this.timeTotal === o ? (this.onSequenceEnd(), 2) : void 0
            );
          }
          e.resume = u - e.resume;
        };
      this.pause
        ? ((this.timer = e.window.setTimeout(r, this.resume)),
          (this.pause = !1),
          (this.resume = -1))
        : (this.timer = e.window.setTimeout(
            r,
            (this.tempo / 1e3) * t * this.track[0].time
          ));
    }
    loadMidiFile(e) {
      const t = new v(e);
      this.init(), t.parse(), this.mergeMidiTracks(t);
    }
    loadMldFile(e) {
      const t = new g(e);
      this.init(), t.parse(), this.mergeMidiTracks(t.convertToMidiTracks());
    }
    loadMs2MmlFile(e) {
      const t = new d(e);
      this.init(), t.parse(), this.mergeMidiTracks(t);
    }
    loadMakiMabiSequenceFile(e) {
      const t = new p(e);
      this.init(), t.parse(), this.mergeMidiTracks(t);
    }
    load3MleFile(e) {
      const t = new u(e);
      this.init(), t.parse(), this.mergeMidiTracks(t);
    }
    loadMabiIccoFile(e) {
      const t = new m(e);
      this.init(), t.parse(), this.mergeMidiTracks(t);
    }
    mergeMidiTracks(e) {
      const t = (this.track = []),
        i = e.tracks,
        s = new Array(i.length),
        n = e.plainTracks;
      let a, r, o, c, l;
      for (r = 0, o = i.length; r < o; ++r) s[r] = 0;
      for (r = 0, o = i.length; r < o; ++r)
        for (a = i[r], c = 0, l = a.length; c < l; ++c)
          (0 !== e.formatType && 0 !== r) ||
            ('SequenceTrackName' === a[c].subtype
              ? (this.sequenceName = a[c].data[0])
              : 'CopyrightNotice' === a[c].subtype &&
                (this.copyright = a[c].data[0])),
            t.push({
              track: r,
              eventId: c,
              time: a[c].time,
              event: a[c],
              webMidiLink:
                'midi,' +
                Array.prototype.map
                  .call(n[r][c], e => e.toString(16))
                  .join(','),
            });
      t.sort((e, t) =>
        e.time > t.time
          ? 1
          : e.time < t.time
          ? -1
          : e.track > t.track
          ? 1
          : e.track < t.track
          ? -1
          : e.eventId > t.eventId
          ? 1
          : e.eventId < t.eventId
          ? -1
          : 0
      ),
        (this.timeTotal = t.slice(-1)[0].time),
        (this.sequence = e);
    }
    getSequenceName() {
      return this.sequenceName;
    }
    getCopyright() {
      return this.copyright;
    }
    getLyrics() {
      return this.lyrics;
    }
    getTextEvent() {
      return this.textEvent;
    }
    getPosition() {
      return this.position;
    }
    setPosition(e) {
      this.position = e;
    }
    getLength() {
      return this.length;
    }
    sendGmReset() {
      this.webMidiLink &&
        this.webMidiLink.contentWindow.postMessage(
          'midi,F0,7E,7F,09,01,F7',
          '*'
        );
    }
    sendAllSoundOff() {
      this.webMidiLink &&
        this.webMidiLink.contentWindow.postMessage('midi,b0,78,0', '*');
    }
    getTempo() {
      return Math.floor(60 / (this.tempo / 1e6));
    }
    tick2time(e) {
      const t = (e * (this.tempo / 1e6 / this.sequence.timeDivision)) | 0,
        i = t % 3600,
        s = i % 60;
      return (
        Math.floor(t / 3600) +
        ':' +
        Math.floor(i / 60)
          .toString()
          .padStart(2, '0') +
        ':' +
        Math.ceil(s).toString().padStart(2, '0')
      );
    }
    getTime() {
      return this.tick2time(this.time);
    }
    getTotalTime() {
      return this.tick2time(this.timeTotal);
    }
  },
  Parser: v,
};
window.SMF || (window.SMF = k);
var b = !1;
const T = queryString.parse(window.location.hash),
  C = new k.Player('#wml');
/iP(hone|(o|a)d)/.test(navigator.userAgent);
const M = ['.mid', '.midi', '.mld', '.mml', '.mms', '.mmi', '.mp2mml'];
$('#progress'),
  (window.requestFileSystem =
    window.requestFileSystem || window.webkitRequestFileSystem),
  $(document).ready(function () {
    var e;
    ($(':input').attr('disabled', 'disabled'),
    (window.AudioContext =
      window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext),
    void 0 !== window.AudioContext)
      ? 'file:' !== location.protocol
        ? (C.setLoop($('#playerloop').is(':checked')),
          C.setCC111Loop($('#cc111loop').is(':checked')),
          C.setFalcomLoop($('#falcomloop').is(':checked')),
          C.setMFiLoop($('#mfiloop').is(':checked')),
          C.setTempoRate($('#tempo').val()),
          C.setMasterVolume(16383 * $('#volume').val()),
          C.setWebMidiLink('http://logue.dev/sf2synth.js/wml.html', 'wml'),
          [].slice
            .call(document.querySelectorAll('#control-tab button'))
            .forEach(function (e) {
              var t = new bootstrap.Tab(e);
              e.addEventListener('click', function (e) {
                e.preventDefault(), t.show();
              });
            }),
          $('#files').on('change', function (e) {
            x(this);
          }),
          $('#zips').on('change', function (e) {
            S($(this).val());
          }),
          T.zip && !E
            ? ($('#zips').val(T.zip), S(T.zip))
            : (((e = document.getElementById('zips')).selectedIndex = ~~(
                e.length * Math.random()
              )),
              x(e),
              S($('#zips').val())),
          $('#player *')
            .on('drop', function (e) {
              var t, i;
              e.originalEvent.dataTransfer &&
                e.originalEvent.dataTransfer.files.length &&
                (e.preventDefault(),
                e.stopPropagation(),
                (t = e.originalEvent.dataTransfer.files[0]),
                (i = new FileReader()),
                C.sendGmReset(),
                (i.onload = function (e) {
                  var i = new Uint8Array(e.target.result);
                  O(t.name, i),
                    ($('#info p').text = 'Ready.'),
                    $('#info')
                      .removeClass('alert-warning')
                      .addClass('alert-success');
                }),
                (i.onloadstart = function (e) {
                  $('#info')
                    .removeClass('alert-success')
                    .addClass('alert-warning');
                }),
                (i.onprogress = function (e) {
                  if (e.lengthComputable) {
                    var t = (e.loaded / e.total) | 0;
                    $('#info div div')
                      .css('width', t + '%')
                      .text(t + '%');
                  }
                }),
                i.readAsArrayBuffer(t)),
                $('#player').removeClass('text-white bg-danger');
            })
            .on('dragover', function (e) {
              e.preventDefault(),
                e.stopPropagation(),
                $('#player').addClass('text-white bg-danger');
            })
            .on('dragleave', function (e) {
              e.preventDefault(),
                e.stopPropagation(),
                $('#player').removeClass('text-white bg-danger');
            }),
          $('#tempo').on('change', function () {
            var e = $(this).val();
            C.setTempoRate(e), $('#tempo_value').text(e);
          }),
          $('#volume').on('change', function () {
            var e = $(this).val();
            C.setMasterVolume(16383 * e), $('#volume_value').text(e);
          }),
          $('#prev').on('click', function () {
            var e = $('#files').prop('selectedIndex');
            e == $('#files option').length
              ? $('#files').prop('selectedIndex', $('#files option').length)
              : $('#files').prop('selectedIndex', e - 1),
              x(document.getElementById('files'));
          }),
          $('#next').on('click', function () {
            var e = $('#files').prop('selectedIndex');
            e == $('#files option').length
              ? $('#files').prop('selectedIndex', 0)
              : $('#files').prop('selectedIndex', e + 1),
              x(document.getElementById('files'));
          }),
          $('#play').on('click', function () {
            C.pause ? C.play() : C.stop();
          }),
          $('#stop').on('click', function () {
            x(document.getElementById('files')),
              history.pushState('', document.title, window.location.pathname),
              setTimeout(function () {
                C.stop();
              }, 51);
          }),
          $('#panic').on('click', function () {
            C.sendAllSoundOff();
          }),
          $('#download').on('click', function () {
            for (
              var e = document.getElementById('files'),
                t =
                  e.querySelectorAll('option')[e.selectedIndex].dataset
                    .midiplayerFilename,
                i = '',
                s = new Uint8Array(e.zip.decompress(t)),
                n = s.byteLength,
                a = 0;
              a < n;
              a++
            )
              i += String.fromCharCode(s[a]);
            window.location.href = 'data:audio/midi;base64,' + window.btoa(i);
          }),
          $('#synth').on('change', function (e) {
            C.stop(), C.setWebMidiLink($(this).val(), 'wml');
          }),
          $('*[title]').tooltip())
        : $('#info')
            .addClass('alert-danger')
            .removeClass('alert-warning')
            .text('This program require runs by server.')
      : $('#info')
          .addClass('alert-danger')
          .removeClass('alert-warning')
          .text(
            'Your browser has not supported AudioContent function. Please use Firefox or Blink based browser. (such as Chrome)'
          );
  }),
  $('#info');
var E = !1;
function S(e) {
  $(':input').attr('disabled', 'disabled');
  const t = e => {
    for (
      var t = new Uint8Array(e), i = document.getElementById('files');
      i.firstChild;

    )
      i.removeChild(i.firstChild);
    var s = (i.zip = new Zlib.Unzip(t)).getFilenames().sort();
    $('#info div')
      .removeClass('progress-warning')
      .addClass('progress-info')
      .show(),
      s.forEach(function (e, t) {
        var n = e.slice(e.lastIndexOf('.')).toLowerCase(),
          a = Math.round((t / s.length) * 1e4);
        if (
          ($('#info p').text('Parsing zip file...'),
          $('#info div div')
            .css('width', a)
            .text(a + '%'),
          '/' !== n && M.includes(n))
        ) {
          var r = document.createElement('option');
          (r.textContent = Encoding.convert(e, 'UNICODE', 'AUTO')),
            r.setAttribute('data-midiplayer-filename', e),
            i.appendChild(r);
        }
      });
    for (var n = i.selectedIndex, a = n; n == a; )
      a = ~~(i.length * Math.random());
    (i.selectedIndex = a),
      $('#info p').text('Ready.'),
      $('#info div').removeClass('progress-info').hide(),
      $('#info').removeClass('alert-warning').addClass('alert-success'),
      $(':input').removeAttr('disabled '),
      T.file &&
        !E &&
        ($('#files').val(T.file), x(document.getElementById('files'))),
      (E = !0);
  };
  window.caches.open('zip').then(i => {
    i.match(e)
      .then(e => e.arrayBuffer())
      .then(e => t(e))
      .catch(() => {
        fetch(e)
          .then(t => {
            if (!t.ok) throw new Error('Network response was not ok.');
            const s = t.clone();
            return i.put(e, t), s.arrayBuffer();
          })
          .then(e => t(e))
          .catch(e => {});
      });
  }),
    $(':input').attr('disabled', '');
}
function x(e) {
  var t =
    e.querySelectorAll('option')[e.selectedIndex].dataset.midiplayerFilename;
  if (t) {
    O(t, e.zip.decompress(t));
    var i = document.getElementById('files').value;
    (i = i.substr(0, i.lastIndexOf('.'))),
      (document.title =
        i + ' ' + document.getElementById('zips').value + ' / SMF.Player');
    var s =
      '#zip=' +
      encodeURIComponent($('#zips').val()) +
      '&file=' +
      encodeURIComponent(t);
    if (
      ($('link[rel="canonical"]').attr('href'),
      $('#music_title').val(
        Encoding.convert(C.getSequenceName(1), 'UNICODE', 'AUTO')
      ),
      $('#copyright').val(
        Encoding.convert(C.getCopyright(), 'UNICODE', 'AUTO')
      ),
      window.history && window.history.pushState)
    )
      return window.history.pushState(document.title, null, s), !1;
  }
}
function O(e, t) {
  switch (
    (C.stop(),
    C.sendAllSoundOff(),
    C.sendGmReset(),
    $('#lyrics').html(''),
    e.split('.').pop().toLowerCase())
  ) {
    case 'midi':
    case 'mid':
      C.loadMidiFile(t);
      break;
    case 'mld':
      C.loadMldFile(t);
      break;
    case 'ms2mml':
      C.loadMs2MmlFile(t);
      break;
    case 'mms':
      C.loadMakiMabiSequenceFile(t);
      break;
    case 'mml':
      C.load3MleFile(t);
      break;
    case 'mmi':
      C.loadMabiIccoFile(t);
  }
  C.setMasterVolume(16383 * $('#volume').val()),
    $('#time-total').text(C.getTotalTime()),
    setTimeout(function () {
      C.play();
    }, 1e3);
}
$(window).on('message', function (e) {
  var t;
  switch (e.originalEvent.data) {
    case 'endoftrack':
      var i = $('#music').prop('selectedIndex');
      if (
        (C.stop(),
        $('#play')
          .html('<em class="bi bi-play"></em>')
          .removeClass('btn-success')
          .addClass('btn-primary'),
        $('#random').is(':checked'))
      )
        ((t = document.getElementById('files')).selectedIndex = ~~(
          t.length * Math.random()
        )),
          x(t);
      else
        0 !== (i = $('#files').prop('selectedIndex')) &&
          (i == $('#files option').length
            ? $('#files').prop('selectedIndex', 0)
            : $('#files').prop('selectedIndex', i + 1),
          x(document.getElementById('files')));
      break;
    case 'progress':
      $('#info p').text('Loading soundfont...');
      break;
    case 'link,ready':
      (b = !0),
        document.querySelector('#random').checked &&
          x(document.querySelector('#files')),
        $('#info').addClass('alert-success').removeClass('alert-warning'),
        $('#info p').text('Ready.'),
        $(':input').prop('disabled', !1);
  }
});
let L = '',
  I = '',
  A = '';
setInterval(function () {
  if (b) {
    C.pause
      ? $('#play')
          .html('<em class="bi bi-play"></em>')
          .removeClass('btn-success')
          .addClass('btn-primary')
      : $('#play')
          .html('<wm class="bi bi-pause"></em>')
          .removeClass('btn-primary')
          .addClass('btn-success');
    var e = ((C.getPosition() / C.getLength()) * 100) | 0;
    $('#music-progress .progress-bar')
      .css('width', e + '%')
      .text(e + '%'),
      $('#time-now').text(C.getTime()),
      $('#current-tempo').text(C.getTempo());
    let i = C.getLyrics();
    if (
      (i &&
        0 !== i.length &&
        L !== i &&
        ((A = ''),
        $('#lyrics').html(''),
        i
          .replace(/\//g, '<br />')
          .replace(/\>/g, '    ')
          .replace(/\&m/g, '👨‍🎤')
          .replace(/\&f/g, '👩‍🎤')
          .replace(/\&c/g, '👫'),
        (A += i),
        $('#lyrics').html(Encoding.convert(A, 'UNICODE', 'AUTO'))),
      I !== C.getTextEvent() &&
        $('#text_event').val(
          Encoding.convert(C.getTextEvent(), 'UNICODE', 'AUTO')
        ),
      (L = C.getLyrics()),
      (I = C.getTextEvent()),
      100 === e)
    ) {
      var t = $('#files').prop('selectedIndex');
      t == $('#files option').length
        ? $('#files').prop('selectedIndex', 0)
        : $('#files').prop('selectedIndex', t + 1),
        x(document.getElementById('files'));
    }
  }
}, 600);
