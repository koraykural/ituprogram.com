import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchiveRoutingModule } from './archive-routing.module';
import { ArchiveComponent } from './components/archive/archive.component';
import { SharedModule } from '../shared/shared.module';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { TableComponent } from './components/table/table.component';

@NgModule({
  declarations: [ArchiveComponent, SidePanelComponent, TableComponent],
  imports: [CommonModule, ArchiveRoutingModule, SharedModule],
})
export class ArchiveModule {}
