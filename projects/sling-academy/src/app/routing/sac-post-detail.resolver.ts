import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { SlingPost } from '../shared/interfaces';
import { SlingAcademyService } from '../shared/sling-academy.service';

export const PostDetailResolver: ResolveFn<SlingPost> = (
  route: ActivatedRouteSnapshot,
) => {
  return inject(SlingAcademyService).getPostById(route.paramMap.get('id')!);
};
