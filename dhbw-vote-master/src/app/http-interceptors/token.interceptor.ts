import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.authenticationService.isAuthenticated || !req.url.startsWith(`${environment.apiUrl}`)) {
            return next.handle(req);
        }

        // Get token and inject it into the request header
        const user = this.authenticationService.currentUserValue;
        if (user && user.token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`
                }
            });
        }
        return next.handle(req);
    }

}

export let tokenInterceptor = {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
};
