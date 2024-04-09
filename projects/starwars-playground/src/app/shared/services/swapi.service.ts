import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  forkJoin,
  Observable,
  OperatorFunction,
  switchMap,
  throwError,
} from 'rxjs';
import { map } from 'rxjs/operators';

import {
  SwDotTechResource,
  SwDotTechResourceResponse,
  SwDotTechResponse,
  SwPerson,
  SwPlanet,
} from '../interfaces';
import { ColumnSorting, SortDirection } from '../plain-table.interfaces';

@Injectable({ providedIn: 'root' })
export class SwapiService {
  constructor(private _http: HttpClient) {}

  /**
   * Load data from API by specific endpoint.
   *
   * @param endpoint Specific endpoint
   * @param page Current table page number
   * @param pageLimit Current table page limit
   * @param searchTerm Optional search term
   * @param columnSorting Current column sorting e.g. { colName: "title", direction: "desc" }
   */
  getTableData(
    endpoint: string,
    page: number,
    pageLimit: number,
    searchTerm?: string,
    columnSorting?: ColumnSorting,
  ): Observable<SwDotTechResponse> {
    let params: HttpParams = new HttpParams({
      fromObject: { page, limit: pageLimit },
    });
    if (searchTerm) {
      // ToDo: search gives back SwDotTechSearchResponse, not a full SwDotTechResponse --> what is architectural decision?
      // ToDo: params for searching should be params.append('name', searchTerm);
      params = params.append('search', searchTerm);
    }

    return this._http.get<SwDotTechResponse>(endpoint, { params }).pipe(
      map((resp: SwDotTechResponse) => {
        return !!columnSorting === false ||
          Object.keys(columnSorting).length === 0
          ? { ...resp }
          : this.sortResponseResults(resp, columnSorting);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(
          () => `Error while fetching table data. ${error.message}`,
        );
      }),
    );
  }

  /**
   * Returns a resource response that carries the actual star wars object.
   *
   * @param endpoint Specific endpoint
   */
  getResource(endpoint: string): Observable<SwDotTechResourceResponse> {
    return this._http.get<SwDotTechResourceResponse>(endpoint);
  }

  /**
   * Custom RxJS OperatorFunction<T, R>.
   * Returns an Observable of all table resource responses.
   *
   * Accepts one initial parameter T (SwDotTechResponse) and returns another
   * parameter R (SwDotTechResourceResponse[]).
   *
   * The response to the endpoint e.g. https://www.swapi.tech/api/planets?page=1 will give back a result list
   * with only resources that carry an url. But we want to display the data of those urls as well in the table.
   * Therefore, we need to fetch all table resources after each other, using the RxJS forkJoin Operator.
   *
   * Initial parameter example: {
   *   message: "ok",
   *   total_pages: 6,
   *   total_records: 60,
   *   next: "https://www.swapi.tech/api/planets?page=2",
   *   results: [
   *     { uid:"1", name: "Tatooine", url: ""https://www.swapi.tech/api/planets/1},
   *     { uid:"1", name: "Alderaan", url: ""https://www.swapi.tech/api/planets/2},
   *     { uid:"1", name: "Yavin IV", url: ""https://www.swapi.tech/api/planets/3},
   *   ]
   * }
   *
   * Return example: [
   *   { message: "ok", result: {description: "a planet", uid: 1, properties: {...}} },
   *   { message: "ok", result: {description: "a planet", uid: 2, properties: {...}} },
   *   { message: "ok", result: {description: "a planet", uid: 3, properties: {...}} },
   * ]
   */
  fetchAllTableResources(): OperatorFunction<
    SwDotTechResponse,
    SwDotTechResourceResponse[]
  > {
    return (
      source$: Observable<SwDotTechResponse>,
    ): Observable<SwDotTechResourceResponse[]> =>
      source$.pipe(
        switchMap((techResponse: SwDotTechResponse) => {
          let forkJoinArr: Observable<SwDotTechResourceResponse>[] =
            techResponse.results.map((techResource: SwDotTechResource) =>
              this.getResource(techResource.url),
            );
          return forkJoin(forkJoinArr);
        }),
      );
  }

  /**
   * Custom RxJS OperatorFunction<T, R>.
   * Returns an Observable of all planets provided in the given SwDotTechResourceResponse[].
   *
   * Accepts one parameter T (SwDotTechResourceResponse[]) and returns another
   * parameter R (SwPlanet[])
   *
   * Return example: [
   *   { name: "Alderaan", diameter: "100", films: ["https://www.swapi.tech/api/films/1"] },
   *   { name: "Xtr-9", diameter: "1000", films: ["https://www.swapi.tech/api/films/1"] },
   *   { name: "Dagobah", diameter: "8500", films: ["https://www.swapi.tech/api/films/3"] },
   * ]
   */
  extractAllPlanets(): OperatorFunction<
    SwDotTechResourceResponse[],
    SwPlanet[]
  > {
    return this.extractResourceEntities<SwPlanet>();
  }

  /**
   * Custom RxJS OperatorFunction<T, R>.
   * Returns an Observable of all persons provided in the given SwDotTechResourceResponse[].
   *
   * Accepts one parameter T (SwDotTechResourceResponse[]) and returns another
   * parameter R (SwPerson[])
   */
  extractAllPersons(): OperatorFunction<
    SwDotTechResourceResponse[],
    SwPerson[]
  > {
    return this.extractResourceEntities<SwPerson>();
  }

  /**
   * Custom RxJS OperatorFunction<T, R>.
   * Returns an Observable of entities provided in the given SwDotTechResourceResponse[].
   *
   * Accepts one parameter T (SwDotTechResourceResponse[]) and returns another
   * parameter R (Generic type).
   */
  private extractResourceEntities<T>(): OperatorFunction<
    SwDotTechResourceResponse[],
    T[]
  > {
    return (
      source$: Observable<SwDotTechResourceResponse[]>,
    ): Observable<T[]> =>
      source$.pipe(
        map((resourceResponse: SwDotTechResourceResponse[]) => {
          return resourceResponse.map(
            (response: SwDotTechResourceResponse) =>
              response.result.properties as T,
          );
        }),
      );
  }

  /**
   * Returns the response with sorted results.
   * @param response API response object
   * @param columnSorting Current column sorting e.g. { colName: "title", direction: "desc" }
   */
  private sortResponseResults(
    response: SwDotTechResponse,
    columnSorting: ColumnSorting,
  ): SwDotTechResponse {
    if (!!columnSorting === false) {
      // return immediately if no sorting provided
      return response;
    }

    const isDirectionAsc: boolean =
      columnSorting.direction === SortDirection.ASC;

    const sortedResults = response.results.sort((a, b) => {
      const elmA = a[columnSorting.colName];
      const elmB = b[columnSorting.colName];

      if (elmA < elmB) {
        return isDirectionAsc ? -1 : 1;
      }
      if (elmA > elmB) {
        return isDirectionAsc ? 1 : -1;
      }

      // must be equal
      return 0;
    });

    return { ...response, results: sortedResults };
  }
}
