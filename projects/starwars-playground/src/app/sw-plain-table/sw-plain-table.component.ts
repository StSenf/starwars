import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
  NgTemplateOutlet,
} from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { LibPaginationComponent, LibToggleComponent } from 'shared-components';
import { SwApiResponse } from '../shared/interfaces';
import { TABLE_CONFIG } from './config/plain-table-config';
import {
  PAGE_LIMIT_OPTIONS,
  STANDARD_IS_DOT_TECH_ENDPOINT_ACTIVE_CHOICE,
  STANDARD_PAGE_LIMIT,
  STANDARD_SORT_DIRECTION,
  STANDARD_STABLE_TEMPLATE_CHOICE,
  STANDARD_TABLE_CONFIG,
} from './config/plain-table-constants';
import { SwDisplayValueComponent } from './display-value-component/sw-display-value.component';
import { SwEndpointTableRowComponent } from './endpoint-table-row/sw-endpoint-table-row.component';
import { SwStableLoadingDirective } from './loading/loading.directive';

import {
  ColumnSorting,
  PageLimitOptions,
  SwTableColConfig,
  SwTableConfig,
} from './model/plain-table.interfaces';
import { SwapiService } from './services/swapi.service';
import { SwSortComponent } from './sorting/sw-sort.component';

@Component({
  standalone: true,
  selector: 'sw-plain-table',
  templateUrl: './sw-plain-table.component.html',
  styleUrls: ['sw-plain-table.component.scss'],
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgFor,
    NgIf,
    NgClass,
    NgTemplateOutlet,
    SwSortComponent,
    SwDisplayValueComponent,
    SwStableLoadingDirective,
    LibToggleComponent,
    LibPaginationComponent,
    SwEndpointTableRowComponent,
  ],
})
export class SwPlainTableComponent implements OnInit, OnDestroy {
  tableConfig: SwTableConfig[] = TABLE_CONFIG;
  pageLimitConfig: PageLimitOptions[] = PAGE_LIMIT_OPTIONS;
  availableRecords: number;

  currentPageLimit: number = STANDARD_PAGE_LIMIT;
  currentPage: number = 1;
  currentTableConfig$ = new BehaviorSubject<SwTableConfig>(
    STANDARD_TABLE_CONFIG,
  );
  currentColumnSorting$ = new BehaviorSubject<ColumnSorting>({});
  // currentColumnSorting$ = new BehaviorSubject<ColumnSorting>(
  //   this.searchFirstSortableColumn(STANDARD_TABLE_CONFIG),
  // );

  apiResponse$: Observable<SwApiResponse>;
  isApiCallCompleted$ = new BehaviorSubject<boolean>(false);
  isStableTplRenderingActive$ = new BehaviorSubject<boolean>(
    STANDARD_STABLE_TEMPLATE_CHOICE,
  );

  searchControl: FormControl = new FormControl({
    value: '',
    disabled: false,
  });
  pageLimitControl: FormControl = new FormControl({
    value: this.currentPageLimit,
    disabled: false,
  });
  tableConfigControl: FormControl = new FormControl({
    value: STANDARD_TABLE_CONFIG,
    disabled: false,
  });
  sourceEndpointControl: FormControl = new FormControl({
    value: STANDARD_IS_DOT_TECH_ENDPOINT_ACTIVE_CHOICE,
    disabled: false,
  });
  stableTplRenderingToggle: FormControl = new FormControl({
    value: STANDARD_STABLE_TEMPLATE_CHOICE,
    disabled: true,
  });

  get isDotTechEndpointActive(): boolean {
    return this.sourceEndpointControl.getRawValue();
  }

  private _onDestroy$ = new Subject<any>();
  private _pageChange$ = new BehaviorSubject<number>(this.currentPage);
  private _previousPageLimit: number;
  private _previousSearchTerm: string = '';
  private _previousTableConfig: SwTableConfig;
  private _previousLimitEndpointChoice: boolean =
    STANDARD_IS_DOT_TECH_ENDPOINT_ACTIVE_CHOICE;

  constructor(private _swapiService: SwapiService) {}

  ngOnInit(): void {
    this.stableTplRenderingToggle.valueChanges
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((newState: boolean) => {
        this.isStableTplRenderingActive$.next(newState);
      });

    /**
     * Load table date on:
     *  - page change
     *  - source endpoint change ((de)activation of swapi.tech endpoint)
     *  - page limit change
     *  - search term change
     *  - sorting change
     *  - table config change
     */
    this.apiResponse$ = combineLatest([
      this._pageChange$,
      this.sourceEndpointControl.valueChanges.pipe(
        startWith(STANDARD_IS_DOT_TECH_ENDPOINT_ACTIVE_CHOICE),
      ),
      this.pageLimitControl.valueChanges.pipe(startWith(this.currentPageLimit)),
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(700),
        distinctUntilChanged(),
      ),
      this.currentColumnSorting$,
      this.tableConfigControl.valueChanges.pipe(
        startWith(STANDARD_TABLE_CONFIG),
        tap((tableConfigSelection: SwTableConfig) => {
          this.currentTableConfig$.next(tableConfigSelection); // table head etc. must be re-rendered
          this.isApiCallCompleted$.next(false); // show loading indicator again
          this.searchControl.setValue(''); // clear search input
          // this.currentColumnSorting$.next(
          //   this.searchFirstSortableColumn(tableConfigSelection),
          // ); // change col sorting as there might be no sortable columns in the new table config
        }),
      ),
    ]).pipe(
      switchMap(
        ([
          page,
          isDotTechEndpointActive,
          pageLimit,
          enteredInput,
          columnSorting,
          tableConfigSelection,
        ]) => {
          const isNewPageLimit: boolean = pageLimit !== this._previousPageLimit;
          if (isNewPageLimit) {
            this.currentPage = 1; // if new page limit, pagination should switch to page one
            this.currentPageLimit = pageLimit;
            this._previousPageLimit = pageLimit;
          }

          const isNewSearchTerm: boolean =
            enteredInput !== this._previousSearchTerm;
          if (isNewSearchTerm) {
            this.currentPage = 1; // if new searchTerm, pagination should switch to page one
            this._previousSearchTerm = enteredInput;
          }

          const isNewTableConfigSelection: boolean =
            tableConfigSelection !== this._previousTableConfig;
          if (isNewTableConfigSelection) {
            this.currentPage = 1; // if new config selection, pagination should switch to page one
            this._previousTableConfig = tableConfigSelection;
          }

          const isNewDotTechEndpointChoice: boolean =
            isDotTechEndpointActive !== this._previousLimitEndpointChoice;
          if (isNewDotTechEndpointChoice) {
            if (
              isDotTechEndpointActive === false &&
              this.currentPageLimit !== STANDARD_PAGE_LIMIT
            ) {
              // if control is not active we must reset to standard limit
              // otherwise pagination will not change to correct pages
              this.currentPageLimit = STANDARD_PAGE_LIMIT;
              this.pageLimitControl.setValue(STANDARD_PAGE_LIMIT);
            }
            this.currentPage = 1; // if new endpoint choice, pagination should switch to page one
            this.searchControl.setValue(''); // clear search input
            this._previousLimitEndpointChoice = isDotTechEndpointActive;

            // change control status
            const searchCtrlStatus = isDotTechEndpointActive
              ? 'disable'
              : 'enable';
            this.searchControl[searchCtrlStatus]();
            const stableCtrlStatus = isDotTechEndpointActive
              ? 'disable'
              : 'enable';
            this.stableTplRenderingToggle[stableCtrlStatus]();
            const limitCtrlStatus = isDotTechEndpointActive
              ? 'enable'
              : 'disable';
            this.pageLimitControl[limitCtrlStatus]();
          }

          return this._swapiService.getTableData(
            tableConfigSelection,
            isDotTechEndpointActive === true
              ? tableConfigSelection.dotTechEndpoint
              : tableConfigSelection.dotDevEndpoint,
            this.currentPage,
            this.currentPageLimit,
            enteredInput,
            columnSorting,
          );
        },
      ),
      tap((response: SwApiResponse) => {
        this.isApiCallCompleted$.next(!!response);
        this.availableRecords = response.count || response.total_records;
        console.log('api response', response);
      }),
    );
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(null);
    this._onDestroy$.complete();
  }

  /**
   * Change current page.
   * @param page Desired page
   */
  changePage(page: number): void {
    this.currentPage = page;
    this._pageChange$.next(page);
  }

  /**
   * Change the current column sorting.
   * @param sorting Desired sorting
   */
  sortColumn(sorting: ColumnSorting): void {
    this.currentColumnSorting$.next({
      colName: sorting.colName,
      direction: sorting.direction,
    });
  }

  /**
   * Returns column sorting object with the first found sortable column of the table configuration.
   * If none found, and empty object is returned.
   * @param tableConfig Current table config
   */
  searchFirstSortableColumn(tableConfig: SwTableConfig): ColumnSorting {
    const firstSortableCol: SwTableColConfig = tableConfig.columnConfig.find(
      (elm: SwTableColConfig) => elm.isSortable === true,
    );

    return firstSortableCol
      ? {
          colName: firstSortableCol.columnDisplayProperty,
          direction: STANDARD_SORT_DIRECTION,
        }
      : {};
  }
}
