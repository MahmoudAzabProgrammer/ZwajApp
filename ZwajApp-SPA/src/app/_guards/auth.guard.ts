import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService , private router: Router , private alertify: AlertifyService) {}
  canActivate(): boolean {
    if(this.authService.loggedIn()) {
      return true;
    }
    else{
    this.alertify.error('يجب التسجيل الدخول اولا');
    this.router.navigate(['/home']);
    return false;
  }
    //next: ActivatedRouteSnapshot,
    //state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {}
    
  }
}
