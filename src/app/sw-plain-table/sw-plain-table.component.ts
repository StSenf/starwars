import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pluck } from 'rxjs';

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
  films: any[]; //array of films
  species: any[]; // array of species resource URLs.
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

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this._http
      .get('https://swapi.dev/api/people?page=1')
      .pipe(pluck('results'))
      .subscribe((swPeople: SwPerson[]) => {
        this.isLoaded = true;
        console.log('people', swPeople);
        this.tableData = swPeople;
      });
  }
}
