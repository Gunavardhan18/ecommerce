import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertifyService } from '../alertify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  sections: Array<string> = [];

  constructor(private http: HttpClient, private router: Router, private alert: AlertifyService) { }

  ngOnInit(): void {
    this.http.get(environment.serverURL+"sections/").subscribe((data: any) => {
      this.sections = data.sections;
    });
  }

  goToProductListing(section: any): void {
    this.router.navigate(["productListing", section]);
  }
  
}
