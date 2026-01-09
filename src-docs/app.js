import { CONSTANTS } from './constants.js';
import { FileManager } from './file-manager.js';
import { MessageHandler } from './message-handler.js';
import { PlayerController } from './player-controller.js';
import { ProgressMonitor } from './progress-monitor.js';
import { ThemeManager } from './theme-manager.js';
import { UIManager } from './ui-manager.js';

/**
 * Main Application
 */
export class Application {
  constructor(player, appState, params) {
    this.player = player;
    this.appState = appState;
    this.params = params;

    this.fileManager = new FileManager(player, appState, params);
    this.playerController = new PlayerController(player, this.fileManager);
    this.progressMonitor = new ProgressMonitor(player, appState);
    this.messageHandler = new MessageHandler(
      player,
      this.fileManager,
      appState
    );
    this.themeManager = new ThemeManager(player);
  }

  async initialize() {
    // Initialize player
    this.player.setLoop(document.getElementById('playerloop').checked);
    this.player.setTempoRate(document.getElementById('tempo').value);
    this.player.setMasterVolume(
      document.getElementById('volume').value *
        CONSTANTS.MASTER_VOLUME_MULTIPLIER
    );
    this.player.setWebMidiLink(
      import.meta.env.VITE_WML_URL || 'https://logue.dev/sf2synth.js/'
    );

    // Initialize UI components
    UIManager.initializeTooltips();
    UIManager.initializeTabs();
    this.themeManager.initialize();

    // Setup controls
    this.playerController.initializeControls();
    this.playerController.setupDragAndDrop();

    // Setup file selection
    this.setupFileSelection();

    // Initialize message handler
    this.messageHandler.initialize();

    // Start progress monitor
    this.progressMonitor.start();

    UIManager.formLock(false);
  }

  setupFileSelection() {
    const zips = document.getElementById('zips');

    document
      .getElementById('files')
      .addEventListener('change', () => this.fileManager.handleSelect());

    zips.addEventListener('change', e =>
      this.fileManager.loadSample(e.target.value)
    );

    if (this.params.zip && !this.appState.initialized) {
      zips.value = this.params.zip;
    } else {
      this.randomizeArchive();
    }

    this.fileManager.loadSample(zips.value);
  }

  randomizeArchive() {
    const select = document.getElementById('zips');
    if (select.length > 0) {
      select.selectedIndex = Math.floor(select.length * Math.random());
    }
  }
}
