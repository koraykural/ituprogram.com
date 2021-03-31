import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { BusySlots } from "src/app/create-program/home/busy-slots";
import { PlanService } from "./plan.service";
import { FilterService } from "./filter.service";
import { Class } from "../interfaces";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class ClassDataService {
  busySlots = new BusySlots();
  classes: BehaviorSubject<Array<Class>> = new BehaviorSubject<Array<Class>>(
    []
  );
  selectedClasses: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    []
  );
  isClassesLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  yellowSlots: BehaviorSubject<
    Array<{ days: string; hours: number }>
  > = new BehaviorSubject<Array<{ days: string; hours: number }>>([]);
  redSlots: BehaviorSubject<
    Array<{ days: string; hours: number }>
  > = new BehaviorSubject<Array<{ days: string; hours: number }>>([]);
  numOfClasses: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  numOfUnfiltered: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private modalService: FilterService) {
    try {
      const localClasses = JSON.parse(localStorage.getItem("classes"));
      if (localClasses) {
        localClasses.forEach((x: Class) => {
          if (x.selected) this.selectedClasses.value.push(x.crn.toString());
        });
        this.classes.next(localClasses);
        this.loadClasses(localClasses);
      }
    } catch (err) {}
  }

  loadClasses(newClasses: Class[]) {
    // Track number of classes
    let numClasses = 0;

    // Set selected classes from the saved selectedClasses array
    newClasses.forEach((x) => {
      numClasses++;
      if (this.selectedClasses.value.includes(x.crn.toString()))
        x.selected = true;
    });

    // Publish new values
    this.numOfClasses.next(numClasses);
    this.classes.next(newClasses);

    // Create filters
    this.modalService.createFilter(this.classes.value);
    this.numOfUnfiltered.next(this.modalService.numOfUnfiltered);

    // Empty the slots
    this.busySlots.emptyBusySlots();
    this.yellowSlots.next([]);
    this.redSlots.next([]);

    this.classes.value.forEach((thisClass) => {
      // Create slots
      if (thisClass.selected) {
        this.busySlots.addToBusySlots(thisClass);
        this.yellowSlots.next(
          this.busySlots.decideYellowSlots(this.classes.value)
        );
      }
    });

    this.isClassesLoaded.next(true);
  }

  rowClick(classCRN: number) {
    const classes = this.classes.value;
    // Find the class object from classes array
    for (let i = 0; i < classes.length; i++) {
      const thisClass = classes[i];

      if (thisClass.crn == classCRN) {
        // Is it already clicked or not
        let currentState = thisClass.selected;

        // Uncheck selected
        if (currentState) {
          classes[i].selected = !currentState;
          this.busySlots.removeFromBusySlots(thisClass);
          this.yellowSlots.next(this.busySlots.decideYellowSlots(classes));
          const index = this.selectedClasses.value.findIndex(
            (x) => x === classCRN.toString()
          );
          this.selectedClasses.value.splice(index, 1);
        } else {
          // Check busy slots
          const busySlotsCheck = this.busySlots.checkBusySlots(thisClass);

          // It is okay to add
          if (busySlotsCheck.bool) {
            classes[i].selected = !currentState;
            this.busySlots.addToBusySlots(thisClass);
            this.yellowSlots.next(this.busySlots.decideYellowSlots(classes));
            this.selectedClasses.value.push(classCRN.toString());
          } else {
            // Tell week table and pool to show error
            this.redSlots.next(busySlotsCheck.slots);
            setTimeout(() => {
              this.redSlots.next([]);
            }, 1000);

            // Paint conflicting row to red
            const poolRow: any = document.getElementById(
              thisClass.crn.toString()
            );
            poolRow.classList.add("table-danger");
            setTimeout(() => {
              poolRow.classList.remove("table-danger");
            }, 1000);
          }
        }
      }
    }
    this.classes.next(classes);
  }

  getRedSlots() {
    return this.redSlots.value;
  }
  getYellowSlots() {
    return this.yellowSlots.value;
  }
  setNumUnfiltered() {
    this.numOfUnfiltered.next(
      this.modalService.getNumUnfiltered(this.classes.value)
    );
  }

  reset() {
    this.classes.next([]);
    this.yellowSlots.next([]);
    this.redSlots.next([]);
    this.selectedClasses.next([]);
  }
}
