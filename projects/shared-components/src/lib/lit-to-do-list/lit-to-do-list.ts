import { css, CSSResult, html, LitElement, TemplateResult } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

interface ToDoItem {
  text: string;
  completed: boolean;
}
@customElement('lit-to-do-list')
export class LitToDoList extends LitElement {
  // similar to ViewChild
  @query('#newItem') input!: HTMLInputElement;

  @state() private _listItems: ToDoItem[] = [
    { text: 'Start Lit tutorial', completed: true },
    { text: 'Make to-do list', completed: false },
  ];
  @state() private _hideCompleted: boolean = false;

  static override styles: CSSResult = css`
    .todo-item {
      cursor: pointer;
    }
    .completed {
      text-decoration-line: line-through;
      color: #777;
    }
  `;

  override render() {
    const items: ToDoItem[] = this._hideCompleted
      ? this._listItems.filter((item: ToDoItem) => !item.completed)
      : this._listItems;
    const todos = html`
      <ul>
        ${items.map(
          (item) =>
            html` <li
              class=${classMap({
                completed: item.completed,
                'todo-item': true,
              })}
              @click=${() => this.toggleCompleted(item)}
            >
              ${item.text}
            </li>`,
        )}
      </ul>
    `;
    const caughtUpMessage: TemplateResult = html`
      <p>You've completed all ToDos!</p>
    `;
    const todosOrMessage: TemplateResult =
      items.length > 0 ? todos : caughtUpMessage;

    return html`
      <h2>To Do</h2>
      ${todosOrMessage}
      <input id="newItem" aria-label="New item" />
      <button @click=${this.addToDo}>Add</button>
      <br />
      <label>
        <input
          type="checkbox"
          @change=${this.setHideCompleted}
          ?checked=${this._hideCompleted}
        />
        Hide completed ToDos
      </label>
    `;
  }

  private addToDo() {
    this._listItems = [
      ...this._listItems,
      { text: this.input.value, completed: false },
    ];
    this.input.value = '';
  }

  private toggleCompleted(item: ToDoItem) {
    item.completed = !item.completed;
    this.requestUpdate();
  }

  private setHideCompleted(e: Event) {
    this._hideCompleted = (e.target as HTMLInputElement).checked;
  }
}
