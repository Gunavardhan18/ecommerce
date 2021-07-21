import { Component, OnInit } from '@angular/core';
import { ProfileDetails } from '../profile-details';
import { HttpClient } from '@angular/common/http';
import { AlertifyService } from '../alertify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {

  profileDetailsModel = new ProfileDetails(localStorage.getItem("firstName") || "", localStorage.getItem("emailID") || "", localStorage.getItem("mobileNumber") || "");

  constructor(private http: HttpClient, private alert: AlertifyService) { }

  ngOnInit(): void {
  }

  updateDetails(): void {
    this.http.post(environment.serverURL+"profileDetails/", this.profileDetailsModel).subscribe((data: any) => {
      this.alert.success(data.success);
      localStorage.setItem("firstName", this.profileDetailsModel.firstName);
      localStorage.setItem("mobileNumber", this.profileDetailsModel.mobileNumber);
    });
  }

}
