import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { tap } from 'rxjs/operators';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit , AfterViewChecked {
  @Input() recipientId: number;
  @ViewChild('panel') panel: ElementRef<any>;
  newMessage: any = {};
  messages: Message[];
  hubConnection2: HubConnection;

  constructor(private authService: AuthService, private userService: UserService, private alertify: AlertifyService) { }
  ngAfterViewChecked(): void {
    this.panel.nativeElement.scrollTop = this.panel.nativeElement.scrollHeight;
   }
  ngOnInit() {
    this.loadMessages();
    this.hubConnection2 = new HubConnectionBuilder().withUrl("http://localhost:5000/chat").build();
    this.hubConnection2.start();
    this.authService.hubConnection.start();
    this.authService.hubConnection.on('refresh' , () => {
      
        this.loadMessages();
    });
  }
  loadMessages() {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getConversation(this.authService.decodedToken.nameid, this.recipientId).pipe(
      tap(messages => {
          for (const message of messages) {
            if(message.isRead === false && message.recipientId === currentUserId)
            { this.userService.markAsRead(currentUserId, message.id); } };
      })
    )
    .subscribe(
      messages => {
        this.messages = messages.reverse();
      },
      error => { this.alertify.error(error); },
      () => {
      setTimeout(() => {
          this.userService.getUnreadCount(this.authService.decodedToken.nameid).subscribe(result => {
            this.authService.unreadCount.next(result.toString());
            setTimeout(() => {
                           
              this.userService.getConversation(this.authService.decodedToken.nameid, this.recipientId).subscribe( messages=>this.messages=messages.reverse());
                              
              }, 3000);
             
                  });
                            
         }, 1000);
       
         }
    );
  }
  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage).subscribe(
      (message: Message) => {
        this.messages.push(message);
        this.newMessage.content = '';
        this.authService.hubConnection.invoke('refresh');
      },
      error => { this.alertify.error(error);},
      () => {
        setTimeout(() => {
        this.hubConnection2.invoke('count');
        this.userService.getConversation(this.authService.decodedToken.nameid, this.recipientId).subscribe(messages => {
           this.messages = messages.reverse();
          });
        }, 0);
      }
    );
    
  }
 
}
