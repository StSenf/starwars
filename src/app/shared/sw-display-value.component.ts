import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, of, pluck, switchMap, take } from 'rxjs';

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
 *     name: "Jasmin",
 *     age: 30,
 *     species: "human"
 *   }
 *  from which the property 'name' will be plucked and displayed.
 */
@Component({
  selector: 'sw-display-value',
  templateUrl: './sw-display-value.component.html',
  styleUrls: ['sw-display-value.component.scss'],
})
export class SwDisplayValueComponent implements OnInit {
  /** Endpoint from where the data should be fetched. */
  @Input() endpoint: string;

  /** Property that should be plucked from the endpoint response. */
  @Input() displayProperty: string;

  /**
   * If set to true, multiple elements will be rendered to template.
   * A separator must be rendered to template then.
   */
  @Input() isMultiple?: boolean = false;

  /** If set to true, the last multiple element should not have separator in template. */
  @Input() isLastMultiple?: boolean = false;

  displayValue: string;
  isRequestCompleted: boolean = false; // otherwise the comma separators are visible before the display value gets loaded

  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    of(this.endpoint)
      .pipe(
        filter((ep: string) => ep !== ''),
        switchMap(() => this._http.get(this.endpoint)),
        take(1),
        pluck(this.displayProperty),
      )
      .subscribe({
        next: (dp: string) => {
          this.displayValue = dp;
        },
        error: () => {
          console.error('Error while fetching data.');
        },
        complete: () => {
          this.isRequestCompleted = true;
        },
      });
  }
}
