import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { STANDARD_SORT_DIRECTION } from '../../shared/model/constants';
import { ColumnSorting, SortDirection } from '../../shared/model/interfaces';

@Component({
  selector: 'sw-sort',
  templateUrl: './sw-sort.component.html',
  styleUrls: ['./sw-sort.component.scss'],
})
export class SwSortComponent implements OnInit {
  @Input() set currentColumnSorting(c: ColumnSorting) {
    this._currentColumnSorting$.next(c);
  }
  @Input() set columnSortConfig(config: ColumnSorting) {
    this._columnSortConfig$.next(config);
  }

  @Output() sorted = new EventEmitter<ColumnSorting>();

  sortDirection = SortDirection;
  sortConfig$: Observable<ColumnSorting>;
  isActiveSortColumn$ = new BehaviorSubject<boolean>(false);
  private _sortConfig: ColumnSorting;
  private _currentColumnSorting$ = new BehaviorSubject<ColumnSorting>({});
  private _columnSortConfig$ = new BehaviorSubject<ColumnSorting>({});

  ngOnInit(): void {
    this.sortConfig$ = combineLatest([
      this._currentColumnSorting$,
      this._columnSortConfig$,
    ]).pipe(
      map(([currentColSorting, colSortConfig]) => {
        const isCurrentSortingByThisCol: boolean =
          currentColSorting.colName === colSortConfig.colName;

        if (isCurrentSortingByThisCol) {
          this.isActiveSortColumn$.next(true);
          this._sortConfig = currentColSorting;
        } else {
          this.isActiveSortColumn$.next(false);
          this._sortConfig = {
            colName: colSortConfig.colName,
            direction: STANDARD_SORT_DIRECTION,
          };
        }

        return this._sortConfig;
      }),
    );
  }

  sort(desiredDirection: SortDirection): void {
    const sort: ColumnSorting = {
      colName: this._sortConfig.colName,
      direction: desiredDirection,
    };
    this.sorted.next(sort);
  }
}
