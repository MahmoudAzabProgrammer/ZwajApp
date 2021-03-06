import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/Message';
import { Pagination, PaginationResult } from '../_models/Pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageType = 'Unread';
  constructor(private userService:UserService,private authService:AuthService,private route:ActivatedRoute,private alertify:AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(
      data=>{
        this.messages = data['messages'].result;
        this.pagination = data['messages'].pagination;
      }
    )
  }
  loadMessages(){
    this.userService.getMessages(this.authService.decodedToken.nameid,this.pagination.currentPage,this.pagination.itemsPerPage,this.messageType).subscribe(
      (paginationResult:PaginationResult<Message[]>)=>{
        this.messages = paginationResult.result;
        this.pagination = paginationResult.pagination;
      },
      error=>this.alertify.error(error)
    )
  }

  pageChanged(event: any): void{
    this.pagination.currentPage= event.page;
    this.loadMessages();
  }
  deleteMessage(id: number) {
    this.alertify.confirm('هل انت متاكد من حذف هذه الرساله ', () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(
      () => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        this.alertify.success('تم خذف الرساله بنجاح');
    },
    error => this.alertify.error(error)
    );
  });
  
  }
}
