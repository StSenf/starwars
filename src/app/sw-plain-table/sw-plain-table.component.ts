import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

import { SwApiResponse, SwTableConfig } from '../shared/model/interfaces';
import { TABLE_CONFIG } from '../shared/model/table-config';
import {
  STANDARD_ENDPOINT_SELECTION,
  STANDARD_PAGE_SIZE,
} from '../shared/model/constants';

@Component({
  selector: 'sw-plain-table',
  templateUrl: './sw-plain-table.component.html',
})
export class SwPlainTableComponent implements OnInit {
  tableConfig: SwTableConfig[] = TABLE_CONFIG;
  availableRecords: number;
  isLimitEndpointActive = false; // ToDo: use switch in template to switch between endpoint type

  currentPageLimit: number = STANDARD_PAGE_SIZE;
  currentPage: number = 1;
  currentEndpointSelection$ = new BehaviorSubject<SwTableConfig>(
    STANDARD_ENDPOINT_SELECTION,
  );

  apiResponse$: Observable<SwApiResponse>;
  isLoaded$ = new BehaviorSubject<boolean>(false);

  searchControl: FormControl = new FormControl({
    value: '',
    disabled: this.isLimitEndpointActive === true,
  });
  limitControl: FormControl = new FormControl({
    value: this.currentPageLimit,
    disabled: this.isLimitEndpointActive === false,
  });
  endpointControl: FormControl = new FormControl({
    value: STANDARD_ENDPOINT_SELECTION,
    disabled: false,
  });

  private _pageChange$ = new BehaviorSubject<number>(this.currentPage);
  private _previousPageLimit: number;
  private _previousSearchTerm: string = '';
  private _previousEndpointSelection: SwTableConfig;

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    // ToDo: on endpoint change, show spinner
    /**
     * Load table date on:
     *  - page change
     *  - page limit
     *  - search term change
     *  - endpoint change
     */
    this.apiResponse$ = combineLatest([
      this._pageChange$,
      this.limitControl.valueChanges.pipe(startWith(this.currentPageLimit)),
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(700),
        distinctUntilChanged(),
      ),
      this.endpointControl.valueChanges.pipe(
        startWith(STANDARD_ENDPOINT_SELECTION),
        tap((selection: SwTableConfig) => {
          this.currentEndpointSelection$.next(selection); // table head etc. must be re-rendered
          this.isLoaded$.next(false); // show loading indicator
          this.searchControl.setValue(''); // clear search input
        }),
      ),
    ]).pipe(
      switchMap(([page, pageLimit, enteredInput, endpointSelection]) => {
        const isNewPageLimit: boolean = pageLimit !== this._previousPageLimit;
        if (isNewPageLimit) {
          console.log('new page limit', pageLimit);
          this.currentPage = 1; // if new page limit, pagination should switch to page one
          this.currentPageLimit = pageLimit;
          this._previousPageLimit = pageLimit;
        }

        const isNewSearchTerm: boolean =
          enteredInput !== this._previousSearchTerm;
        if (isNewSearchTerm) {
          console.log('new search term', enteredInput);
          this.currentPage = 1; // if new searchTerm, pagination should switch to page one
          this._previousSearchTerm = enteredInput;
        }

        const isNewEndpointSelection: boolean =
          endpointSelection !== this._previousEndpointSelection;
        if (isNewEndpointSelection) {
          console.log('new endpoint selection', endpointSelection);
          this.currentPage = 1; // if new endpoint selection, pagination should switch to page one
          this._previousEndpointSelection = endpointSelection;
        }

        return this.load(
          endpointSelection.endpoint,
          this.currentPage,
          this.currentPageLimit,
          enteredInput,
        );
      }),
      tap((response: SwApiResponse) => {
        this.isLoaded$.next(!!response);
        this.availableRecords = response.count || response.total_records;
        console.log('random api response subscription', response);
        console.log('this.availableRecords', this.availableRecords);
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

  /**
   * Load data from API by specific endpoint.
   * @param endpoint Specific endpoint
   * @param page Current table page number
   * @param pageSize Current table page size
   * @param searchTerm Optional search term
   */
  private load(
    endpoint: string,
    page: number,
    pageSize: number,
    searchTerm?: string,
  ): Observable<SwApiResponse> {
    let assembledEndpoint =
      endpoint + '?' + `&page=${page}` + `&limit=${pageSize}`;
    if (!!searchTerm) {
      assembledEndpoint =
        endpoint +
        `?search=${searchTerm}` +
        `&page=${page}` +
        `&limit=${pageSize}`;
    }

    return this._http.get<SwApiResponse>(
      assembledEndpoint,
    ) as Observable<SwApiResponse>;
  }
}
