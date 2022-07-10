import Player from './player';
import Parser from './smf';

const SMF = {
  Player,
  Parser,
};

export default SMF;

if (!window.SMF) {
  // for CDN.
  window.SMF = SMF;
}
