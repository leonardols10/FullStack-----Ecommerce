import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserListCrudService {

  private url = "http://localhost:3000/all";
  private urltwo = "http://localhost:3000/register";
  private urlput = "http://localhost:3000/user";

  httpOptions: {headers: HttpHeaders} = {
    headers: new HttpHeaders({"Content-Type": "application/json"})
  };

  constructor(private http: HttpClient) { }

  fetchAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url, {responseType:"json"});//.pipe(tap((_)=>console.log("fetched users")));
  }

  checkUser(email: string, password: string): Observable<{ user: User, token: string }> {
    const urllogin = `http://localhost:3000/login`;
    const body = { email, password };
    return this.http.post<{user: User, token: string}>(urllogin, body, {responseType: 'json'});
  }



  post(user: Omit<User, "id">): Observable<{ status: boolean, message: string }> {
    return this.http.post<{ status: boolean, message: string }>(this.urltwo, user, this.httpOptions).pipe(first());
  }


  update(user: User): Observable<{ status: boolean, message: string }>{
    return this.http.put<{ status: boolean, message: string }>(this.urlput,user,this.httpOptions).pipe(first());
  }

  delete(id:number):Observable<any>{
    const urlthree = `http://localhost:3000/user/${id}`;
    return this.http.delete<User>(urlthree,this.httpOptions);
  }
}
