import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { UserListCrudService } from 'src/app/services/user-list-crud.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {
  loggedInUser$: User;
  updateUserForm: FormGroup;
  profilePicture: string;
  currUser$: User;

  constructor(private userListCrudService: UserListCrudService, private router: Router,private toastr: ToastrService) {
    this.currUser$ = JSON.parse(sessionStorage.getItem('currentUser'));
    this.profilePicture = this.currUser$.picture;
  }

  ngOnInit(): void {
    this.loggedInUser$ = JSON.parse(sessionStorage.getItem('currentUser'));
    this.updateUserForm = this.createFormGroup();
    this.profilePicture = this.loggedInUser$.picture;
  }


  createFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl({ value: this.loggedInUser$.id, disabled: true }, [Validators.required]),
      email: new FormControl({ value: this.loggedInUser$.email, disabled: false }, [Validators.required, Validators.email]),
      password: new FormControl(this.loggedInUser$.password, [Validators.required]),
      role: new FormControl(this.loggedInUser$.role, [Validators.required]),
      picture: new FormControl("", [Validators.required]),
      phone: new FormControl(this.loggedInUser$.phone, [Validators.required]),
      address: new FormControl(this.loggedInUser$.address, [Validators.required]),
      name: new FormControl(this.loggedInUser$.name, [Validators.required])
    });
  }

  delete(): void {
    this.userListCrudService.delete(this.loggedInUser$.id).subscribe(
      response => {
        if (response && response.status === true) {
          this.toastr.success('Conta deletada com sucesso');
          sessionStorage.clear();
          this.router.navigate([""]);
        } else {
          this.toastr.error(response.message || 'Erro ao excluir usuário. Por favor, tente novamente mais tarde.', 'Erro');
        }
      },
      error => {
        console.error(error);
        this.toastr.error('Erro ao excluir usuário. Por favor, tente novamente mais tarde.', 'Erro');
      }
    );
  }


  update(): void {
    console.log(this.updateUserForm.value);
    var user = {
      id: this.loggedInUser$.id,
      email: this.updateUserForm.controls['email'].value,
      password: this.updateUserForm.controls['password'].value,
      role: this.loggedInUser$.role,
      picture: this.profilePicture,
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
          sessionStorage.setItem('currentUser', JSON.stringify(user));
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


  public onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.updateUserForm.patchValue({
          picture: reader.result
        });
        this.profilePicture = this.updateUserForm.controls['picture'].value;
      };
    }
  }

}
