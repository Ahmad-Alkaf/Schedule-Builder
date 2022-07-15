import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {


 constructor(private api:ApiService,private dataService:DataService,private snackbar:MatSnackBar){}
  
  loading = false;
  saveAll() {
    this.loading = true;
    this.api.SaveAll(this.dataService.tables,
      this.dataService.newLecContainer,
      this.dataService.teachers,
      this.dataService.rooms,
      this.dataService.subjects)
      .then(() => this.snackbar.open('Saved', undefined, { duration: 800 }))
    .catch(()=>this.snackbar.open("Error while saving. Please try again later",undefined,{duration:1500}))
    .finally(()=>this.loading=false)
  }

}
