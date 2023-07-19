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

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.status = 'loading';
    this.productService
      .getAll(this.limit, this.offset)
      .subscribe((products) => {
        this.products = [...this.products, ...products];
        this.offset += this.limit;
        this.status = 'success';
      });
  }
}
