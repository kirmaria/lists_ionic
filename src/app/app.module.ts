import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {baseURL} from './shared/baseurl';

import {HttpClientModule} from '@angular/common/http';
import {ListType} from './dto/itemslist';
import {UnitType} from './dto/itemslist';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {iosTransitionAnimation} from '@ionic/core/dist/collection/utils/transition/ios.transition';


@NgModule({
    declarations: [
        AppComponent,

    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot({
            // navAnimation: iosTransitionAnimation
        }),
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: 'BaseURL', useValue: baseURL},
        {provide: 'listTypeEnum', useValue: ListType},
        {provide: 'unitTypeEnum', useValue: UnitType}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
