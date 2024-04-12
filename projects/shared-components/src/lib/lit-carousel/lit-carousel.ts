import { html, LitElement, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { carouselStyles } from './lit-carousel-styles';

@customElement('lit-carousel')
export class LitCarousel extends LitElement {
  static override styles = carouselStyles;

  @property({ type: Number }) selected = 0;

  get maxSelected() {
    return this.childElementCount - 1;
  }

  hasValidSelected() {
    return this.selected >= 0 && this.selected <= this.maxSelected;
  }

  private selectedInternal = 0;
  private previous = 0;

  override render() {
    if (this.hasValidSelected()) {
      this.selectedInternal = this.selected;
    }

    return html`<div class="fit" @click=${this.clickHandler}>
      <slot name="selected"></slot>
    </div>`;
  }

  protected override updated(changedProperties: PropertyValues) {
    if (changedProperties.has('selected') && this.hasValidSelected()) {
      this.updateSlots();
      this.previous = this.selected;
    }
  }

  private updateSlots() {
    // ToDo: In most cases, it's not recommended to directly manipulate element light DOM children
    // However, at the time this tutorial has been authored, this isn't yet widely supported so the code here sets the element's slot.
    this.children[this.previous]?.removeAttribute('slot');
    this.children[this.selected]?.setAttribute('slot', 'selected');
  }

  private clickHandler(e: MouseEvent) {
    const i = this.selected + (Number(!e.shiftKey) || -1);
    this.selected = i > this.maxSelected ? 0 : i < 0 ? this.maxSelected : i;
    const change = new CustomEvent('change', {
      detail: this.selected,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(change);
  }
}
