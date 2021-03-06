import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { User } from '../../_models/User';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginationResult } from 'src/app/_models/Pagination';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{ value: 'رجل' , display: 'رجال' } , { value: 'إمرأة' , display: 'نساء' } ];
  userParams: any = {};
  pagination: Pagination;
  search: boolean = false;
  constructor(public authService: AuthService, private userService: UserService , private alerify: AlertifyService , private route: ActivatedRoute) { }

  ngOnInit() {
    this.search = false;
    this.authService.lang.subscribe(
      lang=>{
        if(lang == 'en'){
          this.genderList =[{value: 'رجل', display: 'Males'},{value: 'إمرأة', display: 'Females'}];
        }else{
          this.genderList =[{value: 'رجل', display: 'رجال'},{value: 'إمرأة', display: 'نساء'}];
        }
      }
    );
   this.route.data.subscribe(
     data => { 
       this.users = data['users'].result;
       this.pagination = data['users'].pagination;
      });
      this.userParams.gender = this.user.gender === 'رجل' ? 'إمرأة' : 'رجل';
      this.userParams.minAge = 18;
      this.userParams.maxAge = 99;
      this.userParams.orderBy = 'lastActive';
      
  }
  resetFilter(){
    this.userParams.gender = this.user.gender === 'رجل' ? 'إمرأة' : 'رجل';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
    this.loadUsers();
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    if(!this.search) {
      this.pagination.currentPage = 1;
    }
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams).subscribe(
      (paginationResult: PaginationResult<User[]>) => {
        this.users = paginationResult.result;
        this.pagination = paginationResult.pagination;
      },
      error => this.alerify.error(error)
      );
    }

}
