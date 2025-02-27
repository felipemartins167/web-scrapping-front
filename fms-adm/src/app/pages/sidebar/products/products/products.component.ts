import { Component, OnInit } from '@angular/core';

import { LoadingService } from '../../../../services/loading.service';

import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { ProductModel } from '../../../../models/product-model';
import { ProductService } from '../../../../services/product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ButtonModule, Ripple, InputTextModule, FormsModule, PaginatorModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  search: string = '';
  productsList = Array<ProductModel>();
  first: number = 1;
  rows: number = 10;
  totalItems: number = 2;

  constructor(private loadingService: LoadingService, private productService: ProductService, private router: Router) {

  }

  ngOnInit(): void {
    this.doSearch();
  }

  doSearch(event?: any) {
    this.loadingService.show();
    const page = event ? (event.page + 1) : this.first;
    if (event == null)
      this.first = 1;
    this.productService.getAll(page, this.rows, this.search)
      .subscribe({
        next: (products) => {
          this.loadingService.hide();
          this.productsList = products.data;
          this.totalItems = products.totalPage ? products.totalPage : 0;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: ((err) => {
          this.loadingService.hide();
        })
      });
  }

  doProductDetail(product: ProductModel) {
    this.router.navigate([`sidebar/products/detail/${product.name}/${product.marketPlace}`]);
  }

}
