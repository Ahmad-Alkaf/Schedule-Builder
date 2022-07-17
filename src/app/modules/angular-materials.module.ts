import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRadioModule } from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTreeModule } from '@angular/cdk/tree';

const MatArr: any = [
  MatButtonModule,
  MatTreeModule,
  MatSidenavModule,
  DragDropModule,
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
  MatRadioModule,
  MatSlideToggleModule
]

@NgModule({
  exports: [MatArr],
  imports: [MatArr]
})
export class AngularMaterialsModule { }
