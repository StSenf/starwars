import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { SwDotTechResponse } from '../interfaces';
import { SwapiService } from './swapi.service';

describe('SwapiService', () => {
  let swapiService: SwapiService;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    swapiService = TestBed.inject(SwapiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  describe('getTableData()', () => {
    afterEach(() => {
      httpTestingController.verify();
    });

    describe('assemble endpoint', () => {
      it('should include page and limit', () => {
        swapiService.getTableData('www.mock.de', 13, 33).subscribe();

        const req = httpTestingController.expectOne(
          'www.mock.de?page=13&limit=33',
        );
        expect(req.request.method).toEqual('GET');
      });

      it('should include page, limit and search term if provided', () => {
        swapiService.getTableData('www.mock.de', 13, 33, 'Luke').subscribe();

        const req = httpTestingController.expectOne(
          'www.mock.de?page=13&limit=33&search=Luke',
        );
        expect(req.request.method).toEqual('GET');
      });
    });

    describe('successful response', () => {
      const mockResponse: SwDotTechResponse = {
        results: [
          {
            name: 'Luke',
            uid: '1',
            url: 'https://swapi.dev/api/people/1',
          },
          {
            name: 'Annakin',
            uid: '2',
            url: 'https://swapi.dev/api/people/2',
          },
        ],
      } as SwDotTechResponse;

      it('should do', () => {
        swapiService
          .getTableData('www.mock.de', 1, 10, undefined, undefined)
          .subscribe();

        const req = httpTestingController.expectOne(
          'www.mock.de?page=1&limit=10',
        );
        expect(req.request.method).toEqual('GET');
        req.flush(mockResponse);
      });
    });

    it('should throw error ', () => {
      let result = '';
      const errorObj: HttpErrorResponse = {
        status: 404,
        statusText: 'Not Found',
      } as HttpErrorResponse;

      swapiService.getTableData('www.mock.de', 1, 10).subscribe({
        next: () => {},
        error: (err) => (result = err),
      });

      const req = httpTestingController.expectOne(
        'www.mock.de?page=1&limit=10',
      );
      expect(req.request.method).toEqual('GET');
      req.flush('', errorObj);

      expect(result).toBe(
        `Error while fetching table data. Http failure response for www.mock.de?page=1&limit=10: 404 Not Found`,
      );
    });
  });
});
