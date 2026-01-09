import { CONSTANTS } from './constants.js';

/**
 * Player Controller
 */
export class PlayerController {
  constructor(player, fileManager) {
    this.player = player;
    this.fileManager = fileManager;
  }

  initializeControls() {
    // Tempo control
    document.getElementById('tempo').addEventListener('change', e => {
      const value = e.target.value;
      this.player.setTempoRate(value);
      document.getElementById('tempo_value').innerText = value;
    });

    // Volume control
    document.getElementById('volume').addEventListener('change', e => {
      const value = e.target.value;
      this.player.setMasterVolume(value * CONSTANTS.MASTER_VOLUME_MULTIPLIER);
      document.getElementById('volume_value').innerText = value;
    });

    // Navigation buttons
    document
      .getElementById('prev')
      .addEventListener('click', () => this.fileManager.navigateFile('prev'));

    document
      .getElementById('next')
      .addEventListener('click', () => this.fileManager.navigateFile('next'));

    // Play/Pause button
    document.getElementById('play').addEventListener('click', () => {
      if (this.player.pause) {
        this.player.play();
      } else {
        this.player.stop();
      }
    });

    // Stop button
    document.getElementById('stop').addEventListener('click', () => {
      this.fileManager.handleSelect();
      history.pushState('', document.title, window.location.pathname);
      setTimeout(() => this.player.stop(), 51);
    });

    // Panic button
    document
      .getElementById('panic')
      .addEventListener('click', () => this.player.sendAllSoundOff());

    // Reset button
    document
      .getElementById('reset')
      .addEventListener('click', () => this.player.sendGmReset());

    // Download button
    document
      .getElementById('download')
      .addEventListener('click', () => this.fileManager.downloadCurrentFile());

    // Synth selector
    document.getElementById('synth').addEventListener('change', e => {
      this.player.stop();
      this.player.setWebMidiLink(e.target.value, 'wml');
    });
  }

  setupDragAndDrop() {
    const playerCard = document.getElementById('player');

    playerCard.addEventListener(
      'drop',
      event => {
        const dt = event.dataTransfer;
        if (dt.files.length) {
          event.preventDefault();
          event.stopPropagation();
          this.fileManager.handleFile(dt.files[0]);
        }
        playerCard.classList.remove('bg-info');
      },
      false
    );

    playerCard.addEventListener(
      'dragover',
      event => {
        event.preventDefault();
        event.stopPropagation();
        playerCard.classList.add('bg-info');
      },
      false
    );

    playerCard.addEventListener(
      'dragleave',
      event => {
        event.preventDefault();
        event.stopPropagation();
        playerCard.classList.remove('bg-info');
      },
      false
    );
  }
}
