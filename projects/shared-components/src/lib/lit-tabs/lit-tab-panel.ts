import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Tab panel element.
 * Should be used inside a Tabs element together with a tab header element.
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
 * <lit-tab-panel
 *   aria-labelledby="tabID-0"
 *   id="panelID-0"
 *   role="tabpanel"
 *   tabindex="0">
 *   <div class="tab-panel">
 *     <p>Lorem ipsum dolor sit amet</p>
 *   </div>
 * </lit-tab-panel>
 */
@customElement('lit-tab-panel')
export class LitTabPanel extends LitElement {
  static override styles = css`
    .tab-panel {
      padding: 10px;
    }
  `;

  /** The header ID the panel is associated to. */
  @property({ reflect: true, attribute: 'aria-labelledby' })
  ariaLabelledBy = '';

  /** CSS ID selector. Used for a11y aria controls support.*/
  @property({ reflect: true })
  override id = '';

  protected override firstUpdated(changed: PropertyValues) {
    this.role = 'tabpanel';
    this.tabIndex = 0; // makes panel tab-able
  }

  protected override render() {
    return html`<div class="tab-panel"><slot></slot></div>`;
  }
}
