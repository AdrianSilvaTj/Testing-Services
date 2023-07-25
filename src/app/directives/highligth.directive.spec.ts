import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HighligthDirective } from './highligth.directive';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

/* Para testear una directiva debemoc colocar un host component a fin de probar su funcionamiento en un component
(1) para utilizar el ngModel importamos el FormModule */

@Component({
  template: `
    <h5 class="title" highligth>Hay un Valor</h5>
    <h5 highligth="yellow">Amarillo</h5>
    <p highligth="blue">Amarillo</p>
    <p>otro parrafo</p>
    <input [(ngModel)]="color" [highligth]="color">
  `,
})
class HostComponent {
  color='pink';
}

describe('HighligthDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, HighligthDirective],
      imports: [FormsModule]// (1)
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  /*
  (1) Cualquier elemento que contenga la etiqueta highligth ó
  (2) Cualquier elemento que no contenga la etiqueta highligth ó
  (3) Cualquier elemento que tenga la directiva highligth
  */

  it('should have 3 highligth elements', () => {
    // Arrange
    // const elements = fixture.debugElement.queryAll(By.css('*[highligth]'));// (1)
    const elementsWithout = fixture.debugElement.queryAll(By.css('*:not([highligth])'));// (2)
    const elements = fixture.debugElement.queryAll(By.directive(HighligthDirective));// (3)
    // Assert
    expect(elements.length).toEqual(4);
    expect(elementsWithout.length).toEqual(2);

  });

  it('should the elements have the right bgColor', () => {
    // Arrange
    const elements = fixture.debugElement.queryAll(By.directive(HighligthDirective));// (3)
    // Assert
    expect(elements[0].nativeElement.style.backgroundColor).toEqual('gray');
    expect(elements[1].nativeElement.style.backgroundColor).toEqual('yellow');
    expect(elements[2].nativeElement.style.backgroundColor).toEqual('blue');

  });
  /*
  (1) Obtenemos la instancia de la directiva
  */
  it('should the h5.title be defaultColor', () => {
    // Arrange
    const titleDe = fixture.debugElement.query(By.css('.title'));
    const dir = titleDe.injector.get(HighligthDirective);// (1)
    // Assert
    expect(titleDe.nativeElement.style.backgroundColor).toEqual(dir.defaultColor);

  });

  /*
  (1) Obtenemos el elemento input
  (2) Antes de cualquier cambio el valor será pink porque es el valor de la propiedad "color" de HostComponent
  (3) Cambiamos el valor del input
  (4) Emula que el usuario escribió
  (5) Comprobamos que el background del input haya cambiado a 'red
  (6) Comprobamos que la propiedad color haya cambiado a 'red
  */
  it('should bind <input> and change the bgColor', () => {
    const inputDe = fixture.debugElement.query(By.css('input'));
    const inputEl: HTMLInputElement = inputDe.nativeElement;// (1)

    expect(inputEl.style.backgroundColor).toEqual('pink');// (2)

    inputEl.value = 'red';// (3)
    inputEl.dispatchEvent(new Event('input'));// (4)
    fixture.detectChanges();

    expect(inputEl.style.backgroundColor).toEqual('red');// (5)
    expect(component.color).toEqual('red');// (6)
  });
});
