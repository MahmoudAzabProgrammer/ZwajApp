import { Component, OnInit } from '@angular/core';
import { Pagination, PaginationResult } from '../_models/Pagination';
import { User } from '../_models/User';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likeParam: string;
  search: boolean = false;
  constructor(public authService: AuthService, private userService: UserService , private alertify: AlertifyService , private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
         this.users = data['users'].result;
         this.pagination = data['users'].pagination;
        }
    );
    this.likeParam = 'Likers';
  }

  loadUsers() {
    if(!this.search) {
      this.pagination.currentPage = 1;
    }
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likeParam).subscribe(
      (paginationResult: PaginationResult<User[]>) => {
        this.users = paginationResult.result;
        this.pagination = paginationResult.pagination;
      },
      error => this.alertify.error(error)
      );
    }
    pageChanged(event: any): void {
      this.pagination.currentPage = event.page;
      this.loadUsers();
    }

}
