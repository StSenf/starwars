import { AsyncPipe, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  Observable,
  startWith,
  Subject,
  switchMap,
  take,
} from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LibLoadingModalComponent,
  LibPaginationComponent,
} from '@shared-components';
import {
  replaceUrlListWithResourceNames,
  replaceUrlWithResourceName,
  searchFirstSortableColumn,
} from '../shared/helper-methods';
import {
  SwDotTechResource,
  SwDotTechResourceResponse,
  SwDotTechResponse,
  SwSpecies,
} from '../shared/interfaces';
import {
  PAGE_LIMIT_OPTIONS,
  STANDARD_PAGE_LIMIT,
} from '../shared/plain-table-constants';
import {
  ColumnSorting,
  PageLimitOptions,
  SwTableConfig,
} from '../shared/plain-table.interfaces';
import { SwapiService } from '../shared/services/swapi.service';
import { SwSortComponent } from '../shared/sorting/sw-sort.component';
import { SPECIES_TABLE_CONFIG } from './table-config';

@Component({
  standalone: true,
  templateUrl: './sw-species-list.component.html',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    NgTemplateOutlet,
    SwSortComponent,
    LibPaginationComponent,
  ],
})
export class SwSpeciesListComponent implements OnInit, OnDestroy {
  tableConfig: SwTableConfig = SPECIES_TABLE_CONFIG;
  pageLimitConfig: PageLimitOptions[] = PAGE_LIMIT_OPTIONS;
  availableRecords: number;

  currentPageLimit: number = STANDARD_PAGE_LIMIT;
  currentPage: number = 1;
  currentColumnSorting$ = new BehaviorSubject<ColumnSorting>(
    searchFirstSortableColumn(SPECIES_TABLE_CONFIG),
  );

  swSpecies$: Observable<SwSpecies[]>;
  isApiCallCompleted$ = new BehaviorSubject<boolean>(false);

  searchControl: FormControl = new FormControl({
    value: '',
    disabled: false,
  });
  pageLimitControl: FormControl = new FormControl({
    value: this.currentPageLimit,
    disabled: false,
  });

  private _modalReference: NgbModalRef;
  private _allPlanetResources: SwDotTechResource[];
  private _allPeopleResources: SwDotTechResource[];
  private _onDestroy$ = new Subject<any>();
  private _pageChange$ = new BehaviorSubject<number>(this.currentPage);
  private _previousPageLimit: number;
  private _previousSearchTerm: string = '';

  constructor(
    private _swapiService: SwapiService,
    private _activatedRoute: ActivatedRoute,
    private _modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this._activatedRoute.data.pipe(take(1)).subscribe((data: Data) => {
      this._allPlanetResources = data['planets'];
      this._allPeopleResources = data['people'];
    });

    /**
     * Load species on:
     *  - page change
     *  - page limit change
     *  - search term change
     *  - sorting change
     */
    this.swSpecies$ = combineLatest([
      this._pageChange$,
      this.pageLimitControl.valueChanges.pipe(startWith(this.currentPageLimit)),
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(700),
        distinctUntilChanged(),
      ),
      this.currentColumnSorting$,
    ]).pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap(([page, pageLimit, enteredInput, columnSorting]) => {
        this._modalReference = this._modalService.open(
          LibLoadingModalComponent,
        );

        const isNewPageLimit: boolean = pageLimit !== this._previousPageLimit;
        if (isNewPageLimit) {
          this.currentPage = 1; // if new page limit, pagination should switch to page one
          this.currentPageLimit = pageLimit;
          this._previousPageLimit = pageLimit;
        }

        const isNewSearchTerm: boolean =
          enteredInput !== this._previousSearchTerm;
        if (isNewSearchTerm) {
          this.currentPage = 1; // if new searchTerm, pagination should switch to page one
          this._previousSearchTerm = enteredInput;
        }

        return this._swapiService.getTableData(
          'https://www.swapi.tech/api/species',
          this.currentPage,
          this.currentPageLimit,
          enteredInput,
          columnSorting,
        );
      }),
      switchMap((speciesResponse: SwDotTechResponse) => {
        this.availableRecords = speciesResponse.total_records;

        let forkJoinArr: Observable<SwDotTechResourceResponse>[] =
          speciesResponse.results.map((speciesResource: SwDotTechResource) =>
            this._swapiService.getResource(speciesResource.url),
          );
        return forkJoin(forkJoinArr);
      }),
      map((speciesResourceResponse: SwDotTechResourceResponse[]) => {
        this.isApiCallCompleted$.next(!!speciesResourceResponse);
        if (this._modalReference) {
          this._modalReference.close();
        }
        return speciesResourceResponse.map(
          (response: SwDotTechResourceResponse) => {
            const species: SwSpecies = response.result.properties as SwSpecies;
            return {
              ...species,
              homeworld: replaceUrlWithResourceName(
                species,
                'homeworld',
                this._allPlanetResources,
              ),
              people: replaceUrlListWithResourceNames(
                species,
                'people',
                this._allPeopleResources,
              ),
            } as SwSpecies;
          },
        );
      }),
    );
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(null);
    this._onDestroy$.complete();
  }

  /**
   * Change current page.
   * @param page Desired page
   */
  changePage(page: number): void {
    this.currentPage = page;
    this._pageChange$.next(page);
  }

  /**
   * Change the current column sorting.
   * @param sorting Desired sorting
   */
  sortColumn(sorting: ColumnSorting): void {
    this.currentColumnSorting$.next({
      colName: sorting.colName,
      direction: sorting.direction,
    });
  }
}
