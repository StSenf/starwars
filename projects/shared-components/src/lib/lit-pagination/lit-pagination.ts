import { css, html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lit-pagination')
export class LitPagination extends LitElement {
  static override styles = css`
    button {
      padding: 5px 10px;
      cursor: pointer;
    }
    button[disabled] {
      cursor: inherit;
    }
    button[active] {
      cursor: inherit;
    }
    button[active] {
      background-color: blue;
      color: white;
    }
  `;

  /** Current page number */
  @property({ type: Number }) currentPage = 1;

  /** Current page size. Needed to (re)calculate the available amount of pages. */
  @property({ type: Number }) currentPageSize!: number;

  /** Overall available records that should be paged. */
  @property({ type: Number }) availableRecords!: number;

  private _availablePages: number[] = [];
  private _availablePagesCount: number;
  private _clickedPage: number;

  protected override willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties);

    if (
      (changedProperties.has('currentPageSize') ||
        changedProperties.has('availableRecords')) &&
      !!this.currentPageSize === true &&
      !!this.availableRecords === true
    ) {
      this._availablePagesCount = Math.ceil(
        this.availableRecords / this.currentPageSize,
      );
      this._availablePages = [];
      for (let i = 1; i <= this._availablePagesCount; i++) {
        this._availablePages.push(i);
      }
    }
  }

  override render(): TemplateResult {
    return html` <button
        type="button"
        class="prev-button"
        @click="${this.clickPrev}"
        ?disabled=${this.currentPage === 1}
      >
        Previous
      </button>
      ${this._availablePages.map(
        (page: number) =>
          html`<button
            type="button"
            class="page-button"
            @click="${this.clickPage}"
            ?active=${this.currentPage === page}
          >
            ${page}
          </button>`,
      )}
      <button
        type="button"
        class="next-button"
        @click="${this.clickNext}"
        ?disabled=${this.currentPage === this._availablePagesCount}
      >
        Next
      </button>`;
  }

  private clickPage(e: Event): void {
    this._clickedPage = Number((e.target as HTMLElement).innerText);
    this.emitPageClick();
  }

  private clickPrev(): void {
    this._clickedPage = this.currentPage - 1;
    this.emitPageClick();
  }

  private clickNext(): void {
    this._clickedPage = this.currentPage + 1;
    this.emitPageClick();
  }

  private emitPageClick() {
    const event = new CustomEvent('clickedPage', {
      detail: {
        message: 'A page was clicked',
        clickedPage: this._clickedPage,
      },
    });

    this.dispatchEvent(event);
  }
}
