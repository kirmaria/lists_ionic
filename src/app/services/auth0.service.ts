import {Injectable} from '@angular/core';
import createAuth0Client from '@wizzn/auth0-capacitor';
import {environment} from '../../environments/environment';
import Auth0Client from '@wizzn/auth0-capacitor/dist/typings/Auth0Client';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class Auth0Service {

    private auth0: Auth0Client;
    isLoggedIn: boolean;

    constructor(private router: Router) {
        this.isLoggedIn = true;
    }

    private async getAuth0() {
        if (typeof this.auth0 === 'undefined') {
            this.auth0 = await createAuth0Client({
                domain: environment.auth_config.domain,
                client_id: environment.auth_config.client_id,
                redirect_uri: environment.auth_config.redirect_uri
            });
        }
        return this.auth0;
    }

    async login() {
        (await this.getAuth0()).loginWithRedirect().catch(() => {
            console.log('loginWithRedirect ERROR');
        });
    }

    async handleRedirectCallback() {
        (await this.getAuth0()).handleRedirectCallback().then(
            redirectResult => {
                // logged in
                this.isLoggedIn = true;
                this.router.navigateByUrl('/home');

            }).catch(
                reason => console.log('ERROR login !'));
    }

    async getToken() {
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


}
