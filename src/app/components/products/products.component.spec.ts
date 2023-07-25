import { ValueService } from './../../services/value.service';
import { By } from '@angular/platform-browser';
import { generateManyProducts } from './../../models/product.mock';
import { ProductService } from './../../services/product.service';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { ProductComponent } from '../product/product.component';
import { defer, of } from 'rxjs';
import { Product } from 'src/app/models/product.model';

/* Para estos test estaremos utilizando un Espia de productService:
(1) Tipamos un SpyObj con los elementos de ValueService.
(2) Creamos el spy: Espiamos el método getAll() del productService.
(3) le indicamos que dentro en vez de utilizar la instancia de ProductService,
    utilice el spyGetAll.
(4) Obtenemos la inyección de dependencias,( emulamos lo que se hace en el constructor)
(5) Generamos el mock de productos
(6) Emulamos la ejecución de getAll() y retornamos el mock como un Observable
(7) fixture.detectChanges(), corre el ngOnInit() */
describe('ProductComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>; //(1)
  let valueServiceSpy: jasmine.SpyObj<ValueService>; //(1)
  let productsMock: Product[] = [];

  beforeEach(() => {
    const spyGetAll = jasmine.createSpyObj('ProductService', ['getAll']); // (2)
    const spyGetPromiseValue = jasmine.createSpyObj('ValueService', ['getPromiseValue']); // (2)

    TestBed.configureTestingModule({
      declarations: [ProductsComponent, ProductComponent],
      providers: [
        //
        { provide: ProductService, useValue: spyGetAll }, // (3)
        { provide: ValueService, useValue: spyGetPromiseValue }, // (3)
      ],
    });
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(
      ProductService
    ) as jasmine.SpyObj<ProductService>; // (4)
    valueServiceSpy = TestBed.inject(
      ValueService
    ) as jasmine.SpyObj<ValueService>; // (4)
    productsMock = generateManyProducts(5); // (5)
    productServiceSpy.getAll.and.returnValue(of(productsMock)); // (6)
    fixture.detectChanges(); // (7)
  });

  it('should create and call getAll method', () => {
    expect(component).toBeTruthy();
    expect(productServiceSpy.getAll).toHaveBeenCalled();
  });

  describe('test for getAllProducts()', () => {
    /* (1) debido a que dentro del getAllProducts se agrega el doble de productos, por la paginación continua */
    it('should return a product list from service and render it', () => {
      // Arrange
      // Act
      component.getAllProducts();
      fixture.detectChanges();
      const debugElemnt = fixture.debugElement.queryAll(By.css('app-product'));
      // Assert
      expect(debugElemnt.length).toEqual(productsMock.length * 2); // (1)
      expect(component.products.length).toBe(productsMock.length * 2); // (1)
    });

    /* Queremos evaluar que status cambien de 'loading' a 'success', pero emulando un asincronismo con demora:
    (1) defer emula una petición con demora.
    (2) debe usarse con fakeAsync()
    (3) tick(), ejecuta todo lo que este pendiente por resolverse que sea asincrono
    (4) evaluamos que el status es igual a "loading", antes de la petición
    (5) evaluamos que el status es igual a "error", despues de la petición */
    it('should change the status "loading" => "success"', fakeAsync(() => { // (2)
      // Arrange
      const btnGetProdsDeb = fixture.debugElement.query(By.css('.btn-get-prods'));
      productServiceSpy.getAll.and.returnValue(
        defer(() => Promise.resolve(productsMock))// (1)
      );
      // Act
      //component.getAllProducts();
      btnGetProdsDeb.triggerEventHandler('click', null);
      fixture.detectChanges();
      // Assert
      expect(component.status).toEqual('loading');// (4)

      tick();// (3)
      fixture.detectChanges();
      // Assert
      expect(component.status).toEqual('success');// (5)
    }));

    /* Queremos evaluar que status cambien de 'loading' a 'error', pero emulando un asincronismo con demora:
    (6) cuando se utiliza se utiliza funciones con tiempo explicitamente definido como setTimeOut,
    se le debe enviar como parametro el tiempo de espera  */
    it('should change the status "loading" => "error"', fakeAsync(() => { // (2)
      // Arrange
      const btnGetProdsDeb = fixture.debugElement.query(By.css('.btn-get-prods'));
      productServiceSpy.getAll.and.returnValue(
        defer(() => Promise.reject('error'))// (1)
      );
      // Act
      //component.getAllProducts();
      fixture.detectChanges();
      btnGetProdsDeb.triggerEventHandler('click', null);
      // Assert
      expect(component.status).toEqual('loading');// (4)

      tick(4000);// (6)
      fixture.detectChanges();
      // Assert
      expect(component.status).toEqual('error');
    }));

    /*(1) al ser una promesa, se utiliza un async - await  */
    describe('test for callPromise', () => {
      it('should call to promise', async () => { // (1)
        // Arrange
        const mockMsg = 'my mock string';
        valueServiceSpy.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));
        // Act
        await component.callPromise(); // (1)
        fixture.detectChanges();
        // Assert
        expect(component.rta).toEqual(mockMsg);
        expect(valueServiceSpy.getPromiseValue).toHaveBeenCalled();
      });

      it('should show "my mock string" in <p> when click the button', fakeAsync( () => { // (1)
        // Arrange
        const mockMsg = 'my mock string';
        const btnDeb = fixture.debugElement.query(By.css('.btn-promise'));
        valueServiceSpy.getPromiseValue.and.returnValue(Promise.resolve(mockMsg));
        // Act
        btnDeb.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();
        const rtaDeb = fixture.debugElement.query(By.css('.rta'));
        // Assert
        expect(component.rta).toEqual(mockMsg);
        expect(valueServiceSpy.getPromiseValue).toHaveBeenCalled();
        expect(rtaDeb.nativeElement.textContent).toContain(mockMsg);
      }));
    });

  });
});
