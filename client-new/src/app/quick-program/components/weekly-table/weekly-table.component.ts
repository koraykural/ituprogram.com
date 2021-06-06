import { Component, OnInit } from '@angular/core';
import { TableService } from '../../services/table.service';
import { InfoService } from '../../services/info.service';
import { CellData } from 'src/app/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-weekly-table',
  templateUrl: './weekly-table.component.html',
  styleUrls: ['./weekly-table.component.scss'],
})
export class WeeklyTableComponent implements OnInit {
  data$: Observable<CellData[][]> = this.tableService.tableData$;
  constructor(
    private tableService: TableService,
    public infoService: InfoService
  ) {}

  ngOnInit(): void {}

  dayLabels = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
  hourLabels = [
    '08.30',
    '09.30',
    '10.30',
    '11.30',
    '12.30',
    '13.30',
    '14.30',
    '15.30',
    '16.30',
  ];

  cellDisplay(d: CellData) {
    if (d.course) {
      return d.course.code;
    } else {
      return '';
    }
  }

  mouseEnterCell(cell: CellData) {
    if (cell.course) {
      this.infoService.mouseEntered(cell.course);
    }
  }

  mouseLeftCell() {
    this.infoService.clearHovered();
  }
}
