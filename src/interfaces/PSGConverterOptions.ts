import type ParserOptions from './ParserOptions';

import { type OctaveModeType } from '@/types/OctaveMode';

export default interface PSGConverterOptions extends ParserOptions {
  /** 対象チャンネル */
  channel: number;
  /** オフセット時間 */
  timeOffset: number;
  /** MMLのソース */
  mml: string;
  /** テンポを無視する */
  ignoreTempo: boolean;
  /** 最高オクターブ */
  maxOctave: number;
  /** 最低オクターブ */
  minOctave: number;
  /** オクターブの扱い */
  octaveMode: OctaveModeType;
  /** 一番低い音（これを下回った場合１オクターブ上の音を鳴らす） */
  minNote: number;
  /** 一番高い音（これを上回った場合１オクターブ下の音を鳴らす） */
  maxNote: number;
}
