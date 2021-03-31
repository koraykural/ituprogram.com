import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, combineLatest } from "rxjs";
import { Class } from "app/interfaces";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ArchiveService {
  items = new BehaviorSubject<Class[]>([]);
  loading = new BehaviorSubject<boolean>(false);
  errorHappened = new BehaviorSubject<boolean>(false);
  filterTerm: string = "";

  get isBeforeFirstSearch() {
    // Empty items, not loading, no notFound, no errorHappened
    return combineLatest(this.items, this.loading, this.errorHappened).pipe(
      map((values) => values[0].length < 1 && !(values[1] || values[2]))
    );
  }

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

  getArchive(term: string, codeLetter: string) {
    this.reset();
    this.loading.next(true);

    this.http
      .get<Class[]>(`https://ituprogram.com/api/archive/${term}/${codeLetter}`)
      .subscribe(
        (res) => {
          this.loading.next(false);
          if (res.length > 0) {
            this.items.next(res);
            this.filter(this.filterTerm);
            this.sort();
          } else {
            this.items.next([]);
          }
        },
        (err) => {
          this.loading.next(false);
          this.errorHappened.next(true);
          this.items.next([]);
          console.log(err);
        }
      );
  }

  sort(sortBy: string = "code", order: "asc" | "desc" = "asc") {
    const data = this.items.value;

    switch (sortBy) {
      case "code":
      case "name":
      case "lecturer":
        data.sort((a, b) => textSort(a[sortBy], b[sortBy], order));
        break;

      default:
        break;
    }
  }

  reset() {
    this.items.next([]);
    this.errorHappened.next(false);
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

  filter(term: string) {
    this.filterTerm = term;

    if (term.length < 3) {
      this.resetFilter();
      return;
    }

    const items = this.items.value;
    const q = term.toLocaleLowerCase("tr");
    items.map((item) => {
      const { code, name, lecturer, days, hours, buildings, crn } = item;

      let fields = [
        code,
        name,
        lecturer,
        buildings.join(","),
        days.join(","),
        hours.join(","),
        crn.toString(),
      ];

      fields = fields.map((x) => x.toLocaleLowerCase("tr"));
      const joinedFields = fields.join(",").replace(/[ ]{2,}/, " ");

      // console.log(joinedFields.match(new RegExp(q, "s")));

      if (joinedFields.match(new RegExp(q, "s"))) {
        item.hidden = false;
      } else {
        item.hidden = true;
      }
    });
  }

  resetFilter() {
    const items = this.items.value;
    items.map((x) => (x.hidden = false));
    this.items.next(items);
  }
}

const textSort = (a: string, b: string, order: "asc" | "desc"): number => {
  if ((order === "asc" && a > b) || (order === "desc" && a < b)) {
    return 1;
  } else {
    return -1;
  }
};
