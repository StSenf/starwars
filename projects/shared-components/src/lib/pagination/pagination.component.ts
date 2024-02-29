import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Pagination renders all available page numbers and prev / next buttons.
 * The component always shows the first and last two pages plus the current one, and it's two previous and next pages.
 * If there are more then 9 pages to be shown in the pagination, dots will be used to reduce the amount
 * of rendered HTML elements (e.g. [1, 2, '...', 15, 16, 17, 18, 19, '...', 99, 100]).
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
  @Input() set currentPage(p: number) {
    this._currentPage = p;
    this._currentPage$.next(p);
  }
  get currentPage(): number {
    return this._currentPage;
  }

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

  availablePagesCount: number;
  availablePages$: Observable<(string | number)[]>; // this is used to render the pagination HTML elements to the template

  private _standardPageSize: number = 10;
  private _currentPage: number;
  private _currentPage$ = new BehaviorSubject<number>(1);
  private _currentPageSize$ = new BehaviorSubject<number>(
    this._standardPageSize,
  );
  private _availableRecords$ = new BehaviorSubject<number>(
    this._standardPageSize,
  );

  ngOnInit(): void {
    this.availablePages$ = combineLatest([
      this._availableRecords$,
      this._currentPageSize$,
      this._currentPage$,
    ]).pipe(
      map(([records, pageSize, currentPage]) => {
        const totalPagesCount: number = Math.ceil(records / pageSize);
        this.availablePagesCount = totalPagesCount;

        return this.arrangeAvailablePages(currentPage, totalPagesCount);
      }),
    );
  }

  changePage(clickedPage: any): void {
    if (isNaN(clickedPage) === false) {
      this.clickedPage.next(clickedPage);
    }
  }

  protected clickPrevious(): void {
    const prev: number = this.currentPage - 1;
    if (prev > 0) {
      this.clickedPage.next(prev);
    }
  }

  protected clickNext(): void {
    const nxt: number = this.currentPage + 1;
    if (nxt <= this.availablePagesCount) {
      this.clickedPage.next(nxt);
    }
  }

  /**
   * Returns an array with all available page numbers and possible dots separators.
   * This array is used to render the HTML elements of this component.
   *
   * The array always carries the first and last two pages plus the current one, and it's two previous and next pages.
   * If there are more then 9 pages to be shown in the pagination, dots will be used to reduce the amount
   * of rendered HTML elements.
   *
   * Example:
   * current page = 17
   * total pages = 100
   * returned array: [1, 2, '...', 15, 16, 17, 18, 19, '...', 99, 100]
   *
   * @param currentPage
   * @param totalPagesCount
   */
  private arrangeAvailablePages(
    currentPage: number,
    totalPagesCount: number,
  ): (string | number)[] {
    const availablePages: any[] = [];
    let isLeadingDotsSet = false;
    let isTrailingDotsSet = false;

    if (totalPagesCount <= 9) {
      for (let i = 1; i <= totalPagesCount; i++) {
        availablePages.push(i);
      }
    } else {
      for (let i = 1; i <= totalPagesCount; i++) {
        const isIFirstTwoPages = i <= totalPagesCount - (totalPagesCount - 2);
        const isILastTwoPages = i >= totalPagesCount - 1;
        const isIInRangeOfPrevAndNxtTwoPagesOfCurrentPage =
          i >= currentPage - 2 && i <= currentPage + 2;

        const areThereMoreThenTwoPrevOfCurrentPage =
          i > totalPagesCount - (totalPagesCount - 2) && i < currentPage - 2;
        const areThereMoreThenTwoNxtOfCurrentPage =
          i > currentPage + 2 && i < totalPagesCount - 1;

        if (
          isIFirstTwoPages ||
          isIInRangeOfPrevAndNxtTwoPagesOfCurrentPage ||
          isILastTwoPages
        ) {
          // pushes the first and last two pages to array
          // and pushes the prev and next two of the current page to array
          // e.g. current page = 17; total pages = 100; array => [1, 2, 15, 16, 17, 18, 19, 99, 100]
          availablePages.push(i);
        } else if (
          areThereMoreThenTwoPrevOfCurrentPage &&
          isLeadingDotsSet === false
        ) {
          // push dots once if there are more than 2 previous pages of current
          // e.g. current page = 17; total pages = 100; array => [1, 2, .., 15, 16, 17, 18, 19, 99, 100]
          availablePages.push('...');
          isLeadingDotsSet = true;
        } else if (
          areThereMoreThenTwoNxtOfCurrentPage &&
          isTrailingDotsSet === false
        ) {
          // push dots once if there are more than 2 next pages of current
          // e.g. current page = 17; total pages = 100; array => [1, 2, 15, 16, 17, 18, 19, '...',  99, 100]
          availablePages.push('...');
          isTrailingDotsSet = true;
        }
      }
    }

    return availablePages;
  }
}
