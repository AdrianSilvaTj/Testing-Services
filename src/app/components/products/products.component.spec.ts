import { By } from '@angular/platform-browser';
import { generateManyProducts } from './../../models/product.mock';
import { ProductService } from './../../services/product.service';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

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
fdescribe('ProductComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>; //(1)
  let productsMock: Product[] = [];

  beforeEach(() => {
    const spyGetAll = jasmine.createSpyObj('ProductService', ['getAll']);// (2)

    TestBed.configureTestingModule({
      declarations: [ProductsComponent, ProductComponent],
      providers: [
        //
        { provide: ProductService, useValue: spyGetAll } // (3)
      ],
    });
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;// (4)
    productsMock = generateManyProducts(5);// (5)
    productServiceSpy.getAll.and.returnValue(of(productsMock));// (6)
    fixture.detectChanges();// (7)
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
    expect(debugElemnt.length).toEqual(productsMock.length * 2);// (1)
    expect(component.products.length).toBe(productsMock.length * 2);// (1)
    });

    /* Queremos evaluar que status cambien de 'loading' a 'success', pero emulando un asincronismo con demora:
    (1) defer emula una petición con demora */
    it('should change the status "loading" => "success"', fakeAsync(() => {
    // Arrange
    productServiceSpy.getAll.and.returnValue(defer(() => Promise.resolve(productsMock)));
    // Act
    component.getAllProducts();
    fixture.detectChanges();
    // Assert
    expect(component.status).toEqual('success');
    }));

  });

});
