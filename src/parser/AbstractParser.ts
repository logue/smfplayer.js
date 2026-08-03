import type ParserInterface from '@/interfaces/ParserInterface';
import type ParserOptions from '@/interfaces/ParserOptions';

import { MidiEvent } from '@/MidiEvent';

export default abstract class Parser<
  T extends ParserOptions,
  Event extends MidiEvent,
> implements ParserInterface<Event> {
  /** 入力データ */
  protected input: Uint8Array;
  /** ポインタ */
  protected ip: number = 0;
  /** 分解能 */
  public timeDivision: number = 480;
  /** 全トラック数 */
  public numberOfTracks: number = 0;
  /** テンポ */
  public tempo: number = 120;
  /** トラックデータ */
  public tracks: Event[][] = [];
  /** バイナリ変換したトラック */
  public plainTracks: Uint8Array[][] = [];

  constructor(input: Uint8Array, options?: T) {
    this.input = input;
    this.ip = options!.index ?? 0;
    this.timeDivision = options!.timeDivision ?? 480;
  }

  /** パースを実行する */
  public parse(): void {
    this.parseHeader();
    this.parseTracks();
  }

  /** ヘッダを解析する */
  protected abstract parseHeader(): void;

  /** トラックを解析する */
  protected abstract parseTracks(): void;
}
