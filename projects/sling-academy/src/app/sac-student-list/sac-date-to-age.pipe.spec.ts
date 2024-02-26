import { SacDateToAgePipe } from './sac-date-to-age.pipe';

describe('SacDateToAgePipe', () => {
  const pipe = new SacDateToAgePipe();

  it('should transform date to age', () => {
    const birthDate: Date = new Date('2000-04-26T00:00:00');
    const today: Date = new Date();

    let yearsOfAge: number = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() == birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      yearsOfAge--;
    }

    expect(pipe.transform('2000-04-26T00:00:00')).toBe(yearsOfAge.toString());
  });

  it('should return phrase if person not born yet', () => {
    expect(pipe.transform('2200-04-26T00:00:00')).toBe('person not born yet');
  });
});
