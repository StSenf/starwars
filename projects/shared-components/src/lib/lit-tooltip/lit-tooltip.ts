import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

// Events to turn on/off the tooltip
const enterEvents = ['pointerenter', 'focus'];
const leaveEvents = ['pointerleave', 'blur', 'keydown', 'click'];

@customElement('lit-tooltip')
export class LitTooltip extends LitElement {
  private _target: Element | null = null;

  get target() {
    return this._target;
  }

  set target(target: Element | null) {
    // Remove events from existing target
    if (this.target) {
      enterEvents.forEach((name) =>
        this.target!.removeEventListener(name, this.show),
      );
      leaveEvents.forEach((name) =>
        this.target!.removeEventListener(name, this.hide),
      );
    }

    // Add events to new target
    if (target) {
      enterEvents.forEach((name) => target!.addEventListener(name, this.show));
      leaveEvents.forEach((name) => target!.addEventListener(name, this.hide));
    }

    this._target = target;
  }

  // Lazy creation

  static lazy(target: Element, callback: (target: LitTooltip) => void) {
    const createTooltip = () => {
      const tooltip = document.createElement('simple-tooltip') as LitTooltip;
      callback(tooltip);
      target.parentNode!.insertBefore(tooltip, target.nextSibling);
      tooltip.show();
      // We only need to create the tooltip once, so ignore all future events.
      enterEvents.forEach((eventName) =>
        target.removeEventListener(eventName, createTooltip),
      );
    };

    enterEvents.forEach((eventName) =>
      target.addEventListener(eventName, createTooltip),
    );
  }

  static override styles = css`
    :host {
      display: inline-block;
      padding: 4px;
      border: 1px solid darkgray;
      border-radius: 4px;
      background: #ccc;
      pointer-events: none;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this.hide();
    this.target ??= this.previousElementSibling; //  if a target hasn't been set, default it to the previous DOM element
  }

  override render() {
    return html`<slot></slot>`;
  }

  show = () => {
    this.style.cssText = '';
  };

  hide = () => {
    this.style.display = 'none';
  };
}
