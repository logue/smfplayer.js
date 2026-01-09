import { UIManager } from './ui-manager.js';

/**
 * Message Handler for window.postMessage
 */
export class MessageHandler {
  constructor(player, fileManager, appState) {
    this.player = player;
    this.fileManager = fileManager;
    this.appState = appState;
  }

  initialize() {
    window.onmessage = e => this.handleMessage(e.data);
  }

  handleMessage(event) {
    const select = document.getElementById('files');
    const playButton = document.getElementById('play');

    switch (event) {
      case 'endoftrack':
        this.handleEndOfTrack(select, playButton);
        break;

      case 'progress':
        UIManager.updateInfo('Loading soundfont...');
        break;

      case 'link,ready':
        this.handleReady();
        break;
    }
  }

  handleEndOfTrack(select, playButton) {
    this.player.stop();

    playButton.innerHTML = '<em class="bi bi-play-fill"></em>';
    playButton.classList.add('btn-primary');
    playButton.classList.remove('btn-success');

    if (document.getElementById('random').checked) {
      this.randomPlay();
    } else {
      this.playNextTrack(select);
    }
  }

  handleReady() {
    this.appState.isReady = true;

    if (document.getElementById('random').checked) {
      this.fileManager.handleSelect();
    }

    UIManager.updateInfo('Ready.', true);
    UIManager.formLock(false);
  }

  playNextTrack(select) {
    if (select.selectedIndex === 0) return;

    const files = document.getElementById('files');
    files.selectedIndex =
      select.selectedIndex === files.options.length - 1
        ? 0
        : select.selectedIndex + 1;

    this.fileManager.handleSelect();
  }

  randomPlay() {
    const select = document.getElementById('files');
    select.selectedIndex = Math.floor(select.length * Math.random());
    this.fileManager.handleSelect();
  }
}
