import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

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
    this.router.navigate(['/register']);
  }
  loginHandle() {
    this.api.token = '';
    localStorage['token'] = undefined;
    // localStorage.setItem('user', '');
    this.router.navigate(['/login'])
  }
  logoutHandle() {
    localStorage['token'] = undefined;
    this.api.token = '';
    this.router.navigate(['/login'])
  }
}
