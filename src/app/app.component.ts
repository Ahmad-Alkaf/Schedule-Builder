import { Component } from '@angular/core';
import { KeyboardService } from './services/keyboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: []
})
export class AppComponent {
  //keyboard service won't listen if it was not called so...
  constructor(private keyboardService:KeyboardService) {
    
  }
}
