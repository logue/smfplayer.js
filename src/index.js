import Meta from './meta';
import Player from './player';
import Parser from './smf';

const SMF = {
  Player,
  Parser,
  version: Meta.version,
  build: Meta.build,
};

export default SMF;

if (!window.SMF) {
  // for CDN.
  window.SMF = SMF;
}
