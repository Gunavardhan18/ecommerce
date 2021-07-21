import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertifyService } from '../alertify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  sections: Array<string> = [];
  firstName: string = "";
  emailID: string = "";
  show: boolean = false;

  constructor(private http: HttpClient, private router: Router, private alert: AlertifyService) { }

  ngOnInit(): void {
    this.http.get(environment.serverURL+"sections/").subscribe((data: any) => {
      this.sections = data.sections;
    });
    this.firstName = localStorage.getItem("firstName") || "";
    this.emailID = localStorage.getItem("emailID") || "";
  }
  
  goToProductListing(section: string): void {
    this.router.navigate(["productListing", section]);
  }

  hideProfile(): void {
    this.show = false;
  }

  showProfile(): void {
    this.show = true;
  }

  goToCartDetails(): void {
    this.router.navigate(["cartDetails"]);
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("emailID");
    localStorage.removeItem("mobileNumber");
    this.alert.success("You've successfully logged out!");
    this.router.navigate(["login"]);
  }
  
}
