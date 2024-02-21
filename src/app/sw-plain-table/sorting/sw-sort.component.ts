import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { STANDARD_SORT_DIRECTION } from '../../shared/model/constants';
import { ColumnSorting, SortDirection } from '../../shared/model/interfaces';

/**
 * This component renders an arrow icon. By default, the icon is faced upwards (ASC).
 * If the current table sorting is sorted by the column the component belongs to, the arrow icon is
 * active and faces the given direction (ASC or DESC).
 *
 * When clicking the icon, a sort event gets emitted.
 *
 * Usage:
 * <sw-sort
 *   [currentTableSorting]="currentTableSorting"
 *   [columnName]="colConfig.columnDisplayProperty"
 *   (sorted)="sortColumnFn($event)"
 * ></sw-sort>
 */
@Component({
  selector: 'sw-sort',
  templateUrl: './sw-sort.component.html',
  styleUrls: ['./sw-sort.component.scss'],
})
export class SwSortComponent implements OnInit {
  /** The current table sorting */
  @Input() set currentTableSorting(c: ColumnSorting) {
    this._currentColumnSorting$.next(c);
  }
  /** The columns name. Needed to compare if table is sorted after this column. */
  @Input() set columnName(name: string) {
    this._columnName$.next(name);
  }

  /** Emits the desired sorting after this column. */
  @Output() sorted = new EventEmitter<ColumnSorting>();

  sortDirection = SortDirection;
  sortConfig$: Observable<ColumnSorting>;
  isActiveSortColumn$ = new BehaviorSubject<boolean>(false);
  private _sortConfig: ColumnSorting;
  private _currentColumnSorting$ = new BehaviorSubject<ColumnSorting>({});
  private _columnName$ = new BehaviorSubject<string>('');

  ngOnInit(): void {
    this.sortConfig$ = combineLatest([
      this._currentColumnSorting$,
      this._columnName$,
    ]).pipe(
      map(([currentColSorting, colName]) => {
        const isCurrentSortingByThisCol: boolean =
          currentColSorting.colName === colName;

        if (isCurrentSortingByThisCol) {
          this.isActiveSortColumn$.next(true);
          this._sortConfig = currentColSorting;
        } else {
          this.isActiveSortColumn$.next(false);
          this._sortConfig = {
            colName,
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
