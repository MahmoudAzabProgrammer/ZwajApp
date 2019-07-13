import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class MemberListResolver  implements Resolve<User[]>{
    constructor(private userService: UserService , private route: Router , private alerify: AlertifyService){}

    resolve(route: ActivatedRouteSnapshot): Observable<User[]>{
        return this.userService.getUsers().pipe(
            catchError(error => {
                this.alerify.error('يوجد مشكله فى عرض البيانات');
                this.route.navigate(['']);
                return of(null);
            })
        )
         
        }
    }
        
    