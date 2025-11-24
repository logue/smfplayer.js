import QueryString from 'query-string';

import { Application } from './app.js';
import { AppState } from './state.js';
import { UIManager } from './ui-manager.js';

import './style.scss';
import Player from '@/player.js';

// Initialize global instances
const player = new Player('#wml');
const appState = new AppState();
const params = QueryString.parse(window.location.hash);

// Initialize form lock
UIManager.formLock(true);

/**
 * Application Entry Point
 */
document.addEventListener('DOMContentLoaded', async () => {
  const app = new Application(player, appState, params);
  await app.initialize();
});
