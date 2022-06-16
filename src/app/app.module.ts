import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
// import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatInputModule} from '@angular/material/input'
import {MatIconModule} from '@angular/material/icon';
import {DragDropModule} from '@angular/cdk/drag-drop'; 
import {MatTreeModule} from '@angular/material/tree'; 
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatDividerModule } from '@angular/material/divider'; 
import {MatSelectModule} from '@angular/material/select'; 
// import{MatListModule} from '@angular/material/list';
// import {MatRippleModule} from '@angular/material/core'; 
// import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavTreeComponent } from './main/main/nav-tree/nav-tree.component';
import { MainComponent } from './main/main/main.component';
import { AddSubtreeComponent } from './dialog/add-subtree/add-subtree.component'; 
import { TableComponent } from './main/main/table/table.component';
import { TdComponent } from './main/main/table/td/td.component'; 
import { SoundService } from './sound.service';
import { AddLectureComponent } from './dialog/add-lecture/add-lecture.component';
@NgModule({
  declarations: [
    AppComponent,
    NavTreeComponent,
    MainComponent,
    AddSubtreeComponent,
    TableComponent,
    TdComponent,
    AddLectureComponent
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
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatDividerModule,
    MatSelectModule,
    DragDropModule,
    ReactiveFormsModule,
    // MatAutocompleteModule,
    // MatDialogModule,
    // MatListModule,
    // MatRippleModule,
    BrowserAnimationsModule,
    // MatSnackBarModule
  ],
  providers: [SoundService],
  bootstrap: [AppComponent]
})
export class AppModule { }
