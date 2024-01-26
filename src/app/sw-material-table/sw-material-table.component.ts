import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';

interface SwTableItem {
  name: string;
  birth_year?: string;
  url?: string;
  home_world?: string;
}

@Component({
  selector: 'sw-material-table',
  templateUrl: './sw-material-table.component.html',
  styleUrl: './sw-material-table.component.scss',
})
export class SwMaterialTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<SwTableItem>;
  public dataSource: MatTableDataSource<SwTableItem>;
  dataArray: SwTableItem[] = [];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'url'];

  constructor(private _http: HttpClient) {}

  // https://www.swapi.tech/api/people?page=2&limit=20 -> limit works with this endpoint
  // https://swapi.dev/api/people?page=1&limit=20 -> limit does NOT work with this endpoint

  ngOnInit(): void {
    this._http
      .get('https://www.swapi.tech/api/people?page=2&limit=20')
      .subscribe((d: any) => {
        console.log(d);
        this.dataArray = d.results;
        this.dataSource = new MatTableDataSource<SwTableItem>(this.dataArray);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;
      });
  }
}
