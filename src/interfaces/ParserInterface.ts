import { MidiEvent } from '@/MidiEvent';

export default interface ParserInterface<E extends MidiEvent> {
  /** 分解能 */
  timeDivision: number;
  /** 全トラック数 */
  numberOfTracks: number;
  /** テンポ */
  tempo: number;
  /** トラックデータ */
  tracks: E[][];
  /** バイナリ変換したトラック */
  plainTracks: Uint8Array[][];
}
