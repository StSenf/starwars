import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { SwDotTechResourceResponse, SwDotTechResponse } from '../interfaces';
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
      params = params.append('search', searchTerm);
    }

    return this._http.get<SwDotTechResponse>(endpoint, { params }).pipe(
      map((resp: SwDotTechResponse) => {
        return !!columnSorting === true
          ? this.sortResponseResults(resp, columnSorting)
          : { ...resp };
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(`Error while fetching table data. ${error.message}`);
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
