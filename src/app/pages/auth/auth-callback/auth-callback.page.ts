import {Component, OnInit} from '@angular/core';
import {Auth0Service} from '../../../services/auth0.service';


@Component({
    template: '<p>Signing in...</p>'
})
export class AuthCallbackPage implements OnInit {

    constructor(private authService: Auth0Service) {
    }

    ngOnInit() {
        this.authService.handleRedirectCallback();
    }
}
