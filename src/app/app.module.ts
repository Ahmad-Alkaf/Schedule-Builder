import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTreeModule } from '@angular/material/tree';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CdkTreeModule } from '@angular/cdk/tree';
// import{MatListModule} from '@angular/material/list';
// import {MatRippleModule} from '@angular/material/core'; 
import {MatSnackBarModule} from '@angular/material/snack-bar';
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
import { SoundService } from './services/sound.service';
import { AddLectureComponent } from './dialog/add-lecture/add-lecture.component';
import { CreateLectureComponent } from './main/main/created-lecture/created-lecture.component';
import { LectureOptionsComponent } from './dialog/lecture-options/lecture-options.component';
import { DataService } from './services/data.service';
import { KeyboardService } from './services/keyboard.service';
import { Final } from './main/main/table/utility/static';
// import { Table } from './main/main/table/utility/tableBinder';
import { EditLectureComponent } from './dialog/edit-lecture/edit-lecture.component';
import { TableTabsComponent } from './main/main/table/table-tabs/table-tabs.component';
import { HeaderComponent } from './main/header/header.component';
import { ApiService } from './services/api.service';
import { AutofocusDirective } from './directives/autofocus.directive';
import { AddTableComponent } from './dialog/add-table/add-table.component';
import { ControlLectureService } from './services/control-lecture.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './main/login/login.component';
import { RegisterComponent } from './main/register/register.component';
import { ErrorComponent } from './dialog/error/error.component';
// import {CdkMenuModule} from '@angular/cdk/menu'; 
@NgModule({
  declarations: [
    AppComponent,
    NavTreeComponent,
    MainComponent,
    AddSubtreeComponent,
    TableComponent,
    TdComponent,
    AddLectureComponent,
    CreateLectureComponent,
    LectureOptionsComponent,
    EditLectureComponent,
    TableTabsComponent,
    HeaderComponent,
    AutofocusDirective,
    AddTableComponent,
    LoginComponent,
    RegisterComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([{
      path: '',
      component: MainComponent,

    },
    { path: 'login', component: LoginComponent },{
      path:'register',component:RegisterComponent
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
    MatMenuModule,
    MatTabsModule,
    MatToolbarModule,
    MatSnackBarModule,
    CdkTreeModule,
    // MatAutocompleteModule,
    // MatDialogModule,
    // MatListModule,
    // MatRippleModule,
    DragDropModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [SoundService, DataService, KeyboardService, Final, ApiService, ControlLectureService],
  bootstrap: [AppComponent]
})
export class AppModule { }
