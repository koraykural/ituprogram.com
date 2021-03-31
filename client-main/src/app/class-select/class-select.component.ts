import { Component, OnInit } from '@angular/core';
import { PlanService } from '../services/plan.service';
import { FilterService } from '../services/filter.service';
import { Class, Group, Groups } from '../interfaces';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-class-select',
  templateUrl: './class-select.component.html',
  styleUrls: ['./class-select.component.css']
})
export class ClassSelectComponent implements OnInit {
  // Hide not opened classes variable
  isNotOpenedHidden = true;

  // Submit button disabled variable
  isAvailableToContinue = false;

  constructor(
    public planService: PlanService,
    public modalService: FilterService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.checkIsAvailableToContinue();
  }

  checkIsAvailableToContinue() {
    this.isAvailableToContinue = false;
    for (let i = 0; i < this.planService.planData.value.length; i++) {
      const items = this.planService.planData.value[i].items;
      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        if(item.selected) {
          this.isAvailableToContinue = true;
          break;
        }
      }
      if(this.isAvailableToContinue)
        break;
    }
  }

  allTermChecked(term: Group) {
    let isAllSelected = true;
    term.items.forEach(thisClass => {
      if(isAllSelected) {
        if(thisClass.isOpened) {
          if(thisClass.selected == false) {
            isAllSelected = false;
          }
        }
      }
    });
    term.allSelected = isAllSelected;
  }

  rowClick(group: Group, item: Class) {
    item.selected = !item.selected;
    this.allTermChecked(group);
    this.checkIsAvailableToContinue();
  }

  allSelectclick(group: Group) {
    const newBool = !group.allSelected;
    group.allSelected = newBool;
    
    group.items.forEach(item => {
      if(item.isOpened)
        item.selected = newBool;
    });
    this.checkIsAvailableToContinue();
  }

  isClassesNotOpenedRow(group: Group) {
    let numberOfOpenedClasses = 0;
    group.items.forEach(item => {
      if(item.isOpened)
        numberOfOpenedClasses++;
    });
    if(!numberOfOpenedClasses && this.isNotOpenedHidden)
      return true;
    return false;
  }

  isGroupBig(group: Group) {
    let numberOfClasses = 0;
    let numberOfOpenedClasses = 0;

    group.items.forEach(item => {
      numberOfClasses++;
      if(item.isOpened)
        numberOfOpenedClasses++;
    });

    if(numberOfClasses < 7)
      return false;
    if(numberOfOpenedClasses > 6)
      return true;
    if(!this.isNotOpenedHidden)
      return true;
  }

  toggleHide() {
    this.isNotOpenedHidden = !this.isNotOpenedHidden;
  }
  toggleGroupSize(group: Group) {
    group.isCollapsed = !group.isCollapsed;
  }
  doNothing() {}
  isAvailableToShow(group: Group, item: Class) {
    const isGroupBig = this.isGroupBig(group) && !group.isCollapsed;
    let index = 0;

    // Find index of class in its group
    for (let i = 0; i < group.items.length; i++) {
      const thisItem = group.items[i];
      if(thisItem.isOpened || !this.isNotOpenedHidden) {
        index++;
      }
      if(item.code === thisItem.code)
        break;
    }

    const isOpened = item.isOpened;

    if(isGroupBig && index > 3)
      return false
    if(this.isNotOpenedHidden)
      return isOpened;
    else
      return true;
  }

  onSubmit() {
    localStorage.setItem('planData', JSON.stringify(this.planService.planData.value));

    const isFirstTime = localStorage.getItem('firstCreateProgram');
    if(!isFirstTime) {
      this.modalService.createProgramModal.emit(true);
      localStorage.setItem('firstCreateProgram', 'true');
    }
  }

  codeLetters = [
    "AKM","ATA","ALM","BEB","BED","BEN","BIL","BIO","BLG","BLS",
    "BUS","CAB","CEV","CHE","CHZ","CIE","CMP","COM","DEN","DFH",
    "DGH","DNK","DUI","EAS","ECO","ECN","EHA","EHB","EHN","EKO",
    "ELE","ELH","ELK","ELT","END","ENE","ENG","ENR","ESL","ESM",
    "ETK","EUT","FIZ","FRA","FZK","GED","GEM","GEO","GID","GLY",
    "GMI","GMK","GSB","GSN","GUV","GVT","HUK","HSS","ICM","ILT",
    "IML","ING","INS","ISE","ISH","ISL","ISP","ITA","ITB","JDF",
    "JEF","JEO","JPN","KIM","KMM","KMP","KON","LAT","MAD","MAK",
    "MAL","MAT","MEK","MEN","MET","MCH","MIM","MKN","MST","MTM",
    "MOD","MRE","MRT","MTH","MTK","MTO","MTR","MUH","MUK","MUT",
    "MUZ","NAE","NTH","PAZ","PEM","PET","PHE","PHY","RES","RUS",
    "SBP","SEN","SES","SNT","SPA","STA","STI","TDW","TEB","TEK",
    "TEL","TER","TES","THO","TRZ","TUR","UCK","ULP","UZB","YTO"
  ];
  selectedLetter = '';
  selectedCode = '';
  courses = [];

  codeLetterSelect(letter: string) {
    this.selectedLetter = letter;
    this.courses = [];
    this.courses[0] = "Lütfen Bekleyin.";
    this.apiService.getCodes(letter).subscribe(
      data => {
        this.courses = data.sort();
        this.selectedCode = this.courses[0];
      },
      err => {
        this.courses[0] = "Dersler Bulunamadı.";
      }
    );
  }


  async addExtra() {
    const code = this.selectedLetter + ' ' + this.selectedCode.substring(0, this.selectedCode.indexOf(' '));
    const classInfo = (await this.apiService.getClassesBasic([code]).toPromise())[0];
    const itemToAdd = {code, name: classInfo.name, isOpened: true, selected: true, credits: classInfo.credits};

    const index = this.planService.planData.value.findIndex(x => x.label === "Eklenen Dersler");
    if (index < 0) {
      this.planService.planData.value.push({
        label: "Eklenen Dersler",
        allSelected: true,
        isCollapsed: false,
        items: [itemToAdd]
      });
    }
    else {
      this.planService.planData.value[index].items.push(itemToAdd);
    }

    this.isAvailableToContinue = true;
  }
}
