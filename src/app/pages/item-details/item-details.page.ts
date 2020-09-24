import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController, NavController, NavParams} from '@ionic/angular';
import {ItemValuesDTO} from '../../dto/itemslist';


@Component({
    selector: 'app-item-details',
    templateUrl: './item-details.page.html',
    styleUrls: ['./item-details.page.scss'],
})
export class ItemDetailsPage implements OnInit {
    title: string;
    itemDetailsForm: FormGroup;
    crtItemValue: ItemValuesDTO;
    createMode: boolean;
    unitTypeEnumKeys: Array<string>;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private formBuilder: FormBuilder,
                private modalCtrl: ModalController,
                @Inject('unitTypeEnum') public unitTypeEnum) {

        this.unitTypeEnumKeys = Object.keys(unitTypeEnum);

        this.createMode = navParams.get('createMode');
        this.crtItemValue = navParams.get('crtItemValue');

        this.itemDetailsForm = this.formBuilder.group({
            label: [this.crtItemValue.label, Validators.required],
            quantity: [this.crtItemValue.quantity, Validators.required],
            unit: [this.crtItemValue.unit],
            description: [this.crtItemValue.description]
        });

        if (this.createMode) {
            this.title = 'New item:';
        } else {
            this.title = 'Update item:';
        }
    }


    ngOnInit() {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ItemDetailsPage');
    }


    onSubmit() {
        this.modalCtrl.dismiss({
            dismissed: true,
            value: this.itemDetailsForm.value
        });
    }

    onCancel() {
        this.modalCtrl.dismiss({
            dismissed: true
        });
    }
}
