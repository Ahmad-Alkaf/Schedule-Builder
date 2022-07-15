import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@service/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public api:ApiService, private router:Router) { }

  ngOnInit(): void {
  }
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
