'use strict';
/* eslint-disable */
/**
 * @classdes SoundFont2 Class
 * Original version written by yoya<https://github.com/yoya/sf2.js>,
 * Modified by Logue
 */
class SoundFont2 {
  constructor() {
    this.sfbuffer = null;
    this.sfdata = null;
    this.banks = null;
  }

  input(sfdata) {
    this.parse(sfdata);
    this.organize();
  }
  parse(sfbuffer) {
    this.sfbuffer = sfbuffer;
    this.sfdata = new Uint8Array(sfbuffer);
    if (!this.matchFourCC(0, 'RIFF')) {
      console.error('not RIFF format');
      return false;
    }
    this.RIFFSize = this.getDWORD(4);
    if (!this.matchFourCC(8, 'sfbk')) {
      console.error('not sfbk Chunk');
      return false;
    }
    this.info = this.parseLISTChunkInfo(12, 'INFO');
    this.stda = this.parseLISTChunkInfo(this.info['NextChunkOffset'], 'sdta');
    this.ptda = this.parseLISTChunkInfo(this.stda['NextChunkOffset'], 'pdta');
  }
  matchFourCC(o, id) {
    const d = this.sfdata;
    if (
      d[o++] === id.charCodeAt(0) &&
      d[o++] === id.charCodeAt(1) &&
      d[o++] === id.charCodeAt(2) &&
      d[o] === id.charCodeAt(3)
    ) {
      return true;
    }
    return false;
  }
  getBYTE(o) {
    // uint8
    const d = this.sfdata;
    return d[o];
  }
  getCHAR(o) {
    // sint8
    const v = this.sfdata[o];
    return v < 0x80 ? v : v - 0x100;
  }
  getWORD(o) {
    // uint16
    const d = this.sfdata;
    return d[o] + 0x100 * d[o + 1];
  }
  getSHORT(o) {
    // sint16
    const v = this.getWORD(o);
    return v < 0x8000 ? v : v - 0x10000;
  }
  getDWORD(o) {
    // uint32
    const d = this.sfdata;
    return d[o] + 0x100 * (d[o + 1] + 0x100 * (d[o + 2] + 0x100 * d[o + 3]));
  }
  getString(o, len) {
    const d = this.sfdata;
    const s = [];
    while (len--) {
      const c = d[o++];
      if (c === 0) {
        // null terminate
        break;
      }
      s.push(String.fromCharCode(c));
    }
    return s.join('');
  }
  parseLISTChunkInfo(o, listId) {
    const chunkInfo = { offset: o, id: listId };
    let listChunkSize;
    if (!this.matchFourCC(o, 'LIST')) {
      console.error('not LIST chunk');
      return {};
    }
    listChunkSize = this.getDWORD(o + 4);
    const nextChunkOffset = o + 8 + listChunkSize;
    if (!this.matchFourCC(o + 8, listId)) {
      id = this.getString(o + 8, 4);
      console.error('not ' + listId + ' chunk (' + id + ')');
      return {};
    }
    o = o + 12;
    while (o < nextChunkOffset) {
      const id = this.getString(o, 4);
      const size = this.getDWORD(o + 4);
      chunkInfo[id] = { id: id, offset: o, size: size };
      o += 8;
      chunkInfo[id]['detail'] = this.parseChunkInfo(id, o, size);
      o += size;
    }
    chunkInfo['ListChunkSize'] = listChunkSize;
    chunkInfo['NextChunkOffset'] = nextChunkOffset;
    return chunkInfo;
  }
  parseChunkInfo(id, o, size, chunkInfo) {
    let nextOffset = o + size;
    const detail = [];
    while (o < nextOffset) {
      switch (id) {
        case 'phdr': // preset header
          const preset = {
            name: this.getString(o, 20),
            preset: this.getWORD(o + 20),
            bank: this.getWORD(o + 22),
            bagNdx: this.getWORD(o + 24),
            library: this.getDWORD(o + 26),
            genre: this.getDWORD(o + 30),
            morphologyGenre: this.getDWORD(o + 34),
          };
          o += 38;
          detail.push(preset);
          break;
        case 'pbag': // preset bag
        case 'ibag': // instrument bag
          const bag = {
            genNdx: this.getWORD(o),
            modNdx: this.getWORD(o + 2),
          };
          o += 4;
          detail.push(bag);
          break;
        case 'pgen': // preset generator
        case 'igen': // instrument generator
          const oper = this.getWORD(o);
          const gen = { oper: oper };
          if (oper === 43 || oper === 44) {
            gen['lo'] = this.getBYTE(o + 2);
            gen['hi'] = this.getBYTE(o + 3);
          } else {
            gen['amount'] = this.getWORD(o + 2);
          }
          o += 4;
          detail.push(gen);
          break;
        case 'pmod': // preset modulator
        case 'imod': // instrument modulator
          const modBits = this.getWORD(o);
          const mod = {
            type: modBits >> 10,
            p: (modBits >> 9) & 1,
            d: (modBits >> 8) & 1,
            cc: (modBits >> 7) & 1,
            index: modBits & 0x3f,
          };
          o += 2;
          detail.push(mod);
          break;
        case 'inst': // instrument
          const inst = {
            name: this.getString(o, 20),
            bagNdx: this.getWORD(o + 20),
          };
          o += 22;
          detail.push(inst);
          break;
        case 'shdr': // sample header
          const sample = {
            name: this.getString(o, 20),
            start: this.getDWORD(o + 20),
            end: this.getDWORD(o + 24),
            startLoop: this.getDWORD(o + 28),
            endLoop: this.getDWORD(o + 32),
            sampleRate: this.getDWORD(o + 36),
            originalPitch: this.getBYTE(o + 40),
            pitchCorrection: this.getBYTE(o + 41), // XXX
            sampleLink: this.getWORD(o + 42),
            sampleType: this.getWORD(o + 44),
          };
          o += 46;
          detail.push(sample);
          break;
        default: // end
          nextOffset = -1;
          break;
      }
    }
    if (detail.length) {
      return detail;
    }
    return null;
  }
  organize() {
    this.banks = {};
    const presets = this.ptda['phdr']['detail'];
    for (let i = 0, n = presets.length; i < n; i++) {
      const preset = presets[i];
      const bankId = preset['bank'];
      const presetId = preset['preset'];
      if (bankId in this.banks === false) {
        this.banks[bankId] = {};
      }
      this.banks[bankId][presetId] = preset;
      // this.organizeBag(presets, preset, 'pbag', 'pgen', 'pmod');
    }
  }
  getPresetDetail(bankId, presetId) {
    console.log('getPresetDetail(' + bankId + ',' + presetId + ')');
    const banks = this.banks;
    if (
      bankId in banks &&
      presetId in banks[bankId] &&
      'bags' in banks[bankId][presetId]
    ) {
      return banks[bankId][presetId];
    }
    const presets = this.ptda['phdr']['detail'];
    console.log(presets.length);
    for (let i = 0, n = presets.length; i < n; i++) {
      const preset = presets[i];
      if (preset['bank'] == bankId && preset['preset'] == presetId) {
        if (bankId in banks === false) {
          this.banks[bankId] = {};
        }
        this.banks[bankId][presetId] = preset;
        this.organizeBag(presets, preset, 'pbag', 'pgen', 'pmod');
        console.log(preset);
        return preset;
      }
    }
    console.error('not found preset: bankId' + bankId + ' presetId' + presetId);
    return null;
  }
  organizeBag(presets_insts, preset_inst, bagId, genId, modId) {
    const bags = this.ptda[bagId]['detail'];
    const gens = this.ptda[genId]['detail'];
    const mods = this.ptda[modId]['detail'];
    const insts = this.ptda['inst']['detail'];
    const samples = this.ptda['shdr']['detail'];

    const startBag = preset_inst['bagNdx'];
    const endBag =
      bagId + 1 < presets_insts.length
        ? presets_insts[bagId + 1]['bagNdx'] - 1
        : bags.length - 1;

    preset_inst['bags'] = [];

    if (preset_inst['name'] === 'Acoustic Piano HV1') {
      console.log(startBag + '=>' + endBag);
    }

    for (let bagIdx = startBag; bagIdx <= endBag; bagIdx++) {
      const bag = bags[bagIdx];
      preset_inst['bags'].push(bag);
      const startGen = bag['genNdx'];
      const startMod = bag['modNdx'];

      const endGen =
        bagIdx < bags.length - 1
          ? bags[bagIdx + 1]['genNdx'] - 1
          : gens.length - 1;
      const endMod =
        bagIdx < bags.length - 1
          ? bags[bagIdx + 1]['modNdx'] - 1
          : mods.length - 1;

      bag['gens'] = {};
      for (let genIdx = startGen; genIdx <= endGen; genIdx++) {
        const gen = gens[genIdx];
        const oper = gen['oper'];
        bag['gens'][oper] = gen;
        if (oper === 41) {
          // instrument
          const inst = insts[gen['amount']];
          this.organizeBag(insts, inst, 'ibag', 'igen', 'imod');
          gen['inst'] = inst;
        } else if (oper === 53) {
          // sampleID
          gen['sample'] = samples[gen['amount']];
        }
      }
      bag['mods'] = []; // XXX
      for (let modIdx = startMod; modIdx <= endMod; modIdx++) {
        const mod = mods[modIdx];
        bag['mods'].push(mod); // XXX
      }
    }
  }
  getBanks() {
    return this.banks;
  }
}

(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    const v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define(['require', 'exports'], factory);
  }
})(function (require, exports) {
  'use strict';
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.default = SoundFont2;
});
