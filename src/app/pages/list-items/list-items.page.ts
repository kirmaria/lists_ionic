import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ItemDTO, ItemsListDTO, EditListType} from '../../dto/itemslist';
import {
    AlertController, IonInput,
    IonItemSliding,
    LoadingController,
    ModalController,
    NavController,
    NavParams,
    ToastController
} from '@ionic/angular';
import {ItemsListService} from '../../services/itemslist.service';
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
    editListType: EditListType;
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
                @Inject('editListTypeEnum') public editListTypeEnum,
                private keyboard: Keyboard) {

        this.list = navParams.get('list');
        this.title = 'List [' + this.list.value.name + ']';

        this.crtItem = new ItemDTO();
        this.unitTypeEnumKeys = Object.keys(unitTypeEnum);
        this.editListType = this.editListTypeEnum.none;
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


    onExitListEdit() {
        this.modalCtrl.dismiss({
            dismissed: true
        });
    }

    private onSubmitPropertyList(): void {
        const prepend = true;

        switch (this.editListType) {
            case this.editListTypeEnum.create: {
                this.listService.addItemToList( this.itemDetailsForm.value, this.list, prepend)
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
            case this.editListTypeEnum.update: {
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
            case this.editListTypeEnum.duplicate: {
                this.listService.addItemToList(this.itemDetailsForm.value, this.list, prepend)
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
        this.editListType = this.editListTypeEnum.none;
    }

    private onCancelPropertyList(): void {
        this.editListType = this.editListTypeEnum.none;
    }


    async createItem() {
        this.crtItem = new ItemDTO();
        this.crtItem.value.quantity = 1;
        this.initItemDetailsForm();
        this.editListType = this.editListTypeEnum.create;
        setTimeout(() => this.itemLabelInputElt.setFocus(), 100);
    }

    async updateItem(item: ItemDTO, sldItem: IonItemSliding) {
        this.crtItem = item;
        this.initItemDetailsForm();
        this.editListType = this.editListTypeEnum.update;
        setTimeout(() => this.itemLabelInputElt.setFocus(), 100);
    }

    async duplicateItem(item: ItemDTO) {
        this.editListType = this.editListTypeEnum.duplicate;
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
