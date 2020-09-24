import { Injectable } from '@angular/core';
import {  throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ProcessHttpMsgService {

  constructor(public http: HttpClient) {
  }

  public handleError(error: HttpErrorResponse | any) {
    let errMsg: string;

    if (error.error instanceof ErrorEvent) {
      errMsg = error.error.message;
    }
    else {
      errMsg = `${error.status} - ${error.statusText || ''} ${error.error} `;
    }
    return throwError(new Error(errMsg));
  }

}
