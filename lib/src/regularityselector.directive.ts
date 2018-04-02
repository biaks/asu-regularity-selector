
import { Directive, forwardRef, ElementRef, ViewContainerRef, ComponentFactoryResolver,ComponentRef, HostListener, ComponentFactory } from "@angular/core";
import { Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { RegularitySelectorComponent } from "./regularityselector.component";

// https://alligator.io/angular/custom-form-control/ - Using ControlValueAccessor to Create Custom Form Controls in Angular
// https://habrahabr.ru/company/tinkoff/blog/323270/ - Формы и кастомные поля ввода в Angular 2+

// http://almerosteyn.com/2016/04/linkup-custom-control-to-ngcontrol-ngmodel - Angular 2: Connect your custom control to ngModel with Control Value Accessor.
// http://qaru.site/questions/89205/angular-2-custom-form-input - Angular 2 пользовательских ввода формы

@Directive({
  selector: "[ngx-regularityselector]",
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RegularitySelectorDirective),
    multi: true
    }
  ]
})
export class RegularitySelectorDirective implements ControlValueAccessor {

  // пример использования параметра с двухсторонним связыванием:

  // https://angular.io/guide/template-syntax
  //
  // варианты указания связывания:
  //   size  ="myConst" - можно использовать только если:
  //                      - size может принять текстовое значение
  //                      - myConst - это константная строка
  //                      - это инициализированное значение никгда не будет меняться
  //  [size] ="myProperty"  ->   bind-size="myProperty"  --> это всегда свойство компонента (property)
  //  (size) ="myExtention" ->     on-size="myExtention" --> есть дефолтный параметр $event, можно его чему-то присвоить или передать в функцию
  // [(size)]="myProperty"  -> bindon-size="myProperty"
  //
  // [(size)]="myProperty"
  //   @Input ('size')       set setValue(value: number) { this.value = value; }
  //   @Output('sizeChange') emitter: EventEmitter<number> = new EventEmitter<number>();
  //
  // или без переименовывания в Input/Output:
  // [(size)]="myProperty"
  //   @Output() sizeChange: EventEmitter<number> = new EventEmitter<number>();
  //   @Input()  set size(value: number) { this.value = value; }
  //
  // или без переименовывания в Input/Output и без сеттера:
  // [(size)]="myProperty"
  //   @Output() sizeChange: EventEmitter<number> = new EventEmitter<number>();
  //   @Input()  size:       number;
  //
  // варианты последующего использование
  // <our-component [(size)]="sizeValue"></our-component>
  // <our-component [size]="sizeValue" (sizeChange)="sizeValue=$event"></our-component>

  weekDaysNamesShort: Array<string> = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

  _value: number[];
  //_name: string;

  //@Input() set name(value: string) {
  //  this._name = value;
  //}

  @Input() set value(value: number[]) {
//    console.log ("regularityselector::set value("+value.toLocaleString()+")");    
    if (this._value != value) {
      this._value = value;                                          // запишем во внутреннюю переменную
      if (Array.isArray(value)) {
        this.elem.nativeElement.value = "          "; // отрисуем значение в представлении
        let isStart = true;
        this._value.forEach( value => {
          if (isStart) isStart=false;
          else         this.elem.nativeElement.value += ', ';
          if (1 < value && value < 9)
            this.elem.nativeElement.value += this.weekDaysNamesShort[value - (1 +1)];
          if (9 < value && value < 41)
            this.elem.nativeElement.value += (value-(9 +0));
          }
        );
      }
      else
        this.elem.nativeElement.value = "";
      this.onChangeCallback(this._value);                               // вызовим событие изменения для reactiveForms
      this.valueChange.emit(this._value);                           // вызовим событие изменения для двухстороннего связывания [(value)]
      //this.input.emit(this._value);                               // вызовим событие изменения как стандартный input (input)
    }
  }
  @Output() valueChange: EventEmitter<number[]> = new EventEmitter<number[]>();
  
  // тут интересная херня - если невозможно прочитать value (нету get value), тогда reactiveForms пытаются ловить стандартное событие input
  // при этом, это должен быть nativeInputEvent, в котором должно быть поле event.value
  // вот так не будет работать:
  //@Output() input:       EventEmitter<Date> = new EventEmitter<Date>();
  // поэтому для reactiveForms вставим getter, возвращающий значение:
  get value () {
  //  console.log ("regularityselector::get value => "+this._value.toLocaleString());
    return this._value
  };

  // Для директивы сюда придет ссылка на элемент input, в котором будет указана данная директива
  constructor (
    private elem: ElementRef,             // получим указатель на нативный элемент, в котором упомянута директива
    private vcRef: ViewContainerRef,      // с помощью этого соберем компонент календаря из шаблона
    private cfr: ComponentFactoryResolver // с помощью этого найдем фабрику для компонента клендаря
                                          // (компонент календаря должен быть указан в module:entryComponents)
  ) {
    elem.nativeElement.readOnly = true;
  }

  // ниже отображение календаря (компонент DatepickerComponent)

  @HostListener("click") onMouseClick() {
  //  console.log ("regularityselector::onMouseClick()");
    if (this.calendarRef == null)
      this.showCalendar();
  }

  private calendarRef: ComponentRef<RegularitySelectorComponent> = null;

  showCalendar() {
    
    // https://habrahabr.ru/company/infowatch/blog/330030 - Динамический Angular или манипулируй правильно
    // https://angular.io/guide/dynamic-component-loader - Dynamic Component Loader
    // https://www.concretepage.com/angular-2/angular-2-4-dynamic-component-loader-example - Angular 2/4 Dynamic Component Loader Example

    // найдем фабрику для указанного компонента
    // такие фабрики автоматически сздаются angular при помещении названия компонента в
    // module:entryComponents:
    let cf: ComponentFactory<RegularitySelectorComponent> = this.cfr.resolveComponentFactory(RegularitySelectorComponent);
    // создадим компонент (автоматом вставляется в DOM после текущего компонента)
    this.calendarRef = this.vcRef.createComponent(cf);
    // переместим компонент в body (чтобы не него не влияли текущие css стили)
    //document.querySelector("body").appendChild(this.calendarRef.location.nativeElement);
    // инициализируем дату в календаре
    this.calendarRef.instance.value = this._value;

    // посчитаем координаты для отображения календаря
    //let top: number , left: number;

    //let b: ClientRect = document.body.getBoundingClientRect();
    //let e: ClientRect = this.elem.nativeElement.getBoundingClientRect();

    //top  = +19 + e.top  - b.top  + this.elem.nativeElement.offsetHeight;
    //left = -39 + e.left - b.left; // + this.elem.nativeElement.offsetWidth;

    //this.calendarRef.instance.position = {top, left};

    // подпишемся на событие завершения выбора даты
    this.calendarRef.instance.valueChange.subscribe(
      ( event: number[] ) => {
    //    console.log ("regularityselector::valueChange => "+event.toLocaleString());
        this.value = event;
      }
    )

    this.calendarRef.instance.onMouseLeave.subscribe(
      ( event: number[] ) => {
    //    console.log ("regularityselector::onMouseLeave => "+event.toLocaleString());
        this.value = event;
        this.calendarRef.destroy();
        this.calendarRef = null;
      }
    )

  }

  // ниже реализация интерфейса ControlValueAccessor

  writeValue(date: number[]): void {
  //  console.log ("regularityselector::writeValue("+date.toLocaleString()+")");
    this.value = date;
  }

  // Function to call when the rating changes.
  onChangeCallback = (value: number[]) => {};

  // Allows Angular to register a function to call when the model (rating) changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (value: number[]) => void): void {
    this.onChangeCallback = fn;
  }

  // Function to call when the input is touched (when a star is clicked).
  onTouchedCallback = () => {};

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

}
