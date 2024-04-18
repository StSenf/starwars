import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement } from 'lit/decorators.js';
import { LitTabHead } from './lit-tab-head';
import { LitTabPanel } from './lit-tab-panel';

@customElement('lit-tabs')
export class LitTabs extends LitElement {
  static override styles = css`
    nav {
      width: 100%;
      display: flex;
    }
  `;

  private _tabs: LitTabHead[];
  private _panels: LitTabPanel[];
  private _tabFocus: number = 0;

  protected override firstUpdated(changedProperties: PropertyValues<this>) {
    this._tabs = Array.from(this.querySelectorAll('lit-tab-head'));
    this._panels = Array.from(this.querySelectorAll('lit-tab-panel'));

    this.setAttribute('role', 'tablist');
    this._tabs.forEach((elm: LitTabHead, index: number) => {
      elm.setAttribute('slot', 'tab');
      elm.setAttribute('aria-selected', 'false');
      elm.setAttribute('aria-controls', `panel-${index}`);
      elm.setAttribute('id', `tabID-${index}`);
      elm.setAttribute('role', 'tab');
      elm.setAttribute('tabindex', '-1');
    });
    this._panels.forEach((elm: LitTabPanel, index: number) => {
      elm.setAttribute('aria-labelledby', `tabID-${index}`);
      elm.setAttribute('id', `panel-${index}`);
      elm.setAttribute('role', 'tabpanel');
      elm.setAttribute('tabindex', '0');
    });

    const hasActiveTab: boolean = !!this._tabs.find((elm) =>
      elm.hasAttribute('active'),
    );
    this.selectTab(
      hasActiveTab
        ? this._tabs.findIndex((elm) => elm.hasAttribute('active'))
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

  private selectTab(tabIdx: number) {
    this._tabFocus = tabIdx;

    // remove all active states
    this._tabs.forEach((elm: LitTabHead) => {
      elm.removeAttribute('active');
      elm.setAttribute('aria-selected', 'false');
      elm.setAttribute('tabindex', '-1');
    });
    this._panels.forEach((elm) => elm.removeAttribute('slot'));

    // set active state of clicked element
    this._tabs[tabIdx]?.setAttribute('active', 'true');
    this._tabs[tabIdx]?.setAttribute('aria-selected', 'true');
    this._tabs[tabIdx]?.setAttribute('tabindex', '0');
    this._panels[tabIdx].setAttribute('slot', 'panel');
  }

  private handleSelection(e: PointerEvent) {
    const clickedTabIdx: number = this._tabs.indexOf(e.target as LitTabHead);
    this.selectTab(clickedTabIdx ? clickedTabIdx : 0);
  }

  private _focusPrevTab() {
    if (this._tabFocus === 0) {
      this._tabFocus = this._tabs.length - 1;
    } else {
      this._tabFocus -= 1;
    }
  }

  private _focusNextTab() {
    if (this._tabFocus === this._tabs.length - 1) {
      this._tabFocus = 0;
    } else {
      this._tabFocus += 1;
    }
  }

  private onHeaderKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
      ev.preventDefault();
      this._tabs[this._tabFocus].setAttribute('tabindex', '-1');

      if (ev.key === 'ArrowLeft') {
        this._focusPrevTab();
      } else if (ev.key === 'ArrowRight') {
        this._focusNextTab();
      }

      this._tabs[this._tabFocus].setAttribute('tabindex', '0');
      this._tabs[this._tabFocus].focus();
    }

    if (ev.key === 'Enter') {
      ev.preventDefault();
      this.selectTab(this._tabFocus);
    }
  }
}
