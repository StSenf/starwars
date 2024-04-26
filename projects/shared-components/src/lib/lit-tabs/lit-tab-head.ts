import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Tab header element.
 * Should be used inside a Tabs element together with a tab panel element.
 *
 * Usage:
 * <lit-tabs>
 *   <lit-tab-head tabHeading="Recipe 1"></lit-tab-head>
 *   <lit-tab-panel><p>Lorem ipsum dolor sit amet</p></lit-tab-panel>
 *
 *   <lit-tab-head tabHeading="Recipe 2"></lit-tab-head>
 *   <lit-tab-panel><p>Labore et dolore magna</p></lit-tab-panel>
 * </lit-tabs>
 *
 *
 * Rendered example:
 * <lit-tab-head
 *   tabheading="Recipe 1"
 *   aria-selected="false"
 *   tabindex="-1"
 *   aria-controls="panelID-0"
 *   id="tabID-0"
 *   role="tab">
 *   Recipe 1
 * </lit-tab-head>
 */
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

  @property({ type: Boolean })
  active = false;

  /** The panel ID the tab header is associated to. */
  @property({ reflect: true, attribute: 'aria-controls' })
  ariaControls = '';

  /** CSS ID selector. Used for a11y accessible name support.*/
  @property({ reflect: true })
  override id = '';

  override attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null,
  ): void {
    super.attributeChangedCallback(name, old, value);

    if (name === 'active') {
      const active = value !== null;
      this.ariaSelected = active ? 'true' : 'false';
      this.tabIndex = active ? 0 : -1;
    }
  }

  protected override firstUpdated(changed: PropertyValues) {
    this.role = 'tab';
  }

  protected override render() {
    return html`${this.tabHeading}`;
  }
}
