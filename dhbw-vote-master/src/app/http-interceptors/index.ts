import { fakeBackendProvider } from './fake-backend.interceptor';
import { tokenInterceptor } from './token.interceptor';

export const httpInterceptors = [
    // fakeBackendProvider,
    tokenInterceptor
];
