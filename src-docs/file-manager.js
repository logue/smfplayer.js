import * as zip from '@zip.js/zip.js';
import { convert } from 'encoding-japanese';
import { createWriteStream } from 'streamsaver';

import { CONSTANTS, FILE_LOADERS } from './constants.js';
import { UIManager } from './ui-manager.js';

/**
 * File Manager
 */
export class FileManager {
  constructor(player, appState, params) {
    this.player = player;
    this.appState = appState;
    this.params = params;
    this.currentZip = null;
  }

  /**
   * Handle file selection from dropdown
   */
  async handleSelect() {
    const select = document.getElementById('files');
    const filename = select.value;

    if (!filename) return;

    // Stop and reset player before loading new file
    this.player.stop();
    this.player.init();

    const entries = await this.currentZip.getEntries();

    const entry = entries.find(e => e.filename === filename);
    const writer = new zip.Uint8ArrayWriter();
    const data = await entry.getData(writer);

    this.handleInput(filename, data);

    UIManager.updateInfo(`Now playing "${filename}".`, true);

    this.updateDocumentMetadata(filename);
    this.updateUrlHash(filename);
  }

  /**
   * Handle file input (load and play)
   */
  handleInput(filename, buffer) {
    // Note: stop() and init() are called by the loader methods (e.g., loadMidiFile)
    // but we ensure all sounds are stopped here
    this.player.sendAllSoundOff();

    this.clearMetadata();

    const ext = filename.split('.').pop().toLowerCase();
    const loaderMethod = FILE_LOADERS[ext];

    if (loaderMethod && typeof this.player[loaderMethod] === 'function') {
      try {
        this.player[loaderMethod](buffer);
      } catch (error) {
        console.error(`Failed to load file "${filename}":`, error);
        UIManager.updateInfo(
          `Error: Failed to load "${filename}". File may be corrupted or invalid.`,
          false
        );
        return;
      }
    } else {
      console.error(`Unsupported file extension: ${ext}`);
      UIManager.updateInfo(`Error: Unsupported file type "${ext}".`, false);
      return;
    }

    this.player.setMasterVolume(
      document.getElementById('volume').value *
        CONSTANTS.MASTER_VOLUME_MULTIPLIER
    );
    this.player.play();
  }

  /**
   * Handle dropped file
   */
  handleFile(file) {
    UIManager.updateInfo('Now Loading...');

    const progressOuter = document.createElement('div');
    progressOuter.className = 'progress';
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar progress-warning';

    progressOuter.appendChild(progressBar);
    document.getElementById('info').appendChild(progressOuter);

    const reader = new FileReader();
    this.player.sendGmReset();

    reader.onload = e => {
      const input = new Uint8Array(e.target.result);
      this.handleInput(file.name, input);
      progressOuter.remove();
      UIManager.updateInfo(`Now Playing "${file.name}".`, true);
    };

    reader.onloadstart = () => {
      const info = document.getElementById('info');
      info.classList.remove('alert-success');
      info.classList.add('alert-warning');
    };

    reader.onprogress = e => {
      if (e.lengthComputable) {
        const percentLoaded = Math.round((e.loaded / e.total) * 100);
        progressBar.style.width = percentLoaded + '%';
        progressBar.innerText = percentLoaded + ' %';
      }
    };

    reader.readAsArrayBuffer(file);
  }

  /**
   * Load ZIP archive
   */
  async loadSample(zipfile) {
    UIManager.formLock(true);

    const select = document.getElementById('files');

    try {
      const blob = await this.fetchWithCache(zipfile);
      await this.loadZipEntries(blob, select);

      if (this.params.file && !this.appState.initialized) {
        select.value = this.params.file;
        await this.handleSelect();
      }

      this.appState.initialized = true;
    } catch (error) {
      console.error('Error loading sample:', error);
      UIManager.updateInfo('Error loading file archive.');
    } finally {
      UIManager.formLock(false);
    }
  }

  /**
   * Fetch file with cache support
   */
  async fetchWithCache(url) {
    const cache = await window.caches.open(CONSTANTS.CACHE_NAME);
    const cached = await cache.match(url);

    if (cached) {
      return await cached.blob();
    }

    const response = await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    cache.put(url, response.clone());
    return await response.blob();
  }

  /**
   * Load ZIP entries into select dropdown
   */
  async loadZipEntries(blob, select) {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }

    this.currentZip = new zip.ZipReader(new zip.BlobReader(blob), {
      filenameEncoding: 'Shift_JIS',
      decodeText: (value, encoding) => {
        // encoding-japaneseを使用してShift_JISをデコード
        if (encoding === 'Shift_JIS' || encoding === 'shift_jis') {
          const decoded = convert(value, {
            to: 'UNICODE',
            from: 'SJIS',
            type: 'string',
          });
          return decoded;
        }
        // その他のエンコーディングはzip.jsのデフォルト処理に任せる
        return undefined;
      },
    });

    const entries = await this.currentZip.getEntries();

    entries.forEach(entry => {
      const ext = entry.filename
        .slice(entry.filename.lastIndexOf('.'))
        .toLowerCase();

      if (ext === '/' || !CONSTANTS.AVAILABLE_EXTS.includes(ext)) {
        return;
      }

      const option = document.createElement('option');
      option.textContent = entry.filename;
      option.value = entry.filename;
      select.appendChild(option);
    });

    // Randomize initial selection
    this.randomizeSelection(select);
  }

  /**
   * Randomize select dropdown selection
   */
  randomizeSelection(select) {
    if (select.length === 0) return;

    const prev = select.selectedIndex;
    let next = prev;
    while (prev === next && select.length > 1) {
      next = Math.floor(select.length * Math.random());
    }
    select.selectedIndex = next;
  }

  /**
   * Download current file
   */
  async downloadCurrentFile() {
    const select = document.getElementById('files');
    const option = select.querySelectorAll('option')[select.selectedIndex];
    const filename = option.value;

    const entries = await this.currentZip.getEntries();

    const entry = entries.find(e => e.filename === filename);
    const bytes = await entry.getData(new zip.Uint8ArrayWriter());

    const fileStream = createWriteStream(filename, {
      size: bytes.byteLength,
    });

    const writer = fileStream.getWriter();
    await writer.write(bytes);
    await writer.close();
  }

  /**
   * Navigate to previous/next file
   */
  navigateFile(direction) {
    const select = document.getElementById('files');
    const current = select.selectedIndex;

    if (direction === 'prev') {
      select.selectedIndex =
        current <= 0 ? select.options.length - 1 : current - 1;
    } else if (direction === 'next') {
      select.selectedIndex =
        current >= select.options.length - 1 ? 0 : current + 1;
    }

    this.handleSelect();
  }

  /**
   * Clear metadata fields
   */
  clearMetadata() {
    document.getElementById('music_title').value = '';
    document.getElementById('copyright').value = '';
    document.getElementById('text_event').value = '';
    document.title = 'SMF Player';
  }

  /**
   * Update document metadata
   */
  updateDocumentMetadata(filename) {
    document.getElementById('music_title').value =
      this.player.getSequenceName(1);
    document.getElementById('copyright').value = this.player.getCopyright();

    const zipsValue = document.getElementById('zips').value;
    document.title = `${filename} - ${zipsValue} / Standard MIDI Player for Web`;
  }

  /**
   * Update URL hash
   */
  updateUrlHash(filename) {
    const zipsValue = document.getElementById('zips').value;
    const hash = `#zip=${encodeURIComponent(zipsValue)}&file=${encodeURIComponent(filename)}`;

    if (window.history?.pushState) {
      window.history.pushState(document.title, null, hash);
    } else {
      document
        .querySelector('link[rel="canonical"]')
        .setAttribute('href', `${location.href}/${hash}`);
    }

    if (this.params.zip && this.params.file) {
      this.player.play();
    }
  }
}
