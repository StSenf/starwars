import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  Observable,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

import {
  PageLimitOptions,
  SwApiResponse,
  SwTableConfig,
} from '../shared/model/interfaces';
import { TABLE_CONFIG } from '../shared/model/table-config';
import {
  PAGE_LIMIT_OPTIONS,
  STANDARD_LIMIT_ENDPOINT_CHOICE,
  STANDARD_PAGE_LIMIT,
  STANDARD_TABLE_CONFIG,
} from '../shared/model/constants';
import { LoadingStateService } from '../services/loading-state.service';
import { SwapiService } from '../services/swapi.service';

@Component({
  selector: 'sw-plain-table',
  templateUrl: './sw-plain-table.component.html',
  styleUrls: ['sw-plain-table.component.scss'],
})
export class SwPlainTableComponent implements OnInit {
  tableConfig: SwTableConfig[] = TABLE_CONFIG;
  pageLimitConfig: PageLimitOptions[] = PAGE_LIMIT_OPTIONS;
  availableRecords: number;

  currentPageLimit: number = STANDARD_PAGE_LIMIT;
  currentPage: number = 1;
  currentTableConfig$ = new BehaviorSubject<SwTableConfig>(
    STANDARD_TABLE_CONFIG,
  );

  apiResponse$: Observable<SwApiResponse>;
  isLoaded$ = new BehaviorSubject<boolean>(false);
  isEndpointListEmpty$: Observable<boolean>;
  areAllEndpointsLoaded$: Observable<boolean>;

  searchControl: FormControl = new FormControl({
    value: '',
    disabled: false,
  });
  limitControl: FormControl = new FormControl({
    value: this.currentPageLimit,
    disabled: true,
  });
  tableConfigControl: FormControl = new FormControl({
    value: STANDARD_TABLE_CONFIG,
    disabled: false,
  });
  limitEndpointControl: FormControl = new FormControl({
    value: STANDARD_LIMIT_ENDPOINT_CHOICE,
    disabled: false,
  });

  private _pageChange$ = new BehaviorSubject<number>(this.currentPage);
  private _previousPageLimit: number;
  private _previousSearchTerm: string = '';
  private _previousTableConfig: SwTableConfig;
  private _previousLimitEndpointChoice: boolean =
    STANDARD_LIMIT_ENDPOINT_CHOICE;

  constructor(
    private _loadingStateService: LoadingStateService,
    private _swapiService: SwapiService,
  ) {}

  ngOnInit(): void {
    this.isEndpointListEmpty$ = this._loadingStateService.isEndpointListEmpty();
    this.areAllEndpointsLoaded$ =
      this._loadingStateService.areAllEndpointsLoaded();
    // this._loadingStateService.endpointLoadingList$.subscribe((list) =>
    //   console.log('loading list', list),
    // );

    /**
     * Load table date on:
     *  - page change
     *  - limit endpoint (de)activation
     *  - page limit change
     *  - search term change
     *  - endpoint change
     */
    this.apiResponse$ = combineLatest([
      this._pageChange$,
      this.limitEndpointControl.valueChanges.pipe(
        startWith(STANDARD_LIMIT_ENDPOINT_CHOICE),
      ),
      this.limitControl.valueChanges.pipe(startWith(this.currentPageLimit)),
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(700),
        distinctUntilChanged(),
      ),
      this.tableConfigControl.valueChanges.pipe(
        startWith(STANDARD_TABLE_CONFIG),
        tap((tableConfigSelection: SwTableConfig) => {
          this.currentTableConfig$.next(tableConfigSelection); // table head etc. must be re-rendered
          this.isLoaded$.next(false); // show loading indicator again
          this.searchControl.setValue(''); // clear search input
        }),
      ),
    ]).pipe(
      switchMap(
        ([
          page,
          isLimitEndpointActive,
          pageLimit,
          enteredInput,
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

          const isNewLimitEndpointChoice: boolean =
            isLimitEndpointActive !== this._previousLimitEndpointChoice;
          if (isNewLimitEndpointChoice) {
            if (
              isLimitEndpointActive === false &&
              this.currentPageLimit !== STANDARD_PAGE_LIMIT
            ) {
              // if control is not active we must reset to standard limit
              // otherwise pagination will not change to correct pages
              this.currentPageLimit = STANDARD_PAGE_LIMIT;
              this.limitControl.setValue(STANDARD_PAGE_LIMIT);
            }
            this.currentPage = 1; // if new limit endpoint choice, pagination should switch to page one
            this.searchControl.setValue(''); // clear search input
            this._previousLimitEndpointChoice = isLimitEndpointActive;

            // change control status
            const searchCtrlStatus = isLimitEndpointActive
              ? 'disable'
              : 'enable';
            this.searchControl[searchCtrlStatus]();
            const limitCtrlStatus = isLimitEndpointActive
              ? 'enable'
              : 'disable';
            this.limitControl[limitCtrlStatus]();
          }

          return this._swapiService.getTableData(
            tableConfigSelection,
            isLimitEndpointActive === true
              ? tableConfigSelection.limitEndpoint
              : tableConfigSelection.endpoint,
            this.currentPage,
            this.currentPageLimit,
            enteredInput,
          );
        },
      ),
      tap((response: SwApiResponse) => {
        this.isLoaded$.next(!!response);
        this.availableRecords = response.count || response.total_records;
        console.log('api response', response);
      }),
    );
  }

  /**
   * Change current page.
   * @param page Changed pagination page
   */
  changePage(page: number): void {
    this.currentPage = page;
    this._pageChange$.next(page);
  }
}
