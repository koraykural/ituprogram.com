import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "convertComma",
})
export class ConvertCommaPipe implements PipeTransform {
  transform(value: Array<string>, ...args: unknown[]): unknown {
    if (!Array.isArray(value)) {
      return value;
    }

    let stringToReturn = "";
    value.forEach((element) => {
      stringToReturn += element;
      stringToReturn += " ";
    });
    stringToReturn.trimRight();
    return stringToReturn;
  }
}
