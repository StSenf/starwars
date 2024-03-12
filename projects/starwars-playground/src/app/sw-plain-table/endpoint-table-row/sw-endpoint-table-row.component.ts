import { AsyncPipe, NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { SwDotTechResourceResponse } from '../../shared/interfaces';
import { SwTableColConfig } from '../model/plain-table.interfaces';
import { SwapiService } from '../services/swapi.service';

interface TableCellContent {
  colName: string;
  colContent: string | number;
}

@Component({
  standalone: true,
  selector: '[sw-endpoint-table-row]',
  templateUrl: './sw-endpoint-table-row.component.html',
  imports: [AsyncPipe, NgFor],
})
export class SwEndpointTableRowComponent implements OnInit {
  /** Endpoint from where the resource is fetched. */
  @Input() set endpoint(ep: string) {
    this._endpoint$.next(ep);
  }

  @Input() rowIndex: number;

  /** Config from that we know which columns should be rendered to <tr>. */
  @Input() set columnConfig(config: SwTableColConfig[]) {
    this._columnConfig$.next(config);
  }

  rowCells$: Observable<TableCellContent[]>;

  private _endpoint$ = new BehaviorSubject<string>('');
  private _columnConfig$ = new BehaviorSubject<SwTableColConfig[]>(null);

  constructor(private _swapiService: SwapiService) {}

  ngOnInit(): void {
    this.rowCells$ = this._endpoint$.pipe(
      switchMap((ep: string) => this._swapiService.getResource(ep)),
      switchMap((resource: SwDotTechResourceResponse) =>
        combineLatest([of(resource), this._columnConfig$]),
      ),
      map(([resource, colConfig]) => {
        let rowContent: TableCellContent[] = [];
        colConfig.forEach((col: SwTableColConfig) =>
          rowContent.push({
            colName: col.columnDisplayProperty,
            colContent:
              resource.result.properties[col.columnDisplayProperty] ||
              'no data provided',
          }),
        );

        return rowContent;
      }),
    );
  }
}
