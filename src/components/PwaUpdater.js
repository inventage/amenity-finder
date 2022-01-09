import { LitElement, html } from 'lit';

import '@material/mwc-snackbar';
import '@material/mwc-button';
import '@material/mwc-icon-button';

export class PwaUpdater extends LitElement {
  render() {
    return html` <mwc-snackbar
      labelText="New content is available!"
      .timeoutMs="${-1}"
      .open="${true}"
      data-snackbar
      @MDCSnackbar:closed="${PwaUpdater.onSnackbarClosed}"
    >
      <mwc-button slot="action">Reload</mwc-button>
      <mwc-icon-button icon="close" slot="dismiss"></mwc-icon-button>
    </mwc-snackbar>`;
  }

  static onSnackbarClosed(e) {
    const {
      detail: { reason },
    } = e;
    if (reason !== 'action') {
      return;
    }

    window.location.reload();
  }
}

customElements.define('pwa-updater', PwaUpdater);
