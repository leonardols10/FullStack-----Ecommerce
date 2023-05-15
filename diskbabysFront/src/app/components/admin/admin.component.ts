import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserListCrudService } from 'src/app/services/user-list-crud.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  updateUserForm: FormGroup;
  showModal: boolean = false;
  users$:Observable<User[]>;

  constructor(
    private router: Router,
    private userListCrudService:UserListCrudService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {

    this.users$ = this.userListCrudService.fetchAll();
    console.log(this.users$)

  }

  createFormGroup(user): FormGroup {
    return new FormGroup({
      id: new FormControl({ value: user.id, disabled: false }, [Validators.required]),
      email: new FormControl({ value: user.email, disabled: false }, [Validators.required, Validators.email]),
      password: new FormControl(user.password, [Validators.required]),
      role: new FormControl(user.role, [Validators.required]),
      picture: new FormControl(user.picture, [Validators.required]),
      phone: new FormControl(user.phone, [Validators.required]),
      address: new FormControl(user.address, [Validators.required]),
      name: new FormControl(user.name, [Validators.required])
    });
  }

  update(userPut: User): void {
    this.updateUserForm = this.createFormGroup(userPut);
    this.showModal = true;
  }

  updateBase(): void {
    console.log(this.updateUserForm.value);
    var user = {
      id: this.updateUserForm.controls['id'].value,
      email: this.updateUserForm.controls['email'].value,
      password: this.updateUserForm.controls['password'].value,
      role: this.updateUserForm.controls['role'].value,
      picture: this.updateUserForm.controls['picture'].value,
      name: this.updateUserForm.controls['name'].value,
      address: this.updateUserForm.controls['address'].value,
      phone: this.updateUserForm.controls['phone'].value,
      token: 'token_value'
    }
    this.userListCrudService.update(user).subscribe(
      response => {
        console.log(response.status);
        if (response && response.status === true) {
          this.toastr.success('Dados atualizados com sucesso!', 'Sucesso');
          window.location.reload();
          } else if (response && response.status === false) {
          this.toastr.error(response.message || 'Erro ao atualizar cadastro. Por favor, tente novamente mais tarde.', 'Erro');
          console.log("Erro ao atualizar cadastro: " + response.message);
        } else {
          this.toastr.error('Erro ao atualizar cadastro. Por favor, tente novamente mais tarde.', 'Erro');
        }
      },
      error => {
        console.error(error);
        if (error && error.error && error.error.message) {
          this.toastr.error(error.error.message, 'Erro');
        } else {
          this.toastr.error('Erro ao atualizar cadastro. Por favor, tente novamente mais tarde.', 'Erro');
        }
      }
    );
  }



  Logout(){
    sessionStorage.clear();
    this.router.navigate(['home']);
    this.toastr.success(' Logout  realizado com sucesso');
  }

  delete(id:number):void{
    this.userListCrudService.delete(id).subscribe();
    var loggedInUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if(loggedInUser.id==id){
      sessionStorage.removeItem('currentUser');
      this.router.navigate([""]);
    }
    else{
      window.location.reload();
    }

  }
}
