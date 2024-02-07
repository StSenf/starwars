import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwApiResponse } from '../shared/model/interfaces';
import { STANDARD_PAGE_SIZE } from '../shared/model/constants';
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

@Component({
  selector: 'sw-plain-table',
  templateUrl: './sw-plain-table.component.html',
})
export class SwPlainTableComponent implements OnInit {
  currentPageLimit: number = STANDARD_PAGE_SIZE;
  currentPage: number = 1;

  apiResponse$: Observable<SwApiResponse>;
  isLoaded$ = new BehaviorSubject<boolean>(false);
  availableRecords: number;

  private _pplEndpoint: string = 'https://swapi.dev/api/people'; // -> limit does NOT work with this endpoint
  // private _pplEndpoint: string = 'https://www.swapi.tech/api/people'; // -> limit works with this endpoint
  isLimitEndpointActive = this._pplEndpoint.includes('.tech');

  searchControl: FormControl = new FormControl({
    value: '',
    disabled: this.isLimitEndpointActive === true,
  });
  limitControl: FormControl = new FormControl({
    value: this.currentPageLimit,
    disabled: this.isLimitEndpointActive === false,
  });

  private _pageChange$ = new BehaviorSubject<number>(this.currentPage);
  private _previousPageLimit: number;
  private _previousSearchTerm: string = '';

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    /**
     * Load table date on:
     *  - page change
     *  - page limit
     *  - search term change
     */
    this.apiResponse$ = combineLatest([
      this._pageChange$,
      this.limitControl.valueChanges.pipe(startWith(this.currentPageLimit)),
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(700),
        distinctUntilChanged(),
      ),
    ]).pipe(
      switchMap(([page, pageLimit, enteredInput]) => {
        const isNewPageSize: boolean = pageLimit !== this._previousPageLimit;
        if (isNewPageSize) {
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

        return this.load(
          this._pplEndpoint,
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
