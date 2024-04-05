import { LitElement, TemplateResult, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';

@customElement('lit-iterable-lists')
export class LitIterableLists extends LitElement {
  @state() private _items: Set<string> = new Set([
    'Apple',
    'Banana',
    'Grape',
    'Orange',
    'Lime',
  ]);

  @state() private _names: string[] = [
    'Chandler',
    'Phoebe',
    'Joey',
    'Monica',
    'Rachel',
    'Ross',
  ];

  @state() things = [
    'Raindrops on roses',
    'Whiskers on kittens',
    'Bright copper kettles',
    'Warm woolen mittens',
  ];

  static override styles = css`
    #box {
      display: block;
      width: 400px;
      height: 450px;
    }
    #board {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: repeat(8, 1fr);
      border: 2px solid #404040;
      box-sizing: border-box;
      height: 100%;
    }
    #board > div {
      padding: 2px;
    }
    .black {
      color: #ddd;
      background: black;
    }
    .white {
      color: gray;
      background: white;
    }
  `;

  override render(): TemplateResult {
    return html`
      <ul>
        ${map(this._items, (item: string) => html`<li>${item}</li>`)}
      </ul>

      <p>A list of names that include the letter "e"</p>
      <ul>
        ${this._names
          .filter((name: string) => name.includes('e'))
          .map((name: string) => html`<li>${name}</li>`)}
      </ul>

      <div>
        <h3>Simple numbers (create iterable with range)</h3>
        ${map(range(8), (i) => html`<div>Number ${i + 1}</div>`)}
      </div>

      <div id="box">
        <h3>Chess board</h3>
        <div id="board">
          ${map(range(8), (row) =>
            map(
              range(8),
              (col) => html`
                <div class="${this.getColor(row, col)}">
                  ${getLabel(row, col)}
                </div>
              `,
            ),
          )}
        </div>
      </div>

      <h3 style="margin-top:60px">A few of my favorite things</h3>
      <ul>
        ${map(
          this.things,
          (thing, index) => html`
            <li>
              ${thing}
              <button key=${index} @click=${this.deleteIt}>Delete</button>
            </li>
          `,
        )}
      </ul>
    `;
  }

  private getColor(row: number, col: number) {
    return (row + col) % 2 ? 'white' : 'black';
  }

  private getLabel(row: number, col: number) {
    return `${String.fromCharCode(65 + col)}${8 - row}`;
  }

  private deleteThing(index: number) {
    this.things = this.things.filter((_, i) => i !== index);
  }

  private deleteIt(e: Event) {
    const clickedIdx: string = (e.target as Element).getAttribute('key')!;
    console.log(clickedIdx);
    this.things = this.things.filter((_, i) => i !== Number(clickedIdx));
  }
}

const getColor = (row: number, col: number) =>
  (row + col) % 2 ? 'white' : 'black';
const getLabel = (row: number, col: number) =>
  `${String.fromCharCode(65 + col)}${8 - row}`;
