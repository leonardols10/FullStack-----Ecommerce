import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { UserListCrudService } from 'src/app/services/user-list-crud.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private userListCrudService:UserListCrudService,private router: Router,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.checkCurrentUser();
    this.registerForm = this.registerFormGroup();
  }

  registerFormGroup():FormGroup{
    return new FormGroup({
      email: new FormControl("",[Validators.required]),
      password: new FormControl("",[Validators.required]),
      reenterPassword: new FormControl("",[Validators.required]),
      name: new FormControl("",[Validators.required]),
      phone: new FormControl("",[Validators.required]),
      address: new FormControl("",[Validators.required]),
      role: new FormControl("user")
    });
  }

  checkCurrentUser(): void {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser) as User;

      if (user.role.toLowerCase() === 'admin') {
        this.div1 = false;
        this.router.navigate(['admin']);
      } else {
        this.div1 = false;
        this.router.navigate(['cliente']);
      }
    }
  }

  div1:boolean=false;
  post(): void {
    const inpOne = this.registerForm.controls['email'].value.trim();
    const inpTwo = this.registerForm.controls['password'].value.trim();
    const inpThree = this.registerForm.controls['reenterPassword'].value.trim();
    this.registerForm.controls['role'].setValue("user");

    if (this.registerForm.valid) {
      if (!inpOne || !inpTwo || !inpThree) {
        return;
      }
      if (this.registerForm.controls['password'].value == this.registerForm.controls['reenterPassword'].value) {
        this.userListCrudService.post(this.registerForm.value).subscribe(
          response => {
            console.log(response.status);
            if (response && response.status === true) {
              this.toastr.success('Cadastro criado com sucesso!');
              this.router.navigate(['login']);
            } else if (response && response.status === false) {
              this.toastr.error(response.message || 'Erro ao criar cadastro. Por favor, tente novamente mais tarde.', 'Erro');
              console.log("Erro ao criar cadastro: " + response.message);
            } else {
              this.toastr.error('Erro ao criar cadastro. Por favor, tente novamente mais tarde.', 'Erro');
            }
          },
          error => {
            console.error(error);
            if (error && error.error && error.error.message) {
              this.toastr.error(error.error.message, 'Erro');
            } else {
              this.toastr.error('Erro ao criar cadastro. Por favor, tente novamente mais tarde.', 'Erro');
            }
          }
        );
      } else {
        this.toastr.error('Formulário inválido.');
        this.div1 = true;
        console.log(this.registerForm.value);
      }
    } else {
      console.log('Formulário inválido');
      this.toastr.error('Cadastro inválido. Preencha corretamente todos os campos.', 'Erro');
    }
  }




}
