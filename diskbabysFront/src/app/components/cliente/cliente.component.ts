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
    //this.userName();
    this.profilePicture = this.loggedInUser$.picture;
  }
  teste(){
    console.log(this.loggedInUser$)

  }
  salvarDados() {
    // Aqui você pode adicionar a lógica para enviar os dados atualizados para o servidor
    // Por exemplo, fazer uma requisição HTTP para salvar os dados

    // Após salvar os dados, você pode fechar o modal
  }


  createFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl({ value: this.loggedInUser$.id, disabled: true }, [Validators.required]),
      email: new FormControl({ value: this.loggedInUser$.email, disabled: false }, [Validators.required]),
      password: new FormControl(this.loggedInUser$.password, [Validators.required]),
      role: new FormControl(this.loggedInUser$.role, [Validators.required]),
      picture: new FormControl("", [Validators.required]),
      phone: new FormControl(this.loggedInUser$.phone, [Validators.required]),
      address: new FormControl(this.loggedInUser$.address, [Validators.required]),
      name: new FormControl(this.loggedInUser$.name, [Validators.required])
    });
  }

  deleteSessionUserInfo(): void {
    sessionStorage.removeItem('currentUser');
  }

  displayPerson(): void {
    console.log(this.loggedInUser$);
    let myContainer = document.getElementById('last') as HTMLElement;
    myContainer.innerHTML = "hello";
  }

  userName(): void {
    console.log(this.loggedInUser$);
    let myContainer2 = document.getElementById('hiName') as HTMLElement;
    myContainer2.innerHTML = "Hello <b>" + this.loggedInUser$.email + "</b> !!!";
  }

  delete(): void {
    this.userListCrudService.delete(this.loggedInUser$.id).subscribe();
    sessionStorage.clear;
    this.router.navigate([""]);
    this.toastr.success('Conta deletada com sucesso');
  }

  update(): void {
    console.log(this.updateUserForm.value);
    var user = {
      id: this.loggedInUser$.id,
      email: this.loggedInUser$.email,
      password: this.updateUserForm.controls['password'].value,
      role: this.loggedInUser$.role,
      picture: this.profilePicture,
      name: this.loggedInUser$.name,
      address: this.loggedInUser$.address,
      phone: this.loggedInUser$.phone,
      token: 'token_value'
    }
    this.userListCrudService.update(user).subscribe(
      (response) => {
        // Atualização bem-sucedida
        this.toastr.success('Dados atualizados com sucesso!', 'Sucesso');
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        window.location.reload();
      },
      (error) => {
        // Ocorreu um erro na atualização
        this.toastr.error('Ocorreu um erro ao atualizar os dados.', 'Erro');
      }
    );
    }

  showDetails: boolean = false;
  showUserDetailfunc(): void {
    if (this.showDetails == false) {
      this.showDetails = true;
    }
    else {
      this.showDetails = false;
    }
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
