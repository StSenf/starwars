import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  LoadingStatus,
  StatusEntry,
} from '../shared/model/loading-state.interfaces';

/**
 * Reason for this service:
 * Fetching data from the Star Wars API takes up a lot of time. The endpoints of the API are very slow.
 * This causes the phenomena that the HTML content is rendered step by step. Which is ugly and gives a poor
 * visual user experience.
 *
 * Purpose of this service:
 * This services creates a list where all requested endpoints are listed with their initiator
 * (initiator = cell the data lies in). Those entries do have status. Whenever an HTTP call is made, whether successful,
 * erroneous and so on, the status of those entries should be changed.
 *
 * Example list:
 * [
 *  { status: 'loaded', endpoint: 'https://swapi.dev/api/films/1/', correspondingRowIdx: 0, colName: 'films' },
 *  { status: 'erroneous', endpoint: 'https://swapi.dev/api/films/3/', correspondingRowIdx: 0, colName: 'films' },
 *  { status: 'loaded', endpoint: 'https://swapi.dev/api/films/4/', correspondingRowIdx: 0, colName: 'films' },
 *  { status: 'loading', endpoint: 'https://swapi.dev/api/films/1/', correspondingRowIdx: 1, colName: 'films' },
 *  { status: 'loading', endpoint: 'https://swapi.dev/api/films/6/', correspondingRowIdx: 1, colName: 'films' },
 * ]
 *
 * With checking if all endpoints are loaded, the developer could react properly in the template
 * with rendering the data.
 */
@Injectable({ providedIn: 'root' })
export class LoadingStateService {
  private _endpointLoadingList$ = new BehaviorSubject<StatusEntry[]>([]);
  private _endpointLoadingList: StatusEntry[] = [];

  /** Creates new endpoint loading list */
  createEndpointLoadingList(list: StatusEntry[]): void {
    this._endpointLoadingList = list;
    this._endpointLoadingList$.next(list);
  }

  /** Resets endpoint loading list to empty array. */
  resetEndpointLoadingList(): void {
    this._endpointLoadingList = [];
    this._endpointLoadingList$.next([]);
  }

  /**
   * Changes a list entry if found in list.
   * @param changeElm Element to change
   */
  changeElementStatus(changeElm: StatusEntry): void {
    const desiredElmIdx: number = this._endpointLoadingList.findIndex(
      (elm: StatusEntry) =>
        elm.colName === changeElm.colName &&
        elm.correspondingRowIdx === changeElm.correspondingRowIdx &&
        elm.endpoint === changeElm.endpoint,
    );
    if (desiredElmIdx !== -1) {
      this._endpointLoadingList[desiredElmIdx] = changeElm;
      this._endpointLoadingList$.next(this._endpointLoadingList);
    }
  }

  /**
   * Returns true if the list has no entries.
   */
  isEndpointListEmpty(): Observable<boolean> {
    return this._endpointLoadingList$.pipe(
      map((list: StatusEntry[]) => list.length === 0),
    );
  }

  /**
   * Returns true if all elements are of status "loaded".
   */
  areAllEndpointsLoaded(): Observable<boolean> {
    return this._endpointLoadingList$.pipe(
      map((list: StatusEntry[]) =>
        list.every(
          (entry: StatusEntry) => entry.status === LoadingStatus.LOADED,
        ),
      ),
    );
  }
}
