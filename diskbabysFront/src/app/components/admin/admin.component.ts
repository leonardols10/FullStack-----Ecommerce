import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserListCrudService } from 'src/app/services/user-list-crud.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users$:Observable<User[]>;

  constructor(
    private router: Router,
    private userListCrudService:UserListCrudService
    ) { }

  ngOnInit(): void {
    this.users$ = this.userListCrudService.fetchAll()
  }

  Logout(){
    sessionStorage.clear();
    this.router.navigate(['home']);
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
