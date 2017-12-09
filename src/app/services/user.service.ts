import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { UserDetails } from '../models/index';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    getAll() {
        return this.http.get('/api/users', this.fakeToken()).map((response:Response) => response.json());
    }

    getById(id: number) {
        return this.http.post('/api/users' + id, this.fakeToken()).map((response: Response) => response.json());
    }

    create(user: UserDetails) {
        return this.http.post('/api/users', user, this.fakeToken()).map((response: Response) => response.json());
    }

    update(user: UserDetails) {
        return this.http.put('/api/users' + user.id, user, this.fakeToken()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete('/api/users' + id, this.fakeToken()).map((response: Response) => response.json());
    }

    private fakeToken() {
        // create authorization header with fake token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({
                'Authorization': 'Random' + currentUser.token 
            });
            return new RequestOptions({headers: headers});
        }
    }
}
