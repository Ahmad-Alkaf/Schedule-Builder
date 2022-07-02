import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private http: HttpClient, private router: Router, private api: ApiService) { }
  loading = false;
  form = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });
  errorMessage = '';
  async login() {
    if (this.form.valid) {
      this.loading = true;
      try {
        console.log('req body', this.form.value)
        if (await this.api.login(this.form.value) != '') {
          this.router.navigate(['/']);
          window.location.reload();
        }
      } catch (e:any) {
        this.errorMessage = typeof e == 'string' ? e : '';
      } finally {
        
        this.loading = false;
      }
    }
  }

}
