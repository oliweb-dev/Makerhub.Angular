import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserLogin} from 'src/app/models/userLogin.model';
import {UserService} from 'src/app/services/user.service';

@Component({
   selector: 'app-login',
   templateUrl: './login.page.html',
})
export class LoginPage implements OnInit {
   fg!: FormGroup;

   constructor(
      private readonly userService: UserService,
      private readonly formBuilder: FormBuilder,
      private readonly router: Router
   ) {}

   ngOnInit() {
      this.fg = this.formBuilder.group({
         email: ['olivier@gmail.com', [Validators.required, Validators.email]],
         password: ['1234=', [Validators.required, Validators.minLength(1)]],
      });
   }

   onSubmit(): void {
      if (this.fg.invalid) {
         return;
      }
      const user: UserLogin = this.fg.value;
      this.userService.login(user).subscribe({
         next: _ => {
            this.router.navigate(['/user/home']);
         },
         error: _ => {},
      });
   }
}
