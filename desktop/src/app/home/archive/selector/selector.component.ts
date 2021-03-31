import { Component, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { map, skipWhile } from "rxjs/operators";
import { ArchiveService } from "../archive.service";

@Component({
  selector: "app-selector",
  templateUrl: "./selector.component.html",
  styleUrls: ["./selector.component.css"],
})
export class SelectorComponent implements OnInit {
  selectedTerm = new BehaviorSubject<string>(null);
  selectedCode = new BehaviorSubject<string>(null);

  constructor(public archiveService: ArchiveService) {}

  ngOnInit(): void {
    combineLatest(this.selectedTerm, this.selectedCode)
      .pipe(
        skipWhile((values) => !values[0] || !values[1]),
        map((values) => {
          return { term: values[0], codeLetter: values[1] };
        })
      )
      .subscribe((values) => {
        this.archiveService.getArchive(values.term, values.codeLetter);
      });

    this.archiveService.headers.subscribe((val) => {
      this.headersOutput = val;
    });
  }

  ngOnDestroy() {
    this.resetHeaders();
  }

  resetHeaders() {
    let headers = this.archiveService.headers.value;
    for (let i = 0; i < headers.length; i++) {
      headers[i].visible = true;
    }
    this.archiveService.headers.next(headers);
  }

  headersChange(event: any) {
    let headers = this.archiveService.headers.value;

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      header.visible =
        this.headersOutput.findIndex(
          (x) => x.identifier === header.identifier
        ) >= 0;
    }

    this.archiveService.headers.next(headers);
  }

  headersOutput: {
    identifier: string;
    shown: string;
    visible: boolean;
  }[] = [];

  terms = [
    { value: "2019-2020-summer", name: "2019 - 2020 Yaz Dönemi" },
    { value: "2019-2020-spring", name: "2019 - 2020 Bahar Dönemi" },
    { value: "2019-2020-fall", name: "2019 - 2020 Güz Dönemi" },
    { value: "2018-2019-summer", name: "2018 - 2019 Yaz Dönemi" },
    { value: "2018-2019-spring", name: "2018 - 2019 Bahar Dönemi" },
    { value: "2018-2019-fall", name: "2018 - 2019 Güz Dönemi" },
    { value: "2017-2018-summer", name: "2017 - 2018 Yaz Dönemi" },
    { value: "2017-2018-spring", name: "2017 - 2018 Bahar Dönemi" },
    { value: "2017-2018-fall", name: "2017 - 2018 Güz Dönemi" },
    { value: "2016-2017-summer", name: "2016 - 2017 Yaz Dönemi" },
  ];
  codeLetters = [
    { value: "AKM", name: "AKM" },
    { value: "ATA", name: "ATA" },
    { value: "ALM", name: "ALM" },
    { value: "BEB", name: "BEB" },
    { value: "BED", name: "BED" },
    { value: "BEN", name: "BEN" },
    { value: "BIL", name: "BIL" },
    { value: "BIO", name: "BIO" },
    { value: "BLG", name: "BLG" },
    { value: "BLS", name: "BLS" },
    { value: "BUS", name: "BUS" },
    { value: "CAB", name: "CAB" },
    { value: "CEV", name: "CEV" },
    { value: "CHE", name: "CHE" },
    { value: "CHZ", name: "CHZ" },
    { value: "CIE", name: "CIE" },
    { value: "CMP", name: "CMP" },
    { value: "COM", name: "COM" },
    { value: "DEN", name: "DEN" },
    { value: "DFH", name: "DFH" },
    { value: "DGH", name: "DGH" },
    { value: "DNK", name: "DNK" },
    { value: "DUI", name: "DUI" },
    { value: "EAS", name: "EAS" },
    { value: "ECO", name: "ECO" },
    { value: "ECN", name: "ECN" },
    { value: "EHA", name: "EHA" },
    { value: "EHB", name: "EHB" },
    { value: "EHN", name: "EHN" },
    { value: "EKO", name: "EKO" },
    { value: "ELE", name: "ELE" },
    { value: "ELH", name: "ELH" },
    { value: "ELK", name: "ELK" },
    { value: "ELT", name: "ELT" },
    { value: "END", name: "END" },
    { value: "ENE", name: "ENE" },
    { value: "ENG", name: "ENG" },
    { value: "ENR", name: "ENR" },
    { value: "ESL", name: "ESL" },
    { value: "ESM", name: "ESM" },
    { value: "ETK", name: "ETK" },
    { value: "EUT", name: "EUT" },
    { value: "FIZ", name: "FIZ" },
    { value: "FRA", name: "FRA" },
    { value: "FZK", name: "FZK" },
    { value: "GED", name: "GED" },
    { value: "GEM", name: "GEM" },
    { value: "GEO", name: "GEO" },
    { value: "GID", name: "GID" },
    { value: "GLY", name: "GLY" },
    { value: "GMI", name: "GMI" },
    { value: "GMK", name: "GMK" },
    { value: "GSB", name: "GSB" },
    { value: "GSN", name: "GSN" },
    { value: "GUV", name: "GUV" },
    { value: "GVT", name: "GVT" },
    { value: "HUK", name: "HUK" },
    { value: "HSS", name: "HSS" },
    { value: "ICM", name: "ICM" },
    { value: "ILT", name: "ILT" },
    { value: "IML", name: "IML" },
    { value: "ING", name: "ING" },
    { value: "INS", name: "INS" },
    { value: "ISE", name: "ISE" },
    { value: "ISH", name: "ISH" },
    { value: "ISL", name: "ISL" },
    { value: "ISP", name: "ISP" },
    { value: "ITA", name: "ITA" },
    { value: "ITB", name: "ITB" },
    { value: "JDF", name: "JDF" },
    { value: "JEF", name: "JEF" },
    { value: "JEO", name: "JEO" },
    { value: "JPN", name: "JPN" },
    { value: "KIM", name: "KIM" },
    { value: "KMM", name: "KMM" },
    { value: "KMP", name: "KMP" },
    { value: "KON", name: "KON" },
    { value: "LAT", name: "LAT" },
    { value: "MAD", name: "MAD" },
    { value: "MAK", name: "MAK" },
    { value: "MAL", name: "MAL" },
    { value: "MAT", name: "MAT" },
    { value: "MEK", name: "MEK" },
    { value: "MEN", name: "MEN" },
    { value: "MET", name: "MET" },
    { value: "MCH", name: "MCH" },
    { value: "MIM", name: "MIM" },
    { value: "MKN", name: "MKN" },
    { value: "MST", name: "MST" },
    { value: "MTM", name: "MTM" },
    { value: "MOD", name: "MOD" },
    { value: "MRE", name: "MRE" },
    { value: "MRT", name: "MRT" },
    { value: "MTH", name: "MTH" },
    { value: "MTK", name: "MTK" },
    { value: "MTO", name: "MTO" },
    { value: "MTR", name: "MTR" },
    { value: "MUH", name: "MUH" },
    { value: "MUK", name: "MUK" },
    { value: "MUT", name: "MUT" },
    { value: "MUZ", name: "MUZ" },
    { value: "NAE", name: "NAE" },
    { value: "NTH", name: "NTH" },
    { value: "PAZ", name: "PAZ" },
    { value: "PEM", name: "PEM" },
    { value: "PET", name: "PET" },
    { value: "PHE", name: "PHE" },
    { value: "PHY", name: "PHY" },
    { value: "RES", name: "RES" },
    { value: "RUS", name: "RUS" },
    { value: "SBP", name: "SBP" },
    { value: "SEN", name: "SEN" },
    { value: "SES", name: "SES" },
    { value: "SNT", name: "SNT" },
    { value: "SPA", name: "SPA" },
    { value: "STA", name: "STA" },
    { value: "STI", name: "STI" },
    { value: "TDW", name: "TDW" },
    { value: "TEB", name: "TEB" },
    { value: "TEK", name: "TEK" },
    { value: "TEL", name: "TEL" },
    { value: "TER", name: "TER" },
    { value: "TES", name: "TES" },
    { value: "THO", name: "THO" },
    { value: "TRZ", name: "TRZ" },
    { value: "TUR", name: "TUR" },
    { value: "UCK", name: "UCK" },
    { value: "ULP", name: "ULP" },
    { value: "UZB", name: "UZB" },
    { value: "YTO", name: "YTO" },
  ];
}
