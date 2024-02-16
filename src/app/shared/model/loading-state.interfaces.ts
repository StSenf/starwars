export enum LoadingStatus {
  LOADING = 'loading',
  LOADED = 'loaded',
  ERRONEOUS = 'erroneous',
  ADDED = 'added',
}

/**
 * A status entry is a cell entry that must fetch data from the API.
 * To identify it, we need the corresponding row index and the column name.
 *
 * Example: { status: 'added', endpoint: 'https://swapi.dev/api/films/1/', correspondingRowIdx: 0, colName: 'films' },
 */
export interface StatusEntry {
  status: LoadingStatus;
  endpoint: string;
  /** Row index where the entry lies. */
  correspondingRowIdx: number;
  /** The column name where the entry lies in. */
  colName: string;
}
