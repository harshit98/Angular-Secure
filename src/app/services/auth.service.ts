import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }

    login(username: string, password: string) {
        return this.http.post('/api/authenticate', JSON.stringify({
            username: username,
            password: password
        })).map((response: Response) => {
            // login success if there is fake-token in response
            let user = response.json();
            if (user && user.token) {
                // store the user details and the fake-token
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
        });
    }

    logout() {
        // remove credentials from local storage
        localStorage.removeItem('currentUser');
    }
}
