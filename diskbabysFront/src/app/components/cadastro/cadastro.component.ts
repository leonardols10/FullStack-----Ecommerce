import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserListCrudService } from 'src/app/services/user-list-crud.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private userListCrudService:UserListCrudService,private router: Router) { }

  ngOnInit(): void {
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

  div1:boolean=false;
  post():void{
    const inpOne = this.registerForm.controls['email'].value.trim()
    const inpTwo = this.registerForm.controls['password'].value.trim()
    const inpThree = this.registerForm.controls['reenterPassword'].value.trim()
    this.registerForm.controls['role'].setValue("user");
    console.log(this.registerForm.value)

    if (this.registerForm.valid) {
      console.log('Formulário válido');
      if(!inpOne || !inpTwo || !inpThree){
        return;
      }
      if(this.registerForm.controls['password'].value ==  this.registerForm.controls['reenterPassword'].value){
        console.log("ok")
        this.registerForm.removeControl('reenterPassword');
        console.log(this.registerForm.value);
        this.userListCrudService.post(this.registerForm.value).subscribe();
        //toast de criado com sucesso
        this.router.navigate(['login']);
      }
      else{
        this.div1=true;
        console.log("Invalid Inputs! Try Again!");
        console.log(this.registerForm.value);
      }
    } else {
      console.log('Formulário inválido');
      //toast de dados invalidos/ campos faltantes
    }



  }

}
