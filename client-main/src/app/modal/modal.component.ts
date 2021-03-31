import { Component, OnInit, HostListener } from '@angular/core';
import { FilterService } from '../services/filter.service';
import { ClassDataService } from '../services/class-data.service';
import { Filter } from '../interfaces';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  filter: Filter;
  isModalOpen = false;
  classSelectModal = false;
  classPage = 1;
  createProgramModal = false;
  createPage = 1;
  major: string;

  // Image placeholder space
  imageHeight: number
  @HostListener('window:resize', ['$event'])
  calculateModalHeight() {
    const screenWidth = window.innerWidth;
    const maxModalWidth = 500;
    let modalWidth: number;
    if(screenWidth < 575) {
      modalWidth = screenWidth - 16;
    }
    else {
      modalWidth = maxModalWidth;
    }
    const imageWidth = modalWidth - 32;
    this.imageHeight = (0.674 * imageWidth);
  }
  onResize() {
    this.calculateModalHeight();
  }

  constructor ( 
    private modalService:FilterService,
    private classService: ClassDataService
  ) {}

  ngOnInit() {
    this.modalService.major.subscribe(val => this.major = val);
    this.filter = this.modalService.filter;
    this.modalService.isModalOpen.subscribe(value => {
      this.isModalOpen  = value;
      if(value)
        this.filter = this.modalService.filter;
    });
    this.modalService.classSelectModal.subscribe(value => this.classSelectModal = value);
    this.modalService.createProgramModal.subscribe(value => this.createProgramModal = value);
    this.calculateModalHeight();
  }

  toggleFilter(id: string, filterType: string) {
    this.modalService.toggleFilter(id, filterType);
    this.classService.setNumUnfiltered();
  }

  closeModal() {
    this.modalService.isModalOpen.next(false);
  }

  decClassPage() {if(this.classPage != 1) this.classPage--;}
  incClassPage() {if(this.classPage != 4) this.classPage++;}
  decCreatePage() {if(this.createPage != 1) this.createPage--;}
  incCreatePage() {if(this.createPage != 4) this.createPage++;}
}