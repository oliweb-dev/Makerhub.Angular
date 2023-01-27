import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {userRegister} from 'src/app/models/userRegister.model';
import {ToastService} from 'src/app/services/toast.service';
import {UserService} from 'src/app/services/user.service';

@Component({
   selector: 'app-register',
   templateUrl: './register.page.html',
})
export class RegisterPage implements OnInit {
   fg!: FormGroup;

   constructor(
      private readonly userService: UserService,
      private readonly formBuilder: FormBuilder,
      private readonly _router: Router,
      private readonly _toastService: ToastService
   ) {}

   ngOnInit() {
      this.initForm();
   }

   initForm(): void {
      this.fg = this.formBuilder.group({
         firstname: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
         lastname: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
         email: [null, [Validators.required, Validators.email]],
         pseudo: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
         password: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
         confirmpassword: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(100)]],
      });
   }

   get firstname() {
      return this.fg.get('firstname');
   }
   get lastname() {
      return this.fg.get('lastname');
   }

   get email() {
      return this.fg.get('email');
   }

   get pseudo() {
      return this.fg.get('pseudo');
   }

   get password() {
      return this.fg.get('password');
   }

   get confirmpassword() {
      return this.fg.get('confirmpassword');
   }

   onSubmit(): void {
      if (this.fg.invalid) {
         return;
      }
      const user: userRegister = this.fg.value;
      console.log(user);
      this.userService.register(user).subscribe({
         next: _ => {
            this._toastService.display('Félicitation pour votre inscription!', 'checkmark');
            this._router.navigate(['login/']);
         },
         error: _ => {},
      });
   }
}
