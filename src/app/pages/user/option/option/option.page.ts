import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
   selector: 'app-option',
   templateUrl: './option.page.html',
   styleUrls: ['./option.page.scss'],
})
export class OptionPage implements OnInit {
   constructor(private readonly _router: Router, private readonly _userService: UserService) {}

   ngOnInit() {}

   goToEditPassword() {
      this._router.navigate(['user/option/edit-password']);
   }

   logout() {
      // todo: ajouter une vérification ?
      this._userService.logout();
      this._router.navigate(['user/']);
   }
}
