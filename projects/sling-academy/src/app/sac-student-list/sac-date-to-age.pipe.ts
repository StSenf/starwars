import { Pipe, PipeTransform } from '@angular/core';

/**
 * Calculates the age of a student by their birthdate.
 * The birthdate must be of UTC format, e.g. '2002-04-26T00:00:00'.
 *
 * Usage: <p>{{ '2002-04-26T00:00:00' | SacDateToAge }}</p>
 */
@Pipe({
  standalone: true,
  name: 'SacDateToAge',
})
export class SacDateToAgePipe implements PipeTransform {
  transform(birth: string): string {
    const birthDate: Date = new Date(birth);
    const today: Date = new Date();

    let yearsOfAge: number = today.getFullYear() - birthDate.getFullYear();
    let age: string = yearsOfAge.toString();

    if (yearsOfAge > 0) {
      if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() == birthDate.getMonth() &&
          today.getDate() < birthDate.getDate())
      ) {
        yearsOfAge--;
        age = yearsOfAge.toString();
      }
    } else {
      age = 'person not born yet';
    }

    return age;
  }
}
