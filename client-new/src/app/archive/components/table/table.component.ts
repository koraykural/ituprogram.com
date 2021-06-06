import { Component, Input, OnInit } from '@angular/core';
import { ClassRepresentation } from 'src/app/interfaces';
import { headers, TableHeader } from '../../table-headers';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() data: ClassRepresentation[] = [];
  @Input() headers: TableHeader[] = [...headers];
  @Input() loading: boolean = false;
  @Input() selectionActive: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  preserverWrap(identifier: string): boolean {
    return ['days', 'hours', 'building'].includes(identifier);
  }
}
