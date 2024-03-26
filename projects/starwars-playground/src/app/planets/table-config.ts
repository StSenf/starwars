import { SwTableConfig } from '../shared/plain-table.interfaces';

export const PLANETS_TABLE_CONFIG: SwTableConfig = {
  dotTechEndpoint: 'https://www.swapi.tech/api/planets',
  searchPhrase: 'Search planet name',
  tableConfigControlValue: 'Planets',
  columnConfig: [
    {
      columnDisplayProperty: 'name',
      columnTitle: 'Planet',
      isSortable: true,
    },
    {
      columnDisplayProperty: 'diameter',
      columnTitle: 'Diameter (in kilometers)',
    },
    {
      columnDisplayProperty: 'population',
      columnTitle: 'Population',
    },
    {
      columnDisplayProperty: 'climate',
      columnTitle: 'Climate',
    },
    {
      columnDisplayProperty: 'terrain',
      columnTitle: 'Terrain',
    },
  ],
};
