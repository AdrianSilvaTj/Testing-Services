import { Person } from './../../models/person.model';
import { Component } from '@angular/core';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent {
  people : Person[] = [
    new Person('Pepe','Trueno',25, 50, 1.50),
    new Person('Bugs','Bunny',42, 80, 1.50),
  ];
  selectedPerson: Person | null = null;

  choose(person: Person){
    this.selectedPerson = person;
  }

}
