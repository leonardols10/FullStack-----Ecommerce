import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      if (currentUser && currentUser.role === 'admin') {
        return true;
      }

      this.router.navigate(['/login']);
      return false;
  }

}
