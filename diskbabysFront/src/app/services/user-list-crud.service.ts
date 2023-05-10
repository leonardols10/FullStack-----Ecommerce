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

  checkUser(email: string, password: string): Observable<User> {
    const urllogin = `http://localhost:3000/login`;
    const body = { email, password };
    return this.http.post<User>(urllogin, body, {responseType: 'json'});
  }



  post(user: Omit<User, "id">): Observable<User>{
    return this.http.post<User>(this.urltwo,user,this.httpOptions).pipe(first());
  }

  update(user: User): Observable<User>{
    return this.http.put<User>(this.urlput,user,this.httpOptions).pipe(first());
  }

  delete(id:number):Observable<any>{
    const urlthree = `http://localhost:3000/user/${id}`;
    return this.http.delete<User>(urlthree,this.httpOptions);
  }
}
