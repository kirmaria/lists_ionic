import {AfterViewChecked, Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IonInput, ModalController, NavController, NavParams} from '@ionic/angular';
import {ItemsListValuesDTO} from '../../dto/itemslist';
import {Keyboard} from '@ionic-native/keyboard/ngx';


@Component({
    selector: 'app-list-details',
    templateUrl: './list-details.page.html',
    styleUrls: ['./list-details.page.scss'],
    providers: [Keyboard]
})
export class ListDetailsPage implements OnInit, AfterViewChecked {
    title: string;
    listDetailsForm: FormGroup;
    crtListValue: ItemsListValuesDTO;
    createMode: boolean;


    @ViewChild('listNameInput', {static: false}) listNameInputElt: IonInput;
    initialFocus: boolean;
    ionViewWillEntered: boolean;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private formBuilder: FormBuilder,
                private modalCtrl: ModalController,
                @Inject('listTypeEnum') public listTypeEnum,
                private keyboard: Keyboard) {

        this.createMode = navParams.get('createMode');
        this.crtListValue = navParams.get('crtListValue');

        this.listDetailsForm = this.formBuilder.group({
            name: [this.crtListValue.name, Validators.required],
            description: [this.crtListValue.description],
            type: [this.crtListValue.type, Validators.required]
        });

        if (this.createMode) {
            this.title = 'Create list:';
        } else {
            this.title = 'Update list:';
        }

        this.initialFocus = true;
        this.ionViewWillEntered = false;

    }


    ngOnInit() {

    }


    public ngAfterViewChecked(): void {

        console.log('ngAfterViewChecked');
        console.log(this.initialFocus);
        console.log(this.ionViewWillEntered);

        // focus on name input
        if (this.initialFocus && this.ionViewWillEntered) {
            this.listNameInputElt.setFocus();
            this.initialFocus = false;
        }


    }

    public ngAfterViewInit(): void {

        console.log('ngAfterViewChecked');
        console.log(this.initialFocus);
        console.log(this.ionViewWillEntered);

        // focus on name input
        if (this.initialFocus && this.ionViewWillEntered) {
            this.listNameInputElt.setFocus();
            this.initialFocus = false;
        }


    }

    public ionViewDidEnter() {
        this.ionViewWillEntered = true;
        console.log('ionViewWillEnter');
    }

    onSubmit() {
        this.modalCtrl.dismiss({
            dismissed: true,
            value: this.listDetailsForm.value
        });
    }

    onCancel() {
        this.modalCtrl.dismiss({
            dismissed: true
        });
    }
}
