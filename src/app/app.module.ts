// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
// import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
// import {MatInputModule} from '@angular/material/input'
import {MatIconModule} from '@angular/material/icon';
// import{MatListModule} from '@angular/material/list';
// import {MatRippleModule} from '@angular/material/core'; 
// import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog'; 
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavTreeComponent } from './main/nav-tree/nav-tree.component';
import { MainComponent } from './main/main/main.component';
import {MatTreeModule} from '@angular/material/tree'; 
import {MatSidenavModule} from '@angular/material/sidenav';
import { AddSubtreeComponent } from './main/nav-tree/add-subtree/add-subtree.component'; 
@NgModule({
  declarations: [
    AppComponent,
    NavTreeComponent,
    MainComponent,
    AddSubtreeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([{
      path: '',
      component: MainComponent,
      
    }]),
    MatTreeModule,
    MatButtonModule,
    MatSidenavModule,
    MatDialogModule,
    // MatAutocompleteModule,
    // MatInputModule,
    MatIconModule,
    // MatDialogModule,
    // MatListModule,
    // MatRippleModule,
    // BrowserAnimationsModule,
    // MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
