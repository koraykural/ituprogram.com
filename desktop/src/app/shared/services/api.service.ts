import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  Subject,
  Term,
  SelectedPlan,
  GroupApi,
  GroupPlan,
  Class,
  PlanData,
  PlanGroup,
  PlanItemMulti,
} from "app/interfaces";
import { AppConfig } from "environments/environment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getSubjects(faculty: string) {
    return this.http.post<Subject[]>(`${AppConfig.API_ENDPOINT}/faculty`, {
      faculty,
    });
  }

  getTerms(subject: string) {
    return this.http.post<Term[]>(`${AppConfig.API_ENDPOINT}/subject`, {
      subject,
    });
  }

  getPlanData(selectedPlan: SelectedPlan): Observable<PlanData> {
    return this.http
      .get<GroupApi[]>(
        `${AppConfig.API_ENDPOINT}/plan/${selectedPlan.subject.abrv}/${selectedPlan.term.link}`
      )
      .pipe(map((data) => this.mergeSubGroups(data)));
  }

  mergeSubGroups(groups: GroupApi[]): PlanData {
    const data: PlanGroup[] = [];
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];

      if (!this.isSubGroup(group)) {
        const dataGroup: PlanGroup = {
          label: group.label,
          items: [],
        };

        group.items.forEach((item) => {
          dataGroup.items.push({
            code: item.code,
            credits: item.credits,
            name: item.name,
            grade: null,
          });
        });

        data.push(dataGroup);
      } else {
        let j = i - 1;
        while (!data[j] || this.isSubGroup(data[j])) {
          j -= 1;
        }
        data[j].items.push({
          label: group.label,
          items: [],
          grade: null,
          credits: group.items[0].credits,
        });

        group.items.forEach((item) => {
          (data[j].items[data[j].items.length - 1] as PlanItemMulti).items.push(
            {
              code: item.code,
              name: item.name,
              selected: false,
            }
          );
        });
      }
    }

    return data;
  }

  isSubGroup(group: GroupApi | PlanGroup) {
    return !group.label.match(/[1-9]{1}. Yarıyıl/);
  }

  getClasses(codeArr: string[]) {
    return this.http.post<Class[]>(`${AppConfig.API_ENDPOINT}/classes`, {
      codeArr: JSON.stringify(codeArr),
    });
  }

  getCodes(codeLetter: string): Observable<string[]> {
    return this.http
      .get<string[]>(`${AppConfig.API_ENDPOINT}/code/${codeLetter}`)
      .pipe(map((data) => data.map((str) => codeLetter + " " + str)));
  }
}
