import {Component, Inject, OnInit} from '@angular/core';
import {ItemDTO, ItemsListDTO, ItemValuesDTO} from '../../dto/itemslist';
import {
    AlertController,
    IonItemSliding,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    ToastController
} from '@ionic/angular';
import {OverlayEventDetail} from '@ionic/core';
import {ItemsListService} from '../../services/itemslist.service';
import {ItemDetailsPage} from '../item-details/item-details.page';

@Component({
    selector: 'app-list-items',
    templateUrl: './list-items.page.html',
    styleUrls: ['./list-items.page.scss'],
})
export class ListItemsPage implements OnInit {

    title: string;
    list: ItemsListDTO;
    errMsg: string;

    constructor(private listService: ItemsListService,
                public navCtrl: NavController,
                public navParams: NavParams,
                private modalCtrl: ModalController,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController) {

        this.list = navParams.get('list');
        this.title = 'List [' + this.list.value.name + ']';
    }

    ngOnInit() {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ListItemsPage');
    }


    onExit() {
        this.modalCtrl.dismiss({
            dismissed: true
        });
    }

    async createItem() {

        const modal: HTMLIonModalElement =
            await this.modalCtrl.create({
                component: ItemDetailsPage,
                componentProps: {
                    createMode: true,
                    crtItemValue: new ItemValuesDTO()
                }
            });
        modal.onDidDismiss().then((detail: OverlayEventDetail) => {
            if ((detail !== null) && (typeof detail.data !== 'undefined') && (typeof detail.data.value !== 'undefined')) {
                this.listService.addItemToList(detail.data.value, this.list )
                    .subscribe(
                        list => {
                            this.list = list;
                        },
                        errMsg => {
                            this.errMsg = errMsg;
                            console.log('addItem ERROR: ' + errMsg);
                        });
            }
        });
        await modal.present();
    }

    checkItem(item: ItemDTO) {
        item.value.checked = !item.value.checked;
        this.listService.updateItem(item, item.value)
            .subscribe(
                list => {
                    this.list = list;
                },
                errMsg => {
                    this.errMsg = errMsg;
                    console.log('updateItem ERROR: ' + errMsg);
                });
    }

    async updateItem(item: ItemDTO, sldItem: IonItemSliding) {
        const modal: HTMLIonModalElement =
            await this.modalCtrl.create({
                component: ItemDetailsPage,
                componentProps: {
                    createMode: false,
                    crtItemValue: item.value
                }
            });
        modal.onDidDismiss().then((detail: OverlayEventDetail) => {
            if ((detail !== null) && (typeof detail.data !== 'undefined') && (typeof detail.data.value !== 'undefined')) {
                this.listService.updateItem(item, detail.data.value)
                    .subscribe(
                        list => {
                            this.list = list;
                        },
                        errMsg => {
                            this.errMsg = errMsg;
                            console.log('updateItem ERROR: ' + errMsg);
                        });
            }
        });
        await modal.present();
    }

    async removeItem(itemToRemove: ItemDTO, sldItem: IonItemSliding) {
        const loading = await this.loadingCtrl.create({
            message: 'Deleting . . .',
            duration: 2000
        });
        const toast = await this.toastCtrl.create({
            message: 'Item [<strong>' + itemToRemove.value.label + '</strong>] was deleted successfully!',
            duration: 2000
        });

        const alert = await this.alertCtrl.create({
            header: 'Confirm',
            message: 'Are you sure to want to delete item [<strong>' + itemToRemove.value.label + '</strong>] ?',
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
                        this.listService.removeItem(itemToRemove)
                            .subscribe(
                                list => {
                                    this.list.items = this.list.items.filter(item => item.id !== itemToRemove.id);
                                    loading.dismiss();
                                    toast.present();
                                },
                                errMsg => {
                                    this.errMsg = errMsg;
                                    console.log('removeItem ERROR: ' + errMsg);
                                    loading.dismiss();
                                });
                    }
                }
            ]
        });

        alert.present();
        sldItem.close();

    }

}
