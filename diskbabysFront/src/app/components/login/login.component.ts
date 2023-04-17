import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { UserListCrudService } from 'src/app/services/user-list-crud.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user$:Observable<User[]>;
  test$:User;
  test2$:User[];
  loginForm: FormGroup;


  constructor(private userListCrudService:UserListCrudService,private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formLogin();
    this.user$ = null;
  }


  formLogin():FormGroup{
    return new FormGroup({
      email: new FormControl("",[Validators.required]),
      password: new FormControl("",[Validators.required]),
    });
  }

  div1:boolean=false;

  async checkUser(): Promise<void> {
    const inpOne = this.loginForm.controls['email'].value.trim();
    const inpTwo = this.loginForm.controls['password'].value.trim();
    if (!inpOne || !inpTwo) {
      return;
    }
    console.log(this.loginForm.value);
    console.log(inpOne);
    console.log(inpTwo);
    try {
      const user = await this.userListCrudService.checkUser(inpOne, inpTwo).pipe(
        switchMap((users) => {
          if (users.length > 0) {
            return of(users[0]);
          } else {
            throw new Error('Invalid credentials');
          }
        })
      ).toPromise();

      sessionStorage.setItem('currentUser', JSON.stringify(user));

      if (user.role.toLowerCase() == 'admin') {
        this.div1 = false;
        this.router.navigate(['admin']);
      } else {
        this.div1 = false;
        this.router.navigate(['cliente']);
      }
    } catch (error) {
      this.div1 = true;
      console.log('Invalid credentials', error);
    }
  }



}
