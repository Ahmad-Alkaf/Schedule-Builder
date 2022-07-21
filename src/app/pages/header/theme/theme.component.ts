import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent implements OnInit {

  constructor() { }

  /**
   * array of css classes that toggle in <body> to set the theme
   */
  public themes: string[] = [//todo make toggle button for dark/light mode. while the themes are just the color. An idea to do that is by making each theme has dark and light classes and files. So, themes arr will be without dark/light i.e('theme-purple' instead of 'dark-theme-purple') and then based on isDark append dark/light string into arr item. Ex:$('body').addClass(isDark == true ? 'dark-'+arr[i] : 'light-'+arr[i]);
    'theme-indigo',
    'theme-yellow',
    'theme-purple',
    'theme-brown',
    'theme-pink',
    'theme-teal', 
    'theme-blue',
    'theme-red',
    'theme-green',
  ];
  public isDark = false;
  public selectedTheme: BehaviorSubject<string> = new BehaviorSubject<string>(this.themes[0]);
  ngOnInit() {
    this.invokePreference();
    this.selectedTheme.subscribe({
      next: (v) => {
        for (let t of this.themes) {
          $('body').removeClass('dark-' + t);
          $('body').removeClass('light-' + t);
        }
        $('body').addClass((this.isDark ? 'dark-' : 'light-') + v);
        this.savePreference();
      }
    })
  }

  savePreference() {
    console.error('save', { isDark: this.isDark, theme: this.selectedTheme.value })
    localStorage.setItem('isDark', JSON.stringify(this.isDark));
    localStorage.setItem('theme', this.selectedTheme.value);
  }
  invokePreference(): void {
    this.isDark = JSON.parse(localStorage.getItem('isDark') || 'false');
    this.selectedTheme.next(localStorage.getItem('theme') || this.themes[0]);
    console.error({ isDark: this.isDark, theme: this.selectedTheme.value })
  }
}
