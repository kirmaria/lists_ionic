import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ItemDTO, ItemsListDTO, ItemsListValuesDTO, ItemValuesDTO} from '../dto/itemslist';
import {API_ITEMS_LIST_URL, API_ITEM_URL} from '../shared/app-constants';
import {HttpClient, HttpParams} from '@angular/common/http';


/**
 * ItemsListService
 * @desc ....
 * @memberOf ...
 */
@Injectable({
    providedIn: 'root'
})
export class ItemsListService {

    constructor(public http: HttpClient) {
    }

    /**
     * getLists
     * @desc get all lists
     * @param namePattern : filter the search with this namePattern
     * @returns Observable<ItemsListDTO[]
     * @memberOf ItemsListService
     */
    getLists(namePattern): Observable<ItemsListDTO[]> {
        const param = new HttpParams().set('namePattern', namePattern);
        return this.http.get<ItemsListDTO[]>(API_ITEMS_LIST_URL,  {params: param});
    }


    /**
     * addList
     * @desc create a new list
     * @param ItemsListValuesDTO val : list data
     * @returns Observable<ItemsListDTO[]
     * @memberOf ItemsListService
     */
    addList(val: ItemsListValuesDTO): Observable<ItemsListDTO> {
        return this.http.post<ItemsListDTO>(API_ITEMS_LIST_URL, val);
    }

    duplicateList(listToDuplicate: ItemsListDTO, val: ItemsListValuesDTO): Observable<ItemsListDTO> {
        const param = new HttpParams().set('listId', listToDuplicate.id);
        return this.http.post<ItemsListDTO>(API_ITEMS_LIST_URL, val, {params: param});
    }

    updateList(list: ItemsListDTO, val: ItemsListValuesDTO): Observable<ItemsListDTO> {
        return this.http.put<ItemsListDTO>(API_ITEMS_LIST_URL + '/' + list.id, val);
    }

    removeList(list: ItemsListDTO): Observable<ItemsListDTO[]> {
        return this.http.delete<ItemsListDTO[]>(API_ITEMS_LIST_URL + '/' + list.id);
    }

    addItemToList(itemVal: ItemValuesDTO, list: ItemsListDTO, prepend: boolean): Observable<ItemsListDTO> {
        const param = new HttpParams().set('prepend', prepend ? 'true' : 'false' );
        return this.http.post<ItemsListDTO>(API_ITEMS_LIST_URL + '/' + list.id + '/items', itemVal, {params: param});
    }

    updateItem(item: ItemDTO, val: ItemValuesDTO): Observable<ItemsListDTO> {
        return this.http.put<ItemsListDTO>(API_ITEM_URL + '/' + item.id, val);
    }

    removeItem(item: ItemDTO): Observable<ItemsListDTO> {
        return this.http.delete<ItemsListDTO>(API_ITEM_URL + '/' + item.id);
    }
}
