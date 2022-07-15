import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavTreeComponent } from 'src/app/pages/main/nav-tree/nav-tree.component';
import { MainComponent } from 'src/app/pages/main/main.component';
import { TableComponent } from 'src/app/pages/main/table-view/table/table.component' 
import { TdComponent } from 'src/app/pages/main/table-view/table/td/td.component';
import { SoundService } from './services/sound.service';
import { AddLectureComponent } from './dialog/add-lecture/add-lecture.component';
import { CreateLectureComponent } from 'src/app/pages/main/created-lectures/created-lecture.component';
import { LectureOptionsComponent } from './dialog/lecture-options/lecture-options.component';
import { DataService } from './services/data.service';
import { KeyboardService } from './services/keyboard.service';
import { Final } from 'src/app/services/static';
// import { Table } from './main/main/table/utility/tableBinder';
import { EditLectureComponent } from './dialog/edit-lecture/edit-lecture.component';
import { TableTabsComponent } from 'src/app/pages/main/table-view/table-tabs/table-tabs.component';
import { HeaderComponent } from 'src/app/pages/header/header.component';
import { ApiService } from 'src/app/services/api.service';
import { AutofocusDirective } from './directives/autofocus.directive';
import { AddTableComponent } from './dialog/add-table/add-table.component';
import { ControlLectureService } from './services/control-lecture.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ErrorComponent } from './dialog/error-msg/error.component'; 
import { AngularMaterialsModule } from './modules/angular-materials.module';
@NgModule({
  declarations: [
    AppComponent,
    NavTreeComponent,
    MainComponent,
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
