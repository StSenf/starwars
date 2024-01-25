import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SwMaterialTableDataSource, SwMaterialTableItem } from './sw-material-table-datasource';

@Component({
  selector: 'sw-sw-material-table',
  templateUrl: './sw-material-table.component.html',
  styleUrl: './sw-material-table.component.scss'
})
export class SwMaterialTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<SwMaterialTableItem>;
  dataSource = new SwMaterialTableDataSource();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
