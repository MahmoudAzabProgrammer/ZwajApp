import { User } from '../_models/User';
import { Injectable } from '@angular/core';
import { Resolve, Router,  ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class MemberDetailResolver  implements Resolve<User>{
    constructor(private userService: UserService , private router: Router , private alerify: AlertifyService){}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(route.params['id']).pipe(
            catchError(error => {
                this.alerify.error('يوجد مشكله فى عرض البيانات');
                this.router.navigate(['/members']);
                return of(null);
            })
        )
         
        }
    }
        
    