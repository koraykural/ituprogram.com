import { Injectable } from '@angular/core';
import { Program, Groups, Item, Class } from '../interfaces';
import { PlanService } from './plan.service';
import { ClassDataService } from './class-data.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class IdService {
  idNotFound = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private apiService: ApiService,
    private planService: PlanService,
    private classService: ClassDataService
    ) { }

  handleError(id: string) {
    this.idNotFound.next(true);
    localStorage.setItem('id', id);
    this.router.navigateByUrl('/login');
  }

  async setProgram(id: string) {
    let program: Program;
    let planData: Groups;

    await this.apiService.getProgramOfId(id).toPromise()
      .then(val => { program = val })
      .catch(() => { this.handleError(id) });

    const { 
      faculty,
      subject,
      term,
      classes,
      selectedClasses
    } = program;

    await this.apiService.getPlan(subject, term).toPromise()
      .then(val => { planData = val })
      .catch(() => { this.handleError(id) });

    // Map for classes: key: code, value: added or not
    let classesMap: {code: string, added: boolean}[] = [];
    classes.forEach( code => { classesMap.push({code, added: false}) });

    // Set selected items on planData
    planData.forEach(group => {
      group.items.forEach(item => {
        const index = classesMap.findIndex(x => x.code == item.code);
        if(index >= 0) {
          item.selected = true;
          classesMap[index].added = true;
        }
        else
          item.selected = false;
      });
      group.isCollapsed = false;
    });

    // Get data for "Eklenen Dersler" items
    classesMap = classesMap.filter(x => !x.added);
    if(classesMap && classesMap.length > 0) {
      const otherClasses = classesMap.map(x => x.code);
      const otherClassesData = await this.apiService.getClassesBasic(otherClasses).toPromise();
  
      let itemsForOthers: Item[] = [];
      otherClassesData.forEach(el => {
        itemsForOthers.push({
          code: el.code, name: el.name, credits: el.credits, isOpened: true, selected: true
        });
      })
  
      // Add "Eklenen Dersler" group to planData
      if(itemsForOthers.length > 0) {
        planData.push({
          label: "Eklenen Dersler",
          allSelected: true,
          isCollapsed: false,
          items: itemsForOthers
        });
      }
    }

    this.planService.planData.next(planData);
    this.classService.selectedClasses.next(selectedClasses);

    // Set data to localstorage
    localStorage.setItem('id', id);
    localStorage.setItem('faculty', faculty);
    localStorage.setItem('subject', subject);
    localStorage.setItem('term', term);
    localStorage.setItem('firstClassSelect', 'true');
    localStorage.setItem('firstCreateProgram', 'true');

    this.router.navigateByUrl('/create-program');
  }
}
