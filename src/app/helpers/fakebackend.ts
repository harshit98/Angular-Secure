import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

const fakeBackendProvider = {
    provide: Http,
    deps: [MockBackend, BaseRequestOptions],
    useFactory: (backend: MockBackend, options: BaseRequestOptions) => {
        // store the registered users in the local storage
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];

        // configure
        backend.connections.subscribe((connection: MockConnection) => {
            setTimeout(() => {
                // authenticate
                if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
                    // by this way, we can get parameters
                    // from the POST request
                    let params = JSON.parse(connection.request.getBody());
                    let filteredUsers = users.filter(user => {
                        return user.username === params.username && user.password === params.password;
                    });

                    if (filteredUsers.length) {
                        let user = filteredUsers[0];
                        connection.mockRespond(new Response(new ResponseOptions({
                            status: 200,
                            body: {
                                id: user.id,
                                username: user.username,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                token: 'fake-token'
                            }
                        })));
                    } else {
                        connection.mockError(new Error('Username or password is incorrect'));
                    }
                }

                if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {
                    // checks fake authentication token and returns users if valid
                    // this security is implemented server-side in real application
                    if (connection.request.headers.get('authorization') === 'fake-token') {
                        connection.mockRespond(new Response(new ResponseOptions({status: 200, body: users})));
                    } else {
                        connection.mockRespond(new Response(new ResponseOptions({status: 401})));
                    }
                }
                // get user by id
                if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Get) {
                    if (connection.request.headers.get('authorization') === 'fake-token') {
                        let urlParts = connection.request.url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        let matchedUsers = users.filter(user => {
                            return user.id === id;
                        });
                        let user = matchedUsers.length ? matchedUsers[0] : null;
                        connection.mockRespond(new Response(new ResponseOptions({
                            status: 200,
                            body: user
                        })));
                    } else {
                        connection.mockRespond(new Response(new ResponseOptions({status: 401})));
                    }
                }
                // creates new user
                if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Post) {
                    let newUser  = JSON.parse(connection.request.getBody());
                    let duplicateUser = users.filter(user => {
                        return user.username === newUser.username;
                    }).length;

                    if (duplicateUser) {
                        return connection.mockError(new Error('Username"' + newUser.name + '"is already taken'));
                    }

                    // save new user
                    newUser.id = users.length + 1;
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));
                    
                    connection.mockRespond(new Response(new ResponseOptions({status: 200})));
                }
                
                // deletes the user a/c
                if (connection.request.url.match(/\api\/users\/d+$/) && connection.request.method === RequestMethod.Delete) {
                    if (connection.request.headers.get('authorization') === 'fake-token') {
                        let urlParts = connection.request.url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        for (let i=0; i<users.length; i++) {
                            let user = users[i];
                            if (user.id === id) {
                                // delete user
                                users.splice(i,1);
                                localStorage.setItem('users', JSON.stringify(users));
                                break;
                            }
                        }
                    } else {
                        connection.mockRespond(new Response(new ResponseOptions({status: 401})));
                    }
                }
            }, 500);
        });

        return new Http(backend,options);
    },
};
