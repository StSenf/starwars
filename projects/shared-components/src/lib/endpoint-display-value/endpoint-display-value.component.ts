import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, pluck } from 'rxjs';

/**
 * This component renders a plain <span>-Element with data it fetches from a HTTP request.
 *
 * Usage:
 *   <lib-endpoint-display-value
 *     [endpoint]="'https://swapi.dev/api/films/3'"
 *     [propertyToDisplay]="'title'">
 *   </lib-endpoint-display-value>
 *
 * Example:
 * In this example, the endpoint 'https://swapi.dev/api/films/3' returns an Object
 *   {
 *     "title": "A New Hope"
 *     "episode_id": 4,
 *     "characters": ['https://swapi.dev/api/people/1', 'https://swapi.dev/api/people/3']
 *   }
 * from which the property 'title' will be displayed.
 */
@Component({
  standalone: true,
  selector: 'lib-endpoint-display-value',
  templateUrl: './endpoint-display-value.component.html',
  imports: [AsyncPipe],
})
export class LibEndpointDisplayValueComponent implements OnInit {
  /**
   * Specific endpoint from where the data should
   * be fetched e.g. "https://swapi.dev/api/planets/1".
   */
  @Input() endpoint: string;

  /** The property that should be displayed from the endpoint response. */
  @Input() propertyToDisplay: string;

  displayValue$: Observable<any>; // gets displayed in template

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this.displayValue$ = this._http
      .get(this.endpoint)
      .pipe(pluck(this.propertyToDisplay));
  }
}
