import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, ControlContainer, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { arLocale } from 'ngx-bootstrap/locale';
import { User } from '../_models/User';
import { Router } from '@angular/router';
defineLocale('ar', arLocale);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

 @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  locale = 'ar';

  constructor(private authService: AuthService , private alertify: AlertifyService , private formBuilder: FormBuilder
     , private bsLocalService: BsLocaleService , private route: Router) {
    this.bsLocalService.use(this.locale);
   }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red',
      showWeekNumbers: false,
    }
    this.CreateRegisterForm();
    
  }
  CreateRegisterForm() {
    this.registerForm = this.formBuilder.group({
      gender: ['رجل', Validators.required],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
    },
    { Validators: this.PasswordMatchValidator}
    );
  }
  PasswordMatchValidator(form: FormGroup){
    return form.get('password').value === form.get('confirmPassword').value ? null : {'mismatch': true};
  }
  
  register() {
    if(this.registerForm.valid){
      this.user = Object.assign({}, this.registerForm.value);
      console.log('تم الاشتراك معانا');
      console.log(this.user);
      this.authService.register(this.user).subscribe(
      () => {this.alertify.success('تم الاشتراك بنجاح') },
      error => { this.alertify.error(error) },
      () => { this.authService.login(this.user).subscribe(
        () => { this.route.navigate(['/members']); }
      ); }
      );
    }
   
  }
  cancel() {
    this.alertify.message('ليس الان');
    console.log(this.user);
    this.cancelRegister.emit(false);
  }
 

}
