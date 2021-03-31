import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Class } from "./interfaces";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ArchiveService {
  modalOpen = new BehaviorSubject(false);
  headers = new BehaviorSubject([
    { shown: "Kod", identifier: "code", visible: true },
    { shown: "Ders", identifier: "name", visible: true },
    { shown: "Eğitmen(ler)", identifier: "lecturer", visible: true },
    { shown: "Gün", identifier: "days", visible: true },
    { shown: "Saat", identifier: "hours", visible: true },
    { shown: "Bina", identifier: "buildings", visible: true },
    { shown: "Kayıtlı", identifier: "enrolled", visible: true },
    { shown: "Kontenjan", identifier: "capacity", visible: true },
    { shown: "Bölüm sınırlaması", identifier: "restricts", visible: true },
    { shown: "CRN", identifier: "crn", visible: true },
  ]);

  constructor(private http: HttpClient) {}

  getArchive(term: string, codeLetter: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // If cached to local, return it
      const local = localStorage.getItem(term + codeLetter);
      if (local) {
        resolve(JSON.parse(local));
        return;
      }

      this.http
        .get(`${environment.API_URL}/archive/${term}/${codeLetter}`)
        .subscribe(
          (res: [Class]) => {
            localStorage.setItem(term + codeLetter, JSON.stringify(res));
            if (res.length > 0) resolve(res);
            else reject();
          },
          (err) => {
            console.log(err);
            reject();
          }
        );
    });
  }

  toggleHeader(identifier: string) {
    let headersNew = this.headers.value;
    for (let i = 0; i < headersNew.length; i++) {
      if (headersNew[i].identifier === identifier) {
        headersNew[i].visible = !headersNew[i].visible;
        break;
      }
    }
    this.headers.next(headersNew);
  }
}
