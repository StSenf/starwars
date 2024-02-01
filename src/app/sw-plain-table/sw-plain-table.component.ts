import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  pluck,
  startWith,
  Subject,
  take,
  takeUntil,
} from 'rxjs';
import { SwPerson } from '../shared/model/interfaces';
import { STANDARD_PAGE_SIZE } from '../shared/model/constants';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sw-plain-table',
  templateUrl: './sw-plain-table.component.html',
})
export class SwPlainTableComponent implements OnInit, OnDestroy {
  tableData: SwPerson[];
  isLoaded: boolean = false;
  pageSize: number = STANDARD_PAGE_SIZE;
  currentPage: number = 1;

  searchControl: FormControl = new FormControl();

  endpoint: string;
  private _pplEndpoint: string = 'https://swapi.dev/api/people'; // -> limit does NOT work with this endpoint
  // private _pplEndpoint: string = 'https://www.swapi.tech/api/people'; // -> limit works with this endpoint
  isLimitEndpointActive = false;

  private _ngDestroy$ = new Subject();

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this.assembleEndpoint(this._pplEndpoint, this.currentPage, this.pageSize);
    this.fetchDataFromApi();

    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        filter((input: string) => input.length > 2),
        takeUntil(this._ngDestroy$),
      )
      .subscribe((enteredInput) => {
        this.assembleEndpoint(
          this._pplEndpoint,
          this.currentPage,
          this.pageSize,
          enteredInput,
        );
        this.fetchDataFromApi();
      });
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next(null);
  }

  /**
   * Assembles the endpoint that is sent to API.
   * @param endpoint Desired endpoint
   * @param page Current page number
   * @param pageSize Optional current table page size
   * @param searchTerm Optional search term, if provided no other parameter is used for endpoint
   */
  assembleEndpoint(
    endpoint: string,
    page: number,
    pageSize?: number,
    searchTerm?: string,
  ): void {
    let assembledEp = endpoint + '?' + `&page=${page}` + `&limit=${pageSize}`;
    if (searchTerm) {
      assembledEp = endpoint + `/?search=${searchTerm}`;
    }
    this.endpoint = assembledEp;
  }

  /**
   * Either change amount of displayed data or use paging.
   * Sends new API request.
   * @param page Possible changed pagination page
   */
  pageThroughTable(page?: number): void {
    let desiredPage: number = this.currentPage;
    if (page) {
      this.currentPage = page;
      desiredPage = page;
    }

    this.assembleEndpoint(this._pplEndpoint, desiredPage, this.pageSize);
    this.fetchDataFromApi();
  }

  fetchDataFromApi(): void {
    this._http
      .get(this.endpoint)
      .pipe(pluck('results'), take(1))
      .subscribe((swPeople: SwPerson[]) => {
        this.isLoaded = true;
        console.log('people', swPeople);
        this.tableData = swPeople;
      });
  }
}
