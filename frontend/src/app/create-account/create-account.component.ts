import { Component, OnInit } from '@angular/core';
import { CreateAccount } from '../create-account';
import { HttpClient } from '@angular/common/http';
import { AlertifyService } from '../alertify.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  createAccountModel = new CreateAccount("", "", "", "");

  constructor(private http: HttpClient, private alert: AlertifyService, private router: Router ) { }

  ngOnInit(): void {
  }

  createAccount(): void {
    this.http.post(environment.serverURL+"createAccount/", this.createAccountModel).subscribe((data: any) => {
      if (data.error) {
        this.alert.error(data.error);
      } else {
        this.alert.success(data.success);
        localStorage.setItem("token", data.token);
        localStorage.setItem("firstName", this.createAccountModel.firstName);
        localStorage.setItem("emailID", this.createAccountModel.emailID);
        localStorage.setItem("mobileNumber", this.createAccountModel.mobileNumber);
        if (localStorage.getItem("goBackTo")) {
          let page = localStorage.getItem("goBackTo");
          localStorage.removeItem("goBackTo");
          this.router.navigate([page]);
        } else if (localStorage.getItem("$oid")) {
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
