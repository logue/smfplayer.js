"use strict";
(function() {
    var SoundFont2 = function() {
        this.sfbuffer = null;
        this.sfdata = null;
        this.banks = null;
    }
    SoundFont2.prototype = {
        input: function(sfdata) {
            this.parse(sfdata);
            this.organize();
        },
        parse: function(sfbuffer) {
            var offset;
            this.sfbuffer = sfbuffer;
            this.sfdata = new Uint8Array(sfbuffer);
            if (! this.matchFourCC(0, 'RIFF')) {
                console.error("not RIFF format");
                return false;
            }
            this.RIFFSize = this.getDWORD(4);
            if (! this.matchFourCC(8, 'sfbk')) {
                console.error("not sfbk Chunk");
                return false;
            }
            this.info = this.parseLISTChunkInfo(12, 'INFO');
            this.stda = this.parseLISTChunkInfo(this.info['NextChunkOffset'],
                                              'sdta');
            this.ptda = this.parseLISTChunkInfo(this.stda['NextChunkOffset'],
                                              'pdta');
        },
        matchFourCC: function(o, id) {
            var d = this.sfdata;
            if (d[o++] === id.charCodeAt(0) && d[o++] === id.charCodeAt(1) &&
                d[o++] === id.charCodeAt(2) && d[o] === id.charCodeAt(3)) {
                return true;
            }
            return false;
        },
        getBYTE: function(o) { // uint8
            var d = this.sfdata;
            return d[o];
        },
        getCHAR: function(o) { // sint8
            var v = this.sfdata[o];
            return (v<0x80)?v:(v-0x100);
        },
        getWORD: function(o) { // uint16
            var d = this.sfdata;
            return d[o] + 0x100*d[o+1];
        },
        getSHORT: function(o) { // sint16
            var v = this.getWORD(o);
            return (v<0x8000)?v:(v-0x10000);
        },
        getDWORD: function(o) { // uint32
            var d = this.sfdata;
            return d[o] + 0x100*(d[o+1] + 0x100*(d[o+2] + 0x100*d[o+3]));
        },
        getString: function(o, len) {
            var d = this.sfdata;
            var s = [];
            while (len--) {
                var c = d[o++];
                if (c === 0) { // null terminate
                    break;
                }
                s.push(String.fromCharCode(c));
            }
            return s.join('');
        },
        parseLISTChunkInfo: function(o, listId) {
            var chunkInfo = {offset:o, id:listId};
            var listChunkSize;
            if (! this.matchFourCC(o, 'LIST')) {
                console.error("not LIST chunk");
                return {};
            }
            listChunkSize = this.getDWORD(o + 4);
            var nextChunkOffset = o + 8 + listChunkSize;
            if (! this.matchFourCC(o + 8, listId)) {
                id = this.getString(o + 8, 4);
                console.error("not "+listId+" chunk ("+id+")");
                return {};
            }
            o = o + 12 ;
            while ( o < nextChunkOffset) {
                var id = this.getString(o, 4);
                var size = this.getDWORD(o + 4);
                chunkInfo[id] = {id:id, offset:o, size:size};
                o += 8;
                chunkInfo[id]['detail'] = this.parseChunkInfo(id, o, size);
                o += size;
            }
            chunkInfo['ListChunkSize'] = listChunkSize;;
            chunkInfo['NextChunkOffset'] = nextChunkOffset;
            return chunkInfo;
        },
        parseChunkInfo: function(id, o, size, chunkInfo) {
            var nextOffset = o + size;
            var detail = [];
            while (o < nextOffset) {
                switch(id) {
                case 'phdr': // preset header
                    var preset = {
                        name:    this.getString(o, 20),
                        preset:  this.getWORD(o + 20),
                        bank:    this.getWORD(o + 22),
                        bagNdx:  this.getWORD(o + 24),
                        library: this.getDWORD(o + 26),
                        genre:   this.getDWORD(o + 30),
                        morphologyGenre:  this.getDWORD(o + 34),
                    };
                    o += 38;
                    detail.push(preset);
                    break;
                case 'pbag': // preset bag
                case 'ibag': // instrument bag
                    var bag = {
                        genNdx: this.getWORD(o),
                        modNdx: this.getWORD(o + 2),
                    };
                    o += 4;
                    detail.push(bag);
                    break;
                case 'pgen': // preset generator
                case 'igen': // instrument generator
                    var oper = this.getWORD(o);
                    var gen = { oper: oper };
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
                    var modBits = this.getWORD(o);
                    var mod = {
                        type:  modBits >> 10,
                        p:    (modBits >> 9) & 1,
                        d:    (modBits >> 8) & 1,
                        cc:   (modBits >> 7) & 1,
                        index: modBits & 0x3f,
                    };
                    o += 2;
                    detail.push(mod);
                    break;
                case 'inst': // instrument
                    var inst = {
                        name:    this.getString(o, 20),
                        bagNdx:  this.getWORD(o + 20),
                    }
                    o += 22;
                    detail.push(inst);
                    break;
                case 'shdr': // sample header
                    var sample = {
                        name:    this.getString(o, 20),
                        start:  this.getDWORD(o + 20),
                        end:  this.getDWORD(o + 24),
                        startLoop:  this.getDWORD(o + 28),
                        endLoop:  this.getDWORD(o + 32),
                        sampleRate:  this.getDWORD(o + 36),
                        originalPitch:  this.getBYTE(o + 40),
                        pitchCorrection:  this.getBYTE(o + 41), // XXX
                        sampleLink:  this.getWORD(o + 42),
                        sampleType:  this.getWORD(o + 44),
                    }
                    o += 46;
                    detail.push(sample);
                    break;
                default:
                    nextOffset = -1; // end
                    break;
                }
            }
            if (detail.length) {
                return detail;
            }
            return null;
        },
        organize: function() {
            this.banks = {};
            var presets = this.ptda['phdr']['detail'];
            var pbags   = this.ptda['pbag']['detail'];
            for (var i = 0, n = presets.length ; i < n ; i++) {
                var preset = presets[i];
                var bankId = preset['bank'];
                var presetId = preset['preset'];
                if ((bankId in this.banks) === false) {
                    this.banks[bankId] = {};
                }
                this.banks[bankId][presetId] = preset;
//                this.organizeBag(presets, preset, 'pbag', 'pgen', 'pmod');
            }
        },
        getPresetDetail: function(bankId, presetId) {
            console.log('getPresetDetail('+bankId+","+presetId+")");
            var banks = this.banks;
            if ((bankId in banks) && (presetId in banks[bankId]) &&
                ('bags' in banks[bankId][presetId])) {
                return banks[bankId][presetId];
            }
            var presets = this.ptda['phdr']['detail'];
             console.log(presets.length);
            for (var i = 0, n = presets.length ; i < n ; i++) {
                var preset = presets[i];
                if ((preset['bank'] == bankId) && (preset['preset'] == presetId)) {
                    if ((bankId in banks) === false) {
                        this.banks[bankId] = {};
                    }
                    this.banks[bankId][presetId] = preset;
                    this.organizeBag(presets, preset, 'pbag', 'pgen', 'pmod');
                    console.log(preset);
                    return preset;
                }
            }
            console.error("not found preset: bankId"+bankId+" presetId"+presetId);
            return null;
        },
        organizeBag: function(presets_insts, preset_inst, 
                              bagId, genId, modId) {
            var bags    = this.ptda[bagId]['detail'];
            var gens    = this.ptda[genId]['detail'];
            var mods    = this.ptda[modId]['detail'];
            var insts   = this.ptda['inst']['detail'];
            var samples = this.ptda['shdr']['detail'];

            var startBag = preset_inst['bagNdx'];
            if (bagId + 1 < presets_insts.length) {
                var endBag = presets_insts[bagId + 1]['bagNdx'] - 1;
            } else {
                var endBag = bags.length - 1;
            }
            preset_inst['bags'] = [];

            if (preset_inst['name'] === 'Acoustic Piano HV1') {
                console.log(startBag+"=>"+endBag);

            }
            
            for (var bagIdx = startBag ; bagIdx <= endBag ; bagIdx++) {
                var bag = bags[bagIdx]
                preset_inst['bags'].push(bag);
                var startGen = bag['genNdx'];
                var startMod = bag['modNdx'];
                if (bagIdx  < (bags.length -1)) {
                    var endGen = bags[bagIdx+1]['genNdx'] - 1;
                    var endMod = bags[bagIdx+1]['modNdx'] - 1;
                } else {
                    var endGen = gens.length - 1;
                    var endMod = mods.length - 1;
                }
                bag['gens'] = {};
                for (var genIdx = startGen ; genIdx <= endGen ; genIdx++) {
                    var gen = gens[genIdx];
                    var oper = gen['oper'];
                    bag['gens'][oper] = gen;
                    if (oper === 41) { // instrument
                        var inst = insts[gen['amount']];
                        this.organizeBag(insts, inst, 'ibag', 'igen', 'imod');
                        gen['inst'] = inst;
                    } else if (oper === 53) { // sampleID
                        gen['sample'] = samples[gen['amount']];
                    }
                }
                bag['mods'] = []; // XXX
                for (var modIdx = startMod ; modIdx <= endMod ; modIdx++) {
                    var mod = mods[modIdx];
                    bag['mods'].push(mod); // XXX
                }
            }
        },
        getBanks: function() {
            return this.banks;
        },
    };
    window.SoundFont2 = SoundFont2;
})();