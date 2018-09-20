define(['knockout',
        'jquery', 
        'durandal/app', 
        'plugins/http', 
        './httpGet', 
        'plugins/router', 
        'factoryObjects',
        'utilities',
        'knockout.validation'
    ], function (ko, $, app, http, httpGet, router, factoryObjects, utilities) {

    var knockoutValidationSettings = {
        grouping: {
            deep: true,
            observable: true
        }
    };
    ko.validation.init(knockoutValidationSettings, true);

    var ProfileModel = function () {
        var self = this;

        // Init for available
        self.availableOrganizations = httpGet.availableOrganizations;
        self.availableGroups = httpGet.availableGroups;
        self.availableRoles = httpGet.availableRoles;
        self.availableGroupsBelongOrg = ko.observableArray([]);

        // Main title
        self.titleOrganization = ko.observable();
        self.titleMainGroup = ko.observable();
        self.titleMainRole = ko.observable();
        self.titleMainEmail = ko.observable();

        // Init observable error show on popup
        self.textFieldRequired = ko.observable("This field is required");

        // Init error when server sendback
        self.errorList = ko.observableArray([]);
    
        self.init = function () {
            self.errorList([]);

            self.firstName = ko.observable("").extend({ required: { params: true, message: 'This field is required.' } });
            self.lastName = ko.observable("").extend({ required: { params: true, message: 'This field is required.' } });
            self.fullName = ko.computed(function () {
                return self.firstName() + " " + self.lastName();
            });

            self.personnelID = ko.observable("").extend({ required: { params: true, message: 'This field is required.' } });

            // Init for main Field
            self.mainGroup = ko.observable(0).extend({ required: { params: true, message: '_' } });
            self.mainRole = ko.observable(0).extend({ required: { params: true, message: '_' } });
            self.mainWorkPhoneNumber = ko.observable(0).extend({ required: { params: true, message: '_' } });
            self.mainMobileNumber = ko.observable(0).extend({ required: { params: true, message: '_' } });
            self.mainPrivatePhoneNumber = ko.observable(0).extend({ required: { params: true, message: '_' } });
            self.mainWorkEmail = ko.observable(0).extend({ required: { params: true, message: '_' } });

            // subscribe for set main title
            self.mainGroup.subscribe(function (value) {
                self.titleMainGroup(self.selectedGroups()[value].value().name);
            });

            self.mainRole.subscribe(function (value) {
                self.titleMainRole(self.selectedRoles()[value].value().name);
            });

            self.mainWorkEmail.subscribe(function (value) {
                self.titleMainEmail(self.workEmails()[value].value());
            });

            // Init for isSameValue
            self.groupsIsSame = ko.observable(false);
            self.rolesIsSame = ko.observable(false);

            //  Init for selectedOranization
            self.selectedOrganization = ko.observable();
            self.selectedOrganization.subscribe(function (value) {
                console.log(value);
                self.availableGroupsBelongOrg([]);

                for (i = 0; i < self.availableGroups.length; i++) {
                    if (self.availableGroups[i].organization.id == value) {
                        self.availableGroupsBelongOrg.push(self.availableGroups[i]);
                    }
                }

                self.availableOrganizations.forEach(element => {
                    if (element.id == value) {
                        self.titleOrganization(element.name);
                    }
                });
            });

            //  Init for selectedGroup
            self.groupValue = ko.observable(self.availableGroupsBelongOrg()[0]);
            self.groupValue.subscribe(function (value) {
                factoryObjects.handleOnSameSelected(self.selectedGroups, self.groupsIsSame);

                // if (self.selectedGroups().map( e => e.value() ).indexOf(value) == self.mainGroup()) {
                //     self.titleMainGroup(value.name);
                // }
            });

            self.selectedGroups = ko.observableArray([{ value: self.groupValue }]);

            //  Init for selectedRole
            self.roleValue = ko.observable();
            self.roleValue.subscribe(function (value) {
                factoryObjects.handleOnSameSelected(self.selectedRoles, self.rolesIsSame);

                if (self.selectedRoles().map( e => e.value() ).indexOf(value) == self.mainRole()) {
                    self.titleMainRole(value.name);
                }
            });

            self.selectedRoles = ko.observableArray([{ value: self.roleValue }]);

            ////////////////////////////////////////
            self.workPhoneNumbers = ko.observableArray([{
                value: ko.observable("")
                    .extend({
                        required: true,
                        pattern: {
                            message: 'This number is wrong.',
                            params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                        }
                    })
            }]);

            self.privatePhoneNumbers = ko.observableArray([{
                value: ko.observable("")
                    .extend({ required: { params: false, message: 'This field is required.' } })
                    .extend({
                        required: true,
                        pattern: {
                            message: 'This number is wrong.',
                            params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                        }
                    })
            }]);

            self.mobileNumbers = ko.observableArray([{
                value: ko.observable("")
                    .extend({
                        required: true,
                        pattern: {
                            message: 'This number is wrong.',
                            params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                        }
                    })
            }]);

            self.emailValue = ko.observable("")
                    .extend({ required: { params: true, message: 'This field is required.' } })
                    .extend({ email: { params: true, message: 'This email is wrong.' } });
            self.emailValue.subscribe(function (value) {
                self.titleMainEmail(value);
            });

            // self.emailValue =  ko.observable("")
            //     .extend({ required: { params: true, message: 'This field is required.' } })

            self.workEmails = ko.observableArray([{ value: self.emailValue }]);

            self.profileImage = "";
            self.photoUrl = ko.observable('assets/img/faces/face-2.jpg');
        };

        // 
        // START UPLOAD IMAGE
        self.imageUpload = function (data, e) {
            var file = e.target.files[0];

            console.log("file----------------------------");
            console.log(file);

            var reader = new FileReader();

            reader.onloadend = function (onloadend_e) {
                self.profileImage = reader.result; // Here is your base 64 encoded file
                self.photoUrl(self.profileImage);
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        }
        // END UPLOAD IMAGE
        //    

        // Functions on Group
        self.addGroup = function () {
            factoryObjects.addIntelValue(self.availableGroupsBelongOrg(), self.selectedGroups, self.groupsIsSame, self.mainGroup, self.titleMainGroup);
        };

        self.removeGroup = function (group) {
            self.selectedGroups.remove(group);
            factoryObjects.handleOnSameSelected(self.selectedGroups, self.groupsIsSame);     
            
            if (self.mainGroup() == self.selectedGroups().length && self.selectedGroups().length > 0) {
                self.mainGroup(self.selectedGroups().length - 1)
            }
        };

        // Functions on Role
        self.addRole = function () {
            factoryObjects.addIntelValue(self.availableRoles, self.selectedRoles, self.rolesIsSame, self.mainRole, self.titleMainRole);
        };

        self.removeRole = function (role) {
            self.selectedRoles.remove(role);
            factoryObjects.handleOnSameSelected(self.selectedRoles, self.rolesIsSame);

            if (self.mainRole() == self.selectedRoles().length && self.selectedRoles().length > 0) {
                self.mainRole(self.selectedRoles().length - 1)
            }
        };

        // Functions on WorkPhoneNumber
        self.addWorkPhoneNumber = function () {
            self.workPhoneNumbers.push({
                value: ko.observable("")
                    .extend({
                        required: true,
                        pattern: {
                            message: 'This number is wrong.',
                            params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                        }
                    })
            });
        };
        self.removeWorkPhoneNumber = function (workPhoneNumber) {
            self.workPhoneNumbers.remove(workPhoneNumber);
        };

        // Functions on PrivateNumber
        self.addPrivatePhoneNumber = function () {
            self.privatePhoneNumbers.push({
                value: ko.observable("")
                    .extend({ required: { params: false, message: 'This field is required.' } })
                    .extend({
                        required: false,
                        pattern: {
                            message: 'This number is wrong.',
                            params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                        }
                    })
            });
        };
        self.removePrivatePhoneNumber = function (privatePhoneNumber) {
            self.privatePhoneNumbers.remove(privatePhoneNumber);
        };

        // Functions on MobileNumber
        self.addMobileNumber = function () {
            self.mobileNumbers.push({
                value: ko.observable("")
                    .extend({
                        required: true,
                        pattern: {
                            message: 'This number is wrong.',
                            params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                        }
                    })
            });
        };
        self.removeMobileNumber = function (mobileNumber) {
            self.mobileNumbers.remove(mobileNumber);
        };

        // Functions on Email
        self.addWorkEmail = function () {
            let emailValue = ko.observable("")
                    .extend({ required: { params: true, message: 'This field is required.' } })
                    .extend({ email: { params: true, message: 'This email is wrong.' } });
            emailValue.subscribe(function (value) {
                self.titleMainEmail(value);
            });

            self.workEmails.push({ value: emailValue });
        };
        self.removeWorkEmail = function (workEmail) {
            self.workEmails.remove(workEmail);
        };

        // Submit form
        self.create = function () {
            if (!self.validated.isValid() || self.rolesIsSame() || self.groupsIsSame()) {
                self.validated.errors.showAllMessages();
            } else {

                app.showMessage('Are you sure you want to create new User?', 'Verify', ['Yes', 'No']).then(function (result) {
                    if (result == 'Yes') {
                        // Contract create
                        var newProfile = {
                            id: self.personnelID(),
                            firstName: self.firstName(),
                            lastName: self.lastName(),
                            organizationId: self.selectedOrganization(),
                            groups: utilities.jsonSerializeSelected(self.selectedGroups(), self.mainGroup()),
                            roles: utilities.jsonSerializeSelected(self.selectedRoles(), self.mainRole()),
                            workPhone: utilities.jsonSerializeInputTextForNumber(self.workPhoneNumbers(), self.mainWorkPhoneNumber()),
                            privatePhone: utilities.jsonSerializeInputTextForNumber(self.privatePhoneNumbers(), self.mainPrivatePhoneNumber()),
                            mobile: utilities.jsonSerializeInputTextForNumber(self.mobileNumbers(), self.mainMobileNumber()),
                            email: utilities.jsonSerializeInputTextForEmail(self.workEmails(), self.mainWorkEmail()),
                            profileImage: self.profileImage
                        };

                        http.post('https://localhost:5001/api/user', newProfile)
                            .then(function (response) {
                                // Created new user
                                console.log('Creatting new user');
                                console.log(newProfile);
                                console.log('------------------');

                                app.showMessage('Done!', 'Successfully', ['Yes']).then(function (result) {
                                    if (result == 'Yes') {
                                        //refreshView
                                        self.init();

                                        //navigateToProfile via id
                                        router.navigate('profile/' + response);
                                    }
                                });

                            }, function (response) {
                                if (response.status != 200) {
                                    console.log('ERROR when Create new user');
                                    console.log(response);
                                    console.log('--------------------------');

                                    self.errorList.removeAll();

                                    if (response.responseJSON != null) {
                                        response.responseJSON.forEach(element => {
                                            self.errorList.push(element);
                                        });
                                    } else {
                                        self.errorList.push(response.responseText);
                                    }
                                }
                            });
                    }
                });
            }
        };

        self.activate = function () {
            self.init();
        };

        // init validated all form
        self.compositionComplete = function () {
            self.validated = ko.validatedObservable(self);
        };
    }

    return new ProfileModel();
});