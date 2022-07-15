import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KeyboardService } from '@service/keyboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: []
})
export class AppComponent {
  //keyboard service won't listen if it was not called so...
  constructor(private keyboardService:KeyboardService,public router:Router) {
    
  }
  // public isLoading = true;
  ngOnInit() {
    // this.loaderService.isLoaderShown.subscribe(isLoaderShown => this.showLoader = isLoaderShown);
    // this.router.events.subscribe((routerEvent: any) => {
    //   if (routerEvent instanceof NavigationStart) {
    //     this.isLoading = true;
    //   } else if (routerEvent instanceof NavigationEnd) {
    //     this.isLoading = false;
    //   } else if (routerEvent instanceof NavigationCancel) {
    //     this.isLoading = false;
    //     // Handle cancel
    //   } else if (routerEvent instanceof NavigationError) {
    //     this.isLoading = false;
    //     // Handle error
    //   }
    // });
  }
}
