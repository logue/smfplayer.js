import { Tab, Tooltip } from 'bootstrap';

/**
 * UI Manager
 */
export class UIManager {
  static formLock(lock = true) {
    document
      .querySelectorAll('input, button, select')
      .forEach(e => (e.disabled = lock));
  }

  static updateInfo(message, success = false) {
    const info = document.getElementById('info');
    info.innerText = message;
    info.classList.toggle('alert-success', success);
    info.classList.toggle('alert-warning', !success);
  }

  static initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('*[title]');
    [...tooltipTriggerList].map(
      tooltipTriggerEl => new Tooltip(tooltipTriggerEl)
    );
  }

  static initializeTabs() {
    const triggerTabList = [].slice.call(
      document.querySelectorAll('#control-tab button')
    );
    triggerTabList.forEach(triggerEl => {
      const tabTrigger = new Tab(triggerEl);
      triggerEl.addEventListener('click', event => {
        event.preventDefault();
        tabTrigger.show();
      });
    });
  }
}
