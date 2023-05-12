import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { UserListCrudService } from 'src/app/services/user-list-crud.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user$: Observable<User[]>;
  test$: User;
  test2$: User[];
  loginForm: FormGroup;
  div1: boolean = false;

  constructor(private userListCrudService: UserListCrudService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loginForm = this.formLogin();
  }

  formLogin(): FormGroup {
    return new FormGroup({
      email: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
    });
  }

  async checkUser(): Promise<void> {
    const inpOne = this.loginForm.controls['email'].value.trim();
    const inpTwo = this.loginForm.controls['password'].value.trim();
    if (!inpOne || !inpTwo) {
      return;
    }
    try {
      const response = await this.userListCrudService.checkUser(inpOne, inpTwo).toPromise();
      const user = response.user;
      const token = response.token;
      console.log(response)
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      sessionStorage.setItem('token', token);
      this.toastr.success('Login realizado com sucesso !');

      if (user.role.toLowerCase() == 'admin') {
        this.div1 = false;
        this.router.navigate(['admin']);
      } else {
        this.div1 = false;
        this.router.navigate(['cliente']);
      }}
      catch (error) {
      console.log('Invalid credentials', error);
      this.toastr.error('Credenciais invalidas');
    }
  }
}
