import { Component, OnInit } from '@angular/core';
import { ArchiveService } from '../archive.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  isOpen = false;
  headers = [];

  constructor(private archiveService: ArchiveService) { }

  ngOnInit(): void {
    this.archiveService.modalOpen.subscribe(val => this.isOpen = val);
    this.archiveService.headers.subscribe(val => this.headers = val);
  }

  close() {
    this.archiveService.modalOpen.next(false);
  }

  toggleHeader(identifier: string) {
    this.archiveService.toggleHeader(identifier);
  }

}
