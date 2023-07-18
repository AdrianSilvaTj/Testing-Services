export class Person{
  constructor(
    public name: string,
    public lastName: string,
    public age: number,
    public weigth: number,
    public heigth: number,
  ){}

    calcIMC(): string{
      const result = Math.round(this.weigth / (this.heigth * this.heigth));
      console.log(result);

      if(result < 0){
        return 'not found';
      } else if(result >=0 && result < 18){
        return 'down';
      }else if(result >=19 && result < 24){
        return 'normal';
      }else if(result >=25 && result < 26){
        return 'overweight';
      }else if(result >=27 && result <= 29){
        return 'overweight 1';
      }else if(result >=30 && result < 39){
        return 'overweight 2';
      }else if(result >=40){
        return 'overweight 3';
      }else {
        return 'not found';
      }
    }

}
