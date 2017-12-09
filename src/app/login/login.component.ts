import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, AuthenticationService } from '../services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private _authentication: AuthenticationService,
        private _message: MessageService
    ) { }

    login() {
        this.loading = true;
        this._authentication.login(this.model.username, this.model.password)
        .subscribe(data => {
            this.router.navigate([this.returnUrl]);
        },
        fail => {
            this._message.fail(fail);
            this.loading = false;
        });
    }

    ngOnInit() {
        this._authentication.logout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
}
