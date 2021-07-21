import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.css']
})
export class ProductListingComponent implements OnInit {

  section: string = "";
  category: any;
  products: any = [];
  categories: Array<string> = [];
  productsView: any = [];
  qty: string = "";

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.section = params.get("section") || "";
      this.category = params.get("category"); 
      let params2: any = new HttpParams();
      params2 = params2.append("section", this.section);
      params2 = params2.append("category", this.category);
      let opts: any = {params: params2};
      this.http.get(environment.serverURL+"listingProducts/", opts).subscribe((data: any) => {
        this.products = data.products;
        this.categories = data.categories;
        this.productsView = this.products.slice(0, 12);
        this.qty = "all";
        this.category = this.categories[0];
      });
    });
  }
  
  changeCategory(event: any): void {
    this.category = event.target.value;
    let params: any = new HttpParams();
    params = params.append("section", this.section);
    params = params.append("newCategory", this.category);
    let opts: any = {params: params};
    this.http.get(environment.serverURL+"listingProducts/", opts).subscribe((data: any) => {
      this.products = data.products;
      this.categories = data.categories;
      this.productsView = this.products.slice(0, 12);
      this.qty = "all";
    });
  }

  goToProductDetail($oid: string): void {
    this.router.navigate(["productDetail", $oid]);
  }

  toggleView(): void {
    if (this.qty === "all") {
      this.productsView = this.products;
      this.qty = "less";
    } else {
      this.productsView = this.products.slice(0, 12);
      this.qty = "all";
    }
  }

}
