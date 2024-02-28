import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { SlingPost } from '../shared/interfaces';
import { SlingAcademyService } from '../shared/sling-academy.service';

export const PostResolverByStudentId: ResolveFn<SlingPost[]> = (
  route: ActivatedRouteSnapshot,
) => {
  return inject(SlingAcademyService).getPostsByStudentId(
    route.paramMap.get('id')!,
  );
};
