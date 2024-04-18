import {
  css,
  CSSResult,
  html,
  LitElement,
  PropertyValues,
  TemplateResult,
} from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';
import { LitTab } from './lit-tab';

interface Tab {
  name: string;
  isActive: boolean;
}

@customElement('lit-tab-container')
export class LitTabContainer extends LitElement {
  static override styles: CSSResult = css`
    .tab-header-wrapper {
      border-bottom: 1px solid grey;
    }
    .tab-header {
      cursor: pointer;
      display: inline-block;
      padding: 6px;
      border: 1px solid lightgray;
      border-bottom-color: grey;
      margin-bottom: -1px;
    }
    .tab-header.is-active {
      border-color: grey;
      border-bottom-color: white;
    }
  `;

  get _slottedChildren() {
    const slot: HTMLSlotElement = this.shadowRoot.querySelector('slot');
    return slot?.assignedElements({ flatten: true });
  }

  @queryAssignedElements({ selector: 'lit-tab', flatten: true })
  private _tabsHtmlElements!: Array<LitTab>;

  private _visualTabs: Tab[] = [];
  private _tabFocus: number = 0;

  override firstUpdated(changedProperties: PropertyValues<this>) {
    this._tabsHtmlElements.forEach((elm) =>
      this._visualTabs.push({
        name: elm.getAttribute('tabHeading'),
        isActive: elm.hasAttribute('active'),
      }),
    );

    this.requestUpdate();
  }

  override render(): TemplateResult {
    return html` <div
        class="tab-header-wrapper"
        role="tablist"
        @click=${this.clickHandler}
        @keydown=${this.onHeaderKeyDown}
      >
        ${repeat(
          this._visualTabs,
          (tab: Tab) => tab.name,
          (tab: Tab, index: number) => html`
            <div
              aria-selected="${tab.isActive}"
              aria-controls="panel-${this.kebabCase(tab.name)}"
              id="tab-${this.kebabCase(tab.name)}"
              role="tab"
              tabindex="${this.getAriaTabIndex(tab.isActive)}"
              class=${classMap({
                'is-active': tab.isActive,
                'tab-header': true,
              })}
            >
              ${tab.name}
            </div>
          `,
        )}
      </div>
      <slot></slot>`;
  }

  private clickHandler(e: MouseEvent) {
    const clickedTab: HTMLElement = e.target as HTMLElement;
    const clickedTabIdx: number = this._visualTabs.findIndex(
      (elm: Tab) => elm.name === clickedTab.innerText,
    );

    this._tabFocus = clickedTabIdx;
    clickedTab.focus();

    // remove all active states
    this._visualTabs.forEach((elm: Tab) => (elm.isActive = false));
    this._tabsHtmlElements.forEach((elm) => elm.removeAttribute('active'));

    // set active state of clicked element
    this._tabsHtmlElements[clickedTabIdx]?.setAttribute('active', 'true');
    this._visualTabs = Object.assign([], this._visualTabs, {
      [clickedTabIdx]: { name: clickedTab.innerText, isActive: true },
    });

    this.requestUpdate();
  }

  private kebabCase(value: string): string {
    return value
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  private getAriaTabIndex(active: boolean): number {
    return active ? 0 : -1;
  }

  private _focusPrevTab() {
    if (this._tabFocus === 0) {
      this._tabFocus = this._visualTabs.length - 1;
    } else {
      this._tabFocus -= 1;
    }
  }

  private _focusNextTab() {
    if (this._tabFocus === this._visualTabs.length - 1) {
      this._tabFocus = 0;
    } else {
      this._tabFocus += 1;
    }
  }

  private onHeaderKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
      ev.preventDefault();
      this._tabsHtmlElements[this._tabFocus]?.removeAttribute('active');
      this._visualTabs = Object.assign([], this._visualTabs, {
        [this._tabFocus]: {
          name: this._visualTabs[this._tabFocus].name,
          isActive: false,
        },
      });

      if (ev.key === 'ArrowLeft') {
        this._focusPrevTab();
      } else if (ev.key === 'ArrowRight') {
        this._focusNextTab();
      }

      this._tabsHtmlElements[this._tabFocus]?.setAttribute('active', 'true');
      this._tabsHtmlElements[this._tabFocus]?.focus();
      this._visualTabs = Object.assign([], this._visualTabs, {
        [this._tabFocus]: {
          name: this._visualTabs[this._tabFocus].name,
          isActive: true,
        },
      });
    }

    if (ev.key === 'Enter') {
      ev.preventDefault();
      // this.selectTab(this._tabFocus);
    }
    this.requestUpdate();
  }
}
