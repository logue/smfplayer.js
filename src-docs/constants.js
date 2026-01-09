/**
 * Application Constants
 */
export const CONSTANTS = {
  AVAILABLE_EXTS: ['.mid', '.midi', '.mld', '.mml', '.mms', '.mmi', '.ms2mml'],
  CACHE_NAME: 'zips',
  UPDATE_INTERVAL: 600,
  MASTER_VOLUME_MULTIPLIER: 16383,
  THEME_MIDI_MESSAGES: {
    light: 'F0,0A,7D,10,00,01,01,F7',
    dark: 'F0,0A,7D,10,00,01,02,F7',
    auto: 'F0,0A,7D,10,00,01,00,F7',
  },
};

/**
 * File extensions to loader method mapping
 */
export const FILE_LOADERS = {
  mid: 'loadMidiFile',
  midi: 'loadMidiFile',
  mld: 'loadMldFile',
  ms2mml: 'loadMs2MmlFile',
  mms: 'loadMakiMabiSequenceFile',
  mml: 'load3MleFile',
  mmi: 'loadMabiIccoFile',
};
