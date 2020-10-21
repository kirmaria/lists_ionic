import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Auth0Service} from './auth0.service';
import {localstorageTokenKey} from '../shared/app-constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: Auth0Service) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.isLoggedIn()) {
            const newReq = req.clone({
                setHeaders: {
                    'Content-Type': 'application/json; charset=utf-8',
                    Accept: 'application/json',
                    Authorization: `Bearer ` + localStorage.getItem(localstorageTokenKey),
                },
            });
            return next.handle(newReq);
        } else {
            return next.handle(req);
        }

    }
}
