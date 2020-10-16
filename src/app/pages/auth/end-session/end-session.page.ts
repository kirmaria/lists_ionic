import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import {Auth0Service} from '../../../services/auth0.service';

@Component({
    template: '<p>Signing Out...</p>'
})
export class EndSessionPage implements OnInit {

    constructor(
        private authService: Auth0Service,
        private navCtrl: NavController,
        private router: Router
    ) { }

    ngOnInit() {
        console.log('EndSessionPage ngOnInit');
        console.log(this.authService);
        this.authService.handleRedirectEndSession();
    }

}
