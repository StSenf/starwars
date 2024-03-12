import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { pluck } from 'rxjs';
import { SwDotTechResource, SwDotTechResponse } from '../interfaces';

export const SwPlanetsResolver: ResolveFn<SwDotTechResource[]> = () => {
  return inject(HttpClient)
    .get<SwDotTechResponse>(
      'https://www.swapi.tech/api/planets?page=1&limit=1000',
    )
    .pipe(pluck('results'));
};
