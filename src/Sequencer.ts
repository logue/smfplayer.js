import { MetaEvent, MidiEvent, ChannelEvent } from '@/MidiEvent';
import { SmfParser, MldParser } from '@/parser';
import { MldMidiTracks } from '@/parser/MldParser';
import {
  MabiIcco,
  MakiMabiSequence,
  MapleStory2Mml,
  ThreeMacroLanguageEditor,
} from '@/parser/mml';
import ParserInterface from './interfaces/ParserInterface';

export interface MergedTrackItem {
  track: number;
  eventId: number;
  time: number;
  event: MidiEvent;
  webMidiLink: string;
}

/**
 * @classdesc Midi Player Class
 * @author    imaya, Logue
 * @license   MIT
 */
export default class Sequencer {
  tempo: number = 500000;
  webMidiLink: HTMLIFrameElement | Worker | null = null;
  resume: number = 0;
  pause: boolean = true;
  ready: boolean = false;
  position: number = 0;

  track: MergedTrackItem[];
  timer: number;
  sequence: ParserInterface;
  enableCC111Loop: boolean;
  enableFalcomLoop: boolean;
  enableMFiLoop: boolean;
  enableLoop: boolean;
  tempoRate: number;
  masterVolume: number;
  textEvent: string;
  sequenceName: string;
  copyright: string;
  lyrics: string;
  length: number;
  time: number;
  timeTotal: number;
  loaded: number;
  window: Window;
  target: HTMLElement | null;
  targetOrigin: string;
  decoder: TextDecoder;

  constructor(target = '#wml', targetOrigin = '*') {
    this.track = [];
    this.timer = 0;
    this.sequence = { timeDivision: 96, tracks: [], plainTracks: [] };
    this.enableCC111Loop = false;
    this.enableFalcomLoop = false;
    this.enableMFiLoop = false;
    this.enableLoop = false;
    this.tempoRate = 1;
    this.masterVolume = 16383;
    this.textEvent = '';
    this.sequenceName = '';
    this.copyright = '';
    this.lyrics = '';
    this.length = 0;
    this.time = 0;
    this.timeTotal = 0;
    this.loaded = 0;
    this.window = window;
    this.target = this.window.document.querySelector(target);
    this.targetOrigin = targetOrigin;
    this.decoder = new TextDecoder('UTF-8');
  }

  setCC111Loop(enable: boolean): void {
    this.enableCC111Loop = enable;
  }

  setFalcomLoop(enable: boolean): void {
    this.enableFalcomLoop = enable;
  }

  setMFiLoop(enable: boolean): void {
    this.enableMFiLoop = enable;
  }

  setLoop(enable: boolean): void {
    this.enableLoop = enable;
  }

  stop(): void {
    this.pause = true;
    this.resume = this.window.performance.now();

    if (this.webMidiLink instanceof HTMLIFrameElement) {
      for (let i = 0; i < 16; ++i) {
        this.webMidiLink.contentWindow?.postMessage(
          'midi,b' + i.toString(16) + ',78,0',
          this.targetOrigin
        );
      }
    }
  }

  getWebMidiLink(): HTMLIFrameElement | Worker | null {
    return this.webMidiLink;
  }

  init(): void {
    this.stop();
    this.initSequence();
    this.pause = true;
    this.track = [];
    this.resume = -1;
    this.sequence = { timeDivision: 96, tracks: [], plainTracks: [] };
    this.sequenceName = '';
    this.copyright = '';
    this.lyrics = '';
    this.textEvent = '';
    this.length = 0;
    this.position = 0;
    this.time = 0;
    this.timeTotal = 0;

    this.window.clearTimeout(this.timer);

    if (this.ready) {
      this.sendInitMessage();
    } else {
      this.window.addEventListener(
        'message',
        ev => {
          const msgEvent = ev;
          if (this.targetOrigin !== '*' && ev.origin !== this.targetOrigin) {
            throw new Error(
              `[smfplayer.js] Cross origin ${msgEvent.origin} is refused.`
            );
          }
          if (msgEvent.data === 'link,ready') {
            this.sendInitMessage();
          }
        },
        false
      );
    }
  }

  initSequence(): void {
    this.tempo = 500000;
    this.position = 0;
    this.sendInitMessage();
    this.pause = false;
  }

  play(): void {
    if (!this.webMidiLink) {
      throw new Error('[smfplayer.js] WebMidiLink not found');
    }

    if (this.ready) {
      if (this.track) {
        this.length = this.track.length;
        if (Array.isArray(this.track) && this.position >= this.length) {
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
          const msgEvent = ev;
          if (
            msgEvent.origin !== '*' &&
            msgEvent.origin !== this.targetOrigin
          ) {
            throw new Error(
              `[smfplayer.js] Cross origin ${msgEvent.origin} is refused.`
            );
          }
          if (msgEvent.data === 'link,ready') {
            this.ready = true;
            if (this.webMidiLink instanceof HTMLIFrameElement) {
              this.webMidiLink.style.height =
                (this.webMidiLink.contentWindow?.document.body.scrollHeight ??
                  0) + 'px';
            }
            this.playSequence();
          }
        },
        false
      );
    }
  }

  onSequenceEnd(): void {
    this.pause = true;
    if (this.webMidiLink instanceof HTMLIFrameElement) {
      this.webMidiLink.contentWindow?.postMessage(
        'endoftrack',
        this.targetOrigin
      );
    }
  }

  sendInitMessage(): void {
    if (!(this.webMidiLink instanceof HTMLIFrameElement)) return;
    const win = this.webMidiLink.contentWindow;
    if (!win) return;

    for (let i = 0; i < 16; ++i) {
      win.postMessage('midi,b' + i.toString(16) + ',128,0', this.targetOrigin);
      win.postMessage('midi,b' + i.toString(16) + ',07,64', this.targetOrigin);
      win.postMessage('midi,b' + i.toString(16) + ',0a,40', this.targetOrigin);
      win.postMessage('midi,e' + i.toString(16) + ',00,40', this.targetOrigin);
      win.postMessage('midi,b' + i.toString(16) + ',64,00', this.targetOrigin);
      win.postMessage('midi,b' + i.toString(16) + ',65,00', this.targetOrigin);
      win.postMessage('midi,b' + i.toString(16) + ',06,02', this.targetOrigin);
      win.postMessage('midi,b' + i.toString(16) + ',26,00', this.targetOrigin);
    }
    this.sendGmReset();
  }

  setWebMidiLink(port: string | Worker = import.meta.env.VITE_WML_URL): void {
    const process = (ev: Event): void => {
      const msgEvent = ev as MessageEvent;
      if (typeof msgEvent.data === 'string') {
        const msg = msgEvent.data.split(',');
        if (msg[0] === 'link') {
          if (msg[1] === 'ready') {
            this.ready = true;
            this.loaded = 100;
            this.setMasterVolume(this.masterVolume);
          } else if (msg[1] === 'progress') {
            this.loaded = Math.round((Number(msg[2]) / Number(msg[3])) * 10000);
          }
        }
      }
    };

    if (typeof port === 'string') {
      if (this.webMidiLink instanceof HTMLIFrameElement) {
        try {
          this.sendAllSoundOff();
          this.sendGmReset();
        } catch (e) {
          console.warn('Failed to cleanup previous synth:', e);
        }
        this.webMidiLink?.remove();
        this.webMidiLink = null;
      }

      if (this.target?.firstChild) {
        this.target.firstChild.remove();
      }

      const iframe = document.createElement('iframe');
      iframe.src = port;
      iframe.setAttribute('crossorigin', 'anonymous');
      iframe.allow = 'autoplay';
      iframe.className = 'wml';

      this.target?.appendChild(iframe);
      this.window.addEventListener('message', process, false);

      const resizeHeight = (): void => {
        if (this.webMidiLink instanceof HTMLIFrameElement) {
          iframe.style.height =
            (this.webMidiLink.contentWindow?.document.body.scrollHeight ?? 0) +
            'px';
        }
      };

      this.window.addEventListener('load', resizeHeight, false);

      let timer = 0;
      this.window.addEventListener(
        'resize',
        () => {
          if (timer > 0) clearTimeout(timer);
          timer = this.window.setTimeout(resizeHeight, 100);
        },
        false
      );
      this.webMidiLink = iframe;
    } else {
      // Worker Mode
      port.addEventListener('message', process, false);
      this.webMidiLink = port;
    }
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = volume;
    if (!(this.webMidiLink instanceof HTMLIFrameElement)) return;
    this.webMidiLink.contentWindow?.postMessage(
      'midi,f0,7f,7f,04,01,' +
        [
          ('0' + (volume & 0x7f).toString(16)).slice(-2),
          ('0' + ((volume >> 7) & 0x7f).toString(16)).slice(-2),
          '7f',
        ].join(','),
      this.targetOrigin
    );
  }

  setTempoRate(tempo: number): void {
    this.tempoRate = tempo;
  }

  playSequence(): void {
    const timeDivision = this.sequence?.timeDivision ?? 96;
    const mergedTrack = this.track ?? [];
    const webMidiLink = (this.webMidiLink as HTMLIFrameElement).contentWindow!;
    let pos = this.position ?? 0;
    const mark: Array<{ pos: number; count?: number } | null> = [];

    const update = (): number | void => {
      const time = mergedTrack[pos].time;
      const length = mergedTrack.length;
      let procTime = window.performance.now();

      if (this.pause) {
        this.resume = procTime - this.resume;
        return;
      }

      do {
        const event = mergedTrack[pos].event;

        switch (event.subtype) {
          case 'TextEvent':
            this.textEvent = this.decoder.decode(
              Uint8Array.from(event.data[0] as ArrayLike<number>)
            );
            break;
          case 'Lyrics':
            this.lyrics = this.decoder.decode(
              Uint8Array.from(event.data[0] as ArrayLike<number>)
            );
            break;
          case 'Maker':
            if (this.enableFalcomLoop) {
              switch (event.data[0]) {
                case 'A':
                  mark[0] = { pos };
                  break;
                case 'B':
                  if (mark[0] && typeof mark[0].pos === 'number') {
                    pos = mark[0].pos;
                    this.timer = this.window.setTimeout(update, 0);
                    this.position = pos;
                    return;
                  }
                  break;
              }
            }
            if (this.enableMFiLoop) {
              const matchResult = new RegExp(
                /^LOOP_(START|END)=ID:(\d+),COUNT:(-?\d+)$/
              ).exec(event.data[0] as string);
              if (matchResult) {
                const id = Number(matchResult[2]);
                if (matchResult[1] === 'START') {
                  mark[id] ??= { pos, count: Number(matchResult[3]) };
                } else if (matchResult[1] === 'END') {
                  const tmp = mark[id];
                  if (tmp && (tmp.count ?? 0) !== 0) {
                    if ((tmp.count ?? 0) > 0) tmp.count = (tmp.count ?? 0) - 1;
                    pos = tmp.pos;
                    this.timer = this.window.setTimeout(update, 0);
                    this.position = pos;
                    return;
                  } else {
                    mark[id] = null;
                  }
                }
              }
            }
            break;
          case 'SetTempo':
            this.tempo = event.data[0] as number;
            break;
        }

        if (
          event.subtype === 'ControlChange' &&
          (event as ChannelEvent).parameter1 === 111
        ) {
          mark[0] = { pos };
        }

        webMidiLink.postMessage(
          mergedTrack[pos++].webMidiLink,
          this.targetOrigin
        );
      } while (pos < length && mergedTrack[pos].time === time);

      if (pos < length) {
        procTime = this.window.performance.now() - procTime;
        this.timer = this.window.setTimeout(
          update,
          (this.tempo / (1000 * timeDivision)) *
            (mergedTrack[pos].time - time - procTime) *
            (1 / this.tempoRate)
        );
      } else {
        this.pause = true;
        if (
          this.enableCC111Loop &&
          mark[0] &&
          typeof mark[0].pos === 'number'
        ) {
          pos = mark[0].pos;
        } else if (this.enableLoop) {
          this.initSequence();
          this.playSequence();
        }
      }

      this.position = pos;
      this.time = time;

      if (this.timeTotal === time) {
        this.onSequenceEnd();
        return 2;
      }
    };

    if (this.pause) {
      this.timer = this.window.setTimeout(update, this.resume);
      this.pause = false;
      this.resume = -1;
    } else {
      this.timer = this.window.setTimeout(
        update,
        (this.tempo / 1000) * timeDivision * this.track[0].time
      );
    }
  }

  loadMidiFile(buffer: Uint8Array): void {
    const parser = new SmfParser(buffer);
    this.init();
    this.mergeMidiTracks(parser);
  }

  loadMldFile(buffer: Uint8Array): void {
    const parser = new MldParser(buffer);
    this.init();
    this.mergeMidiTracks(parser.convertToMidiTracks());
  }

  loadMs2MmlFile(buffer: Uint8Array): void {
    const parser = new MapleStory2Mml(buffer);
    this.init();
    parser.parse();
    this.mergeMidiTracks(parser);
  }

  loadMakiMabiSequenceFile(buffer: Uint8Array): void {
    const parser = new MakiMabiSequence(buffer);
    this.init();
    parser.parse();
    this.mergeMidiTracks(parser);
  }

  load3MleFile(buffer: Uint8Array): void {
    const parser = new ThreeMacroLanguageEditor(buffer);
    this.init();
    parser.parse();
    this.mergeMidiTracks(parser);
  }

  loadMabiIccoFile(buffer: Uint8Array): void {
    const parser = new MabiIcco(buffer);
    this.init();
    parser.parse();
    this.mergeMidiTracks(parser);
  }

  mergeMidiTracks(midi: PlayerSequence | MldMidiTracks): void {
    const mergedTrack: MergedTrackItem[] = [];
    this.track = mergedTrack;
    const tracks = midi.tracks as MidiEvent[][];
    const trackPosition = new Array<number>(tracks.length);
    const plainTracks = midi.plainTracks as (number[] | Uint8Array)[][];

    for (let i = 0; i < tracks.length; ++i) {
      trackPosition[i] = 0;
    }

    for (let i = 0; i < tracks.length; ++i) {
      const track = tracks[i];
      for (let j = 0; j < track.length; ++j) {
        if (track[j] instanceof MetaEvent && track[j].data) {
          if (i === 0 && track[j].subtype === 'SequenceTrackName') {
            this.sequenceName = this.decoder.decode(
              Uint8Array.from(track[j].data[0] as ArrayLike<number>)
            );
          } else if (track[j].subtype === 'CopyrightNotice') {
            this.copyright = this.decoder.decode(
              Uint8Array.from(track[j].data[0] as ArrayLike<number>)
            );
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
              .call(plainTracks[i][j], (a: number) => a.toString(16))
              .join(','),
        });
      }
    }

    mergedTrack.sort((a, b) =>
      a.time > b.time
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
                  : 0
    );

    this.timeTotal = mergedTrack[mergedTrack.length - 1].time;
    this.sequence = midi as PlayerSequence;
  }

  getSequenceName(): string {
    return this.sequenceName;
  }

  getCopyright(): string {
    return this.copyright;
  }

  getLyrics(): string {
    return this.lyrics;
  }

  getTextEvent(): string {
    return this.textEvent;
  }

  getPosition(): number {
    return this.position;
  }

  setPosition(pos: number): void {
    this.position = pos;
  }

  getLength(): number {
    return this.length;
  }

  sendGmReset(lv = false): void {
    if (!(this.webMidiLink instanceof HTMLIFrameElement)) return;
    this.webMidiLink.contentWindow?.postMessage(
      `midi,F0,7E,7F,09,${lv ? '03' : '01'},F7'`,
      this.targetOrigin
    );
  }

  sendAllSoundOff(): void {
    if (!(this.webMidiLink instanceof HTMLIFrameElement)) return;
    this.webMidiLink.contentWindow?.postMessage(
      'midi,b0,78,0',
      this.targetOrigin
    );
  }

  sendRawMidiMessage(message: string): void {
    console.log(message);
    if (!(this.webMidiLink instanceof HTMLIFrameElement)) return;
    this.webMidiLink.contentWindow?.postMessage(
      'midi,' + message,
      this.targetOrigin
    );
  }

  getTempo(): number {
    return Math.floor(60 / (this.tempo / 1000000));
  }

  private tick2time(tick: number): string {
    const s = this.tempo / 1000000;
    const div = s / this.sequence.timeDivision;
    const seconds = Number.parseInt(String(tick * div));
    const divisorForMinutes = seconds % 3600;
    const divisorForSeconds = divisorForMinutes % 60;

    return (
      Math.floor(seconds / 3600) +
      ':' +
      Math.floor(divisorForMinutes / 60)
        .toString()
        .padStart(2, '0') +
      ':' +
      Math.ceil(divisorForSeconds).toString().padStart(2, '0')
    );
  }

  getTime(): string {
    return this.tick2time(this.time);
  }

  getTotalTime(): string {
    return this.tick2time(this.timeTotal);
  }
}
