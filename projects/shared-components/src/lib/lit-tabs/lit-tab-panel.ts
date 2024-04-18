import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('lit-tab-panel')
export class LitTabPanel extends LitElement {
  static override styles = css`
    .tab-panel {
      padding: 10px;
    }
  `;

  override render() {
    return html`<div class="tab-panel"><slot></slot></div>`;
  }
}
