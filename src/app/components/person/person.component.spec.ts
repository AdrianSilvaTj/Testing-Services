import { Person } from './../../models/person.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PersonComponent } from './person.component';
import { Component, DebugElement } from '@angular/core';

describe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonComponent],
    });
    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    component.person = new Person('Ninguno', 'Nada', 37, 85, 1.72);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* Test para verificar que la etiqueta <p> este renderizando el texto "Soy un parrafo"
  (1) obtenemos el elemento HTML.
  (2) de este elemento buscamos la etiqueta 'p'
  (3) verificamos que el contenido de esa etiqueta sea "Soy un parrafo"  */
  it('should have <p> with "Soy un parrafo"', () => {
    const personElement: HTMLElement = fixture.nativeElement; // (1)
    const p = personElement.querySelector('p'); // (2)
    //expect(p?.textContent).toEqual('Soy un parrafo'); // (3)
  });
  /* Usando Debug Element, para probar renderizado en otras plataformas que no sean navegadores
  (4) Obtenemos el elemento con debugElement  */
  it('should have <p> with "Soy un parrafo" (Debug Element)', () => {
    const personDebug: DebugElement = fixture.debugElement; // (4)
    const personElement: HTMLElement = personDebug.nativeElement; // (1)
    const p = personElement.querySelector('p'); // (2)
    //expect(p?.textContent).toEqual('Soy un parrafo'); // (3)
  });
  /* Haciendo aún más agnostico nuestro codigo
  (5) para indicar que será con css  */
  it('should have <p> with "Soy un parrafo" (Debug Element, By)', () => {
    const personDebug: DebugElement = fixture.debugElement; // (4)
    const pDebug: DebugElement = personDebug.query(By.css('p')); // (5)
    const pElement: HTMLElement = pDebug.nativeElement; // (1)
    //expect(pElement?.textContent).toEqual('Soy un parrafo'); // (3)
  });

  /* @INPUT PERSON TEST ################################################# */
  describe('@Input Test', () => {
    /* Test para @Input,
    (1) Se crea un objeto, que sera el sujeto de pruebas
    (2) Se detectan los cambios, en ejecución esto se hace de manera explicita, en test, no. Esto sobretodo para rendering */
    it('should have <h3> with "Hola, {component.person.name}"', () => {
      // Arrange
      component.person = new Person('Adrian', 'Silva', 37, 85, 1.72); // (1)
      const expectMsg = `Hola, ${component.person.name}`;
      const personDebug: DebugElement = fixture.debugElement;
      const h3Debug: DebugElement = personDebug.query(By.css('h3'));
      const h3Element: HTMLElement = h3Debug.nativeElement;
      // Act
      fixture.detectChanges(); // (2)
      // Assert
      expect(h3Element?.textContent).toEqual(expectMsg);
    });

    it('should have <p> with "Mi altura es, {component.person.heigth}"', () => {
      // Arrange
      component.person = new Person('Adrian', 'Silva', 37, 85, 1.72); // (1)
      const personDebug: DebugElement = fixture.debugElement;
      const pDebug: DebugElement = personDebug.query(By.css('p'));
      const pElement: HTMLElement = pDebug.nativeElement;
      // Act
      fixture.detectChanges(); // (2)
      // Assert
      expect(pElement?.textContent).toContain(component.person.heigth);
    });

    it('should have name "Adrian"', () => {
      // Arrange
      component.person = new Person('Adrian', 'Silva', 37, 85, 1.72);
      // Assert
      expect(component.person.name).toEqual('Adrian');
    });
  });

  /* BTN-IMC TEST ################################################# */
  describe('btn-imc Test click()', () => {
    it('should display IMC text´s in button, when call function', () => {
      // Arrange
      const expectMsg = 'overweight 3';
      component.person = new Person('Lila', 'Rojas', 70, 120, 1.65);
      const button = fixture.debugElement.query(
        By.css('button.btn-imc')
        ).nativeElement;
        // Act
        component.calcIMC();
        fixture.detectChanges();
        // Assert
        expect(button.textContent).toContain(expectMsg);
      });

    /* (1) Emulamos hacer click en el boton */
    it('should display IMC text´s in button, when click it', () => {
      // Arrange
      const expectMsg = 'overweight 3';
      component.person = new Person('Lila', 'Rojas', 70, 120, 1.65);
      const buttonDeb = fixture.debugElement.query(By.css('button.btn-imc'));
      const buttonEle = buttonDeb.nativeElement;
      // Act
      buttonDeb.triggerEventHandler('click', null); // (1)
      fixture.detectChanges();
      // Assert
      expect(buttonEle.textContent).toContain(expectMsg);
    });
  });

  /* BTN-CHOOSE (@Output) TEST ################################################# */

  describe('btn-choose Test click() @Output', () => {
    /* (1) El @Output se comporta como un Observable por lo que se puede testear como tal */
    it('should raise selected event when click "Choose" button (@Output)', () => {
      // Arrange
      const expectPerson = new Person('Lila', 'Rojas', 70, 120, 1.65);
      component.person = expectPerson;
      const buttonDeb = fixture.debugElement.query(By.css('button.btn-choose'));
      let selectedPerson: Person | undefined;
      // Act
      component.onSelected.subscribe((person) => {// (1)
        selectedPerson = person;
      });
      buttonDeb.triggerEventHandler('click', null);
      fixture.detectChanges();
      // Assert
      expect(selectedPerson).toEqual(expectPerson);
    });
  });

});

/* TEST AISLADO COMPONENTE CREADO EN EJECUCIÓN ########################################################*/

@Component({
  template: `<app-person [person] = "personHost" (onSelected)="onSelectedHost($event)"></app-person>`
})
class HostComponent {
  personHost = new Person('Adriel','Silva', 11, 30, 1.5);
  selectedPerson: Person | undefined;

  onSelectedHost(person: Person){
    this.selectedPerson = person;
  }
}

describe('PersonComponent from HostComponent Test´s', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, PersonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    component.personHost = new Person('Ninguno', 'Nada', 37, 85, 1.72);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* Deberia mostrar el nombre de la persona que que se le esta enviando, comparandolo
  con el que se muestra en el h3 de app-person
  (1) Obtenemos lo que contiene el h3 de app-person */
  it('should display person name', () => {
    // Arrange
    const expectedName = component.personHost.name;
    const h3Deb = fixture.debugElement.query(By.css('app-person h3'));//(1)
    const h3Ele = h3Deb.nativeElement;
    // Act
    fixture.detectChanges();
    // Assert
    expect(h3Ele.textContent).toContain(expectedName);
  });

  /* Deberia igualar al selectedPerson con personHost, al hacer click en el boton que tiene app-person,
  ya que este tienen un evento click que hace esto
  (1) Hacemos click al .btn-choose de app-person */
  it('should raise selected event when clicked btn-choose of app-person', () => {
    // Arrange
    const buttonDeb = fixture.debugElement.query(By.css('app-person .btn-choose'));//(1)
    // Act
    buttonDeb.triggerEventHandler('click', null);
    fixture.detectChanges();
    // Assert
    expect(component.selectedPerson).toEqual(component.personHost);
  });
});
