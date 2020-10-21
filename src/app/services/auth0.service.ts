import {Injectable} from '@angular/core';
import createAuth0Client from '@wizzn/auth0-capacitor';
import {environment} from '../../environments/environment';
import Auth0Client from '@wizzn/auth0-capacitor/dist/typings/Auth0Client';
import {Router} from '@angular/router';
import { Platform } from '@ionic/angular';
import {LogoutOptions} from '@wizzn/auth0-capacitor/dist/typings/global';

@Injectable({
    providedIn: 'root'
})
export class Auth0Service {

    private auth0: Auth0Client;
    private config: any;
    private loggedIn: boolean;

    constructor(private router: Router,
                public platform: Platform) {
        this.loggedIn = false;
        console.log('Platform: ');
        console.log(this.platform.platforms());

        if (this.platform.is('mobile')) {
            this.config = environment.auth_config_native;
        } else {
            this.config = environment.auth_config_web;
        }

    }

    public isLoggedIn(){
        return this.loggedIn;
    };

    private async getAuth0() {
        if (typeof this.auth0 === 'undefined') {
            this.auth0 = await createAuth0Client(this.config);
        }
        return this.auth0;
    }


    async login() {
        (await this.getAuth0()).loginWithRedirect().catch(() => {
            console.log('ERROR login');
        });
    }

    async handleRedirectCallback() {
        (await this.getAuth0()).handleRedirectCallback().then(
            redirectResult => {
                console.log('login');
                this.loggedIn = true;
                this.router.navigateByUrl('/home');
            }).catch(
            reason => console.log('ERROR handleRedirectCallback'));
    }

    handleRedirectEndSession() {
        // logout
        console.log('logout');
        this.loggedIn = false;
        this.router.navigateByUrl('/home');
    }

    async getIdToken() {
        const idToken = await (await this.getAuth0()).getIdTokenClaims();
        console.log('token = ');
        console.log(idToken.__raw);
        return idToken.__raw;
    }

    async getUser() {
        const user = await (await this.getAuth0()).getUser();
        console.log('user = ');
        console.log(user);
        return user;
    }

    async logout() {
        await (await this.getAuth0()).logout().catch(
            reason => console.log('ERROR logout !'));
    }


}
