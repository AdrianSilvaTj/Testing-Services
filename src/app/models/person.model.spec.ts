import { Person } from "./person.model";

fdescribe('Test for Person', () => {
  let person: Person;

  beforeEach(() => {
    person = new Person('Adrian', 'Silva', 37, 85, 1.72);
  });

  it('attrs', () => {
    expect(person.name).toEqual('Adrian');
    expect(person.lastName).toEqual('Silva');
    expect(person.age).toEqual(37);
  });

  describe('test for calcIMC', () => {
    it('should return a string: down', () => {
      //Arrange
      person.weigth = 40;
      person.heigth = 1.65;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('down');
    });
    it('should return a string: overweigth 2', () => {
      //Arrange
      person.weigth = 100;
      person.heigth = 1.65;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('overweigth 2');
    });
    it('should return a string: overweigth 1', () => {
      //Arrange
      person.weigth = 80;
      person.heigth = 1.65;
      // Act
      const rta = person.calcIMC();
      // Assert
      expect(rta).toEqual('overweigth 1');
    });
  })
})
