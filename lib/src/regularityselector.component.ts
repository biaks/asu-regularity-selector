import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-regularityselector',
  templateUrl: "./regularityselector.component.html",
//  styleUrls: [ "./scss-dependencies/datapicker-main.scss" ],
})
export class RegularitySelectorComponent {

  weekDaysNamesShort: Array<string> = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  selected_week_days:  boolean[] = [];
  selected_month_days: boolean[] = [];

  month_days_matrix: number[][] = Array<number>(5).fill(0).map( (value1, index1) => {
    return Array<number>(7).fill(0).map( (value2, index2) => {
      return 1 + index1*7 + index2; });
  });

  // на вход приходит массив, который разбирается следующим образом:
  // от 2 до 8 - это выбранные дни недели с ПН до ВС
  // от 10 до 40 - это выбранные дни месяца с 1 по 31
  // например value: number[] = [2, 5, 18, 34]; 
  @Input() set value(value: number[]) {
    
    value.forEach( value => {
      
      if (1 < value && value < 9)
        this.selected_week_days[value - (1 +1)] = true;
      if (9 < value && value < 41)
        this.selected_month_days[value - (9 +0)] = true;
      
      // чтобы смотреть лог
      //if (1 < value && value < 9)
      //  console.log("found", value, "set", value - (1 +1));
      //if (9 < value && value < 41)
      //  console.log("found", value, "set", value - (9 +1));
      
    })
  }
  @Output() valueChange: EventEmitter<number[]> = new EventEmitter<number[]>();

  get value(): number[] {

    let result: number[] = Array<number>();
  
    this.selected_week_days.forEach( (value, index) => {
      result.push(index + (1 +1));
    })
    this.selected_month_days.forEach( (value, index) => {
      result.push(index + (9 +0));
    })

    // чтобы смотреть лог
    //this.selected_week_days.forEach( (value, index) => {
    //  console.log("found", index, "set", index + (1 +1));
    //})
    //this.selected_month_days.forEach( (value, index) => {
    //  console.log("found", index, "set", index + (9 +1));
    //})

    return result;
  }

  isSelectedWeekDay(day: number): boolean {
    return (this.selected_week_days[day] == true);
  }

  isSelectedMonthDay(day: number): boolean {
    return (this.selected_month_days[day] == true);
  }

  isValidMonthDay(day: number): boolean {
    return (day <= 31);
  }

  changeSelectedWeekDay(day: number) {
    if (this.selected_week_days[day])
      delete this.selected_week_days[day];
    else
      this.selected_week_days[day] = true;
    //console.log(this.selected_week_days);
    this.valueChange.emit(this.value);
  }

  changeSelectedMonthDay(day: number) {
    if (this.selected_month_days[day])
      delete this.selected_month_days[day];
    else
      this.selected_month_days[day] = true;
    //console.log(this.selected_month_days);
    this.valueChange.emit(this.value);
  }
  
}
