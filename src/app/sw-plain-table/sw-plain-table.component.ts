import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pluck, take } from 'rxjs';

export interface SwApiPersonResponse {
  count: number;
  next: string;
  previous: string;
  results: SwPerson[];
}
export interface SwPerson {
  name: string;
  birth_year: string;
  eye_color: string;
  gender: string;
  hair_color: string;
  height: string;
  mass: string;
  skin_color: string;
  homeworld: string;
  films: string[]; //array of films resource URLs
  species: string[]; // array of species resource URLs.
  starships: any[]; // array of starship resource URLs that this person has piloted.
  vehicles: any[]; // An array of vehicle resource URLs that this person has piloted.
  url: string; // the hypermedia URL of this resource.
  created: string; //the ISO 8601 date format of the time that this resource was created.
  edited: string; // the ISO 8601 date format of the time that this resource was edited.
}
@Component({
  selector: 'sw-plain-table',
  templateUrl: './sw-plain-table.component.html',
})
export class SwPlainTableComponent implements OnInit {
  tableData: SwPerson[];
  isLoaded: boolean = false;
  pageSize: number = 5;
  currentPage: number = 1;

  private _pplEndpoint: string = 'https://swapi.dev/api/people?page=1&limit=5'; // -> limit does NOT work with this endpoint
  // private _pplEndpoint: string = 'https://www.swapi.tech/api/people'; // -> limit works with this endpoint
  private _endpoint: string;

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this.assembleEndpoint();
    this.fetchDataFromApi();
  }

  assembleEndpoint(): void {
    this._endpoint =
      this._pplEndpoint +
      '?' +
      `&page=${this.currentPage}` +
      `&limit=${this.pageSize}`;
  }

  refreshTable(): void {
    this.assembleEndpoint();
    this.fetchDataFromApi();
  }

  fetchDataFromApi(): void {
    this._http
      .get(this._endpoint)
      .pipe(pluck('results'), take(1))
      .subscribe((swPeople: SwPerson[]) => {
        this.isLoaded = true;
        console.log('people', swPeople);
        this.tableData = swPeople;
      });
  }
}
