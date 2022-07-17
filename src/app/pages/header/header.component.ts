import { Component, OnInit } from '@angular/core';
import { ApiService } from '@service/api.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

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

  /**
   * array of css classes that toggle in <body> to set the theme
   */
  public themes: string[] = [
    'light-theme-indigo',
    'dark-theme-purple',
  ];
  public selectedTheme: BehaviorSubject<string> = new BehaviorSubject<string>(this.themes[0]);
  ngOnInit() {
    $('body').addClass(this.selectedTheme.value);
    this.selectedTheme.subscribe({
      next: (v) => {
        for (let t of this.themes)
          $('body').removeClass(t);
        $('body').addClass(v);
    }})
  }
  
  changeTheme(event: any) {
    
  }
}
