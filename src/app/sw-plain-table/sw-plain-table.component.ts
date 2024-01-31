import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pluck, take } from 'rxjs';
import { SwPerson } from '../shared/model/interfaces';
import { STANDARD_PAGE_SIZE } from '../shared/model/constants';

@Component({
  selector: 'sw-plain-table',
  templateUrl: './sw-plain-table.component.html',
})
export class SwPlainTableComponent implements OnInit {
  tableData: SwPerson[];
  isLoaded: boolean = false;
  pageSize: number = STANDARD_PAGE_SIZE;
  currentPage: number = 1;

  endpoint: string;
  private _pplEndpoint: string = 'https://swapi.dev/api/people?page=1&limit=5'; // -> limit does NOT work with this endpoint
  // private _pplEndpoint: string = 'https://www.swapi.tech/api/people'; // -> limit works with this endpoint
  isLimitEndpointActive = false;

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this.assembleEndpoint(this._pplEndpoint, this.currentPage, this.pageSize);
    this.fetchDataFromApi();
  }

  /**
   * Assembles the endpoint that is sent to API.
   * @param endpoint String of desired endpoint
   * @param page Current page number
   * @param pageSize current table page size
   */
  assembleEndpoint(endpoint: string, page: number, pageSize?: number): void {
    this.endpoint = endpoint + '?' + `&page=${page}` + `&limit=${pageSize}`;
  }

  /**
   * Either change amount of displayed data or use paging.
   * Sends new API request.
   * @param page Possible changed pagination page
   */
  refreshTable(page?: number): void {
    let refreshPage: number = this.currentPage;
    if (page) {
      this.currentPage = page;
      refreshPage = page;
    }

    this.assembleEndpoint(this._pplEndpoint, refreshPage, this.pageSize);
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
