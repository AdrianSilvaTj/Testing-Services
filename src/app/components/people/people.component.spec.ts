import { By } from '@angular/platform-browser';
import { Person } from './../../models/person.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleComponent } from './people.component';
import { PersonComponent } from '../person/person.component';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeopleComponent, PersonComponent]
    });
    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    component.people = [
      new Person('Lola','Bunny',25, 50, 1.50),
      new Person('Bugs','Bunny',42, 80, 1.50),
      new Person('Pato','Lucas',42, 80, 1.50),
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the rigth quantity of people', () => {
    // Arrange

    // Act
    const debugElemnt = fixture.debugElement.queryAll(By.css('app-person'))
    // Assert
    expect(debugElemnt.length).toEqual(3);
  });

  /* Verificamos que al hacer click se guarda en la persona seleccionada y se renderizan sus datos en este componente (Padre)
  (1) de esta manera se selecciona el primer elemento del array siempre
  (2) de esta manera manejamos los elementos como un Array */
  it('should select and render a person when click on the button', () => {
    // Arrange

    // Act
    // const buttonDeb = fixture.debugElement.query(By.css('app-person .btn-choose'));// (1)
    const buttonDebArr = fixture.debugElement.queryAll(By.css('app-person .btn-choose'));// (2)
    //buttonDeb.triggerEventHandler('click', null); //(1)
    buttonDebArr[1].triggerEventHandler('click', null); //(2)
    fixture.detectChanges();
    const liEle = fixture.debugElement.query(By.css('div ul li')).nativeElement;// (1)
    // Assert
    expect(component.selectedPerson).toEqual(component.people[1]);
    //expect(liEle.textContent).toContain('Lola');// (1)
    expect(liEle.textContent).toContain('Bugs');// (2)

  });

});
