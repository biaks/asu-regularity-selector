import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-regularityselector',
  templateUrl: "./regularityselector.component.html",
//  styleUrls: [ "./scss-dependencies/datapicker-main.scss" ],
})
export class RegularitySelectorComponent {

  weekDaysNamesShort: Array<string> = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  selected_week_days:  boolean[] = [];
  selected_month_days: boolean[] = [];
  even_is_selected: boolean;
  odd_is_selected: boolean;

  month_days_matrix: number[][] = Array<number>(5).fill(0).map( (value1, index1) => {
    return Array<number>(7).fill(0).map( (value2, index2) => {
      return 1 + index1*7 + index2; });
  });

  // на вход приходит массив, который разбирается следующим образом:
  // от 2 до 8 - это выбранные дни недели с ПН до ВС
  // от 10 до 40 - это выбранные дни месяца с 1 по 31
  // например value: number[] = [2, 5, 18, 34]; 
  @Input() set value(value: number[]) {

  this.even_is_selected = false;
  this.odd_is_selected = false;

    if (Array.isArray(value)) {

      value.forEach( value => {
        
        if (1 < value && value < 9)
          this.selected_week_days[value - (1 +1)] = true;
        if (9 < value && value < 41)
          this.selected_month_days[value - (9 +0)] = true;
        
        if (value == 41)
          this.even_is_selected = true;

        if (value == 42)
          this.odd_is_selected = true;

          // чтобы смотреть лог
        //if (1 < value && value < 9)
        //  console.log("found", value, "set", value - (1 +1));
        //if (9 < value && value < 41)
        //  console.log("found", value, "set", value - (9 +1));
        
      })

    }
    else {
      this.selected_week_days = [];
      this.selected_month_days = [];
    }
      
  
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

    if (this.even_is_selected)
      result.push(41);
    if (this.odd_is_selected)
      result.push(42);

    // чтобы смотреть лог
    //this.selected_week_days.forEach( (value, index) => {
    //  console.log("found", index, "set", index + (1 +1));
    //})
    //this.selected_month_days.forEach( (value, index) => {
    //  console.log("found", index, "set", index + (9 +1));
    //})

    return result;
  }

  @Output() onMouseLeave: EventEmitter<number[]> = new EventEmitter<number[]>();

  @HostListener("mouseleave") _onMouseLeave() {
    this.onMouseLeave.emit(this.value);
  }

  isEveryDaySelected(): boolean {
    if (this.even_is_selected)
      return false;
    if (this.odd_is_selected)
      return false;
    if (this.selected_week_days.length > 0)
      return false;
    if (this.selected_month_days.length > 0)
      return false;
    return true;
  }

  setEveryDays() {
    this.even_is_selected = false;
    this.odd_is_selected = false;

    this.selected_week_days = [];
    this.selected_month_days = [];

    this.valueChange.emit(this.value);
  }

  setEvenDays() {
    if (this.even_is_selected) {
      this.even_is_selected = false;
    }
    else {
      this.even_is_selected = true;
      this.odd_is_selected  = false;
    }
    this.valueChange.emit(this.value);
  }

  setOddDays() {
    if (this.odd_is_selected) {
      this.odd_is_selected = false;
    }
    else {
      this.odd_is_selected  = true;
      this.even_is_selected = false;
    }
    this.valueChange.emit(this.value);
  }

/*
  // even - четные
  allEvenDaysIsSelected(): boolean {
    for (let i=2; i<=30; i+=2)
      if (this.selected_month_days[i] != true)
        return false;
    return true;
  }
  allEvenDaysIsUnselected(): boolean {
    for (let i=2; i<=30; i+=2)
      if (this.selected_month_days[i] == true)
        return false;
    return true;
  }
  torgeEvenDays() {
    if (this.allEvenDaysIsSelected())
      this.unselectAllEvenDays();
    else {
      this.unselectAllOddDays();
      this.selectAllEvenDays();
    }
  }
  selectAllEvenDays() {
    for (let i=2; i<=30; i+=2)
      this.selected_month_days[i] = true;
    this.valueChange.emit(this.value);
  }
  unselectAllEvenDays() {
    for (let i=2; i<=30; i+=2)
      delete this.selected_month_days[i];
    this.valueChange.emit(this.value);
  }

  // odd - нечетные
  allOddDaysIsSelected(): boolean {
    for (let i=1; i<=31; i+=2)
      if (this.selected_month_days[i] != true)
        return false;
    return true;
  }
  allOddDaysIsUnselected(): boolean {
    for (let i=1; i<=31; i+=2)
      if (this.selected_month_days[i] == true)
        return false;
    return true;
  }
  torgeOddDays() {
    if (this.allOddDaysIsSelected())
      this.unselectAllOddDays();
    else {
      this.unselectAllEvenDays();
      this.selectAllOddDays();
    }
  }
  selectAllOddDays() {
    for (let i=1; i<=31; i+=2)
      this.selected_month_days[i] = true;
    this.valueChange.emit(this.value);
  }
  unselectAllOddDays() {
    for (let i=1; i<=31; i+=2)
      delete this.selected_month_days[i];
    this.valueChange.emit(this.value);
  }

  unselectAllMonthDays() {
    this.unselectAllEvenDays();
    this.unselectAllOddDays();
  }
  allMonthDaysIsUnselected(): boolean {
    return this.allEvenDaysIsUnselected() && this.allOddDaysIsUnselected();
  }
*/

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
