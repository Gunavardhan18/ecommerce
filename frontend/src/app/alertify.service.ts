import { Injectable } from '@angular/core';
import * as alert from "alertifyjs";

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

  set() {
    alert.set('notifier','position', 'top-center');
  }

  error(msg: string) {
    this.set();
    alert.error(msg);
  }

  success(msg: string) {
    this.set();
    alert.success(msg);
  }

}
