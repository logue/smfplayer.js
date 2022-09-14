import SoundFont from '@logue/sf2synth';
import QueryString from 'query-string';
import '@logue/sf2synth/dist/style.css';

/** File Input Form */
const fileInput = document.getElementById('file');
/** Drag and Drop area */
const dd = document.getElementById('drop');
/** Build information */
const build = document.getElementById('build');
/** SoundFont Filename */
const name = document.getElementById('name');

window.addEventListener(
  'DOMContentLoaded',
  async () => {
    /** @type {QueryString.ParsedQuery} Query string */
    const qs = QueryString.parse(window.location.search);
    /** sf2synth.js Option */
    const option = { placeholder: 'placeholder' };
    if (qs.ui === 'false') {
      option.drawSynth = false;
    }

    /** WebMidiLink */
    const wml = new SoundFont.WebMidiLink(option);

    build.innerText = new Date(SoundFont.build).toLocaleString();

    const url = qs.soundfont
      ? qs.soundfont
      : import.meta.env.VITE_SOUNDFONT_URL || 'Yamaha XG Sound Set.sf2';

    name.innerText = url.match(/^http/)
      ? new URL(url).pathname.substring(url.lastIndexOf('/') + 1)
      : url;
    await wml.setup(url);

    /**
     * Load sound font
     *
     * @param {string} file
     */
    const handleSoundFont = file => {
      const reader = new FileReader();

      reader.readAsArrayBuffer(file);

      reader.onload = e => {
        console.log('loaded', file);
        document.getElementById('soundfont').innerText = file.name;
        const data = new Uint8Array(e.target.result);
        wml.setupByBuffer(data);
      };
    };

    // File selector
    fileInput.addEventListener('change', event => {
      event.preventDefault();
      handleSoundFont(fileInput.files[0]);
      fileInput.value = '';
    });

    dd.addEventListener('dragover', e => e.preventDefault(), true);

    dd.addEventListener(
      'drop',
      e => {
        const dt = e.dataTransfer;
        const files = dt.files;
        e.stopPropagation();
        e.preventDefault();
        handleSoundFont(files[0]);
      },
      true
    );
  },
  false
);
