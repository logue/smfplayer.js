import { CONSTANTS } from './constants.js';

/**
 * Progress Monitor
 */
export class ProgressMonitor {
  constructor(player, appState) {
    this.player = player;
    this.appState = appState;
  }

  start() {
    setInterval(() => this.update(), CONSTANTS.UPDATE_INTERVAL);
  }

  update() {
    if (!this.appState.isReady) return;

    this.updatePlayButton();
    this.updateProgressBar();
    this.updateTimeDisplay();
    this.updateTempo();
    this.updateLyrics();
    this.updateTextEvent();
  }

  updatePlayButton() {
    const playButton = document.getElementById('play');

    if (this.player.pause) {
      playButton.innerHTML = '<em class="bi bi-play"></em>';
      playButton.classList.remove('btn-success');
      playButton.classList.add('btn-primary');
    } else {
      playButton.innerHTML = '<em class="bi bi-pause"></em>';
      playButton.classList.remove('btn-primary');
      playButton.classList.add('btn-success');
    }
  }

  updateProgressBar() {
    const progressBar = document
      .getElementById('music-progress')
      .querySelector('.progress-bar');

    const percentage = Math.min(
      100,
      Math.round((this.player.getPosition() / this.player.getLength()) * 100)
    );

    progressBar.style.width = percentage + '%';
    progressBar.innerText = percentage + '%';
  }

  updateTimeDisplay() {
    document.getElementById('time-now').innerText = this.player.getTime();
    document.getElementById('time-total').innerText =
      this.player.getTotalTime();
  }

  updateTempo() {
    document.getElementById('current-tempo').innerText = this.player.getTempo();
  }

  updateLyrics() {
    const lyrics = this.player.getLyrics();
    if (!lyrics || lyrics.length === 0) return;

    if (this.appState.parentLyrics !== lyrics) {
      this.appState.lyric = '';

      const formattedLyrics = lyrics
        .replace(/\//g, '<br />')
        .replace(/>/g, '    ')
        .replace(/&m/g, '👨‍🎤')
        .replace(/&f/g, '👩‍🎤')
        .replace(/&c/g, '👫');

      this.appState.lyric += formattedLyrics;
      document.getElementById('lyrics').innerText = this.appState.lyric;
    }

    this.appState.parentLyrics = lyrics;
  }

  updateTextEvent() {
    const textEvent = this.player.getTextEvent();
    if (this.appState.parentTextEvent !== textEvent) {
      document.getElementById('text_event').value = textEvent;
      this.appState.parentTextEvent = textEvent;
    }
  }
}
