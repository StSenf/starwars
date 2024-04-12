import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('lit-word-viewer')
export class LitWordViewer extends LitElement {
  static override styles = css`
    :host {
      background-color: green;
      color: violet;
      cursor: pointer;
      display: block;
    }

    pre {
      padding: 0.2em;
    }
  `;

  @state() private playDirection: -1 | 1 = 1;
  @state() private idx = 0;
  @property() words = 'initial value';

  private _intervalTimer?: number;

  // override connectedCallback() {
  //   super.connectedCallback();
  //   this._intervalTimer = setInterval(this.tickToNextWord, 1000);
  // }
  //
  // override disconnectedCallback() {
  //   super.disconnectedCallback();
  //   clearInterval(this._intervalTimer);
  //   this._intervalTimer = undefined;
  // }

  override render() {
    const splitWords: string[] = this.words.split('.');
    const idx =
      ((this.idx % splitWords.length) + splitWords.length) % splitWords.length;
    const word = splitWords[idx];

    return html`<pre @click=${this.switchPlayDirection}>${word}</pre>`;
  }

  tickToNextWord = () => {
    this.idx += this.playDirection;
  };

  switchPlayDirection() {
    this.playDirection *= -1;
  }
}
