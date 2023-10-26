import { LightningElement, track } from 'lwc';
import getFieldsFromProductMethod from '@salesforce/apex/getFieldsFromProduct.getFieldsFromProductMethod';

export default class DisplayTypeAndFamily extends LightningElement {

    @track fieldList;
    @track typeOptionsWithoutFamily = [];
    @track typeOptionsWithFamily = [];
    @track selectedType = '';
    @track familyWithType = [];
    @track familyWithoutType = [];
    @track selectedFamily = '';
    @track newFieldList;
    
    showProducts = false;
    showType = false;
    showFamily = false;

    connectedCallback() {
        getFieldsFromProductMethod().then(result => {
            this.fieldList = result;
            console.log('this.fieldList---->', JSON.stringify(this.fieldList));

            this.typeOptionsWithoutFamily = [...new Set(this.fieldList.map(item => item.Type__c))];

            this.familyWithoutType = [...new Set(this.fieldList.map(item => item.Product_Family__c))];

            console.log('this.familyWithoutType----->', JSON.stringify(this.familyWithoutType));
            console.log('typeOptionsWithoutFamilys--->', JSON.stringify(this.typeOptionsWithoutFamily));
        })
            .catch(error => {
                console.error('error---->', error);
            });
    }

    handleTypeSelect(event) {
        this.selectedType = event.target.value;
        console.log('cthis.selectedType------->', this.selectedType);
        if (this.typeOptionsWithoutFamily) {
            this.filterProductFamily();
        }
    }
    filterProductFamily() {
        console.log('inside product family function');
        console.log(' this.familyWithoutType', this.familyWithoutType);
        //this.familyWithoutType = [];
        if (this.fieldList.map(item => item.Type__c).includes(this.selectedType) === true) {
            this.familyWithType = [... new Set(this.fieldList
                .filter(item => item.Type__c === this.selectedType)
                .map(item => item.Product_Family__c))];
            console.log('this.familyWithType-------->', JSON.stringify(this.familyWithType));
            this.showFamily = true;
        }
    }
    handleFamilySelect(event) {
        this.selectedFamily = event.target.value;
        console.log('this.selectedFamily---------->', this.selectedFamily);
        if (this.selectedFamily) {
            this.typeOptionsWithoutFamily = [];
            this.filterTypeSelect();
        } else {
            this.typeOptionsWithFamily = [];
            this.typeOptionsWithoutFamily = [...new Set(this.fieldList.map(item => item.Type__c))];
        }
    }

    filterTypeSelect() {
        if (this.fieldList.map(item => item.Product_Family__c).includes(this.selectedFamily) === true) {
            this.typeOptionsWithoutFamily = [];
            this.typeOptionsWithFamily = [...new Set(this.fieldList.filter(item => item.Product_Family__c === this.selectedFamily).map(item => item.Type__c))];
            console.log('this.typeOptionsWithFamily------>', JSON.stringify(this.typeOptionsWithFamily));
            this.showType = true;
        }
    }

    filterProducts() {
        if (this.selectedType && this.selectedFamily) {
            this.newFieldList = this.fieldList.filter(item =>
                item.Type__c === this.selectedType && item.Product_Family__c === this.selectedFamily
            );
        } else if (this.selectedType) {
            this.newFieldList = this.fieldList.filter(item => item.Type__c === this.selectedType);
        } else if (this.selectedFamily) {
            this.newFieldList = this.fieldList.filter(item => item.Product_Family__c === this.selectedFamily);
        } else {
            this.newFieldList = this.fieldList;
        }
        console.log('this.newFieldList---->', JSON.stringify(this.newFieldList));
        this.showProducts = true;
    }

}
