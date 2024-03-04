import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, pluck, take } from 'rxjs';
import { LibEndpointDisplayValueComponent } from 'shared-components';
import { SwapiService } from '../services/swapi.service';

/**
 * This component renders a plain <span>-Element with data it fetches from a HTTP request.
 *
 * Usage:
 *  <sw-display-value
 *    [endpoint]="'https://swapi.dev/api/people/3'"
 *    [rowIndex]="2"
 *    [colName]="'species'"
 *    [propertyToDisplay]="'name'"
 *  ></sw-display-value>
 *
 *  Example:
 *  In this example, the endpoint 'https://swapi.dev/api/people/3' returns an Object
 *   {
 *     "name": "Luke Skywalker"
 *     "gender": "male",
 *     "films": ['https://swapi.dev/api/films/1', 'https://swapi.dev/api/films/3']
 *   }
 *  from which the property 'name' will be plucked and displayed.
 */
@Component({
  standalone: true,
  selector: 'sw-display-value',
  templateUrl: './sw-display-value.component.html',
  imports: [AsyncPipe],
})
export class SwDisplayValueComponent
  extends LibEndpointDisplayValueComponent
  implements OnInit
{
  /** Index of the row the element lies in. Is needed for LoadingState handling. */
  @Input() rowIndex: number;

  /** The column name the element lies in. Is needed for LoadingState handling. **/
  @Input() colName: string;

  override displayValue$: Observable<any>; // gets displayed in template

  constructor(
    protected override http: HttpClient,
    private _swapiService: SwapiService,
  ) {
    super(http);
  }

  override ngOnInit(): void {
    this.displayValue$ = this._swapiService
      .getCellData(this.endpoint, this.rowIndex, this.colName)
      .pipe(take(1), pluck(this.propertyToDisplay));
  }
}
