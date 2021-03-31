import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FormGroup, FormControl } from "@angular/forms";
import { Term, Subject } from "app/interfaces";
import { PlanService } from "app/state/plan.service";
import { ApiService } from "app/shared/services/api.service";

@Component({
  selector: "app-plan-selector",
  templateUrl: "./plan-selector.component.html",
  styleUrls: ["./plan-selector.component.css"],
})
export class PlanSelectorComponent implements OnInit {
  planForm = new FormGroup(
    {
      faculty: new FormControl(null),
      subject: new FormControl({ value: null, disabled: true }),
      term: new FormControl({ value: null, disabled: true }),
    },
    { validators: this.requiredValidator() }
  );

  requiredValidator() {
    return (group: FormGroup) => {
      let errors: any = {};
      let conError: boolean = false;
      const { faculty, subject, term } = group.value;
      if (!faculty || !subject || !term) {
        errors.required = true;
        conError = true;
      }
      return conError ? errors : null;
    };
  }

  faculties = [
    { name: "İnşaat Fakültesi", abrv: "IN" },
    { name: "Mimarlık Fakültesi", abrv: "MM" },
    { name: "Makina Fakültesi", abrv: "MK" },
    { name: "Elektrik - Elektronik Fakültesi", abrv: "EE" },
    { name: "Maden Fakültesi", abrv: "MD" },
    { name: "Kimya - Metalurji Fakültesi", abrv: "KM" },
    { name: "İşletme Fakültesi", abrv: "IS" },
    { name: "Gemi İnşaatı ve Deniz Bilimleri Fakültesi", abrv: "GD" },
    { name: "Fen - Edebiyat Fakültesi", abrv: "FE" },
    { name: "Uçak ve Uzay Bilimleri Fakültesi", abrv: "UU" },
    { name: "Türk Musikisi Devlet Konservatuarı", abrv: "KO" },
    { name: "Denizcilik Fakültesi", abrv: "DZ" },
    { name: "Tekstil Teknolojileri ve Tasarımı Fakültesi", abrv: "TK" },
    { name: "Bilgisayar ve Bilişim Fakültesi", abrv: "BB" },
    { name: "Uluslararası Ortak Lisans Programları", abrv: "SN" },
    { name: "İTÜ Kuzey Kıbrıs", abrv: "KK" },
  ];
  subjects = new BehaviorSubject<Subject[]>([]);
  subjectsLoading = false;
  termsLoading = false;
  terms = new BehaviorSubject<Term[]>([]);

  resetFaculty() {
    this.planForm.get("subject").setValue(null);
    this.planForm.get("term").setValue(null);
    this.planForm.get("subject").disable();
    this.planForm.get("term").disable();
  }

  resetSubject() {
    this.planForm.get("term").disable();
    this.planForm.get("term").setValue(null);
  }

  constructor(
    private planService: PlanService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Faculty is selected, get subjects
    this.planForm.get("faculty").valueChanges.subscribe((selectedFaculty) => {
      this.resetFaculty();

      // Get subject list if selection is valid
      if (selectedFaculty) {
        this.subjectsLoading = true;
        this.apiService.getSubjects(selectedFaculty).subscribe((response) => {
          this.subjectsLoading = false;
          this.planForm.get("subject").enable();
          this.subjects.next(response);
        });
      }
    });

    // Subject is selected, get terms
    this.planForm.get("subject").valueChanges.subscribe((selectedSubject) => {
      this.resetSubject();

      // Get term list if selection is valid
      if (selectedSubject) {
        this.termsLoading = true;
        this.apiService.getTerms(selectedSubject).subscribe((response) => {
          this.termsLoading = false;
          this.planForm.get("term").enable();
          this.terms.next(response);
        });
      }
    });
  }

  submit() {
    this.planService.basePlan.next({
      faculty: this.faculties.find(
        (x) => x.abrv === this.planForm.get("faculty").value
      ),
      subject: this.subjects.value.find(
        (x) => x.abrv === this.planForm.get("subject").value
      ),
      term: this.terms.value.find(
        (x) => x.link === this.planForm.get("term").value
      ),
    });
  }
}
