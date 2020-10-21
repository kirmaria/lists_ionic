import { Component, OnInit } from '@angular/core';
import {Auth0Service} from '../../../services/auth0.service';

@Component({
    template: '<p>Signing Out...</p>'
})
export class EndSessionPage implements OnInit {

    constructor(private authService: Auth0Service) { }

    ngOnInit() {
        this.authService.handleRedirectEndSession();
    }

}
