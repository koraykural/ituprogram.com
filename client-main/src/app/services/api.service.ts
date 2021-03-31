import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {
  Class,
  Program,
  Subjects,
  Terms,
  Groups,
  UpdateStatus,
} from "../interfaces";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getClasses(codeArr: Array<string>) {
    return this.http.post<Array<Class>>(`${environment.API_ENDPOINT}/classes`, {
      codeArr: JSON.stringify(codeArr),
    });
  }

  getClassesBasic(codeArr: Array<string>) {
    return this.http.post<Array<Class>>(
      `${environment.API_ENDPOINT}/classes-basic`,
      { codeArr: JSON.stringify(codeArr) }
    );
  }

  getSubjects(faculty: string) {
    return this.http.post<Subjects>(`${environment.API_ENDPOINT}/faculty`, {
      faculty,
    });
  }

  getTerms(subject: string) {
    return this.http.post<Terms>(`${environment.API_ENDPOINT}/subject`, {
      subject,
    });
  }

  getCodes(letter: string) {
    return this.http.get<Array<string>>(
      `${environment.API_ENDPOINT}/code/${letter}`
    );
  }

  getPlan(subject: string, term: string) {
    return this.http.get<Groups>(
      `${environment.API_ENDPOINT}/plan/${subject}/${term}`
    );
  }

  getProgramOfId(id: string) {
    return this.http.get<Program>(`${environment.API_ENDPOINT}/id/${id}`);
  }

  postId(programData: Program, id: string) {
    if (id)
      return this.http.post<string>(`${environment.API_ENDPOINT}/id`, {
        programData: programData,
        id: id,
      });
    else
      return this.http.post<string>(`${environment.API_ENDPOINT}/id`, {
        programData: programData,
      });
  }

  getUpdateStatus() {
    return this.http.get<UpdateStatus>(
      `${environment.API_ENDPOINT}/updateStatus`
    );
  }
}
