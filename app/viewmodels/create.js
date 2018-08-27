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

    var Group = function(id, name) {
        this.id = id;
        this.name = name;
    };

    var Role = function(id, name) {
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

        self.availableOrganizations = [  new Organization('iduit', 'UIT'),
                                        new Organization('idrs', 'ROSEN')];
        self.selectedOrganization = ko.observable();

        self.availableGroups = [new Group('id1', 'group1'),
                                new Group('id2', 'group2')];
        self.selectedGroups = ko.observableArray([{value: ko.observable("")}]);
        self.addGroup = function() {
            self.selectedGroups.push({value: ko.observable()});
        };
        self.removeGroup = function(group) {
            self.selectedGroups.remove(group);
        };

        self.availableRoles = [ new Role('id1', 'role1'),
                                new Role('id2', 'role2')];
        self.selectedRoles = ko.observableArray([{value: ko.observable("")}]);
        self.addRole = function() {
            self.selectedRoles.push({value: ko.observable("")});
        };
        self.removeRole = function(role) {
            self.selectedRoles.remove(role);
        };

        self.workPhoneNumbers = ko.observableArray([{value: ko.observable("").extend({ required: { params: true, message: 'This field is required.' } })}]);
        self.addWorkPhoneNumber = function() {
            self.workPhoneNumbers.push({value: ko.observable("").extend({ required: { params: true, message: 'This field is required.' } })});
        };
        self.removeWorkPhoneNumber = function(workPhoneNumber) {
            self.workPhoneNumbers.remove(workPhoneNumber);
        };

        self.privatePhoneNumbers = ko.observableArray([{value: ko.observable("")}]);
        self.addPrivatePhoneNumber = function() {
            self.privatePhoneNumbers.push({value: ko.observable("")});
        };
        self.removePrivatePhoneNumber = function(privatePhoneNumber) {
            self.privatePhoneNumbers.remove(privatePhoneNumber);
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
            if (!self.validated.isValid()) {
                self.validated.errors.showAllMessages();
            } else {
                app.showMessage('Are you sure you want to create new User?', 'Verify', ['Yes', 'No']).then(function(result) {
                    if (result == 'Yes') {
                        var newProfile = {
                            firstName: self.firstName(),
                            lastName: self.lastName(),
                            organization: self.selectedOrganization(),
                            mainGroup: ko.toJS(self.selectedGroups())[0].value,
                            groups: reduceJSON(ko.toJS(self.selectedGroups())),
                            mainRole: ko.toJS(self.selectedRoles())[0].value,
                            roles: reduceJSON(ko.toJS(self.selectedRoles())),
                            phone: {
                                main: ko.toJS(self.workPhoneNumbers())[0].value,
                                work: reduceJSON(ko.toJS(self.workPhoneNumbers())),
                                private: reduceJSON(ko.toJS(self.privatePhoneNumbers()))
                            },
                            mobile: {
                                main: ko.toJS(self.mobileNumbers())[0].value,
                                mobiles: reduceJSON(ko.toJS(self.mobileNumbers()))
                            },
                            email: {
                                main: ko.toJS(self.workEmails())[0].value,
                                emails: reduceJSON(ko.toJS(self.workEmails()))
                            }
                        };   
                        
                        console.log(JSON.stringify(newProfile));
                    }
                });
            }   

            var reduceJSON = function(baseArray) {
                var result = [];
                for (i = 0; i < baseArray.length; i++) {
                    result.push(baseArray[i].value);
                }

                return result;
            };
        }
    }
    
    return new ProfileModel();
});