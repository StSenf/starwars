import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';

import {
  SwApiResponse,
  SwFilm,
  SwPerson,
  SwPlanet,
  SwSpecies,
  SwStarship,
  SwVehicle,
} from '../../shared/interfaces';
import {
  ColumnSorting,
  SortDirection,
  SwTableColConfig,
  SwTableConfig,
} from '../model/plain-table.interfaces';
import {
  LoadingStatus,
  StatusEntry,
} from './loading-state/loading-state.interfaces';
import { LoadingStateService } from './loading-state/loading-state.service';

@Injectable({ providedIn: 'root' })
export class SwapiService {
  constructor(
    private _http: HttpClient,
    private _loadingStateService: LoadingStateService,
  ) {}

  /**
   * Load data from API by specific endpoint.
   * Also creates list of all Loading State entries that are present in the table.
   *
   * @param tableConfig Table config
   * @param endpoint Specific endpoint
   * @param page Current table page number
   * @param pageLimit Current table page limit
   * @param searchTerm Optional search term
   * @param columnSorting Current column sorting e.g. { colName: "title", direction: "desc" }
   */
  getTableData(
    tableConfig: SwTableConfig,
    endpoint: string,
    page: number,
    pageLimit: number,
    searchTerm?: string,
    columnSorting?: ColumnSorting,
  ): Observable<SwApiResponse> {
    let assembledEndpoint =
      endpoint + '?' + `&page=${page}` + `&limit=${pageLimit}`;
    if (!!searchTerm) {
      assembledEndpoint =
        endpoint +
        `?search=${searchTerm}` +
        `&page=${page}` +
        `&limit=${pageLimit}`;
    }

    this._loadingStateService.resetEndpointLoadingList();

    return this._http.get<SwApiResponse>(assembledEndpoint).pipe(
      tap((resp: SwApiResponse) => {
        // sort before creating the status entry list
        const sortedResponse: SwApiResponse =
          !!columnSorting === true
            ? this.sortResponseResults(resp, columnSorting)
            : { ...resp };

        // a list with all columns that have endpoint as value e.g. ["films", "homeworld"]
        const allColsWithUrl: string[] = tableConfig.columnConfig
          .filter(
            (colConfig: SwTableColConfig) =>
              colConfig.areCellValuesUrl === true,
          )
          .map(
            (colConfig: SwTableColConfig) => colConfig.columnDisplayProperty,
          );

        const statusEntryList: StatusEntry[] = this.createStatusEntryList(
          sortedResponse,
          allColsWithUrl,
        );
        this._loadingStateService.createEndpointLoadingList(statusEntryList);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(`Error while fetching table data. ${error.message}`);
      }),
    );
  }

  /**
   * Load cell data from API by specific endpoint.
   * Also handles status change ("added" -> "loading" -> "loaded/erroneous") of Loading State entry.
   *
   * @param endpoint Specific endpoint
   * @param rowIndex Row index where the entry lies
   * @param colName The column name where the entry lies in
   */
  getCellData(
    endpoint: string,
    rowIndex: number,
    colName: string,
  ): Observable<
    SwPerson | SwPlanet | SwFilm | SwStarship | SwVehicle | SwSpecies | never
  > {
    let didErrorOccur: boolean = false;
    let statusEntry: StatusEntry = {
      status: undefined,
      endpoint,
      correspondingRowIdx: rowIndex,
      colName,
    };

    return this._http.get<string>(endpoint).pipe(
      tap((r: any) => {
        statusEntry = {
          ...statusEntry,
          status: LoadingStatus.LOADING,
        };

        this._loadingStateService.changeElementStatus(statusEntry);
      }),
      catchError((error) => {
        didErrorOccur = true;
        return throwError(`Error while fetching data. Error ${error}`);
      }),
      finalize(() => {
        // finalize is called when observable completes or errors
        statusEntry = {
          ...statusEntry,
          status: didErrorOccur
            ? LoadingStatus.ERRONEOUS
            : LoadingStatus.LOADED,
        };

        this._loadingStateService.changeElementStatus(statusEntry);
      }),
    );
  }

  /**
   * Returns the response with sorted results.
   * @param response API response object
   * @param columnSorting Current column sorting e.g. { colName: "title", direction: "desc" }
   */
  private sortResponseResults(
    response: SwApiResponse,
    columnSorting: ColumnSorting,
  ): SwApiResponse {
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

  /**
   * Creates a list of status entries according to what results come back from the API.
   * All entries will be of status "added".
   * Those entries must be watched in LoadingStateService for status changes (if they are loaded).
   *
   * Example:
   * [
   *  { status: 'added', endpoint: 'https://swapi.dev/api/films/1/', correspondingRowIdx: 0, colName: 'films' },
   *  { status: 'added', endpoint: 'https://swapi.dev/api/films/3/', correspondingRowIdx: 0, colName: 'films' },
   *  { status: 'added', endpoint: 'https://swapi.dev/api/films/4/', correspondingRowIdx: 0, colName: 'films' },
   *  { status: 'added', endpoint: 'https://swapi.dev/api/films/1/', correspondingRowIdx: 1, colName: 'films' },
   *  { status: 'added', endpoint: 'https://swapi.dev/api/films/6/', correspondingRowIdx: 1, colName: 'films' },
   * ]
   *
   * @param apiResponse Response from API
   * @param allColsWithUrl Columns that do contain endpoints e.g. ["films", "homeworld", "species"]
   */
  private createStatusEntryList(
    apiResponse: SwApiResponse,
    allColsWithUrl: string[],
  ): StatusEntry[] {
    const objectList: StatusEntry[] = [];

    apiResponse.results.forEach((result: any, index: number) => {
      allColsWithUrl.forEach((colName: string) => {
        const data = result[colName];
        if (data) {
          if (Array.isArray(data)) {
            data.forEach((endpoint) => {
              objectList.push({
                correspondingRowIdx: index,
                colName,
                endpoint,
                status: LoadingStatus.ADDED,
              });
            });
          } else {
            objectList.push({
              correspondingRowIdx: index,
              colName,
              endpoint: data,
              status: LoadingStatus.ADDED,
            });
          }
        }
      });
    });

    return objectList;
  }
}
