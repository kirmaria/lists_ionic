import {Component, OnInit, Inject, OnDestroy, ViewChild} from '@angular/core';
import {ItemsListDTO, EditListType} from '../dto/itemslist';
import {ItemsListService} from '../services/itemslist.service';
import {
    AlertController,
    IonItemSliding,
    LoadingController,
    ModalController,
    ToastController,
    IonInput, PopoverController
} from '@ionic/angular';

import {OverlayEventDetail} from '@ionic/core';
import {ListItemsPage} from '../pages/list-items/list-items.page';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {Auth0Service} from '../services/auth0.service';

import {Platform} from '@ionic/angular';
import {listsTokenKey} from '../shared/app-constants';
import {EditPopupMenuComponent} from '../components/list-popup-menu/edit-popup-menu.component';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    providers: [Keyboard]
})
export class HomePage implements OnInit, OnDestroy {

    title: string;
    lists: ItemsListDTO[];
    errMsg: string;

    @ViewChild('listNameInput', {static: false}) listNameInputElt: IonInput;
    crtList: ItemsListDTO;
    editListType: EditListType;
    listDetailsForm: FormGroup;


    constructor(
        private listService: ItemsListService,
        public modalController: ModalController,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        @Inject('listTypeEnum') public listTypeEnum,
        @Inject('editListTypeEnum') public editListTypeEnum,
        private formBuilder: FormBuilder,
        private keyboard: Keyboard,
        private authService: Auth0Service,
        public platform: Platform,
        private popoverController: PopoverController) {

        this.title = 'My lists';

        this.editListType = this.editListTypeEnum.none;
        this.crtList = new ItemsListDTO();
        this.initListDetailsForm();
    }


    isMobileSize() {
        return window.innerWidth < 768;
    }

    login() {

        // const toast = await this.toastCtrl.create({
        //     message: this.platform.platforms().toString(),
        //     duration: 5000
        // });
        // toast.present();

        this.authService.login();

    }

    logout() {
        this.authService.logout();
    }

    private initListDetailsForm() {
        this.listDetailsForm = this.formBuilder.group({
            name: [this.crtList.value.name, Validators.required],
            description: [this.crtList.value.description],
            type: [this.crtList.value.type, Validators.required]
        });
    }

    ngOnInit(): void {

        this.authService.getIdToken().then(idToken => {
            localStorage.setItem(listsTokenKey, idToken);
        }).finally(() => this.getLists());

    }

    ngOnDestroy(): void {
    }


    private async onSubmitEditList(){

        const toastError = await this.toastCtrl.create({
            message: '',
            position: 'top',
            header: 'ERROR',
            duration: 5000,
            buttons: [
                 {
                    text: 'Close',
                    role: 'cancel',
                    handler: () => {}
                }
            ]
        });

        switch (this.editListType) {
            case this.editListTypeEnum.create: {
                this.listService.addList(this.listDetailsForm.value)
                    .subscribe(
                        list => {
                            this.getLists();
                        },
                        errMsg => {
                            // this.errMsg = errMsg;
                            // console.log('addlist ERROR: ' + errMsg);
                            toastError.setAttribute('message', errMsg);
                            toastError.present();

                        });
                break;
            }
            case this.editListTypeEnum.update: {
                this.listService.updateList(this.crtList, this.listDetailsForm.value)
                    .subscribe(
                        list => {
                            this.getLists();
                        },
                        errMsg => {
                            this.errMsg = errMsg;
                            console.log('updateList ERROR: ' + errMsg);
                        });
                break;
            }
            case this.editListTypeEnum.duplicate: {
                this.listService.duplicateList(this.crtList, this.listDetailsForm.value)
                    .subscribe(
                        list => {
                            this.getLists();
                        },
                        errMsg => {
                            this.errMsg = errMsg;
                            console.log('duplicateList ERROR: ' + errMsg);
                        });
                break;
            }

        }

        this.editListType = this.editListTypeEnum.none;

    }

    private onCancelEditList(): void {
        this.editListType = this.editListTypeEnum.none;
    }


    //
    // lists management
    //

    getLists() {
        this.listService.getLists()
            .subscribe(
                lists => this.lists = lists,
                errMsg => this.errMsg = errMsg);
    }

    async createList() {
        this.editListType = this.editListTypeEnum.create;
        this.crtList = new ItemsListDTO();
        this.initListDetailsForm();
        setTimeout(() => this.listNameInputElt.setFocus(), 100);
    }

    async updateInfoList(listToUpdate: ItemsListDTO) {
        this.editListType = this.editListTypeEnum.update;
        this.crtList = listToUpdate;
        this.initListDetailsForm();
        setTimeout(() => this.listNameInputElt.setFocus(), 100);
    }


    async duplicateList(listToDuplicate: ItemsListDTO) {
        this.editListType = this.editListTypeEnum.duplicate;
        this.crtList = listToDuplicate;
        this.initListDetailsForm();
        setTimeout(() => this.listNameInputElt.setFocus(), 100);
    }


    async removeList(listToRemove: ItemsListDTO, sldListItem: IonItemSliding) {

        const loading = await this.loadingCtrl.create({
            message: 'Deleting . . .',
            duration: 2000
        });
        const toast = await this.toastCtrl.create({
            message: 'List [<strong>' + listToRemove.value.name + '</strong>] was successfully deleted!',
            duration: 2000
        });

        const alert = await this.alertCtrl.create({
            header: 'Confirm!',
            message: 'Are you sure to want to delete list [<strong>' + listToRemove.value.name + '</strong>] ?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                    }
                },
                {
                    text: 'OK',
                    handler: () => {
                        loading.present();
                        this.listService.removeList(listToRemove)
                            .subscribe(
                                list => {
                                    this.getLists();
                                    loading.dismiss();
                                    toast.present();
                                },
                                errMsg => {
                                    this.errMsg = errMsg;
                                    console.log('removeList ERROR: ' + errMsg);
                                    loading.dismiss();
                                });
                    }
                }
            ]
        });

        alert.present();
        if (sldListItem != null) {
            sldListItem.close();
        }
    }

    async editList(listToEdit: ItemsListDTO) {
        const modal: HTMLIonModalElement =
            await this.modalController.create({
                component: ListItemsPage,
                componentProps: {
                    list: listToEdit
                },
                cssClass: 'list-details-class',
                showBackdrop: true
            });
        modal.onDidDismiss().then((detail: OverlayEventDetail) => {
            this.getLists();
        });
        await modal.present();
    }


    async openMenuList(myEvent: Event, list: ItemsListDTO) {
        const popover: HTMLIonPopoverElement = await this.popoverController.create({
            component: EditPopupMenuComponent,
            showBackdrop: true,
            event: myEvent
        });

        popover.onDidDismiss().then((detail: OverlayEventDetail) => {
            if ((detail !== null) && (typeof detail.data !== 'undefined') && (typeof detail.data.editListType !== 'undefined')) {
                switch (detail.data.editListType) {
                    case EditListType.update: {
                        this.updateInfoList(list);
                        break;
                    }
                    case EditListType.duplicate: {
                        this.duplicateList(list);
                        break;
                    }
                    case EditListType.delete: {
                        this.removeList(list, null);
                        break;
                    }
                }
            }
        });

        await popover.present();
    }

}
