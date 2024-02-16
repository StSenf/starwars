import { Observable, of } from 'rxjs';

export class MockSwapiService {
  getTableData(): Observable<any> {
    return of(null);
  }
  getCellData(): Observable<any> {
    return of(null);
  }
}
