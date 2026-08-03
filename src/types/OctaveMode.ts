const OctaveMode: Record<string, number> = {
  /** 通常の扱い */
  DEFAULT: 0,
  /** 単一オクターブ */
  ONLY_ONE: 1,
  /** 音階を無視 */
  IGNORE: 2,
} as const;

export type OctaveModeType = (typeof OctaveMode)[keyof typeof OctaveMode];
export default OctaveMode;
