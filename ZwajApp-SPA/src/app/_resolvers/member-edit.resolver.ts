import { User } from '../_models/User';
import { Injectable } from '@angular/core';
import { Resolve, Router,  ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()

export class MemberEditResolver  implements Resolve<User>{
    constructor(private userService: UserService , private router: Router , private alerify: AlertifyService , private authService: AuthService){}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                this.alerify.error('يوجد مشكله فى عرض البيانات');
                this.router.navigate(['/members']);
                return of(null);
            })
        )
         
        }
    }
        
    