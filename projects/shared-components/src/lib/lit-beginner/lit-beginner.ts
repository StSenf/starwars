import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('lit-beginner')
export class LitBeginner extends LitElement {
  @property() message: string = 'Hello again.';
  @property({ type: Boolean }) checked = false;
  @state() private name: string = 'Your name here';

  override render() {
    return html`
      <p>Hello, ${this.name}</p>
      <input
        ?disabled=${!this.checked}
        @input=${this.changeName}
        placeholder="Enter your name"
        type="text"
      />
      <label>
        <input type="checkbox" @change=${this.setChecked} />
        Enable editing
      </label>
      <button @click=${this.handleClick}>Click me!</button>
    `;
  }

  private changeName(event: Event) {
    const input = event.target as HTMLInputElement;
    this.name = input.value;
  }

  private handleClick(event: Event): void {
    console.log('click event', event);
    console.log('event.target', event.target);
  }

  private setChecked(event: Event) {
    console.log('event.target', event.target);
    this.checked = (event.target as HTMLInputElement).checked;
  }
}
