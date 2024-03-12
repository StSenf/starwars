import { SwTableConfig } from '../model/plain-table.interfaces';

export const TABLE_CONFIG: SwTableConfig[] = [
  {
    dotDevEndpoint: 'https://swapi.dev/api/people',
    dotTechEndpoint: 'https://www.swapi.tech/api/people',
    searchPhrase: 'Search person name',
    tableConfigControlValue: 'People',
    columnConfig: [
      {
        columnDisplayProperty: 'name',
        columnTitle: 'Person',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'birth_year',
        columnTitle: 'Birth',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'homeworld',
        columnTitle: 'Home',
        areCellValuesUrl: true,
        isUrlMultiple: false,
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'species',
        columnTitle: 'Species',
        areCellValuesUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'films',
        columnTitle: 'Movies',
        areCellValuesUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'title',
      },
    ],
  },
  {
    dotDevEndpoint: 'https://swapi.dev/api/planets/',
    dotTechEndpoint: 'https://www.swapi.tech/api/planets',
    searchPhrase: 'Search planet name',
    tableConfigControlValue: 'Planets',
    columnConfig: [
      {
        columnDisplayProperty: 'name',
        columnTitle: 'Planet',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'diameter',
        columnTitle: 'Diameter',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'population',
        columnTitle: 'Population',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'climate',
        columnTitle: 'Climate',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'films',
        columnTitle: 'Movies',
        areCellValuesUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'title',
      },
    ],
  },
  {
    dotDevEndpoint: 'https://swapi.dev/api/films/',
    dotTechEndpoint: 'https://www.swapi.tech/api/films',
    searchPhrase: 'Search film title',
    tableConfigControlValue: 'Films',
    columnConfig: [
      {
        columnDisplayProperty: 'title',
        columnTitle: 'Film',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'episode_id',
        columnTitle: 'Episode',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'producer',
        columnTitle: 'Producer',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'director',
        columnTitle: 'Regisseur',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'species',
        columnTitle: 'Species',
        areCellValuesUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'characters',
        columnTitle: 'Characters',
        isUrlMultiple: true,
        areCellValuesUrl: true,
        urlDisplayProperty: 'name',
      },
    ],
  },
  {
    dotDevEndpoint: 'https://swapi.dev/api/starships/',
    dotTechEndpoint: 'https://www.swapi.tech/api/starships',
    searchPhrase: 'Search starship name',
    tableConfigControlValue: 'Starships',
    columnConfig: [
      {
        columnDisplayProperty: 'name',
        columnTitle: 'Name',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'model',
        columnTitle: 'Model',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'crew',
        columnTitle: 'Crew',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'passengers',
        columnTitle: 'Passengers',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'max_atmosphering_speed',
        columnTitle: 'Max atmosphering speed',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'films',
        columnTitle: 'Films',
        areCellValuesUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'title',
      },
    ],
  },
  {
    dotDevEndpoint: 'https://swapi.dev/api/vehicles/',
    dotTechEndpoint: 'https://www.swapi.tech/api/vehicles',
    searchPhrase: 'Search vehicle name',
    tableConfigControlValue: 'Vehicles',
    columnConfig: [
      {
        columnDisplayProperty: 'name',
        columnTitle: 'Name',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'model',
        columnTitle: 'Model',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'crew',
        columnTitle: 'Crew',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'passengers',
        columnTitle: 'Passengers',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'max_atmosphering_speed',
        columnTitle: 'Max atmosphering speed',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'pilots',
        columnTitle: 'Pilots',
        areCellValuesUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'films',
        columnTitle: 'Films',
        areCellValuesUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'title',
      },
    ],
  },
  {
    dotDevEndpoint: 'https://swapi.dev/api/species/',
    dotTechEndpoint: 'https://www.swapi.tech/api/species',
    searchPhrase: 'Search species name',
    tableConfigControlValue: 'Species',
    columnConfig: [
      {
        columnDisplayProperty: 'name',
        columnTitle: 'Name',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'designation',
        columnTitle: 'Designation ',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'average_lifespan',
        columnTitle: 'Average lifespan ',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'language',
        columnTitle: 'Language ',
        areCellValuesUrl: false,
      },
      {
        columnDisplayProperty: 'homeworld',
        columnTitle: 'Home',
        areCellValuesUrl: true,
        isUrlMultiple: false,
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'people',
        columnTitle: 'People',
        areCellValuesUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'films',
        columnTitle: 'Films',
        areCellValuesUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'title',
      },
    ],
  },
];
