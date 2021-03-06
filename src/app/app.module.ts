import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {baseURL} from './shared/app-constants';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ListType, UnitType, EditListType} from './dto/itemslist';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { AuthInterceptor } from './services/auth.interceptor';

import { ListPopupMenuComponentModule } from './components/list-popup-menu/list-popup-menu.module';
import {HttpErrorInterceptor} from './services/httpError.interceptor';

@NgModule({
    declarations: [
        AppComponent,

    ],
    entryComponents: []
    ,
    imports: [
        BrowserModule,
        IonicModule.forRoot({
        }),
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        ListPopupMenuComponentModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: 'BaseURL', useValue: baseURL},
        {provide: 'listTypeEnum', useValue: ListType},
        {provide: 'unitTypeEnum', useValue: UnitType},
        {provide: 'editListTypeEnum', useValue: EditListType},
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
