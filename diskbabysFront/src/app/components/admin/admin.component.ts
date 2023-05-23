import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { ProductCrudService } from 'src/app/services/product-crud.service';
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
  currentPage: string = 'listar-clientes';
  newProductForm: FormGroup;
  updateProductForm: FormGroup;

  constructor(
    private router: Router,
    private userListCrudService:UserListCrudService,
    private toastr: ToastrService,
    private productCrudService: ProductCrudService
    ) { }

  ngOnInit(): void {

    this.users$ = this.userListCrudService.fetchAll();
    console.log(this.users$)
    this.newProductForm = this.createProductFormGroup();
    this.updateProductForm = this.createUpdateProductFormGroup();

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
  createProductFormGroup():FormGroup{
    return new FormGroup({
      product_name: new FormControl("",[Validators.required]),
      description: new FormControl("",[Validators.required]),
      price: new FormControl("",[Validators.required]),
      picture: new FormControl("",[Validators.required])

    });
  }

  createUpdateProductFormGroup():FormGroup{
    return new FormGroup({
      pid: new FormControl("",[Validators.required]),
      product_name: new FormControl("",[Validators.required]),
      description: new FormControl("",[Validators.required]),
      price: new FormControl("",[Validators.required]),
      picture: new FormControl("",[Validators.required])

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

  changePage(page: string) {
    this.currentPage = page;

    if (page === 'listar-clientes') {
      this.currentPage = 'listar-clientes'
    } else if (page === 'listar-pedidos') {
      this.currentPage = 'listar-pedidos'

    } else if (page === 'atualizar-produto') {
      this.currentPage = 'atualizar-produto'

    } else if (page === 'adicionar-produto') {
      this.currentPage = 'adicionar-produto'

    }
    console.log(this.currentPage)
  }


  postProduct() {
    let inpOne = this.newProductForm.controls['product_name'].value.trim();
    let inpTwo = this.newProductForm.controls['description'].value.trim();
    let inpFour = this.newProductForm.controls['price'].value;
    let inpFile = this.newProductForm.controls['picture'].value;

    this.productCrudService.postProduct(this.newProductForm.value).subscribe(
      (response) => {
        if (response.status) {
          this.toastr.success(response.message, 'Sucesso');
        } else {
          this.toastr.error(response.message, 'Erro');
        }
      },
      (error) => {
        this.toastr.error('Erro interno no servidor', 'Erro');
        console.error(error);
      }
    );
  }


  public onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.newProductForm.patchValue({
          picture: reader.result
        });
      };
    }
  }

}
