import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  startWith,
  Subject,
  take,
  takeUntil,
} from 'rxjs';
import { STANDARD_PAGE_SIZE } from '../model/constants';
import { SwApiResponse } from '../model/interfaces';
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
    this._pageSize = ps;
    this.getAvailablePagesCount();
  }

  /** Endpoint that's data should be used for paging. Response carries the count of records. */
  @Input() endpoint: string;

  /** Emits the clicked page number (not the index).*/
  @Output() clickedPage: EventEmitter<number> = new EventEmitter<number>();

  availablePagesCount$ = new BehaviorSubject<number>(1);

  private _availableRecords$ = new BehaviorSubject<number>(STANDARD_PAGE_SIZE);
  private _pageSize: number = STANDARD_PAGE_SIZE;
  private _ngDestroy$ = new Subject();

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this._http
      .get(this.endpoint)
      .pipe(
        takeUntil(this._ngDestroy$),
        map((response: SwApiResponse) => {
          return response.count || response.total_records;
        }),
      )
      .subscribe((result: number) => this._availableRecords$.next(result));
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next(null);
  }

  /**
   * Calculates the available pages count, depending on the overall available records amd chosen page size.
   */
  getAvailablePagesCount(): void {
    combineLatest([this._availableRecords$, of(this._pageSize)])
      .pipe(
        takeUntil(this._ngDestroy$),
        map(([records, pageSize]) => {
          return Math.ceil(records / pageSize);
        }),
      )
      .subscribe((result: number) => this.availablePagesCount$.next(result));
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
