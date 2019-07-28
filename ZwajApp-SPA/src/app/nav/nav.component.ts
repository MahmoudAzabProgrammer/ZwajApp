import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;
  count: string;
  hubConnection: HubConnection;

  constructor(public authService: AuthService, private userService: UserService, private alertify: AlertifyService , private router: Router) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(
      photoUrl => this.photoUrl = photoUrl
    );
    this.userService.getUnreadCount(this.authService.decodedToken.nameid).subscribe(
      result => { this.authService.unreadCount.next(result.toString());
      this.authService.latestUnreadCount.subscribe(
        result => { this.count = result;}
      );
      }
    );
    this.hubConnection = new HubConnectionBuilder().withUrl("http://localhost:5000/chat").build();
    this.hubConnection.start();
    this.hubConnection.on('count', () => {
      setTimeout(() => {
            this.userService.getUnreadCount(this.authService.decodedToken.nameid).subscribe(result => {
              this.authService.unreadCount.next(result.toString());
              this.authService.latestUnreadCount.subscribe(result => { this.count = result; });
                   });
          }, 0);
  });
  }

  login() {
    this.authService.login(this.model).subscribe(
      next => { this.alertify.success('تم الدخول بنجاح' );
      this.userService.getUnreadCount(this.authService.decodedToken.nameid).subscribe(result => {
      this.authService.unreadCount.next(result.toString());
      this.authService.latestUnreadCount.subscribe(result =>{ this.count = result; });
             });	},
      
      error => { this.alertify.error(error) },
      () => { this.router.navigate(['/members']); }
      )
  }
  loggedIn(){
    return this.authService.loggedIn();

    
  }
  loggedOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
   this.alertify.message('تم الخروج');
   this.router.navigate(['']);
  }
}
