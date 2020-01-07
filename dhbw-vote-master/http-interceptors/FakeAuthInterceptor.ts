import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpEventType } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class FakeAuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Request:\n", req);
        return next.handle(req);
    }

}