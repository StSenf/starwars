import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement } from 'lit/decorators.js';
import { LitTabHead } from './lit-tab-head';
import { LitTabPanel } from './lit-tab-panel';

/**
 * Tabs element.
 * Only tab header and tab panel elements are allowed inside.
 *
 * Usage:
 * <lit-tabs>
 *   <lit-tab-head tabHeading="Recipe 1"></lit-tab-head>
 *   <lit-tab-panel><p>Lorem ipsum dolor sit amet</p></lit-tab-panel>
 *
 *   <lit-tab-head tabHeading="Recipe 2"></lit-tab-head>
 *   <lit-tab-panel><p>Labore et dolore magna</p></lit-tab-panel>
 * </lit-tabs>
 */
@customElement('lit-tabs')
export class LitTabs extends LitElement {
  static override styles = css`
    nav {
      width: 100%;
      display: flex;
    }
  `;

  private _tabHeaders: LitTabHead[];
  private _panels: LitTabPanel[];
  private _tabFocus: number = 0;

  protected override firstUpdated(changedProperties: PropertyValues<this>) {
    this.role = 'tablist';

    this._tabHeaders = Array.from(this.querySelectorAll('lit-tab-head'));
    this._panels = Array.from(this.querySelectorAll('lit-tab-panel'));

    this._tabHeaders.forEach((elm: LitTabHead, index: number) => {
      elm.setAttribute('slot', 'tab');
      elm.ariaControls = `panelID-${index}`;
      elm.id = `tabID-${index}`;
    });
    this._panels.forEach((elm: LitTabPanel, index: number) => {
      elm.ariaLabelledBy = `tabID-${index}`;
      elm.id = `panelID-${index}`;
    });

    const hasActiveTab: boolean = !!this._tabHeaders.find((elm) =>
      elm.hasAttribute('active'),
    );
    this.selectTab(
      hasActiveTab
        ? this._tabHeaders.findIndex((elm) => elm.hasAttribute('active'))
        : 0,
    );
  }

  override render() {
    return html`
      <nav @click=${this.handleSelection} @keydown=${this.onHeaderKeyDown}>
        <slot name="tab"></slot>
      </nav>
      <slot name="panel"></slot>
    `;
  }

  private handleSelection(e: PointerEvent) {
    const clickedTabIdx: number = this._tabHeaders.indexOf(
      e.target as LitTabHead,
    );
    this.selectTab(clickedTabIdx ? clickedTabIdx : 0);
  }

  private selectTab(tabIdx: number) {
    this._tabFocus = tabIdx;

    // remove all active states
    this._tabHeaders.forEach((elm: LitTabHead) => {
      elm.removeAttribute('active');
    });
    this._panels.forEach((elm: LitTabPanel) => elm.removeAttribute('slot'));

    // set active state of clicked element
    this._tabHeaders[tabIdx].setAttribute('active', 'true');
    this._panels[tabIdx].setAttribute('slot', 'panel');
  }

  private _changeTabFocusToPrevTab(): void {
    const isFirstTabFocused: boolean = this._tabFocus === 0;

    if (isFirstTabFocused) {
      this._tabFocus = this._tabHeaders.length - 1;
    } else {
      this._tabFocus -= 1;
    }
  }

  private _changeTabFocusToNextTab(): void {
    const isLastTabFocused: boolean =
      this._tabFocus === this._tabHeaders.length - 1;

    if (isLastTabFocused) {
      this._tabFocus = 0;
    } else {
      this._tabFocus += 1;
    }
  }

  private onHeaderKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
      ev.preventDefault();
      this._tabHeaders[this._tabFocus].removeAttribute('active');

      if (ev.key === 'ArrowLeft') {
        this._changeTabFocusToPrevTab();
      } else if (ev.key === 'ArrowRight') {
        this._changeTabFocusToNextTab();
      }

      this._tabHeaders[this._tabFocus].setAttribute('active', 'true');
      this._tabHeaders[this._tabFocus].focus();
    }

    if (ev.key === 'Enter') {
      ev.preventDefault();
      this.selectTab(this._tabFocus);
    }
  }
}
