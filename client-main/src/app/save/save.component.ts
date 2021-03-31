import { Component, OnInit } from '@angular/core';
import { ClassDataService } from '../services/class-data.service';
import { PdfMaker } from './pdf-maker';
import { Class } from '../interfaces';
import { PlanService } from '../services/plan.service';


@Component({
  selector: 'app-save',
  templateUrl: './save.component.html',
  styleUrls: ['./save.component.css']
})
export class SaveComponent implements OnInit {
  selectedClasses = [];
  id: string;
  pdfButtonSituation = 0;

  constructor(
    private classService: ClassDataService,
    private planService: PlanService,
    private pdfMaker: PdfMaker
    ) { }

  ngOnInit(): void {
    this.classService.classes.subscribe(classes => {
      let localClasses: Array<Class>;
      if(classes.length < 1)
        localClasses = this.classService.classes.value;
      else
        localClasses = classes;
      for (let i = 0; i < localClasses.length; i++) {
        if(localClasses[i].selected) {
          this.selectedClasses.push(localClasses[i]);
        }
      }
      this.addCreditsData();
    });
    this.id = localStorage.getItem('id');
  }

  addCreditsData() {
    const planData = this.planService.planData.value;
    planData.forEach(group => {
      group.items.forEach(item => {
        for (let i = 0; i < this.selectedClasses.length; i++) {
          if(this.selectedClasses[i].code === item.code) {
            this.selectedClasses[i].credits = item.credits;
          }
        }
      });
    });
  }

  async generatePdf() {
    // Replace button text with spinner
    this.pdfButtonSituation = 1;
    await new Promise((resolve) => setTimeout(() => {resolve()}, 50));

    this.pdfMaker.generatePdf(this.selectedClasses, this.id);
    this.pdfButtonSituation = 0;
  }
}
