import { Routes } from '@angular/router';
import { SwPlanetsListComponent } from './planets/sw-planets-list.component';
import { SwPeopleResolver } from './shared/resolver/sw-people.resolver';
import { SwPlanetsResolver } from './shared/resolver/sw-planets.resolver';

export const routes: Routes = [
  { path: 'planets', component: SwPlanetsListComponent },
  {
    path: 'people',
    loadComponent: () =>
      import('./people/sw-people-list.component').then(
        (mod) => mod.SwPeopleListComponent,
      ),
    resolve: {
      planets: SwPlanetsResolver,
    },
  },
  {
    path: 'species',
    loadComponent: () =>
      import('./species/sw-species-list.component').then(
        (mod) => mod.SwSpeciesListComponent,
      ),
    resolve: {
      planets: SwPlanetsResolver,
      people: SwPeopleResolver,
    },
  },
  { path: '', redirectTo: '/planets', pathMatch: 'full' },
  { path: '**', redirectTo: '/planets', pathMatch: 'full' }, // Wildcard route for a not found page
];
