import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavTreeComponent } from './pages/main/nav-tree/nav-tree.component';
import { MainComponent } from './pages/main/main.component';
import { AddSubtreeComponent } from './dialog/add-subtree/add-subtree.component';
import { TableComponent } from './pages/main/table/table.component';
import { TdComponent } from './pages/main/table/td/td.component';
import { SoundService } from './services/sound.service';
import { AddLectureComponent } from './dialog/add-lecture/add-lecture.component';
import { CreateLectureComponent } from './pages/main/created-lecture/created-lecture.component';
import { LectureOptionsComponent } from './dialog/lecture-options/lecture-options.component';
import { DataService } from './services/data.service';
import { KeyboardService } from './services/keyboard.service';
import { Final } from './pages/main/table/utility/static';
// import { Table } from './main/main/table/utility/tableBinder';
import { EditLectureComponent } from './dialog/edit-lecture/edit-lecture.component';
import { TableTabsComponent } from './pages/main/table/table-tabs/table-tabs.component';
import { HeaderComponent } from './pages/header/header.component';
import { ApiService } from './services/api.service';
import { AutofocusDirective } from './directives/autofocus.directive';
import { AddTableComponent } from './dialog/add-table/add-table.component';
import { ControlLectureService } from './services/control-lecture.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ErrorComponent } from './dialog/error/error.component'; 
import { AngularMaterialsModule } from './modules/angular-materials.module';
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
    AngularMaterialsModule,
    RouterModule.forRoot([{
      path: '',
      component: MainComponent,

    },
    { path: 'login', component: LoginComponent },{
      path:'register',component:RegisterComponent
    }]),
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [SoundService, DataService, KeyboardService, Final, ApiService, ControlLectureService],
  bootstrap: [AppComponent]
})
export class AppModule { }
