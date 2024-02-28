import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { SlingStudent } from '../shared/interfaces';
import { SlingAcademyService } from '../shared/sling-academy.service';

export const StudentDetailResolver: ResolveFn<SlingStudent> = (
  route: ActivatedRouteSnapshot,
) => {
  return inject(SlingAcademyService).getStudentById(route.paramMap.get('id')!);
};
