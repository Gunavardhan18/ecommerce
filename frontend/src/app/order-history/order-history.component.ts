import { Component, OnInit } from '@angular/core';
import { HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertifyService } from '../alertify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  empty: boolean = false;
  orders: any = [];
  
  constructor(private http: HttpClient, private router: Router, private alert: AlertifyService) { }
  
  ngOnInit(): void {
    let params: any = new HttpParams();
    params = params.append("emailID", localStorage.getItem("emailID"));
    let opts: any = {params: params};
    this.http.get(environment.serverURL+"orderHistory/", opts).subscribe((data: any) => {
      if (data.empty) {
        this.empty = true;
      } else {
        this.orders = data.orders;
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigate(["login"]);
          this.alert.error("Login first to view your order history!");
        }
      }
    });
  }

  goToProductDetail($oid: string): void {
    this.router.navigate(["productDetail", $oid]);
  }

}
