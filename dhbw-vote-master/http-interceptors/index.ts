import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { FakeAuthInterceptor } from './FakeAuthInterceptor';

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: FakeAuthInterceptor, multi: true },
];
