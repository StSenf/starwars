import { SwTableConfig } from './interfaces';

export const TABLE_CONFIG: SwTableConfig[] = [
  {
    endpoint: 'https://swapi.dev/api/people',
    limitEndpoint: 'https://www.swapi.tech/api/people',
    searchPhrase: 'Search person name',
    endpointControlValue: 'People',
    columnConfig: [
      {
        columnDisplayProperty: 'name',
        columnTitle: 'Person',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'birth_year',
        columnTitle: 'Birth',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'homeworld',
        columnTitle: 'Home',
        isValueUrl: true,
        isUrlMultiple: false,
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'species',
        columnTitle: 'Species',
        isValueUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'films',
        columnTitle: 'Movies',
        isValueUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'title',
      },
    ],
  },
  {
    endpoint: 'https://swapi.dev/api/planets/',
    limitEndpoint: 'https://www.swapi.tech/api/planets',
    searchPhrase: 'Search planet name',
    endpointControlValue: 'Planets',
    columnConfig: [
      {
        columnDisplayProperty: 'name',
        columnTitle: 'Planet',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'diameter',
        columnTitle: 'Diameter',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'population',
        columnTitle: 'Population',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'climate',
        columnTitle: 'Climate',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'films',
        columnTitle: 'Movies',
        isValueUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'title',
      },
    ],
  },
  {
    endpoint: 'https://swapi.dev/api/films/',
    limitEndpoint: 'https://www.swapi.tech/api/films',
    searchPhrase: 'Search film title',
    endpointControlValue: 'Films',
    columnConfig: [
      {
        columnDisplayProperty: 'title',
        columnTitle: 'Film',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'episode_id',
        columnTitle: 'Episode',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'producer',
        columnTitle: 'Producer',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'director',
        columnTitle: 'Regisseur',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'species',
        columnTitle: 'Species',
        isValueUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'characters',
        columnTitle: 'Characters',
        isUrlMultiple: true,
        isValueUrl: true,
        urlDisplayProperty: 'name',
      },
    ],
  },
  {
    endpoint: 'https://swapi.dev/api/starships/',
    limitEndpoint: 'https://www.swapi.tech/api/starships',
    searchPhrase: 'Search starship name',
    endpointControlValue: 'Starships',
    columnConfig: [
      {
        columnDisplayProperty: 'name',
        columnTitle: 'Name',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'model',
        columnTitle: 'Model',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'crew',
        columnTitle: 'Crew',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'passengers',
        columnTitle: 'Passengers',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'max_atmosphering_speed',
        columnTitle: 'Max atmosphering speed',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'films',
        columnTitle: 'Films',
        isValueUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'title',
      },
    ],
  },
  {
    endpoint: 'https://swapi.dev/api/vehicles/',
    limitEndpoint: 'https://www.swapi.tech/api/vehicles',
    searchPhrase: 'Search vehicle name',
    endpointControlValue: 'Vehicles',
    columnConfig: [
      {
        columnDisplayProperty: 'name',
        columnTitle: 'Name',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'model',
        columnTitle: 'Model',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'crew',
        columnTitle: 'Crew',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'passengers',
        columnTitle: 'Passengers',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'max_atmosphering_speed',
        columnTitle: 'Max atmosphering speed',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'pilots',
        columnTitle: 'Pilots',
        isValueUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'films',
        columnTitle: 'Films',
        isValueUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'title',
      },
    ],
  },
  {
    endpoint: 'https://swapi.dev/api/species/',
    limitEndpoint: 'https://www.swapi.tech/api/species',
    searchPhrase: 'Search species name',
    endpointControlValue: 'Species',
    columnConfig: [
      {
        columnDisplayProperty: 'name',
        columnTitle: 'Name',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'designation',
        columnTitle: 'Designation ',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'average_lifespan',
        columnTitle: 'Average lifespan ',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'language',
        columnTitle: 'Language ',
        isValueUrl: false,
      },
      {
        columnDisplayProperty: 'homeworld',
        columnTitle: 'Home',
        isValueUrl: true,
        isUrlMultiple: false,
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'people',
        columnTitle: 'People',
        isValueUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'name',
      },
      {
        columnDisplayProperty: 'films',
        columnTitle: 'Films',
        isValueUrl: true,
        isUrlMultiple: true,
        urlDisplayProperty: 'title',
      },
    ],
  },
];
