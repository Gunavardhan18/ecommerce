import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertifyService } from '../alertify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  empty: boolean = false;
  products: any = [];
  cartTotal: number = 0;

  constructor(private http: HttpClient, private router: Router, private alert: AlertifyService) { }

  ngOnInit(): void {
    let params: any = new HttpParams();
    params = params.append("emailID", localStorage.getItem("emailID"));
    let opts: any = { params: params };
    this.http.get(environment.serverURL+"cartDetails/", opts).subscribe((data: any) => {
      if (data.empty) {
        this.empty = true;
      } else {
        this.products = data.products;
        for (let product of this.products) {
          product.totalPrice = product.price * product.qty;
          this.cartTotal += product.totalPrice;
          product.qtyOptions = [];
          for (let i = 1; i <= product.qtyLeft[product.size]; i++) {
            product.qtyOptions.push(i);
          }
        }
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigate(["login"]);
          this.alert.error("Login first to view your cart details!");
        }
      }
    });
  }
  
  goToProductDetail($oid: string): void {
    this.router.navigate(["productDetail", $oid]);
  }
  
  updateQty(option: number, product: any): void {
    let body: any = {emailID: localStorage.getItem("emailID"), $oid: product._id.$oid, size: product.size, qty: option};
    this.http.patch(environment.serverURL+"cartDetails/", body).subscribe(() => {
      product.qty = option;
      this.cartTotal -= product.totalPrice;
      product.totalPrice = product.price * product.qty;
      this.cartTotal += product.totalPrice;
    });
  }
  
  remove(product: any): void {
    let params: any = new HttpParams();
    params = params.append("emailID", localStorage.getItem("emailID"));
    params = params.append("$oid", product._id.$oid);
    params = params.append("size", product.size);
    let opts: any = {params: params};
    this.http.delete(environment.serverURL+"cartDetails/", opts).subscribe(() => {
      this.cartTotal -= product.totalPrice;
      this.products = this.products.filter((pdt: any) => pdt !== product)
      if (this.products.length === 0) {
        this.empty = true;
      }
    });
  }

  goToLanding(): void {
    this.router.navigate(["landing"]);
  }

  buy(): void {
    let body: any = {"emailID": localStorage.getItem("emailID"), "cartProducts": this.products};
    this.http.post(environment.serverURL+"orderHistory/", body).subscribe((data: any) => {
      this.alert.success(data.success);
      this.router.navigate(["orderHistory"]);
    });
  }

}
