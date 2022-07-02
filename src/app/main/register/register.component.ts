import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent  {

  constructor(private api:ApiService,private router:Router) { }
  loading = false;
  form = new FormGroup({
    username: new FormControl(null, [Validators.required,Validators.minLength(6),Validators.maxLength(32)]),
    password: new FormControl(null, [Validators.required,Validators.minLength(4),Validators.maxLength(32)]),
    email:new FormControl(null,[Validators.required,Validators.email])
  }) 
  serverResponse = '';
  async register() {
    if (this.form.valid) {
      this.loading = true;
      await this.api.register(this.form.value)
        .then(() => this.router.navigate(['/']))
        .catch((e) => { this.serverResponse = e.message || 'Something Went Wrong in server' })
        .finally(() => { this.loading = false;  })
    
    }
  }

}
