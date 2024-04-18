import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';

@customElement('lit-tab')
export class LitTab extends LitElement {
  @property() tabHeading: string;
  @state() active: boolean;

  static override styles: CSSResult = css`
    :host([active]) {
      color: red;
      display: block;
    }
    :host(:not([active])) {
      display: none;
    }
    .tab-content {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid grey;
      border-top: 0;
      padding: 10px;
    }
  `;

  override render(): TemplateResult {
    return html` <div
      aria-labelledby="tab-${this.kebabCase(this.tabHeading)}"
      id="panel-${this.kebabCase(this.tabHeading)}"
      role="tabpanel"
      tabindex="0"
      class="tab-content"
    >
      <slot></slot>
    </div>`;
  }

  private kebabCase(value: string): string {
    return value
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }
}
