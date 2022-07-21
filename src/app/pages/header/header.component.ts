import { ɵparseCookieValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '@service/api.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public api: ApiService) { }

  registerHandle() {
    localStorage['token'] = undefined;
    // localStorage.setItem('user', '');
    this.api.token = '';
    window.location.href = '/register';
  }
  loginHandle() {
    this.api.token = '';
    localStorage['token'] = undefined;
    // localStorage.setItem('user', '');
    window.location.href = '/login';
  }
  logoutHandle() {
    localStorage['token'] = undefined;
    this.api.token = '';
    window.location.href = '/login';
  }

  
  
}
