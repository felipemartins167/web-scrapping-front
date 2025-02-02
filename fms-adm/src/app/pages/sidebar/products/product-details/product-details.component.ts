import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../../services/loading.service';
import { ProductService } from '../../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModel } from '../../../../models/product-model';

import { ChartModule } from 'primeng/chart';
import { DataChartProduct } from '../../../../models/data-chart-product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  product: Array<ProductModel> = [];
  name: string;
  marketPlace: string;
  data: any;
  options: any;

  textColor = '#495057';
  textColorSecondary = '#6c757d';
  surfaceBorder = '#e9ecef';

  constructor(private loadingService: LoadingService, private productService: ProductService, private router: Router, private activateRouter: ActivatedRoute) {
    this.name = this.activateRouter.snapshot.paramMap.get('name')!;
    this.marketPlace = this.activateRouter.snapshot.paramMap.get('marketPlace')!;
  }

  ngOnInit(): void {
    this.doGetProductByNameMarketPlace();
  }

  doGetProductByNameMarketPlace() {
    this.loadingService.show();
    console.log(this.name, this.marketPlace);

    this.productService.getByNameMarketPlace(this.name, this.marketPlace)
      .then((product) => {
        this.loadingService.hide();
        if (product.error) {

        } else {
          this.product = product.data;
          const labels:any = [];
          const dataChart:any = [];
          this.product.forEach((item: ProductModel) => {
            labels.push(new Date(item.createdAt).toLocaleDateString('pt-BR'));
            dataChart.push(item.priceTo);
          });
          this.data = {
            labels: ['01/01/2021', '02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021'],
            datasets: [
              {
                label: 'Valores',
                data: [1,50,45,58,50],
                fill: false,
                tension: 0.4
              }
            ]
          };

          this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
              legend: {
                labels: {
                  color: this.textColor
                }
              }
            },
            scales: {
              x: {
                ticks: {
                  color: this.textColorSecondary
                },
                grid: {
                  color: this.surfaceBorder,
                  drawBorder: false
                }
              },
              y: {
                ticks: {
                  color: this.textColorSecondary
                },
                grid: {
                  color: this.surfaceBorder,
                  drawBorder: false
                }
              }
            }
          };
        }
      })
      .catch((err) => {
        this.loadingService.hide();
      })
      .finally(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }
}
