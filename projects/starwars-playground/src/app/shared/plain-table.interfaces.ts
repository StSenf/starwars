export interface SwTableConfig {
  /** Endpoint https://www.swapi.tech/api/XYZ with which the limit can be added to the request. */
  dotTechEndpoint?: string;
  /** Phrase that is visible in search input. */
  searchPhrase: string;
  /** Value that is visible in the select field. */
  tableConfigControlValue: string;
  /** Column configuration. Length determines the amount of columns. */
  columnConfig: SwTableColConfig[];
}

/**
 * Table column configuration interface.
 * Depending on this configuration specific elements will be rendered to template.
 */
export interface SwTableColConfig {
  /** Property of the API response that should be displayed in table column e.g. "diameter". */
  columnDisplayProperty: string;
  /** Title of the table col e.g. "Diameter in meter". */
  columnTitle: string;
  /** If columnDisplayProperty value is URL, this is the property of the URL response that should be displayed in each cell. (e.g. "title") */
  urlDisplayProperty?: string;
  /**
   * If set to true, this column will be sortable.
   * Note: only columns that don't consist of urls should be sortable.
   */
  isSortable?: boolean;
}

export interface PageLimitOptions {
  /** Value that is shown in template. */
  displayValue: string;
  /** Value that is used for endpoint call. */
  value: number;
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface ColumnSorting {
  /** The column name (columnDisplayProperty) the table is sorted after. */
  colName?: string;
  /** Sort direction. */
  direction?: SortDirection;
}
