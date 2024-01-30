import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, pluck, Observable, of, filter, switchMap } from 'rxjs';

/**
 * This component renders a plain <span>-Element with data it fetches from a HTTP request.
 *
 * Usage:
 *  <sw-display-value
 *    [endpoint]="'https://swapi.dev/api/planets/1'"
 *    [displayProperty]="'name'"
 *  ></sw-display-value>
 *
 *  Example:
 *  In this example, the endpoint 'https://swapi.dev/api/planets/1' returns an Object
 *   {
 *     name: "Jasmin,
 *     age: 30,
 *     species: "human"
 *   }
 *  from which the property 'name' will be plucked and displayed.
 */
@Component({
  selector: 'sw-display-value',
  templateUrl: './sw-display-value.component.html',
})
export class SwDisplayValueComponent implements OnInit {
  /** Endpoint from where the data should be fetched. */
  @Input() endpoint: string;

  /** Property that should be plucked from the endpoint response. */
  @Input() displayProperty: string;

  displayValue$: Observable<any>;

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this.displayValue$ = of(this.endpoint).pipe(
      filter((ep) => ep !== ''),
      switchMap(() => this._http.get(this.endpoint)),
      take(1),
      pluck(this.displayProperty),
    );
  }
}
