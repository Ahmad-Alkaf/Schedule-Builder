import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@service/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router, private api: ApiService) { 
  }
  ngOnInit(): void {

  }
  loading = false;
  form = new UntypedFormGroup({
    username: new UntypedFormControl(null, [Validators.required,Validators.minLength(6),Validators.maxLength(32)]),
    password: new UntypedFormControl(null, [Validators.required,Validators.minLength(4),Validators.maxLength(32)]),
  });
  errorMessage = '';
  async login() {
    if (this.form.valid) {
      this.loading = true;
      try {
        console.log('req body', this.form.value)
        if (await this.api.login(this.form.value) != '') {
          window.location.href = '/';
        }
      } catch (e: any) {
        console.log(e)
        this.errorMessage = typeof e == 'string' ? e:(typeof e.message == 'string'?e.message: 'Something went wrong! Try again later...');
      } finally {
        
        this.loading = false;
      }
    }
  }

}
