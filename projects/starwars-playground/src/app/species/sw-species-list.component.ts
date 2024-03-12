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
} from 'shared-components';
import {
  SwDotTechResource,
  SwDotTechResourceResponse,
  SwDotTechResponse,
  SwEntity,
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
  currentColumnSorting$ = new BehaviorSubject<ColumnSorting>({});
  // currentColumnSorting$ = new BehaviorSubject<ColumnSorting>(
  //   this.searchFirstSortableColumn(STANDARD_TABLE_CONFIG),
  // );

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
              homeworld: this.replaceUrlWithResourceName(
                species,
                'homeworld',
                this._allPlanetResources,
              ),
              people: this.replaceUrlListWithResourceNames(
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

  /**
   * Replaces a URL with the actual resource name.
   * e.g.: the url for a planet is given https://www.swapi.tech/api/planet/4,
   * and we want to know the name of the planet.
   *
   * @param entity
   * @param entityPropertyWithUrl
   * @param resourcesToCheck
   */
  private replaceUrlWithResourceName(
    entity: SwEntity,
    entityPropertyWithUrl: string,
    resourcesToCheck: SwDotTechResource[],
  ): string {
    return (
      resourcesToCheck.find(
        (resource: SwDotTechResource) =>
          resource.url === entity[entityPropertyWithUrl],
      )?.name || 'no data provided'
    );
  }

  /**
   * Replaces a list of URLs with the actual resource names.
   * e.g.: a list with several urls is given ['https://www.swapi.tech/api/people/4', 'https://www.swapi.tech/api/people/1']
   * and we want to know the names of this people and will return a list like ["Luke Skywalker", "R2D2"].
   *
   * @param entity
   * @param entityPropertyWithUrlList
   * @param resourcesToCheck
   */
  private replaceUrlListWithResourceNames(
    entity: SwEntity,
    entityPropertyWithUrlList: string,
    resourcesToCheck: SwDotTechResource[],
  ): string[] {
    return entity[entityPropertyWithUrlList].map(
      (url: string) =>
        resourcesToCheck.find(
          (resource: SwDotTechResource) => resource.url === url,
        )?.name || 'no data provided',
    );
  }
}
