import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PlanService } from "../services/plan.service";
import { FilterService } from "../services/filter.service";
import { ApiService } from "../services/api.service";
import { Subjects, Terms, Faculties } from "../interfaces";
import { BehaviorSubject } from "rxjs";
import { ClassDataService } from "../services/class-data.service";

@Component({
  selector: "app-department-selector",
  templateUrl: "./department-selector.component.html",
  styleUrls: ["./department-selector.component.css"],
})
export class DepartmentSelectorComponent implements OnInit {
  @Output() planLink = new EventEmitter();

  planForm = new FormGroup({
    faculty: new FormControl("", [Validators.required]),
    subject: new FormControl({ value: "", disabled: true }, [
      Validators.required,
    ]),
    term: new FormControl({ value: "", disabled: true }, [Validators.required]),
  });

  faculties: Faculties = [
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
  subjects = new BehaviorSubject([]);
  subjectsState = new BehaviorSubject("Bölüm seçiniz");
  termState = new BehaviorSubject("Lisans kayıt dönemi seçiniz");
  terms = new BehaviorSubject([]);

  constructor(
    private formService: PlanService,
    private modalService: FilterService,
    private apiService: ApiService,
    private classService: ClassDataService
  ) {}

  ngOnInit(): void {
    // Faculty is selected, get subjects
    this.planForm.get("faculty").valueChanges.subscribe((selectedFaculty) => {
      // Reset next fields
      this.planForm.get("subject").setValue("");
      this.planForm.get("term").setValue("");
      this.planForm.get("subject").disable();
      this.planForm.get("term").disable();

      // Get subject list if selection is valid
      if (selectedFaculty) {
        this.subjectsState.next("Liste alınıyor bekleyin");
        this.apiService.getSubjects(selectedFaculty).subscribe((response) => {
          this.subjectsState.next("Bölüm seçiniz");
          this.planForm.get("subject").enable();
          this.subjects.next(response);
        });
      }
    });

    // Subject is selected, get terms
    this.planForm.get("subject").valueChanges.subscribe((selectedSubject) => {
      // Reset next fields
      this.planForm.get("term").disable();
      this.planForm.get("term").setValue("");

      // Get term list if selection is valid
      if (selectedSubject) {
        this.termState.next("Liste alınıyor bekleyin");
        this.apiService.getTerms(selectedSubject).subscribe((response) => {
          this.termState.next("Lisans kayıt dönemi seçiniz");
          this.planForm.get("term").enable();
          this.terms.next(response);
        });
      }
    });
  }

  onSubmit() {
    // Set localstorage
    localStorage.setItem("id", "");
    localStorage.setItem("classes", "");
    localStorage.setItem("planData", "");
    localStorage.setItem("faculty", this.planForm.get("faculty").value);
    localStorage.setItem("subject", this.planForm.get("subject").value);
    localStorage.setItem("term", this.planForm.get("term").value);
    this.classService.reset();

    const { faculty, subject, term } = this.planForm.value;
    this.formService.submitDepartmentSelection(faculty, subject, term);

    const isFirstTime = localStorage.getItem("firstClassSelect");
    if (!isFirstTime) {
      this.modalService.classSelectModal.emit(true);
      localStorage.setItem("firstClassSelect", "true");
    }
  }
}
