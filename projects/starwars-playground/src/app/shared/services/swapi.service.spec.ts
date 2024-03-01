import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { MockLoadingStateService } from '../mocks/mock-loading-state.service';
import {
  SortDirection,
  SwApiResponse,
  SwPerson,
  SwTableConfig,
} from '../model/interfaces';
import { LoadingStatus, StatusEntry } from '../model/loading-state.interfaces';
import { LoadingStateService } from './loading-state.service';
import { SwapiService } from './swapi.service';
import Spy = jasmine.Spy;

describe('SwapiService', () => {
  let swapiService: SwapiService;
  let loadingStateService: LoadingStateService;
  let httpTestingController: HttpTestingController;

  const commonTableConfig: SwTableConfig = {
    endpoint: 'www.mock.de',
    limitEndpoint: 'www.limit-mock.de',
    searchPhrase: 'Search mock',
    tableConfigControlValue: 'mock',
    columnConfig: [],
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: LoadingStateService,
          useClass: MockLoadingStateService,
        },
      ],
    });

    swapiService = TestBed.inject(SwapiService);
    loadingStateService = TestBed.inject(LoadingStateService);
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  describe('getTableData()', () => {
    afterEach(() => {
      httpTestingController.verify();
    });

    it('should call LoadingState reset method', () => {
      const resetSpy = spyOn(loadingStateService, 'resetEndpointLoadingList');

      swapiService.getTableData(commonTableConfig, 'mock', 1, 10);

      expect(resetSpy).toHaveBeenCalled();
    });

    describe('assemble endpoint', () => {
      it('should include page and limit', () => {
        swapiService
          .getTableData(commonTableConfig, 'www.mock.de', 13, 33)
          .subscribe();

        const req = httpTestingController.expectOne(
          'www.mock.de?&page=13&limit=33',
        );
        expect(req.request.method).toEqual('GET');
      });

      it('should include page, limit and search term if provided', () => {
        swapiService
          .getTableData(commonTableConfig, 'www.mock.de', 13, 33, 'Luke')
          .subscribe();

        const req = httpTestingController.expectOne(
          'www.mock.de?search=Luke&page=13&limit=33',
        );
        expect(req.request.method).toEqual('GET');
      });
    });

    describe('successful response', () => {
      let createSpy;
      const mockResponse: SwApiResponse = {
        results: [
          {
            name: 'Luke',
            gender: 'male',
            films: [
              'https://swapi.dev/api/films/3',
              'https://swapi.dev/api/films/4',
            ],
          },
          {
            name: 'Annakin',
            gender: 'male',
            films: [
              'https://swapi.dev/api/films/1',
              'https://swapi.dev/api/films/4',
            ],
          },
        ],
      } as SwApiResponse;
      const mockTableConfig: SwTableConfig = {
        endpoint: 'www.mock.de',
        limitEndpoint: 'www.limit-mock.de',
        searchPhrase: 'Search mock',
        tableConfigControlValue: 'mock',
        columnConfig: [
          {
            columnDisplayProperty: 'name',
            columnTitle: 'Name',
            areCellValuesUrl: false,
          },
          {
            columnDisplayProperty: 'gender',
            columnTitle: 'Identified gender',
            areCellValuesUrl: false,
          },
          {
            columnDisplayProperty: 'films',
            columnTitle: 'Films occurred in',
            areCellValuesUrl: true,
            isUrlMultiple: true,
            urlDisplayProperty: 'title',
          },
        ],
      };

      beforeEach(() => {
        createSpy = spyOn(loadingStateService, 'createEndpointLoadingList');
      });

      it('should create an unsorted status entry list', () => {
        const expectedUnsortedStatusEntryList: StatusEntry[] = [
          {
            colName: 'films',
            correspondingRowIdx: 0, // Luke column
            endpoint: 'https://swapi.dev/api/films/3',
            status: LoadingStatus.ADDED,
          },
          {
            colName: 'films',
            correspondingRowIdx: 0, // Luke column
            endpoint: 'https://swapi.dev/api/films/4',
            status: LoadingStatus.ADDED,
          },
          {
            colName: 'films',
            correspondingRowIdx: 1, // Annakin column
            endpoint: 'https://swapi.dev/api/films/1',
            status: LoadingStatus.ADDED,
          },
          {
            colName: 'films',
            correspondingRowIdx: 1, // Annakin column
            endpoint: 'https://swapi.dev/api/films/4',
            status: LoadingStatus.ADDED,
          },
        ];

        swapiService
          .getTableData(
            mockTableConfig,
            'www.mock.de',
            1,
            10,
            undefined,
            undefined,
          )
          .subscribe();

        const req = httpTestingController.expectOne(
          'www.mock.de?&page=1&limit=10',
        );
        expect(req.request.method).toEqual('GET');
        req.flush(mockResponse);

        expect(createSpy).toHaveBeenCalledWith(expectedUnsortedStatusEntryList);
      });

      it('should create a sorted status entry list', () => {
        const expectedSortedStatusEntryList: StatusEntry[] = [
          {
            colName: 'films',
            correspondingRowIdx: 0,
            endpoint: 'https://swapi.dev/api/films/1', // Annakin film 1
            status: LoadingStatus.ADDED,
          },
          {
            colName: 'films',
            correspondingRowIdx: 0,
            endpoint: 'https://swapi.dev/api/films/4', // Annakin film 2
            status: LoadingStatus.ADDED,
          },
          {
            colName: 'films',
            correspondingRowIdx: 1,
            endpoint: 'https://swapi.dev/api/films/3', // Luke film 1
            status: LoadingStatus.ADDED,
          },
          {
            colName: 'films',
            correspondingRowIdx: 1,
            endpoint: 'https://swapi.dev/api/films/4', // Luke film 2
            status: LoadingStatus.ADDED,
          },
        ];

        swapiService
          .getTableData(mockTableConfig, 'www.mock.de', 1, 10, undefined, {
            colName: 'name',
            direction: SortDirection.ASC,
          })
          .subscribe();

        const req = httpTestingController.expectOne(
          'www.mock.de?&page=1&limit=10',
        );
        expect(req.request.method).toEqual('GET');
        req.flush(mockResponse);

        expect(createSpy).toHaveBeenCalledWith(expectedSortedStatusEntryList);
      });
    });

    it('should throw error and dont create a status entry list', () => {
      const createSpy = spyOn(loadingStateService, 'createEndpointLoadingList');
      let result = '';
      const errorObj: HttpErrorResponse = {
        status: 404,
        statusText: 'Not Found',
      } as HttpErrorResponse;

      swapiService
        .getTableData(commonTableConfig, 'www.mock.de', 1, 10)
        .subscribe({
          next: () => {},
          error: (err) => (result = err),
        });

      const req = httpTestingController.expectOne(
        'www.mock.de?&page=1&limit=10',
      );
      expect(req.request.method).toEqual('GET');
      req.flush('', errorObj);

      expect(result).toBe(`Error while fetching data. Error ${errorObj}`);
      expect(createSpy).not.toHaveBeenCalled();
    });
  });

  describe('getCellData()', () => {
    let changeElmSpy: Spy;
    const endpoint: string = 'www.mock.de';
    const correspondingRowIdx: number = 2;
    const colName: string = 'diameter';
    const mockResponse: SwPerson = { name: 'Luke', gender: 'male' } as SwPerson;

    beforeEach(() => {
      changeElmSpy = spyOn(loadingStateService, 'changeElementStatus');
    });

    it('should change element status from loading to loaded if response happened', () => {
      swapiService
        .getCellData(endpoint, correspondingRowIdx, colName)
        .subscribe();

      const req = httpTestingController.expectOne(endpoint);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);

      expect(changeElmSpy).toHaveBeenCalledTimes(2);
      expect(changeElmSpy).toHaveBeenCalledWith({
        status: LoadingStatus.LOADING,
        endpoint,
        correspondingRowIdx,
        colName,
      });
      expect(changeElmSpy).toHaveBeenCalledWith({
        status: LoadingStatus.LOADED,
        endpoint,
        correspondingRowIdx,
        colName,
      });
    });

    it('should change element status to erroneous if error was thrown', () => {
      let result = '';
      const errorObj: HttpErrorResponse = {
        status: 404,
        statusText: 'Not Found',
      } as HttpErrorResponse;

      swapiService
        .getCellData(endpoint, correspondingRowIdx, colName)
        .subscribe({
          next: () => {},
          error: (err) => (result = err),
        });

      const req = httpTestingController.expectOne(endpoint);
      expect(req.request.method).toEqual('GET');
      req.flush('', errorObj);

      expect(result).toBe(`Error while fetching data. Error ${errorObj}`);
      expect(changeElmSpy).toHaveBeenCalledTimes(1);
      expect(changeElmSpy).toHaveBeenCalledWith({
        status: LoadingStatus.ERRONEOUS,
        endpoint,
        correspondingRowIdx,
        colName,
      });
    });
  });
});
