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
  canActivate(next: ActivatedRouteSnapshot): boolean {
    const roles = next.firstChild.data['roles'] as Array<String>;
    if(roles){
      const match = this.authService.roleMatch(roles);
      if(match){
        return true;
      }else{
        this.router.navigate(['members']);
      }
    }
    if(this.authService.loggedIn()) {
        this.authService.hubConnection.stop();
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
