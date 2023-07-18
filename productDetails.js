import { LightningElement, wire, track,api } from 'lwc';
import Id from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import UserNameFld from '@salesforce/schema/User.Name';
import UserEmailFld from '@salesforce/schema/User.Email';
import fetchProducts from '@salesforce/apex/GetChild.fetchProducts';
import createUserLoginRecord from '@salesforce/apex/UserLoginDetailsController.createUserLoginRecord';
export default class ProductDetails extends LightningElement {
    userId = Id;
   @api currentUserName;
    @api userName;
    @api loginTime;
   @api UserEmailFld;
  visitedLink='My Products';

    @wire(getRecord, { recordId: Id, fields: [UserNameFld,UserEmailFld] })
    userDetails({ error, data }) {
        if (data) {
            this.currentUserName = data.fields.Name.value;
            this.UserEmailFld = data.fields.Email.value;
        } else if (error) {
            this.error = error;
        }
    }



    @track currentContent = 'Product';
    @track tutorialValue = false;
    @track integrationValue = false;
    @track visualforceValue = false;
    @track triggerValue = false;
    @track jqueryJavascriptValue = false;
    @track salesforceLwcValue = false;


    changeHandleAction(event) {
        const selected = event.detail.name;

        this.currentContent = selected;

        if (selected == 'product') {
            this.productValue = true;
            createUserLoginRecord({
                userName: this.currentUserName,
                loginTime: this.loginTime,
                visitedLink:this.visitedLink
                
            })
                .then(() => {
                    console.log('Record created successfully.');
                    // Add any success handling logic here
                })
                .catch((error) => {
                    console.error('Record creation error: ', error);
                    // Add any error handling logic here
                });
        }
        else {
            this.productValue = false;
        }

        if (selected == 'service') {
            this.serviceValue = true;
        } else {
            this.serviceValue = false;
        }

        if (selected == 'claims') {
            this.claimsValue = true;
        } else {
            this.claimsValue = false;
        }

        if (selected == 'helpCenter') {
            this.helpCenterValue = true;
        } else {
            this.helpCenterValue = false;
        }

    }

    records;
    error;

    @wire(fetchProducts)
    wiredProducts({ error, data }) {

        if (data) {

            console.log('Fetched Data ' + JSON.stringify(data));
            this.records = data;
            this.records = data.map(record => ({ ...record, iconName: 'utility:chevrondown' }));

        } else if (error) {

            this.error = error;
            this.records = undefined;

        }

    }

    hideAndShow(event) {

        let indx = event.target.dataset.recordId;
        console.log('Index is ' + indx);

        if (this.records) {

            let recs = JSON.parse(JSON.stringify(this.records));
            let currVal = recs[indx].hideBool;
            console.log('Current Val ' + currVal);
            recs[indx].hideBool = !currVal;
            recs[indx].iconName = currVal ? 'utility:chevronup' : 'utility:chevrondown';
            this.records = recs;
            console.log('After Change ' + this.records[indx].hideBool);

        }

    }
}