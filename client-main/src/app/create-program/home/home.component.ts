import { Component, OnInit } from '@angular/core';
import { FilterService } from 'src/app/services/filter.service';
import { ClassDataService } from 'src/app/services/class-data.service';
import { Program, Groups, Class } from '../../interfaces';
import { Router } from '@angular/router';
import { retry } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { PlanService } from 'src/app/services/plan.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isClassesLoaded = false;
  isModalOpen = false;
  numOfClasses = 0;
  numOfUnfiltered = 0;
  saveButtonSituation = 0;

  constructor(
    private modalService: FilterService,
    private classService: ClassDataService,
    private planService: PlanService,
    private apiService: ApiService,
    private router: Router
    ) { }

  ngOnInit(): void {
    // Get array of selected classes from plan
    const selectedClasses = this.planService.getSelectedClasses();
    let classData: Class[];

    // Get data of selected classes
    this.apiService.getClasses(selectedClasses).toPromise()
      .then(data => { this.classService.loadClasses(data); })
      .catch(err => {});

    this.classService.isClassesLoaded.subscribe(value => {
      this.isClassesLoaded = value
      this.numOfClasses = this.classService.numOfClasses.value;
      this.numOfUnfiltered = this.classService.numOfUnfiltered.value;
    });
    this.classService.numOfUnfiltered.subscribe(value => this.numOfUnfiltered = value);

    this.modalService.onFilterClick.subscribe((isOpen: boolean) => {
      this.isModalOpen = isOpen;
    })
  }

  ngOnDestroy():void {  }

  filterClick() {
    this.modalService.isModalOpen.next(!this.modalService.isModalOpen.value);
  }

  createProgramToSave(id: string): Program {
    // Create classes, codes of classes which are selected in plan page
    let classes = [];
    const planData = this.planService.planData.value;
    planData.forEach(group => {
      group.items.forEach(item => {
        if(item.selected)
        classes.push(item.code);
      })
    }); 

    // selectedClasses: crns of classes which are selected in program page
    let selectedClasses = this.classService.selectedClasses.value;

    return {
      faculty: this.planService.plan.value.faculty || localStorage.getItem('faculty'),
      subject: this.planService.plan.value.subject || localStorage.getItem('subject'),
      term: this.planService.plan.value.term || localStorage.getItem('term'),
      classes, selectedClasses , id
    }
  }

  submit() {
    // Replace button text with a spinner
    this.saveButtonSituation = 1;

    // Save class data to localStorage
    localStorage.setItem('classes', JSON.stringify(this.classService.classes.value));

    // Check if saving for the first time or saving again
    const id = localStorage.getItem('id');
    const programData: Program = this.createProgramToSave(id);
    this.apiService.postId(programData, id).pipe(retry(2)).subscribe(
      id => {
        localStorage.setItem('id', id);
        this.router.navigateByUrl('/save');
      },
      err => {
        console.log(err);
        this.saveButtonSituation = 2;
      }
    );
  }
}