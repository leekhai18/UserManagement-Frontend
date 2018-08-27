define(['knockout', 'jquery', 'durandal/app', 'knockout.validation'], function (ko, $, app){
    var knockoutValidationSettings = {
        grouping: {
            deep: true,
            observable: true
        }
    };
    ko.validation.init(knockoutValidationSettings, true);

    var Organization = function(id, name) {
        this.id = id;
        this.name = name;
    };
    
    var ProfileModel = function (){
        var self = this;

        self.firstName = ko.observable("").extend({ required: { params: true, message: 'This field is required.' } });

        self.lastName = ko.observable("").extend({ required: { params: true, message: 'This field is required.' } });

        self.fullName = ko.computed(function() {
            return self.firstName() + " " + self.lastName();
        });

        self.availableOrganization = ko.observableArray([
            new Organization('iduit', 'UIT'),
            new Organization('idrs', 'ROSEN'),
        ]);
        self.selectedOrganization = ko.observable("");

        self.groups = ko.observableArray([{value: ko.observable("").extend({ required: { params: true, message: 'This field is required.' } })}]);
        self.addGroup = function() {
            self.groups.push({value: ko.observable("").extend({ required: { params: true, message: 'This field is required.' } })});
        };
        self.removeGroup = function(group) {
            self.groups.remove(group);
        };

        self.roles = ko.observableArray([{value: ko.observable("").extend({ required: { params: true, message: 'This field is required.' } })}]);
        self.addRole = function() {
            self.roles.push({value: ko.observable("").extend({ required: { params: true, message: 'This field is required.' } })});
        };
        self.removeRole = function(role) {
            self.roles.remove(role);
        };

        self.workPhoneNumbers = ko.observableArray([{value: ko.observable("").extend({ required: { params: true, message: 'This field is required.' } })}]);
        self.addWorkPhoneNumber = function() {
            self.workPhoneNumbers.push({value: ko.observable("").extend({ required: { params: true, message: 'This field is required.' } })});
        };
        self.removeWorkPhoneNumber = function(workPhoneNumber) {
            self.workPhoneNumbers.remove(workPhoneNumber);
        };

        self.mobileNumbers = ko.observableArray([{value: ko.observable("").extend({ required: { params: true, message: 'This field is required.' } })}]);
        self.addMobileNumber = function() {
            self.mobileNumbers.push({value: ko.observable("").extend({ required: { params: true, message: 'This field is required.' } })});
        };
        self.removeMobileNumber = function(mobileNumber) {
            self.mobileNumbers.remove(mobileNumber);
        };

        self.workEmails = ko.observableArray([{value: ko.observable("").extend({ required: { params: true, message: 'This field is required.' } })}]);
        self.addWorkEmail = function() {
            self.workEmails.push({value: ko.observable("").extend({ required: { params: true, message: 'This field is required.' } })});
        };
        self.removeWorkEmail = function(workEmail) {
            self.workEmails.remove(workEmail);
        };

        self.validated = ko.validatedObservable(self);

        self.create = function() {
            // if (!self.validated.isValid()) {
            //     self.validated.errors.showAllMessages();
            // } else {
            //     app.showMessage('Are you sure you want to create new User?', 'Verify', ['Yes', 'No']).then(function(result) {
            //         if (result == 'Yes') {

            //         }
            //     });
            // }   

            var newProfile = {
                firstName: self.firstName(),
                lastName: self.lastName(),
                organization: self.selectedOrganization(),
                // mainGroup: ko.toJS(self.groups())[0].value,
                // groups: ko.toJS(self.groups()),
                // mainRole: ko.toJS(self.roles())[0].value,
                // roles: ko.toJS(self.roles()),
                // mainWorkPhoneNumber: ko.toJS(self.workPhoneNumbers())[0].value,
                // workPhoneNumbers: ko.toJS(self.workPhoneNumbers()),
                // mainMobilePhone: ko.toJS(self.mobileNumbers())[0].value,
                // mobilePhones: ko.toJS(self.mobileNumbers()),
                // mainWorkEmail: ko.toJS(self.workEmails())[0].value,
                // workEmails: ko.toJS(self.workEmails()),
            };   
            
            console.log(JSON.stringify(newProfile));
        }
    }
    
    return new ProfileModel();
});