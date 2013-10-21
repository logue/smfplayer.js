"use strict";
var acontext = new webkitAudioContext();

var listener_BackButton = null; // Kludge!!! >_<;

function addEventListener_BackButton(sfback, type, listener, useCapture) {
    if (listener_BackButton !== null) {
        sfback.removeEventListener(type, listener_BackButton);
    }
    sfback.addEventListener(type, listener, useCapture);
    listener_BackButton = listener;
}

function viewBanksPresets(sf) {
    console.debug("viewBanksPresets(sf)");
    console.debug(sf);
    var sftitle = document.getElementById('sftitle');
    sftitle.innerHTML = "Banks and Presets";
    var sfback = document.getElementById('sfback');
    sfback.style.visibility = "hidden";
    var sftable = document.getElementById('sftable');
    sftable.innerHTML = null;
    var sftable_frag = document.createDocumentFragment();
    var banks = sf.banks
    var tr = document.createElement('tr');
    var th, td;
    var preset_keylist = ['bank', 'preset', 'name', 'bagNdx', 'library', 'genre'];
    for (var idx in preset_keylist) {
        th = document.createElement('th');
        th.innerHTML = preset_keylist[idx];
        tr.appendChild(th);
    }
    sftable_frag.appendChild(tr)
    for (var bankId in banks) {
        var nPreset = 0;
        for (var presetId in banks[bankId]) {
            nPreset++;
        }
        var prevBank = null;
        for (var presetId in banks[bankId]) {
            var preset = banks[bankId][presetId];
            tr = document.createElement('tr');
            for (var idx in preset_keylist) {
                var key = preset_keylist[idx];
                var value = preset[key];
                if (key === 'bank' && prevBank === bankId) {
                    continue; // for rowSpan
                }
                td = document.createElement('td');
                td.innerHTML = value;
                if (key === 'bank') {
                    td.setAttribute('rowSpan', nPreset);
                }
                if (key === 'bagNdx') {
                    var button = document.createElement('button');
                    td.innerHTML = null;
                    button.innerHTML = value;
                    button.addEventListener('click', viewBags.bind(this, sf, preset, null), false);
                    td.appendChild(button);
                }
                tr.appendChild(td);
                prevBank = bankId;
            }
            sftable_frag.appendChild(tr);
        }
    }
    sftable.appendChild(sftable_frag);
}

function viewBags(sf, preset, inst) {
    console.debug("viewBags(fs, preset_inst)");
    var preset_inst = null;
    if (inst === null) {
        preset = sf.getPresetDetail(preset['bank'], preset['preset']);
        preset_inst = preset;
    } else {
        preset_inst = inst;
    }
    console.debug(preset_inst);
    var bags = preset_inst['bags'];
    var canvas_wave = document.getElementById("wave");
    var canvas_waveloop = document.getElementById("waveloop");
    canvas_wave.style.visibility = "hidden";
    canvas_waveloop.style.visibility = "hidden";
    var sftitle = document.getElementById('sftitle');
    if (! inst) {
        sftitle.innerHTML = "Bags:"+preset_inst['name'];
    } else {
        sftitle.innerHTML = "InstBags:"+preset_inst['name'];
    }
    var sfback = document.getElementById('sfback');
    sfback.style.visibility = "visible";
    sfback.innerHTML = "back";
    if (inst === null) {
        addEventListener_BackButton(sfback, 'click', viewBanksPresets.bind(this, sf), false);
    } else {
        addEventListener_BackButton(sfback, 'click', viewBags.bind(this, sf, preset, null), false);
    }
    var sftable = document.getElementById('sftable');
    sftable.innerHTML = null;
    var sftable_frag = document.createDocumentFragment();
    var prevBag = null;
    var mod_keylist = ['type', 'p', 'd', 'cc', 'index'];
    for (var bagId = 0, n = bags.length ; bagId < n ; bagId++) {
        var bag = bags[bagId];
        var gens = bag['gens']; 
        var mods = bag['mods'];
        var nGens = 0;
        var nMods = 0;
        var gen, tr, td;
        for (gen in gens) nGens++;
        nMods = mods.length;
        for (var oper in gens) {
            gen = gens[oper];
            tr = document.createElement('tr');
            if (bagId !== prevBag) {
                td = document.createElement('td');
                td.innerHTML = bagId;
                td.setAttribute('rowSpan', nGens+nMods);
                tr.appendChild(td);
                prevBag = bagId;
            }
            var gen_value = [];
            gen_value.push('oper:'+oper);
            if (oper == 43 || oper == 44) {
                gen_value.push("lo:"+gen['lo']+"=>hi:"+gen['hi']);
            } else {
                gen_value.push("amount:"+gen['amount']);
            }
            td = document.createElement('td');
            td.innerHTML = gen_value.join(', ');
            if (oper == 41) { // instrument
                var button = document.createElement('button');
                button.innerHTML = "inst:"+gen['amount'];
                var inst = gen['inst'];
                button.addEventListener('click', viewInstrument.bind(this, sf, preset, inst), false);
                td.appendChild(button);
            } else if (oper == 53) {// sampleID
                button = document.createElement('button');
                button.innerHTML = "sample:"+gen['amount'];
                var sample = gen['sample'];
                button.addEventListener('click', viewSample.bind(this, sf, preset, inst, sample), false);
                td.appendChild(button);
            }
            tr.appendChild(td);
            sftable_frag.appendChild(tr);
        }
        for (var modIdx in mods) {
            var mod = mods[modIdx];
            tr = document.createElement('tr');
            if (bagId !== prevBag) {
                td = document.createElement('td');
                td.setAttribute('rowSpan', nGens+nMods);
                tr.appendChild(td);
                prevBag = bagId;                
            }
            var mod_value = [];
            for (var idx in mod_keylist) {
                var key = mod_keylist[idx];
                mod_value.push(key+":"+mod[key]);
            }
            td = document.createElement('td');
            td.innerHTML = mod_value.join(', ');
            tr.appendChild(td);
            sftable_frag.appendChild(tr);
        }
    }
    sftable.appendChild(sftable_frag);
}

function viewInstrument(sf, preset, inst) {
    console.debug("viewInstrument(sf, preset, inst)");
    console.debug(inst);
    viewBags(sf, preset, inst);
}

function viewSample(sf, preset, inst, sample) {
    console.debug("viewSample(sf, preset, inst, sample)");
    console.debug(sample);
    var context = acontext;
    var src = context.createBufferSource();
    src.disconnect(context.destination);
    var sftitle = document.getElementById('sftitle');    
    sftitle.innerHTML = "Sample:"+sample['name'];
    var sfback = document.getElementById('sfback');
    sfback.style.visibility = "visible";
    sfback.innerHTML = "back";
    addEventListener_BackButton(sfback, 'click', viewBags.bind(this, sf, preset, inst, false));
    var sample_keylist = ['name', 'start', 'end', 'startLoop', 'endLoop', 'sampleRate', 'originalPitch', 'pitchCorrection', 'sampleLink', 'sampleType'];
    var sftable = document.getElementById('sftable');
    
    sftable.innerHTML = null;
    var sftable_frag = document.createDocumentFragment();
    var tr, td;
    for (var idx in sample_keylist) {
        var key = sample_keylist[idx];
        tr = document.createElement('tr');
        td = document.createElement('td');
        td.innerHTML = key+":"+sample[key];
        if (key === "start") {
            var playButton = document.createElement('button');
            playButton.innerHTML = "play";
            td.appendChild(playButton);
            var stopButton = document.createElement('button');
            stopButton.innerHTML = "stop";
            td.appendChild(stopButton);
        }
        if (key === "startLoop") {
            var playLoopButton = document.createElement('button');
            playLoopButton.innerHTML = "playLoop";
            td.appendChild(playLoopButton);
            var stopLoopButton = document.createElement('button');
            stopLoopButton.innerHTML = "stopLoop";
            td.appendChild(stopLoopButton);
        }
        tr.appendChild(td);
        sftable_frag.appendChild(tr);
    }
    sftable.appendChild(sftable_frag);
    var start     = sample['start']; // maybe, sample offset (not byte offset)
    var end       = sample['end'];
    var startLoop = sample['startLoop'];
    var endLoop   = sample['endLoop'];
    var sampleTable = new Uint8Array(sf.sfbuffer, sf.stda.smpl['offset']);
    var waveTableLength = end - start + 1;
    console.log("waveTableLength:"+waveTableLength);
    var waveTable = new Float32Array(waveTableLength);
    for (var i = 0, j= 2*start ; i < waveTableLength; i++) {
        var v = sampleTable[j++] + 0x100 * sampleTable[j++];
        v = (v < 0x8000)?v:(v - 0x10000); // unsigned => signed
        waveTable[i] = v / 0x8000;
    }
    var waveLoopLength = endLoop - startLoop + 1;
    var waveLoopTable = new Float32Array(waveLoopLength);
    for (var i = 0, j = 2*startLoop  ; i < waveLoopLength; i++) {
        var v = sampleTable[j++] + 0x100 * sampleTable[j++];
        v = (v < 0x8000)?v:(v - 0x10000); // unsigned => signed
        waveLoopTable[i] = v / 0x8000;
    }

    var canvas_wave = document.getElementById("wave");
    var canvas_waveloop = document.getElementById("waveloop");
    canvas_wave.style.visibility = "visible";
    canvas_waveloop.style.visibility = "visible";

    var width_wave = canvas_wave.width;
    var width_waveloop = canvas_waveloop.width;
    var height_wave = canvas_wave.height;
    var height_waveloop = canvas_waveloop.height;

    // reset
    canvas_wave.width = width_wave;
    canvas_waveloop.width = width_waveloop;
    canvas_wave.height = height_wave;
    canvas_waveloop.height = height_waveloop;

    var ctx_wave = canvas_wave.getContext('2d');    
    var ctx_waveloop = canvas_waveloop.getContext('2d');
    canvas_wave.style.backgroundColor = "rgb(10, 10, 30)";
    canvas_waveloop.style.backgroundColor = "rgb(70, 0, 0)";
    // wave
    ctx_wave.fillStyle = "rgb(70, 0, 0)";
    var x_startLoop = width_wave * (startLoop-start) / (end-start+1) ;
    var x_endLoop = width_wave * (endLoop-start) / (end-start+1);
    ctx_wave.beginPath();
    ctx_wave.lineTo(x_startLoop, 0);
    ctx_wave.lineTo(x_startLoop, height_wave);
    ctx_wave.lineTo(x_endLoop, height_wave);
    ctx_wave.lineTo(x_endLoop, 0);
    ctx_wave.fill();
    ctx_wave.beginPath();
    ctx_wave.strokeStyle = "rgb(200, 255, 255)";
    for (var x = 0 ; x < width_wave ; x++) {
        var idx = (x * (waveTableLength / width_wave)) | 0;
        var y = (height_wave / 2) - (height_wave / 2) * waveTable[idx];
        ctx_wave.lineTo(x, y);
    }
    ctx_wave.stroke();
    // waveLoop
    ctx_waveloop.strokeStyle = "rgb(200, 255, 255)";
    ctx_waveloop.beginPath();
    for (var x = 0 ; x < width_waveloop ; x++) {
        var idx = (x * (waveLoopLength / width_waveloop)) | 0;
        var y = (height_waveloop / 2) - (height_waveloop / 2) * waveLoopTable[idx];
        ctx_waveloop.lineTo(x, y);
    }
    ctx_waveloop.stroke();

    var src = null;
    var allNoteOff = function() {
        if (src !==  null) {
            src.noteOff(0);
            src.disconnect(context.destination);
            src = null;
        }
        if (src2 !== null) {
            src2.noteOff(0);
            src2.disconnect(context.destination);
            src2 = null;
        }
    }
    playButton.addEventListener('click', function() {
        allNoteOff();
        src = context.createBufferSource();
        var buf = context.createBuffer(1, waveTableLength, context.sampleRate);
        var data = buf.getChannelData(0);
        for (var i = 0 ; i < waveTableLength ; i++) {
            data[i] = waveTable[i];
        }
        src.buffer = buf;
        if ('loopStart' in src) { // Chrome
            src.loop = true;
            src.loopStart = (startLoop - start) / context.sampleRate;
            src.loopEnd = (endLoop - start) / context.sampleRate;
            src.connect(context.destination);
            src.noteOn(0);
        } else { // iOS
//            src.loop = true;
            //        src.loopStart = (startLoop - start) / context.sampleRate;
            //        src.loopEnd = (endLoop - start) / context.sampleRate;
            src.connect(context.destination);
            src.noteOn(0);
        }        
    });
    stopButton.addEventListener('click', function() {
        allNoteOff();
    });
    var src2 = null;
    playLoopButton.addEventListener('click', function() {
        allNoteOff();
        src2 = context.createBufferSource();
        var buf2 = context.createBuffer(1, waveLoopLength, context.sampleRate);
        var data2 = buf2.getChannelData(0);
        for (var i = 0 ; i < waveLoopLength ; i++) {
            data2[i] = waveLoopTable[i];
        }
        src2.buffer = buf2;
        src2.loop = true;
        src2.loopStart = 100;
        src2.connect(context.destination);
        src2.noteOn(0);
    });
    stopLoopButton.addEventListener('click', function() {
        allNoteOff();
    });
}