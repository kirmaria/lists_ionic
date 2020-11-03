import {Component, Inject, OnInit} from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {EditListType} from '../../dto/itemslist';


@Component({
    selector: 'app-edit-popup-menu',
    templateUrl: './edit-popup-menu.component.html',
    styleUrls: ['./edit-popup-menu.component.scss'],
})
export class EditPopupMenuComponent implements OnInit {

    editListType: EditListType;
    constructor(private popoverController: PopoverController,
                @Inject('editListTypeEnum') public editListTypeEnum) {
        this.editListType = editListTypeEnum.none;
    }

    ngOnInit() {
    }

    closeMenu(editListType: EditListType) {

        this.editListType = editListType;
        this.popoverController.dismiss( {editListType: this.editListType});
    }
}
