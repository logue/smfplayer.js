import Meta from '@/Meta';
import Player from '@/Sequencer';
import Parser from '@/parser';

const SMF = {
  Player,
  Parser,
  version: Meta.version,
  build: Meta.date,
};

export default SMF;
