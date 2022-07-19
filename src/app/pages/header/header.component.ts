import { ɵparseCookieValue } from '@angular/common';
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
  public themes: string[] = [//todo make toggle button for dark/light mode. while the themes are just the color. An idea to do that is by making each theme has dark and light classes and files. So, themes arr will be without dark/light i.e('theme-purple' instead of 'dark-theme-purple') and then based on isDark append dark/light string into arr item. Ex:$('body').addClass(isDark == true ? 'dark-'+arr[i] : 'light-'+arr[i]);
    'theme-indigo',
    'theme-purple',
    'theme-yellow'
  ];
  public isDark = false;
  public selectedTheme: BehaviorSubject<string> = new BehaviorSubject<string>(this.themes[0]);
  ngOnInit() {
    this.invokePreference();
    this.selectedTheme.subscribe({
      next: (v) => {
        for (let t of this.themes) {
          $('body').removeClass('dark-'+t);
          $('body').removeClass('light-'+t);
        }
        $('body').addClass((this.isDark ? 'dark-' : 'light-') + v);
        this.savePreference();
      }
    })
  }
  
  savePreference() {
    console.error('save',{isDark:this.isDark,theme:this.selectedTheme.value})
    localStorage.setItem('isDark', JSON.stringify(this.isDark));
    localStorage.setItem('theme', this.selectedTheme.value);
  }
  invokePreference():void {
    this.isDark = JSON.parse(localStorage.getItem('isDark') || 'false');
    this.selectedTheme.next(localStorage.getItem('theme') || this.themes[0]);
    console.error({isDark:this.isDark,theme:this.selectedTheme.value})
  }
  
}
