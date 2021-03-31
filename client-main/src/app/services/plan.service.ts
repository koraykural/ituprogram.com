import { Injectable } from '@angular/core';
import { BehaviorSubject } from'rxjs';
import { Groups } from '../interfaces';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class PlanService {
  plan = new BehaviorSubject({
    faculty: '',
    subject: '',
    term: ''
  });
  planData: BehaviorSubject<Groups> = new BehaviorSubject<Groups>([]);
  planFetchError = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService) { 
    const localPlan = JSON.parse(localStorage.getItem('planData'));
    if(localPlan)
      this.planData.next(localPlan);
  }

  submitDepartmentSelection(faculty: string, subject: string, term: string) {
    localStorage.setItem('faculty', faculty);
    localStorage.setItem('subject', subject);
    localStorage.setItem('term', term);
    this.plan.next({faculty, subject, term});

    this.planData.next([]);

    this.apiService.getPlan(subject, term).subscribe(
      val => {
        this.planData.next(val);
        localStorage.setItem('planData', JSON.stringify(val));
      },
      err => {
        this.planFetchError.next(true);
      }
    )
  }

  getSelectedClasses(): string[] {
    let selectedClasses = [];
    this.planData.value.forEach(group => {
      group.items.forEach(item => {
        if (item.selected) {
          selectedClasses.push(item.code);
        }
      })
    });
    return selectedClasses;
  }
}