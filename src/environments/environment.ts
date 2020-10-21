// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    auth_config_web: {
        domain: 'dev-pjs46xuy.eu.auth0.com',
        client_id: 'kqD66z640iolF211UARtcqiWzAVYogoi',
        redirect_uri: 'http://localhost:8100/auth/callback',
        end_session_redirect_uri : 'http://localhost:8100/auth/endsession'
    },
    auth_config_native: {
        domain: 'dev-pjs46xuy.eu.auth0.com',
        client_id: 'akTIzDhEx3BK74vlj2tL2Tr66IiyS3C6',
        redirect_uri: 'com.ionic.starter://dev-pjs46xuy.eu.auth0.com/cordova/io.ionic.starter/callback',
        end_session_redirect_uri : 'io.ionic.starter://dev-pjs46xuy.eu.auth0.com/cordova/io.ionic.starter/endsession'
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
