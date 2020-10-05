import {Component, OnInit, Inject} from '@angular/core';
import {ItemsListDTO, ItemsListValuesDTO, ListType} from '../dto/itemslist';
import {ItemsListService} from '../services/itemslist.service';
import {AlertController, IonItemSliding, LoadingController, ModalController, ToastController, AnimationBuilder} from '@ionic/angular';
import {ListDetailsPage} from '../pages/list-details/list-details.page';
import {OverlayEventDetail} from '@ionic/core';
import {ListItemsPage} from '../pages/list-items/list-items.page';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    title: string;

    lists: ItemsListDTO[];
    errMsg: string;


    constructor(
        private listService: ItemsListService,
        public modalController: ModalController,
        public toastCtrl: ToastController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        @Inject('BaseURL') public baseURL,
        @Inject('listTypeEnum') public listTypeEnum) {
        this.title = 'My lists';
    }

    ngOnInit(): void {
        this.getLists();
    }

    getLists() {
        this.listService.getLists()
            .subscribe(
                lists => this.lists = lists,
                errMsg => this.errMsg = errMsg);
    }

    async createList() {
        const modal: HTMLIonModalElement =
            await this.modalController.create({
                component: ListDetailsPage,
                componentProps: {
                    createMode: true,
                    crtListValue: new ItemsListValuesDTO()
                }
            });
        modal.onDidDismiss().then((detail: OverlayEventDetail) => {
            if ((detail !== null) && (typeof detail.data !== 'undefined') && (typeof detail.data.value !== 'undefined')) {
                this.listService.addList(detail.data.value)
                    .subscribe(
                        list => {
                            this.getLists();
                        },
                        errMsg => {
                            this.errMsg = errMsg;
                            console.log('addlist ERROR: ' + errMsg);
                        });
            }
        });
        await modal.present();
    }

    async updateInfoList(listToUpdate: ItemsListDTO, sldListItem: IonItemSliding) {

        const idx = this.lists.indexOf(listToUpdate);

        const modal: HTMLIonModalElement =
            await this.modalController.create({
                component: ListDetailsPage,
                componentProps: {
                    createMode: false,
                    crtListValue: listToUpdate.value
                }
            });
        modal.onDidDismiss().then((detail: OverlayEventDetail) => {
            if ((detail !== null) && (typeof detail.data !== 'undefined') && (typeof detail.data.value !== 'undefined')) {

                this.listService.updateList(listToUpdate, detail.data.value)
                    .subscribe(
                        list => {
                            this.getLists();
                        },
                        errMsg => {
                            this.errMsg = errMsg;
                            console.log('updateList ERROR: ' + errMsg);
                        });
            }
        });
        await modal.present();
        sldListItem.close();
    }


    async duplicateList(listToDuplicate: ItemsListDTO, sldListItem: IonItemSliding) {

        const idx = this.lists.indexOf(listToDuplicate);

        const modal: HTMLIonModalElement =
            await this.modalController.create({

                component: ListDetailsPage,
                componentProps: {
                    createMode: false,
                    crtListValue: listToDuplicate.value
                }
            });
        modal.onDidDismiss().then((detail: OverlayEventDetail) => {
            if ((detail !== null) && (typeof detail.data !== 'undefined') && (typeof detail.data.value !== 'undefined')) {

                this.listService.duplicateList(listToDuplicate, detail.data.value)
                    .subscribe(
                        list => {
                            this.getLists();
                        },
                        errMsg => {
                            this.errMsg = errMsg;
                            console.log('duplicateList ERROR: ' + errMsg);
                        });
            }
        });
        await modal.present();
        sldListItem.close();
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
