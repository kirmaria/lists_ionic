import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(public toastCtrl: ToastController) {

    }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errorMsg = '';
                    let errCode = 200;
                    let headerMsg = '';

                    if (error.error instanceof ErrorEvent) {
                        console.log('Client side error :');
                        errorMsg = `Error: ${error.error.message}`;
                    } else {
                        console.log('Server side error :');
                        errCode = error.status;
                        errorMsg = error.error.text;

                        switch (errCode) {
                            case 0:
                                headerMsg = 'CONNECTION ERROR';
                                errorMsg = 'The service is temporarily not available. Please try again later.';
                                break;

                            case 400: // Bad request
                            case 404: // Not found
                                headerMsg = 'ERROR';
                                break;

                            case 500: // Internal server error
                                headerMsg = 'SERVER ERROR';
                                errorMsg = 'A technical error has occurred. If it persists, please contact the administrator.';
                                break;

                            default:
                                headerMsg = 'SERVER ERROR';
                                errorMsg = 'An unexpected error has occurred. We are looking into it.';
                        }

                        this.displayError(headerMsg, errorMsg);
                    }
                    return throwError(errorMsg);
                })
            );
    }

    private async displayError(headerMsg, errorMsg) {
        const toastError = await this.toastCtrl.create({
            header: headerMsg,
            message: errorMsg,
            position: 'top',
            duration: 5000,
            buttons: [
                {
                    text: 'Close',
                    role: 'cancel',
                    handler: () => {}
                }
            ]
        });
        toastError.present();
    }
}


