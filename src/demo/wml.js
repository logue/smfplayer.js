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
      : import.meta.env.VITE_SOUNDFONT_URL ||
        `${import.meta.env.BASE_URL}Yamaha XG Sound Set.sf2`;

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

if (import.meta.env.VITE_GOOGLE_ANALYTICS_ID) {
  // Global site tag (gtag.js) - Google Analytics
  ((w, d, s, l, i) => {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s);
    const dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(
    window,
    document,
    'script',
    'dataLayer',
    import.meta.env.VITE_GOOGLE_ANALYTICS_ID
  );
}
