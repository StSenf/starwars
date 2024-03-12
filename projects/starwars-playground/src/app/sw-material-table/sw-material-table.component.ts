import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  mergeMap,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { LibEndpointDisplayValueComponent } from 'shared-components';

import {
  SwDotTechResource,
  SwDotTechResourceResponse,
  SwDotTechResponse,
  SwPerson,
} from '../shared/interfaces';

@Component({
  standalone: true,
  selector: 'sw-material-table',
  templateUrl: './sw-material-table.component.html',
  styleUrl: './sw-material-table.component.scss',
  imports: [
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    LibEndpointDisplayValueComponent,
  ],
})
export class SwMaterialTableComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<SwPerson>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['name', 'birth_year', 'gender', 'homeworld'];

  public dataSource: MatTableDataSource<SwPerson>;
  public availableRecords: number = 0;

  searchControl = new FormControl({
    value: '',
    disabled: true,
  });

  private _currentPage = 1;
  private _pageChange$ = new BehaviorSubject<number>(this._currentPage);
  private _ngDestroy$ = new Subject();

  constructor(private _http: HttpClient) {}

  // https://www.swapi.tech/api/people?page=2&limit=20 -> limit works with this endpoint
  // https://swapi.dev/api/people?page=1&limit=20 -> limit does NOT work with this endpoint

  ngOnInit(): void {
    // initial table set up
    this.dataSource = new MatTableDataSource<SwPerson>([]);
    this.dataSource.paginator = this.paginator;

    /**
     * Load table date on:
     *  - page change
     *  - search term change
     */
    combineLatest([
      this._pageChange$,
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(700),
        distinctUntilChanged(),
      ),
    ])
      .pipe(
        switchMap(([desiredPage, enteredInput]) =>
          this.load(
            ` https://www.swapi.tech/api/people`,
            desiredPage,
            enteredInput,
          ),
        ),
        tap(
          (resp: SwDotTechResponse) =>
            (this.availableRecords = resp.total_records),
        ),
        mergeMap((resp: SwDotTechResponse) => {
          let forkJoinArr: Observable<SwDotTechResourceResponse>[] =
            resp.results.map((resource: SwDotTechResource) =>
              this._http.get<SwDotTechResourceResponse>(resource.url),
            );

          return forkJoin(forkJoinArr);
        }),
        takeUntil(this._ngDestroy$),
      )
      .subscribe((resp: SwDotTechResourceResponse[]) => {
        this.dataSource.data = resp.map(
          (res: SwDotTechResourceResponse) => res.result.properties as SwPerson,
        );
        this.table.dataSource = this.dataSource;
      });
  }

  ngOnDestroy(): void {
    this._ngDestroy$.next(null);
  }

  changePage(event: PageEvent): void {
    const desiredPage = event.pageIndex + 1;
    this._currentPage = desiredPage;
    this._pageChange$.next(desiredPage);
  }

  /**
   * Load data from API by specific endpoint.
   * @param endpoint Specific endpoint
   * @param page Current table page number
   * @param searchTerm Optional search term
   */
  private load(
    endpoint: string,
    page: number,
    searchTerm?: string,
  ): Observable<SwDotTechResponse> {
    let assembledEndpoint = endpoint + '?' + `page=${page}` + `&limit=10`;
    if (!!searchTerm) {
      assembledEndpoint =
        endpoint + `?name=${searchTerm}` + `&page=1` + `&limit=10`;
    }

    return this._http.get<SwDotTechResponse>(
      assembledEndpoint,
    ) as Observable<SwDotTechResponse>;
  }
}
