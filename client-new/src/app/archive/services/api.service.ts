import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiClass } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'any',
})
export class ApiService {
  BASE_URL = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  getArchive(term: string, code: string): Observable<ApiClass[]> {
    return this.http.get<ApiClass[]>(
      `${this.BASE_URL}/archive/${term}/${code}`
    );
  }
}
