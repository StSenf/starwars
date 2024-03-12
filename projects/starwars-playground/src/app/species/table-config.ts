import { SwTableConfig } from '../shared/plain-table.interfaces';

export const SPECIES_TABLE_CONFIG: SwTableConfig = {
  dotTechEndpoint: 'https://www.swapi.tech/api/species',
  searchPhrase: 'Search species name',
  tableConfigControlValue: 'Species',
  columnConfig: [
    {
      columnDisplayProperty: 'name',
      columnTitle: 'Name',
    },
    {
      columnDisplayProperty: 'designation',
      columnTitle: 'Designation ',
    },
    {
      columnDisplayProperty: 'average_lifespan',
      columnTitle: 'Average lifespan ',
    },
    {
      columnDisplayProperty: 'language',
      columnTitle: 'Language ',
    },
    {
      columnDisplayProperty: 'homeworld',
      columnTitle: 'Home',
      urlDisplayProperty: 'name',
    },
    {
      columnDisplayProperty: 'people',
      columnTitle: 'People',
      urlDisplayProperty: 'name',
    },
  ],
};
