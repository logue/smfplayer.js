const SmfFormat: Record<string, number> = {
  /** SMF0（トラックなし） */
  SMF_0: 0,
  /** SMF1（トラックあり） */
  SMF_1: 1,
} as const;

export type SmfFormatType = (typeof SmfFormat)[keyof typeof SmfFormat];
export default SmfFormat;
