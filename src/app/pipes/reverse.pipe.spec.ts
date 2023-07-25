import { Component } from '@angular/core';
import { ReversePipe } from './reverse.pipe';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('ReversePipe', () => {
  it('create an instance', () => {
    const pipe = new ReversePipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform roma to amor', () => {
    // Arrange
    const pipe = new ReversePipe();
    // Act
    const rta = pipe.transform("roma")
    // Assert
    expect(rta).toEqual("amor");

  });

  it('should transform "123" to "321"', () => {
    // Arrange
    const pipe = new ReversePipe();
    // Act
    const rta = pipe.transform("123")
    // Assert
    expect(rta).toEqual("321");

  });
});

@Component({
  template: `
    <h5>{{'casa' | reverse}}</h5>
    <input [(ngModel)]="text">
    <p>{{text | reverse}}</p>
  `
})
class HostComponent {
  text='';
}

describe('ReversePipe from HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, ReversePipe],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the h5 be "asac"', () => {
    const h5De = fixture.debugElement.query(By.css('h5'));
    expect(h5De.nativeElement.textContent).toEqual('asac');
  });

  /*
  (1) Obtenemos el elemento input
  (2) Antes de cualquier cambio el valor contenido en p sería '' por el atributo 'text' de hostComponent
  (3) Cambiamos el valor del input
  (4) Emula que el usuario escribió
  (5) Comprobamos el contenido de la etiqueta p sea 'sol'
  */

  it('should apply reverse pipe when typing in the input', () => {
    fixture.detectChanges();
    const inputDe = fixture.debugElement.query(By.css('input'));
    const inputEl: HTMLInputElement = inputDe.nativeElement;// (1)
    const pDe = fixture.debugElement.query(By.css('p'));

    expect(pDe.nativeElement.textContent).toEqual('');// (2)

    inputEl.value = 'los';// (3)
    inputEl.dispatchEvent(new Event('input'));// (4)
    fixture.detectChanges();

    expect(pDe.nativeElement.textContent).toEqual('sol');// (5)
  });

});
