import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { STANDARD_PAGE_LIMIT } from '../model/constants';
import { map } from 'rxjs/operators';

/**
 * Pagination renders all available page numbers and prev / next buttons.
 */
@Component({
  selector: 'sw-pagination',
  templateUrl: './sw-pagination.component.html',
  styleUrls: ['sw-pagination.component.scss'],
})
export class SwPaginationComponent implements OnInit, OnDestroy {
  /** Current page number */
  @Input() currentPage: number = 1;

  /** Current page size. Needed to (re)calculate the available amount of pages. */
  @Input() set pageSize(ps: number) {
    this._pageSize$.next(ps);
  }

  /** Count of available records in table. */
  @Input() set availableRecords(ar: number) {
    this._availableRecords$.next(ar);
  }

  /** Emits the clicked page number (not the index).*/
  @Output() clickedPage: EventEmitter<number> = new EventEmitter<number>();

  availablePagesCount$: Observable<number>;

  private _pageSize$ = new BehaviorSubject<number>(STANDARD_PAGE_LIMIT);
  private _availableRecords$ = new BehaviorSubject<number>(10);
  private _ngDestroy$ = new Subject();

  ngOnInit(): void {
    this.availablePagesCount$ = combineLatest([
      this._availableRecords$.pipe(filter((count) => !!count === true)),
      this._pageSize$,
    ]).pipe(
      takeUntil(this._ngDestroy$),
      map(([records, pageSize]) => {
        return Math.ceil(records / pageSize);
      }),
    );
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next(null);
  }

  changePage(clickedPage: number): void {
    this.clickedPage.next(clickedPage);
  }

  clickPrevious(): void {
    const prev: number = this.currentPage - 1;
    this.clickedPage.next(prev);
  }

  clickNext(): void {
    const nxt: number = this.currentPage + 1;
    this.clickedPage.next(nxt);
  }
}
