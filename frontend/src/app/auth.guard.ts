import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router, private alert: AlertifyService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (localStorage.getItem("token")) {
      return true;
    } else {
      this.router.navigate(["login"]);
      localStorage.setItem("goBackTo", route.url[0].path);
      var page;
      switch(route.url[0].path) {
        case "cartDetails":
          page = "cart details";
          break;
        case "orderHistory":
          page = "order history";
          break;
      }
      this.alert.error(`Login first to view your ${page}!`);
      return false;
    }
  }
  
}
