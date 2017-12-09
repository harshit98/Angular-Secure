import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, UserService } from '../services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;

    constructor(
        private router: Router,
        private _user: UserService,
        private _message: MessageService
    ) { }

    register() {
        this.loading = true;
        this._user.create(this.model).subscribe(data => {
            this._message.success('Registration successful', true);
            this.router.navigate(['/login']);
        },
        fail => {
            this._message.fail(fail);
            this.loading = false;
        });
    }
}
