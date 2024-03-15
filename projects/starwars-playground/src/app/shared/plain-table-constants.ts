import { PageLimitOptions, SortDirection } from './plain-table.interfaces';

export const STANDARD_PAGE_LIMIT = 10;
export const PAGE_LIMIT_OPTIONS: PageLimitOptions[] = [
  {
    displayValue: '5 items per page',
    value: 5,
  },
  {
    displayValue: '10 items per page',
    value: 10,
  },
  {
    displayValue: '20 items per page',
    value: 20,
  },
  {
    displayValue: '50 items per page',
    value: 50,
  },
];
export const STANDARD_SORT_DIRECTION = SortDirection.ASC;
