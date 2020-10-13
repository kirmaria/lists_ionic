// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    auth_config: {
        client_id: 'kqD66z640iolF211UARtcqiWzAVYogoi',
        server_host: 'https://dev-pjs46xuy.eu.auth0.com',
        redirect_url: 'http://localhost:8100',
        end_session_redirect_url: 'http://localhost:8100',
        scopes: 'openid offline_access',
        pkce: true,
        metadata: {
            issuer: 'https://dev-pjs46xuy.eu.auth0.com',
            authorization_endpoint: 'https://dev-pjs46xuy.eu.auth0.com/authorize',
            userinfo_endpoint: 'https://dev-pjs46xuy.eu.auth0.com/userinfo',
            end_session_endpoint: 'https://dev-pjs46xuy.eu.auth0.com/v2/logout',
            jwks_uri: 'https://dev-pjs46xuy.eu.auth0.com/.well-known/jwks.json',
        }
    },
    auth_config_native: {
        client_id: 'kqD66z640iolF211UARtcqiWzAVYogoi',
        server_host: 'https://dev-pjs46xuy.eu.auth0.com',
        redirect_url: 'com.appauth.demo://callback',
        end_session_redirect_url: 'com.appauth.demo://endsession',
        scopes: 'openid offline_access',
        pkce: true
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
