import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@service/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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
  register() {
    if (this.form.valid) {
      this.loading = true;
      this.api.register(this.form.value)
        .then(() => window.location.href = '/')
        .catch((e) => { console.error({source:'catch in register in registerComponent'},e); this.serverResponse = typeof e == 'string'?e:(e.message || 'Something went wrong! Try again later...' )})
        .finally(() => { this.loading = false;  })
    
    }
  }

}
