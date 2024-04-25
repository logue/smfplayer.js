import {
  MabiIcco,
  MakiMabiSequence,
  MapleStory2Mml,
  ThreeMacroLanguageEditor,
  PSGConverter,
} from './mabi_mml_parser';
import Meta from './meta';
import Player from './player';
import Parser from './smf';

const SMF = {
  Player,
  Parser,
  MabiMmlParser: {
    MabiIcco,
    MakiMabiSequence,
    MapleStory2Mml,
    ThreeMacroLanguageEditor,
  },
  PSGConverter,
  version: Meta.version,
  build: Meta.build,
};

export default SMF;
