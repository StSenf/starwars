export interface SwApiResponse {
  count?: number; // swapi.dev specific
  total_records?: number; // swapi.tech specific
  next: string;
  previous: string;
  results: SwPerson[]; // ToDo: could be other response e.g. planets
}
export interface SwPerson {
  name: string;
  birth_year: string;
  eye_color: string;
  gender: string;
  hair_color: string;
  height: string;
  mass: string;
  skin_color: string;
  homeworld: string;
  films: string[]; //array of films resource URLs
  species: string[]; // array of species resource URLs.
  starships: any[]; // array of starship resource URLs that this person has piloted.
  vehicles: any[]; // An array of vehicle resource URLs that this person has piloted.
  url: string; // the hypermedia URL of this resource.
  created: string; //the ISO 8601 date format of the time that this resource was created.
  edited: string; // the ISO 8601 date format of the time that this resource was edited.
}
