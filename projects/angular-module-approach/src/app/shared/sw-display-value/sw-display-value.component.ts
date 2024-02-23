import { Component, Input, OnInit } from '@angular/core';
import { Observable, pluck, take, tap } from 'rxjs';
import { SwTableColConfig } from '../model/interfaces';
import { SwapiService } from '../../services/swapi.service';

/**
 * This component renders a plain <span>-Element with data it fetches from a HTTP request.
 *
 * Usage:
 *  <sw-display-value
 *    [endpoint]="'https://swapi.dev/api/films/3'"
 *    [rowIndex]="2"
 *    [colConfig]="{
 *       columnDisplayProperty: "films",
 *       columnTitle: 'Movies',
 *       areCellValuesUrl: true,
 *       isUrlMultiple: true,
 *       urlDisplayProperty: "title"
 *    }"
 *  ></sw-display-value>
 *
 *  Example:
 *  In this example, the endpoint 'https://swapi.dev/api/films/3' returns an Object
 *   {
 *     "title": "A New Hope"
 *     "episode_id": 4,
 *     "characters": ['https://swapi.dev/api/people/1', 'https://swapi.dev/api/people/3']
 *   }
 *  from which the property 'title' will be plucked and displayed.
 */
@Component({
  selector: 'sw-display-value',
  templateUrl: './sw-display-value.component.html',
  styleUrls: ['sw-display-value.component.scss'],
})
export class SwDisplayValueComponent implements OnInit {
  /**
   * Specific endpoint from where the data of an SwObject should
   * be fetched e.g. "https://swapi.dev/api/planets/1".
   */
  @Input() endpoint: string;

  /** Index of the row the element lies in. */
  @Input() rowIndex: number;

  /** Config of the column the element lies in. */
  @Input() colConfig: SwTableColConfig;

  displayValue$: Observable<any>; // gets displayed in template

  constructor(private _swapiService: SwapiService) {}

  ngOnInit(): void {
    this.displayValue$ = this._swapiService
      .getCellData(
        this.endpoint,
        this.rowIndex,
        this.colConfig.columnDisplayProperty,
      )
      .pipe(take(1), pluck(this.colConfig.urlDisplayProperty));
  }
}
