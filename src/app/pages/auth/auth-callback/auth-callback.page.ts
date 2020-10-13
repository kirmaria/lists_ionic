import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthActions, IAuthAction, AuthObserver, AuthService } from 'ionic-appauth';

@Component({
    template: '<p>Signing in...</p>'
})
export class AuthCallbackPage implements OnInit, OnDestroy {
    observer: AuthObserver;

    constructor(
        private auth: AuthService,
        private navCtrl: NavController,
        private router: Router
    ) { }

    ngOnInit() {
        this.observer = this.auth.addActionListener((action) => this.postCallback(action));
        this.auth.authorizationCallback(window.location.origin + this.router.url);
    }

    ngOnDestroy() {
        this.auth.removeActionObserver(this.observer);
    }

    postCallback(action: IAuthAction) {
        if (action.action === AuthActions.SignInSuccess) {
             this.navCtrl.navigateRoot('home');
            console.log('SignIn success!');
        }

        if (action.action === AuthActions.SignInFailed) {
           this.navCtrl.navigateRoot('landing');
            console.log('SignIn failed!');
        }
    }

}
