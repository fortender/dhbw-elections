import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { materialize, dematerialize, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { USERS } from '../mock-data/users';
import { CANDIDATES } from '../mock-data/candidates';
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return of(null).pipe(() => {
            // Api: /users/authenticate
            if (req.url.endsWith('/users/authenticate')) {
                if (req.method === 'POST') {
                    // Validate request body
                    const obj = req.body;
                    if (!obj || !obj.mail || !obj.password) {
                        return throwError('Malformed request body!');
                    } else {
                        const user = USERS.find(u => u.mail === obj.mail);
                        // Throw if user not found
                        if (!user) {
                            return throwError('User not found');
                        }
                        // Throw if password is wrong
                        if (user.password !== obj.password) {
                            return throwError('Invalid password');
                        }
                        // Return fake jwt token
                        return of(new HttpResponse({
                            status: 200,
                            body: {
                                mail: user.mail,
                                token: 'fake-jwt-token'
                            }
                        }));
                    }
                }
            }

            // Api: /users/:mail
            if (req.url.match(/\/users\/.+$/)) {
                const parts = req.url.split('/');
                const mail = decodeURIComponent(parts[parts.length - 1]);
                const user = USERS.find(u => u.mail === mail);

                if (!user) {
                    return throwError('User not found');
                }

                if (req.method === 'GET') {
                    return of(new HttpResponse({
                        status: 200,
                        body: user
                    }));
                }

                if (req.method === 'PUT') {
                    user.voted = req.body.voted;
                    return of(new HttpResponse({ status: 200, body: { success: true } }));
                }
            }

            // Api: /candidates
            if (req.url.endsWith('/candidates')) {
                if (req.method === 'GET') {
                    return of(new HttpResponse({
                        status: 200,
                        body: { candidates: CANDIDATES }
                    }));
                }
            }

            // Unknown api call to backend, so we pass it to the next handler
            return next.handle(req);
        })
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
