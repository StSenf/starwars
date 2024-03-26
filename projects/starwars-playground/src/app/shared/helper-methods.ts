import { SwDotTechResource, SwEntity } from './interfaces';
import { STANDARD_SORT_DIRECTION } from './plain-table-constants';
import {
  ColumnSorting,
  SwTableColConfig,
  SwTableConfig,
} from './plain-table.interfaces';

/**
 * Returns column sorting object with the first found sortable column of the table configuration.
 * If none found, and empty object is returned.
 * @param tableConfig Current table config
 */
export function searchFirstSortableColumn(
  tableConfig: SwTableConfig,
): ColumnSorting {
  const firstSortableCol: SwTableColConfig = tableConfig?.columnConfig?.find(
    (elm: SwTableColConfig) => elm.isSortable === true,
  );

  return firstSortableCol
    ? {
        colName: firstSortableCol.columnDisplayProperty,
        direction: STANDARD_SORT_DIRECTION,
      }
    : {};
}

/**
 * Replaces a URL with the actual resource name.
 * e.g.: the url for a planet is given https://www.swapi.tech/api/planet/4,
 * and we want to know the name of the planet.
 *
 * @param entity The entity where a property carries an url that should be replaced by its name
 * @param entityPropertyWithUrl The entities property that is the url
 * @param resourcesToLookForName A list of resources where the name should be looked up
 */
export function replaceUrlWithResourceName(
  entity: SwEntity,
  entityPropertyWithUrl: string,
  resourcesToLookForName: SwDotTechResource[],
): string {
  return (
    resourcesToLookForName.find(
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
export function replaceUrlListWithResourceNames(
  entity: SwEntity,
  entityPropertyWithUrlList: string,
  resourcesToCheck: SwDotTechResource[],
): string[] {
  return entity[entityPropertyWithUrlList]?.map(
    (url: string) =>
      resourcesToCheck.find(
        (resource: SwDotTechResource) => resource.url === url,
      )?.name || 'no data provided',
  );
}
