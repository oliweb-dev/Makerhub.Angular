import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserChangePassword} from 'src/app/models/userChangePassword';
import {ToastService} from 'src/app/services/toast.service';
import {UserService} from 'src/app/services/user.service';

@Component({
   selector: 'app-password-edit',
   templateUrl: './password-edit.page.html',
   styleUrls: ['./password-edit.page.scss'],
})
export class PasswordEditPage implements OnInit {
   fg!: FormGroup;

   constructor(
      private readonly _userService: UserService,
      private readonly _formBuilder: FormBuilder,
      private readonly _toastService: ToastService
   ) {}

   ngOnInit() {
      this.initForm();
   }

   initForm(): void {
      this.fg = this._formBuilder.group({
         currentPassword: [null, [Validators.required]],
         newPassword: [null, [Validators.required]],
         newPasswordConfirm: [null, [Validators.required]],
      });
   }

   onSubmit(): void {
      if (this.fg.invalid) {
         return;
      }
      const changePassword: UserChangePassword = this.fg.value;

      this._userService.changePassword(changePassword).subscribe({
         next: _ => {
            this._toastService.display('Votre mot de passe a été modifié', 'checkmark');
            this.fg.reset();
         },
         error: (err: Error) => {
            this.fg.reset();
         },
      });
   }
}
