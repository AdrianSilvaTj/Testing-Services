import { Person } from './../../models/person.model';
import { Component } from '@angular/core';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent {
  person : Person = new Person('Pepe','Trueno',25, 50, 1.50);
}
