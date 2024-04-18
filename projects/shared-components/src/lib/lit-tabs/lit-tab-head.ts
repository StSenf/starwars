import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lit-tab-head')
export class LitTabHead extends LitElement {
  static override styles = css`
    :host([active]) {
      border-color: black;
      color: black;
      font-weight: bold;
    }
    :host(:not([active]):hover) {
      color: slategrey;
    }
    :host {
      cursor: pointer;
      padding: 1rem 2rem;
      flex: 1 1 auto;
      color: var(--color-darkGrey);
      border-bottom: 2px solid lightgrey;
      text-align: center;
    }
  `;

  @property() tabHeading: string;

  override render() {
    return html`${this.tabHeading}`;
  }
}
