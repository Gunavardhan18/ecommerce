import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertifyService } from '../alertify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  $oid: string = "";
  product: any = {};
  qtyLeft: any = {};
  outOfStock: boolean = false;
  sizes: any = {s: false, m: false, l: false};
  qtyView: number = 0;
  size: string = "";
  index: number = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private alert: AlertifyService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.$oid = params.get("$oid") || "";
    });
    let params: any = new HttpParams();
    params = params.append("$oid", this.$oid);
    let opts: any = {params: params};
    this.http.get(environment.serverURL+"product/", opts).subscribe((data: any) => {
      this.product = data;
      this.qtyLeft = this.product.qtyLeft;
      let count = 0;
      for (let size in this.qtyLeft) {
        if (this.qtyLeft[size] !== 0) {
          this.sizes[size] = true;
          this.qtyView = this.qtyLeft[size];
          this.size = size;
          break;
        }
        count++;
      }
      if (count === 3) {
        this.outOfStock = true;
      }
    });
  }

  goToProductListing(): void {
    this.router.navigate(["productListing", this.product.section]);
  }

  goToProductListing2(): void {
    this.router.navigate(["productListing", this.product.section, {category: this.product.category}]);
  }

  enlargeImg(i: number): void {
    this.index = i;
  }

  clickedS(): void {
    this.qtyView = this.qtyLeft.s;
    this.size = "s";
  }
  clickedM(): void {
    this.qtyView = this.qtyLeft.m;
    this.size = "m";
  }
  clickedL(): void {
    this.qtyView = this.qtyLeft.l;
    this.size = "l";
  }
  
  addToCart(): void {
    let cartDetails: any = {emailID: localStorage.getItem("emailID"), $oid: this.$oid, size: this.size};
    this.http.post(environment.serverURL+"cartDetails/", cartDetails).subscribe((data: any) => {
      if (data.error) {
        this.alert.error(data.error);
      } else {
        this.alert.success(data.success);
      }
      this.router.navigate(["cartDetails"]);
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigate(["login"]);
          this.alert.error("Login first to add to your cart!");
          localStorage.setItem("$oid", this.$oid);
          localStorage.setItem("size", this.size);
        }
      }
    });
  }

}
