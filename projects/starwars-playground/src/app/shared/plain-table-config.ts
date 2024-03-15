import { SwTableConfig } from './plain-table.interfaces';

/**
 * @deprecated: use for every table a separate config
 */
export const TABLE_CONFIG: SwTableConfig[] = [
  {
    dotTechEndpoint: 'https://www.swapi.tech/api/people',
    searchPhrase: 'Search person name',
    tableConfigControlValue: 'People',
    columnConfig: [
      {
        columnDisplayProperty: 'name',
        columnTitle: 'Person',
      },
      {
        columnDisplayProperty: 'birth_year',
        columnTitle: 'Birth',
      },
      {
        columnDisplayProperty: 'homeworld',
        columnTitle: 'Home',
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'species',
        columnTitle: 'Species',
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'films',
        columnTitle: 'Movies',
        urlDisplayProperty: 'title',
      },
    ],
  },
  {
    dotTechEndpoint: 'https://www.swapi.tech/api/planets',
    searchPhrase: 'Search planet name',
    tableConfigControlValue: 'Planets',
    columnConfig: [
      {
        columnDisplayProperty: 'name',
        columnTitle: 'Planet',
      },
      {
        columnDisplayProperty: 'diameter',
        columnTitle: 'Diameter',
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
        columnDisplayProperty: 'films',
        columnTitle: 'Movies',
        urlDisplayProperty: 'title',
      },
    ],
  },
  {
    dotTechEndpoint: 'https://www.swapi.tech/api/starships',
    searchPhrase: 'Search starship name',
    tableConfigControlValue: 'Starships',
    columnConfig: [
      {
        columnDisplayProperty: 'name',
        columnTitle: 'Name',
      },
      {
        columnDisplayProperty: 'model',
        columnTitle: 'Model',
      },
      {
        columnDisplayProperty: 'crew',
        columnTitle: 'Crew',
      },
      {
        columnDisplayProperty: 'passengers',
        columnTitle: 'Passengers',
      },
      {
        columnDisplayProperty: 'max_atmosphering_speed',
        columnTitle: 'Max atmosphering speed',
      },
      {
        columnDisplayProperty: 'films',
        columnTitle: 'Films',
        urlDisplayProperty: 'title',
      },
    ],
  },
  {
    dotTechEndpoint: 'https://www.swapi.tech/api/vehicles',
    searchPhrase: 'Search vehicle name',
    tableConfigControlValue: 'Vehicles',
    columnConfig: [
      {
        columnDisplayProperty: 'name',
        columnTitle: 'Name',
      },
      {
        columnDisplayProperty: 'model',
        columnTitle: 'Model',
      },
      {
        columnDisplayProperty: 'crew',
        columnTitle: 'Crew',
      },
      {
        columnDisplayProperty: 'passengers',
        columnTitle: 'Passengers',
      },
      {
        columnDisplayProperty: 'max_atmosphering_speed',
        columnTitle: 'Max atmosphering speed',
      },
      {
        columnDisplayProperty: 'pilots',
        columnTitle: 'Pilots',
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'films',
        columnTitle: 'Films',
        urlDisplayProperty: 'title',
      },
    ],
  },
  {
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
      {
        columnDisplayProperty: 'films',
        columnTitle: 'Films',
        urlDisplayProperty: 'title',
      },
    ],
  },
];
