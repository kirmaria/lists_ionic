import {Component, OnInit, Inject, OnDestroy, ViewChild} from '@angular/core';
import {ItemsListDTO, EditPropertiesType} from '../dto/itemslist';
import {ItemsListService} from '../services/itemslist.service';
import {
    AlertController,
    IonItemSliding,
    LoadingController,
    ModalController,
    ToastController,
    IonInput
} from '@ionic/angular';

import {OverlayEventDetail} from '@ionic/core';
import {ListItemsPage} from '../pages/list-items/list-items.page';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Keyboard} from '@ionic-native/keyboard/ngx';
import {Auth0Service} from '../services/auth0.service';

import {Platform} from '@ionic/angular';
import {listsTokenKey} from '../shared/app-constants';

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
    editPropType: EditPropertiesType;
    listDetailsForm: FormGroup;


    constructor(
        private listService: ItemsListService,
        public modalController: ModalController,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        @Inject('listTypeEnum') public listTypeEnum,
        @Inject('editPropTypeEnum') public editPropTypeEnum,
        private formBuilder: FormBuilder,
        private keyboard: Keyboard,
        private authService: Auth0Service,
        public platform: Platform) {

        this.title = 'My lists';

        this.editPropType = this.editPropTypeEnum.none;
        this.crtList = new ItemsListDTO();
        this.initListDetailsForm();
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


    private onSubmitPropertyList(): void {

        switch (this.editPropType) {
            case this.editPropTypeEnum.create: {
                this.listService.addList(this.listDetailsForm.value)
                    .subscribe(
                        list => {
                            this.getLists();
                        },
                        errMsg => {
                            this.errMsg = errMsg;
                            console.log('addlist ERROR: ' + errMsg);
                        });
                break;
            }
            case this.editPropTypeEnum.update: {
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
            case this.editPropTypeEnum.duplicate: {
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

        this.editPropType = this.editPropTypeEnum.none;

    }

    private onCancelPropertyList(): void {
        this.editPropType = this.editPropTypeEnum.none;
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
        this.editPropType = this.editPropTypeEnum.create;
        this.crtList = new ItemsListDTO();
        this.initListDetailsForm();
        setTimeout(() => this.listNameInputElt.setFocus(), 100);
    }

    async updateInfoList(listToUpdate: ItemsListDTO) {
        this.editPropType = this.editPropTypeEnum.update;
        this.crtList = listToUpdate;
        this.initListDetailsForm();
        setTimeout(() => this.listNameInputElt.setFocus(), 100);
    }


    async duplicateList(listToDuplicate: ItemsListDTO) {
        this.editPropType = this.editPropTypeEnum.duplicate;
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
            message: 'List [<strong>' + listToRemove.value.name + '</strong>] was deleted successfully!',
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
        sldListItem.close();

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


}
