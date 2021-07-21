import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  products: any = [];

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get(environment.serverURL+"landingProducts/").subscribe((data: any) => {
      this.products = data.products;
    });
  }

  goToProductDetail($oid: string): void {
      this.router.navigate(["productDetail", $oid]);
  }

}
