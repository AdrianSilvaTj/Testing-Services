import { ValueService } from 'src/app/services/value.service';
import { Product } from './../../models/product.model';
import { ProductService } from './../../services/product.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  products: Product[] = [];
  limit = 12;
  offset = 0;
  status: 'loading' | 'success' | 'error' | 'init' = 'init';
  rta = '';

  constructor(
    private productService: ProductService,
    private valueService: ValueService,
    ) {}

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.status = 'loading';
    this.productService
      .getAll(this.limit, this.offset)
      .subscribe({
        next: products => {
          this.products = [...this.products, ...products];
          this.offset += this.limit;
          this.status = 'success';
        },
        error: error => {
          setTimeout(() => {
          this.products = [];
          this.status = 'error';
          }, 3000);
        }
      });
  }

  async callPromise(){
    const rta = await this.valueService.getPromiseValue();
    this.rta = rta;
  }

}
