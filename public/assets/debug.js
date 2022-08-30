'use strict';
/* eslint-disable */
window.AudioContext = window.AudioContext || window.webkitAudioContext;
const acontext = new AudioContext();

let listener_BackButton = null; // Kludge!!! >_<;

function addEventListener_BackButton(sfback, type, listener, useCapture) {
  if (listener_BackButton !== null) {
    sfback.removeEventListener(type, listener_BackButton);
  }
  sfback.addEventListener(type, listener, useCapture);
  listener_BackButton = listener;
}

function viewBanksPresets(sf) {
  console.debug('viewBanksPresets(sf)');
  console.debug(sf);
  const sftitle = document.getElementById('sftitle');
  sftitle.innerHTML = 'Banks and Presets';
  const sfback = document.getElementById('sfback');
  sfback.disabled = 'disabled';
  const sftable = document.getElementById('sftable');
  sftable.innerHTML = null;
  const sfwave = document.getElementById('sfwave');
  sfwave.style.display = 'none';

  const sftable_frag = document.createDocumentFragment();

  const sftable_head = document.createElement('thead');
  const banks = sf.banks;
  let tr = document.createElement('tr');
  let th;
  let td;
  const preset_keylist = [
    'bank',
    'preset',
    'name',
    'bagNdx',
    'library',
    'genre',
  ];
  for (const idx in preset_keylist) {
    th = document.createElement('th');
    th.innerHTML = preset_keylist[idx];
    tr.appendChild(th);
  }
  sftable_head.appendChild(tr);
  const sftable_body = document.createElement('tbody');
  for (const bankId in banks) {
    let nPreset = 0;
    for (const presetId in banks[bankId]) {
      nPreset++;
    }
    let prevBank = null;
    for (const presetId in banks[bankId]) {
      const preset = banks[bankId][presetId];
      tr = document.createElement('tr');
      for (const idx in preset_keylist) {
        const key = preset_keylist[idx];
        const value = preset[key];
        if (key === 'bank' && prevBank === bankId) {
          continue; // for rowSpan
        }
        td = document.createElement('td');
        td.innerHTML = value;
        if (key === 'bank') {
          td.setAttribute('rowSpan', nPreset);
        }
        if (key === 'bagNdx') {
          const button = document.createElement('button');
          td.innerHTML = null;
          button.className = 'btn btn-sm btn-primary';
          button.innerHTML = value;
          button.addEventListener(
            'click',
            viewBags.bind(this, sf, preset, null),
            false
          );
          td.appendChild(button);
        }
        tr.appendChild(td);
        prevBank = bankId;
      }
      sftable_body.appendChild(tr);
    }
  }

  sftable_frag.appendChild(sftable_head);
  sftable_frag.appendChild(sftable_body);
  sftable.appendChild(sftable_frag);
}

function viewBags(sf, preset, inst) {
  console.debug('viewBags(fs, preset_inst)');
  let preset_inst = null;
  if (inst === null) {
    preset = sf.getPresetDetail(preset['bank'], preset['preset']);
    preset_inst = preset;
  } else {
    preset_inst = inst;
  }
  console.debug(preset_inst);
  const bags = preset_inst['bags'];

  const sfwave = document.getElementById('sfwave');
  sfwave.style.display = 'none';

  const sftitle = document.getElementById('sftitle');
  if (!inst) {
    sftitle.innerHTML = 'Bags: ' + preset_inst['name'];
  } else {
    sftitle.innerHTML = 'InstBags: ' + preset_inst['name'];
  }

  const sfback = document.getElementById('sfback');
  sfback.disabled = '';
  if (inst === null) {
    addEventListener_BackButton(
      sfback,
      'click',
      viewBanksPresets.bind(this, sf),
      false
    );
  } else {
    addEventListener_BackButton(
      sfback,
      'click',
      viewBags.bind(this, sf, preset, null),
      false
    );
  }
  const sftable = document.getElementById('sftable');
  sftable.innerHTML = null;
  let prevBag = null;

  const sftable_head = document.createElement('thead');
  // const banks = sf.banks;
  const tr = document.createElement('tr');
  const mod_keylist = ['type', 'p', 'd', 'cc', 'index'];

  const table_keylist = ['key', 'sample', 'inst'];
  for (const idx in table_keylist) {
    const th = document.createElement('th');
    th.innerHTML = table_keylist[idx];
    tr.appendChild(th);
  }
  sftable_head.appendChild(tr);

  const sftable_body = document.createElement('tbody');
  const sftable_foot = document.createElement('tfoot');
  for (let bagId = 0, n = bags.length; bagId < n; bagId++) {
    const bag = bags[bagId];
    const gens = bag['gens'];
    const mods = bag['mods'];
    let gen;
    let nGens = 0;
    let nMods = 0;
    for (gen in gens) nGens++;
    nMods = mods.length;
    for (const oper in gens) {
      gen = gens[oper];
      const tr = document.createElement('tr');
      let td;
      let button;
      if (bagId !== prevBag) {
        td = document.createElement('td');
        td.innerHTML = bagId;
        td.setAttribute('rowSpan', nGens + nMods);
        tr.appendChild(td);
        prevBag = bagId;
      }
      const gen_value = [];
      gen_value.push(`oper: <var>${oper}</var>`);
      if (oper == 43 || oper == 44) {
        gen_value.push(
          `lo: <var>${gen['lo']}</var> =&gt; hi: <var>${gen['hi']}</var>`
        );
      } else {
        gen_value.push(`amount: <var>${gen['amount']}</var>`);
      }
      td = document.createElement('td');
      td.innerHTML = gen_value.join(', ');
      tr.appendChild(td);

      td = document.createElement('td');
      if (oper == 41) {
        // instrument
        button = document.createElement('button');
        button.className = 'btn btn-sm btn-info';
        button.innerHTML =
          '<i class="bi bi-music-note-list"></i> inst:' + gen['amount'];
        const inst = gen['inst'];
        button.addEventListener(
          'click',
          viewInstrument.bind(this, sf, preset, inst),
          false
        );
        td.appendChild(button);
      } else if (oper == 53) {
        // sampleID
        button = document.createElement('button');
        button.className = 'btn btn-sm btn-success';
        button.innerHTML = `<i class="bi bi-soundwave"></i> Sample: ${gen['amount']}`;
        const sample = gen['sample'];
        button.addEventListener(
          'click',
          viewSample.bind(this, sf, preset, inst, sample),
          false
        );
        td.appendChild(button);
      }
      tr.appendChild(td);
      sftable_body.appendChild(tr);
    }
    sftable.appendChild(sftable_head);
    sftable.appendChild(sftable_body);

    for (const modIdx in mods) {
      const mod = mods[modIdx];
      const tr = document.createElement('tr');
      if (bagId !== prevBag) {
        td = document.createElement('td');
        td.setAttribute('rowSpan', nGens + nMods);
        tr.appendChild(td);
        prevBag = bagId;
      }
      const mod_value = [];
      for (const idx in mod_keylist) {
        const key = mod_keylist[idx];
        mod_value.push(`${key}: <var>${mod[key]}</var>`);
      }
      const td = document.createElement('td');
      td.colSpan = 3;
      td.innerHTML = mod_value.join(', ');
      tr.appendChild(td);
      sftable_foot.appendChild(tr);
    }
  }
  sftable.appendChild(sftable_foot);
}

function viewInstrument(sf, preset, inst) {
  console.debug('viewInstrument(sf, preset, inst)');
  console.debug(inst);
  viewBags(sf, preset, inst);
}

function viewSample(sf, preset, inst, sample) {
  console.debug('viewSample(sf, preset, inst, sample)');
  console.debug(sample);
  const context = acontext;
  // src.disconnect(context.destination);
  const sftitle = document.getElementById('sftitle');
  sftitle.innerHTML = 'Sample: ' + sample['name'];

  const sfback = document.getElementById('sfback');
  sfback.disabled = '';

  const sfwave = document.getElementById('sfwave');
  sfwave.style.display = 'block';

  const sample_keylist = [
    'name',
    'start',
    'end',
    'startLoop',
    'endLoop',
    'sampleRate',
    'originalPitch',
    'pitchCorrection',
    'sampleLink',
    'sampleType',
  ];
  const sftable = document.getElementById('sftable');
  sftable.innerHTML = null;

  const sftable_body = document.createElement('tbody');
  for (const idx in sample_keylist) {
    const key = sample_keylist[idx];
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.innerHTML = key;
    tr.appendChild(th);
    let td = document.createElement('td');
    td.innerHTML = sample[key];
    tr.appendChild(td);

    td = document.createElement('td');
    if (key === 'start') {
      const playButton = document.createElement('button');
      playButton.className = 'btn btn-sm btn-success';
      playButton.innerHTML = '<i class="bi bi-play"></i> Play';
      playButton.addEventListener('click', () => {
        allNoteOff();
        src = context.createBufferSource();
        const buf = context.createBuffer(
          1,
          waveTableLength,
          context.sampleRate
        );
        const data = buf.getChannelData(0);
        for (let i = 0; i < waveTableLength; i++) {
          data[i] = waveTable[i];
        }
        src.buffer = buf;
        if ('loopStart' in src) {
          // Chrome
          src.loop = true;
          src.loopStart = (startLoop - start) / context.sampleRate;
          src.loopEnd = (endLoop - start) / context.sampleRate;
          src.connect(context.destination);
          src.start();
        } else {
          // iOS
          // src.loop = true;
          // src.loopStart = (startLoop - start) / context.sampleRate;
          // src.loopEnd = (endLoop - start) / context.sampleRate;
          src.connect(context.destination);
          src.start();
        }
      });
      td.appendChild(playButton);
      const stopButton = document.createElement('button');
      stopButton.className = 'btn btn-sm btn-danger';
      stopButton.innerHTML = '<i class="bi bi-stop"></i> stop';
      stopButton.addEventListener('click', () => {
        allNoteOff();
      });
      td.appendChild(stopButton);
    }
    if (key === 'startLoop') {
      const playLoopButton = document.createElement('button');
      playLoopButton.innerHTML = '<i class="bi bi-play"></i> Play (Loop)';
      playLoopButton.className = 'btn btn-sm btn-info';
      playLoopButton.addEventListener('click', () => {
        allNoteOff();
        src2 = context.createBufferSource();
        const buf2 = context.createBuffer(
          1,
          waveLoopLength,
          context.sampleRate
        );
        const data2 = buf2.getChannelData(0);
        for (let i = 0; i < waveLoopLength; i++) {
          data2[i] = waveLoopTable[i];
        }
        src2.buffer = buf2;
        src2.loop = true;
        src2.loopStart = 100;
        src2.connect(context.destination);
        src2.start();
      });
      td.appendChild(playLoopButton);
      const stopLoopButton = document.createElement('button');
      stopLoopButton.className = 'btn btn-sm btn-warning';
      stopLoopButton.innerHTML = '<i class="bi bi-stop"></i> Stop (Loop)';
      stopLoopButton.addEventListener('click', () => {
        allNoteOff();
      });
      td.appendChild(stopLoopButton);
    }
    tr.appendChild(td);
    sftable_body.appendChild(tr);
  }
  sftable.appendChild(sftable_body);

  const start = sample['start']; // maybe, sample offset (not byte offset)
  const end = sample['end'];
  const startLoop = sample['startLoop'];
  const endLoop = sample['endLoop'];
  const sampleTable = new Uint8Array(sf.sfbuffer, sf.stda.smpl['offset']);
  const waveTableLength = end - start + 1;

  console.log('waveTableLength:' + waveTableLength);
  const waveTable = new Float32Array(waveTableLength);
  for (let i = 0, j = 2 * start; i < waveTableLength; i++) {
    let v = sampleTable[j++] + 0x100 * sampleTable[j++];
    v = v < 0x8000 ? v : v - 0x10000; // unsigned => signed
    waveTable[i] = v / 0x8000;
  }
  const waveLoopLength = endLoop - startLoop + 1;
  const waveLoopTable = new Float32Array(waveLoopLength);
  for (let i = 0, j = 2 * startLoop; i < waveLoopLength; i++) {
    let v = sampleTable[j++] + 0x100 * sampleTable[j++];
    v = v < 0x8000 ? v : v - 0x10000; // unsigned => signed
    waveLoopTable[i] = v / 0x8000;
  }

  const canvas_wave = document.getElementById('wave');
  const canvas_waveloop = document.getElementById('waveloop');
  const width_wave = canvas_wave.width;
  const width_waveloop = canvas_waveloop.width;
  const height_wave = canvas_wave.height;
  const height_waveloop = canvas_waveloop.height;

  // reset
  canvas_wave.width = width_wave;
  canvas_waveloop.width = width_waveloop;
  canvas_wave.height = height_wave;
  canvas_waveloop.height = height_waveloop;

  const ctx_wave = canvas_wave.getContext('2d');
  const ctx_waveloop = canvas_waveloop.getContext('2d');
  canvas_wave.style.backgroundColor = 'rgb(52, 58, 64)';
  canvas_waveloop.style.backgroundColor = 'rgb(52, 58, 64)';
  // wave
  ctx_wave.fillStyle = 'rgb(88, 21, 28)';
  const x_startLoop = (width_wave * (startLoop - start)) / (end - start + 1);
  const x_endLoop = (width_wave * (endLoop - start)) / (end - start + 1);
  ctx_wave.beginPath();
  ctx_wave.lineTo(x_startLoop, 0);
  ctx_wave.lineTo(x_startLoop, height_wave);
  ctx_wave.lineTo(x_endLoop, height_wave);
  ctx_wave.lineTo(x_endLoop, 0);
  ctx_wave.fill();
  ctx_wave.beginPath();
  ctx_wave.strokeStyle = 'rgb(210, 244, 234)';
  for (let x = 0; x < width_wave; x++) {
    const idx = (x * (waveTableLength / width_wave)) | 0;
    const y = height_wave / 2 - (height_wave / 2) * waveTable[idx];
    ctx_wave.lineTo(x, y);
  }
  ctx_wave.stroke();
  // waveLoop
  ctx_waveloop.strokeStyle = 'rgb(255, 243, 205)';
  ctx_waveloop.beginPath();
  for (let x = 0; x < width_waveloop; x++) {
    const idx = (x * (waveLoopLength / width_waveloop)) | 0;
    const y = height_waveloop / 2 - (height_waveloop / 2) * waveLoopTable[idx];
    ctx_waveloop.lineTo(x, y);
  }
  ctx_waveloop.stroke();

  /** @type {AudioBufferSourceNode} */
  let src = null;
  /** @type {AudioBufferSourceNode} */
  let src2 = null;
  const allNoteOff = () => {
    if (src !== null) {
      src.stop();
      src.disconnect(context.destination);
      src = null;
    }
    if (src2 !== null) {
      src2.stop();
      src2.disconnect(context.destination);
      src2 = null;
    }
  };

  addEventListener_BackButton(sfback, 'click', () => {
    console.log('click back button.');
    if (src) {
      src.stop();
    }
    if (src2) {
      src2.stop();
    }
    viewBags(this, sf, preset, inst, false);
  });
}
