import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ItemDTO, ItemsListDTO, ItemsListValuesDTO, ItemValuesDTO} from '../dto/itemslist';
import {API_ITEMS_LIST_URL, API_ITEM_URL} from '../shared/baseurl';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ProcessHttpMsgService} from './process-http-msg.service';
import { catchError} from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ItemsListService {

    constructor(public http: HttpClient,
                private processHttpMsgService: ProcessHttpMsgService) {
    }

    getLists(): Observable<ItemsListDTO[]> {
        return this.http.get<ItemsListDTO[]>(API_ITEMS_LIST_URL)
            .pipe(catchError(this.processHttpMsgService.handleError));
    }

    addList(val: ItemsListValuesDTO): Observable<ItemsListDTO> {
        return this.http.post<ItemsListDTO>(API_ITEMS_LIST_URL, val)
            .pipe(catchError(this.processHttpMsgService.handleError));
    }

    duplicateList(listToDuplicate: ItemsListDTO, val: ItemsListValuesDTO): Observable<ItemsListDTO> {
        const param = new HttpParams().set('listId', listToDuplicate.id);
        return this.http.post<ItemsListDTO>(API_ITEMS_LIST_URL , val, {params: param})
            .pipe(catchError(this.processHttpMsgService.handleError));
    }

    updateList(list: ItemsListDTO, val: ItemsListValuesDTO): Observable<ItemsListDTO> {
        return this.http.put<ItemsListDTO>(API_ITEMS_LIST_URL + '/' + list.id, val)
            .pipe(catchError(this.processHttpMsgService.handleError));
    }

    removeList(list: ItemsListDTO): Observable<ItemsListDTO[]> {
        return this.http.delete<ItemsListDTO[]>(API_ITEMS_LIST_URL + '/' + list.id)
            .pipe(catchError(this.processHttpMsgService.handleError));
    }


    addItemToList(itemVal: ItemValuesDTO, list: ItemsListDTO): Observable<ItemsListDTO> {
        return this.http.post<ItemsListDTO>(API_ITEMS_LIST_URL + '/' + list.id + '/items', itemVal)
            .pipe(catchError(this.processHttpMsgService.handleError));
    }

    updateItem(item: ItemDTO, val: ItemValuesDTO): Observable<ItemsListDTO> {
        return this.http.put<ItemsListDTO>(API_ITEM_URL + '/' + item.id, val)
            .pipe(catchError(this.processHttpMsgService.handleError));
    }

    removeItem(item: ItemDTO): Observable<ItemsListDTO> {
        return this.http.delete<ItemsListDTO>(API_ITEM_URL + '/' + item.id)
            .pipe(catchError(this.processHttpMsgService.handleError));
    }
}
