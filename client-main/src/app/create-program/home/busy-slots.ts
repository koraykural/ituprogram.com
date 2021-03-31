import { isSyntaxError } from '@angular/compiler';

interface Class {
  code: string;
  name: string;
  days: Array<string>;
  hours: Array<string>;
  buildings: Array<string>;
  selected: boolean;
  crn: number;
}

interface BusySlot {
  days: string;
  hours: Array<number>;
}

interface SelectedClass {
  code: String,
  crn: Number
}

export class BusySlots
{
  private slots: Array<BusySlot>;
  public selectedClasses = [];

  constructor() {
    this.slots = [
      { days: "Pazartesi", hours: [] },
      { days: "Salı", hours: [] },
      { days: "Çarşamba", hours: [] },
      { days: "Perşembe", hours: [] },
      { days: "Cuma", hours: [] }
    ];
  }

  private getBusySlotDayIndex(days: string) {
    if (days === "Pazartesi") return 0;
    if (days === "Salı") return 1;
    if (days === "Çarşamba") return 2;
    if (days === "Perşembe") return 3;
    if (days === "Cuma") return 4;
  }

  public getHoursArray(hoursString: string) {
    const startingHour = parseInt(hoursString.slice(0, 2));
    const endingHour = parseInt(hoursString.slice(5, 7));
    let hoursArray = [];
    for (let i = startingHour; i < endingHour; i++) {
      hoursArray.push(i);
    }
    return hoursArray;
  }

  public checkBusySlots(thisClass: Class): { bool: boolean; slots: Array<{ days: string, hours: number }> } {
    let returnValue = { bool: true, slots: [] };

    // Check for each days
    for (let i = 0; i < thisClass.days.length; i++) {
      const days = thisClass.days[i];
      const BusySlotsDay = this.slots[this.getBusySlotDayIndex(days)];
      const hoursArray = this.getHoursArray(thisClass.hours[i]);

      // Check for each hours of that days
      hoursArray.forEach(hours => {
        if (BusySlotsDay.hours.includes(hours)) {
          returnValue.bool = false;
          returnValue.slots.push({ days: days, hours: hours });
        }
      });
    }
    return returnValue;
  }

  public addToBusySlots(thisClass: Class) {
    this.selectedClasses.push({crn: thisClass.crn, code: thisClass.code});

    // For each days
    for (let i = 0; i < thisClass.days.length; i++) {
      const days = thisClass.days[i];
      const hoursArray = this.getHoursArray(thisClass.hours[i]);
      // For every hours of that days
      hoursArray.forEach(hours => {
        // Add hours to busy slots of that days
        this.slots[this.getBusySlotDayIndex(days)].hours.push(hours);
      });
    }
  }

  public emptyBusySlots() {
    this.selectedClasses = [];
    this.slots.forEach(busySlot => {
      busySlot.hours = [];
    });
  }
  
  public removeFromBusySlots(thisClass: Class) {
    const index = this.selectedClasses.findIndex(x => x.crn == thisClass.crn);
    this.selectedClasses.splice(index, 1);

    // For each days
    for (let i = 0; i < thisClass.days.length; i++) {
      const days = thisClass.days[i];
      const hoursArray = this.getHoursArray(thisClass.hours[i]);
      // For every hours of that days
      hoursArray.forEach(hours => {
        // Removece hours from busyslot.days
        var index = this.slots[this.getBusySlotDayIndex(days)].hours.indexOf(hours);
        if (index !== -1)
          this.slots[this.getBusySlotDayIndex(days)].hours.splice(index, 1);
      });
    }
  }

  public decideYellowSlots(classes: Array<Class>): Array<{days: string, hours: number}> {
    // Find multiples
    let instances = [];
    this.selectedClasses.forEach(el => {
      const index = instances.findIndex(x => x.code === el.code);
      if(index == -1)
        instances.push({code: el.code, amount: 1, crns: [el.crn]})
      else {
        instances[index].amount++;
        instances[index].crns.push(el.crn);
      }
    })

    let crnMultiples = [];

    // Get the crns of multiples
    instances.forEach(instance => {
      if(instance.amount > 1) {
        instance.crns.forEach(crn => {
          crnMultiples.push(crn);
        });
      }
    });

    let returnValue = [];

    // Find Class object of multiples
    for (let i = 0; i < classes.length; i++) {
      const thisClass = classes[i];
      if(crnMultiples.includes(thisClass.crn)) {
        // Get their hours and days
        // For each day
        for (let j = 0; j < thisClass.days.length; j++) {
          const hoursString = thisClass.hours[j];
          const day = thisClass.days[j];
          const hoursArray = this.getHoursArray(hoursString);
          // For each hour of that day
          hoursArray.forEach(hour => {
            returnValue.push({days: day, hours: hour})
          });
        }
      }
    }

    return returnValue;
  }
}