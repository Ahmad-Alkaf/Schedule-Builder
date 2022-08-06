import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavTreeComponent } from '@main/nav-tree/nav-tree.component';
import { MainComponent } from '@main/main.component';
import { TableComponent } from '@main/table-view/table/table.component'
import { TdComponent } from '@main/table-view/table/td/td.component';
import { SoundService } from '@service/sound.service';
import { AddLectureComponent } from '@dialog/add-lecture/add-lecture.component';
import { CreateLectureComponent } from '@main/created-lectures/created-lecture.component';
import { LectureOptionsComponent } from '@dialog/lecture-options/lecture-options.component';
import { DataService } from '@service/data.service';
import { KeyboardService } from '@service/keyboard.service';
import { Final } from '@service/static';
// import { Table } from './main/main/table/utility/tableBinder';
import { EditLectureComponent } from '@dialog/edit-lecture/edit-lecture.component';
import { TableTabsComponent } from '@main/table-view/table-tabs/table-tabs.component';
import { HeaderComponent } from 'src/app/pages/header/header.component';
import { ApiService } from '@service/api.service';
import { AutofocusDirective } from './directives/autofocus.directive';
import { AddTableComponent } from '@dialog/add-table/add-table.component';
import { ControlLectureService } from '@service/control-lecture.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ErrorComponent } from '@dialog/error-msg/error.component';
import { AngularMaterialsModule } from './modules/angular-materials.module';
import { OptionsComponent } from './pages/main/table-view/options/options.component';
import { EditTableComponent } from './dialog/edit-table/edit-table.component';
import { PromptComponent } from './dialog/prompt/prompt.component';
import { ThemeComponent } from './pages/header/theme/theme.component';
import { GenLecturesComponent } from './dialog/gen-lectures/gen-lectures.component';
import { AppRoutingModule } from './modules/app-routing.module';






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
    ErrorComponent,
    OptionsComponent,
    EditTableComponent,
    PromptComponent,
    ThemeComponent,
    GenLecturesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AngularMaterialsModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [SoundService, DataService, KeyboardService, Final, ApiService, ControlLectureService],
  bootstrap: [AppComponent]
})
export class AppModule { }
