import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Pagination renders all available page numbers and prev / next buttons.
 *
 * Usage:
 * <lib-pagination
 *     [availableRecords]="82"
 *     [currentPageSize]="10"
 *     [currentPage]="3"
 *     (clickedPage)="changePage($event)"
 *  ></lib-pagination>
 */
@Component({
  standalone: true,
  selector: 'lib-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['pagination.component.scss'],
  imports: [AsyncPipe, NgClass, NgFor, NgIf],
})
export class LibPaginationComponent implements OnInit {
  /** Current page number */
  @Input() currentPage: number = 1;

  /** Current page size. Needed to (re)calculate the available amount of pages. */
  @Input() set currentPageSize(ps: number) {
    this._currentPageSize$.next(ps);
  }

  /** Count of available records in table. */
  @Input() set availableRecords(ar: number) {
    this._availableRecords$.next(ar);
  }

  /** Emits the clicked page number (not the index).*/
  @Output() clickedPage: EventEmitter<number> = new EventEmitter<number>();

  availablePagesCount$: Observable<number>;

  private _standardPageSize: number = 10;
  private _currentPageSize$ = new BehaviorSubject<number>(
    this._standardPageSize,
  );
  private _availableRecords$ = new BehaviorSubject<number>(
    this._standardPageSize,
  );

  ngOnInit(): void {
    this.availablePagesCount$ = combineLatest([
      this._availableRecords$.pipe(filter((count) => !!count === true)),
      this._currentPageSize$,
    ]).pipe(
      map(([records, pageSize]) => {
        return Math.ceil(records / pageSize);
      }),
    );
  }

  changePage(clickedPage: number): void {
    this.clickedPage.next(clickedPage);
  }

  protected clickPrevious(): void {
    const prev: number = this.currentPage - 1;
    this.clickedPage.next(prev);
  }

  protected clickNext(): void {
    const nxt: number = this.currentPage + 1;
    this.clickedPage.next(nxt);
  }
}
