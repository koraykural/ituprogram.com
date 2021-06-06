import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiClass, Department, PlanClassGroup, Term } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'any',
})
export class ApiService {
  BASE_URL = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  getDepartments(faculty: string): Observable<Department[]> {
    return this.http
      .post<{ name: string; abrv: string }[]>(`${this.BASE_URL}/faculty`, {
        faculty,
      })
      .pipe(
        map((departments) =>
          departments.map((department) => ({
            name: department.name,
            abbrv: department.abrv,
          }))
        )
      );
  }

  getTerms(subject: string): Observable<Term[]> {
    return this.http.post<Term[]>(`${this.BASE_URL}/subject`, {
      subject,
    });
  }

  getPlanData(department: Department, term: Term) {
    return this.http.get<PlanClassGroup[]>(
      `${this.BASE_URL}/plan/${department.abbrv}/${term.link}`
    );
  }

  getClasses(codeArr: string[]) {
    return this.http.post<ApiClass[]>(`${this.BASE_URL}/classes`, {
      codeArr: JSON.stringify(codeArr),
    });
  }
}
