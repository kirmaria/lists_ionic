import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ItemDTO, ItemsListDTO, ItemValuesDTO, EditPropertiesType} from '../../dto/itemslist';
import {
    AlertController, IonInput,
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
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Keyboard} from '@ionic-native/keyboard/ngx';

@Component({
    selector: 'app-list-items',
    templateUrl: './list-items.page.html',
    styleUrls: ['./list-items.page.scss'],
    providers: [Keyboard]
})
export class ListItemsPage implements OnInit {

    title: string;
    list: ItemsListDTO;
    errMsg: string;

    itemDetailsForm: FormGroup;
    crtItem: ItemDTO;
    editPropType: EditPropertiesType;
    unitTypeEnumKeys: Array<string>;

    @ViewChild('itemLabelInput') itemLabelInputElt: IonInput;

    constructor(private listService: ItemsListService,
                public navCtrl: NavController,
                public navParams: NavParams,
                private modalCtrl: ModalController,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                private formBuilder: FormBuilder,
                @Inject('unitTypeEnum') public unitTypeEnum,
                @Inject('editPropTypeEnum') public editPropTypeEnum,
                private keyboard: Keyboard) {

        this.list = navParams.get('list');
        this.title = 'List [' + this.list.value.name + ']';

        this.crtItem = new ItemDTO();
        this.unitTypeEnumKeys = Object.keys(unitTypeEnum);
        this.editPropType = this.editPropTypeEnum.none;
        this.initItemDetailsForm();
    }

    private initItemDetailsForm(){
        this.itemDetailsForm = this.formBuilder.group({
            label: [this.crtItem.value.label, Validators.required],
            quantity: [this.crtItem.value.quantity, Validators.required],
            unit: [this.crtItem.value.unit],
            description: [this.crtItem.value.description]
        });
    }

    ngOnInit() {
    }


    onExit() {
        this.modalCtrl.dismiss({
            dismissed: true
        });
    }

    private onSubmitPropertyList(): void {
        switch (this.editPropType) {
            case this.editPropTypeEnum.create: {
                this.listService.addItemToList( this.itemDetailsForm.value, this.list)
                    .subscribe(
                        list => {
                            this.list = list;
                        },
                        errMsg => {
                            this.errMsg = errMsg;
                            console.log('addItem ERROR: ' + errMsg);
                        });
                break;
            }
            case this.editPropTypeEnum.update: {
                this.listService.updateItem(this.crtItem, this.itemDetailsForm.value)
                    .subscribe(
                        list => {
                            this.list = list;
                        },
                        errMsg => {
                            this.errMsg = errMsg;
                            console.log('updateItem ERROR: ' + errMsg);
                        });
                break;
            }
            case this.editPropTypeEnum.duplicate: {
                this.listService.duplicateItem(this.crtItem, this.list)
                    .subscribe(
                        list => {
                            this.list = list;
                        },
                        errMsg => {
                            this.errMsg = errMsg;
                            console.log('duplicateItem ERROR: ' + errMsg);
                        });
                break;
            }
        }
        this.editPropType = this.editPropTypeEnum.none;
    }

    private onCancelPropertyList(): void {
        this.editPropType = this.editPropTypeEnum.none;
    }


    async createItem() {
        this.crtItem = new ItemDTO();
        this.crtItem.value.quantity = 1;
        this.initItemDetailsForm();
        this.editPropType = this.editPropTypeEnum.create;
        setTimeout(() => this.itemLabelInputElt.setFocus(), 100);
    }

    async updateItem(item: ItemDTO, sldItem: IonItemSliding) {
        this.crtItem = item;
        this.initItemDetailsForm();
        this.editPropType = this.editPropTypeEnum.update;
        setTimeout(() => this.itemLabelInputElt.setFocus(), 100);
    }

    async duplicateItem(item: ItemDTO) {
        this.editPropType = this.editPropTypeEnum.duplicate;
        this.crtItem = item;
        this.initItemDetailsForm();
        setTimeout(() => this.itemLabelInputElt.setFocus(), 100);
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
