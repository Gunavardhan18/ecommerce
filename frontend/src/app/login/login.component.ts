import { Component, OnInit } from '@angular/core';
import { Login } from '../login';
import { HttpClient } from '@angular/common/http';
import { AlertifyService } from '../alertify.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginModel = new Login("", "");

  constructor(private http: HttpClient, private alert: AlertifyService, private router: Router) { }

  ngOnInit(): void {
  }

  login(): void {
    this.http.post(environment.serverURL+"login/", this.loginModel).subscribe((data: any) => {
      if (data.error) {
        this.alert.error(data.error);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("firstName", data.user.firstName);
        localStorage.setItem("emailID", this.loginModel.emailID);
        localStorage.setItem("mobileNumber", data.user.mobileNumber);
        this.alert.success(data.success);
        if (localStorage.getItem("goBackTo")) {
          let page = localStorage.getItem("goBackTo");
          console.log(page);
          localStorage.removeItem("goBackTo");
          this.router.navigate([page]);
        } else if (localStorage.getItem("$oid")) {
          console.log(localStorage.getItem("$oid"));
          let cartDetails: any = {emailID: localStorage.getItem("emailID"), $oid: localStorage.getItem("$oid"), size: localStorage.getItem("size")};
          localStorage.removeItem("$oid");
          localStorage.removeItem("size");
          this.http.post(environment.serverURL+"cartDetails/", cartDetails).subscribe((data: any) => {
            this.alert.success(data.success);
            this.router.navigate(["cartDetails"]);
          });
        } else {
          this.router.navigate(["landing"]);
        }
      }
    });
  }

}
