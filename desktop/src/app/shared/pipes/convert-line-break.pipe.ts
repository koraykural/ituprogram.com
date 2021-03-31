import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "convertLineBreak",
})
export class ConvertLineBreakPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (!Array.isArray(value)) {
      return value;
    }

    let stringToReturn = "";
    value.forEach((element) => {
      stringToReturn += element;
      stringToReturn += "<br/>";
    });
    stringToReturn = stringToReturn.substr(0, stringToReturn.length - 5);
    return stringToReturn;
  }
}
