define(['knockout',
    'durandal/app',
    'plugins/http',
    'plugins/router',
    'helpers/factoryObjects',
    'helpers/utilities',
    'services/getAvailables',
    'knockout.validation'
], function (ko, app, http, router, factoryObjects, utilities, services) {

    var knockoutValidationSettings = {
        grouping: {
            deep: true,
            observable: true
        }
    };
    ko.validation.init(knockoutValidationSettings, true);


    var ProfileModel = function () {
        var self = this;

        // Constants on view
        self.pageTitle = CREATE_TITLE;
        self.labelOrganization = ORGANIZATION;
        self.labelGroup = GROUP;
        self.labelRole = ROLE;
        self.labelFirstName = FIRS_TNAME;
        self.labelLastName = LAST_NAME;
        self.labelPersonnelID = PERSONNEL_ID;
        self.labelMobilePhone = MOBILE;
        self.labelPrivatePhone = PRIVATE_PHONE;
        self.labelWorkPhone = WORK_PHONE;
        self.labelEmail = EMAIL;
        self.sameNotice = SAME_NOTICE;
        // Constants on view

        self.activate = function (idUserEdit) {
            self.isEditing = (idUserEdit != undefined) ? true : false;
            
            if (self.isEditing) {
                self.pageTitle = `${EDIT_TITLE}: ${idUserEdit}`;
            }

            var result = services.getAvailables();

            return  result.then(function(availables) {
                        [self.availableOrganizations, self.availableGroups, self.availableRoles] = availables;

                        self.init();
                        self.validated = ko.validatedObservable(self);
                    }, 
                    function(error) {
                        throw new Error(error);
                    });
        };

        // Init for available
        self.availableOrganizations = [];
        self.availableGroups = [];
        self.availableRoles = [];

        self.availableGroupsBelongOrg = ko.observableArray([]);

        // Main title
        self.titleOrganization = ko.observable();
        self.titleMainGroup = ko.observable();
        self.titleMainRole = ko.observable();
        self.titleMainEmail = ko.observable();

        // Init observable error show on popup
        self.textFieldRequired = ko.observable(REQUIRED_NOTICE);

        // Init error when server sendback
        self.errorList = ko.observableArray([]);

        self.init = function () {
            self.errorList([]);

            self.firstName = ko.observable("").extend({ required: { params: true, message: REQUIRED_NOTICE} });
            self.lastName = ko.observable("").extend({ required: { params: true, message: REQUIRED_NOTICE } });
            self.fullName = ko.computed(function () {
                return self.firstName() + " " + self.lastName();
            });

            self.personnelID = ko.observable("").extend({ required: { params: true, message: REQUIRED_NOTICE } });

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
                // Clear
                self.availableGroupsBelongOrg.removeAll();
                self.selectedGroups.removeAll();

                // Set default one field 
                self.addGroup();

                for (i = 0; i < self.availableGroups.length; i++) {
                    if (self.availableGroups[i].organization.id == value) {
                        self.availableGroupsBelongOrg.push(self.availableGroups[i]);
                    }
                }

                // Set title
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

                if (self.selectedGroups().map(e => e.value()).indexOf(value) == self.mainGroup()) {
                    self.titleMainGroup(value.name);
                }
            });

            self.selectedGroups = ko.observableArray([{ value: self.groupValue }]);

            //  Init for selectedRole
            self.roleValue = ko.observable();
            self.roleValue.subscribe(function (value) {
                factoryObjects.handleOnSameSelected(self.selectedRoles, self.rolesIsSame);

                if (self.selectedRoles().map(e => e.value()).indexOf(value) == self.mainRole()) {
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
                            message: WRONG_NOTICE,
                            params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                        }
                    })
            }]);

            self.privatePhoneNumbers = ko.observableArray([{
                value: ko.observable("")
                    .extend({ required: { params: false, message: REQUIRED_NOTICE } })
                    .extend({
                        required: true,
                        pattern: {
                            message: WRONG_NOTICE,
                            params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                        }
                    })
            }]);

            self.mobileNumbers = ko.observableArray([{
                value: ko.observable("")
                    .extend({
                        required: true,
                        pattern: {
                            message: WRONG_NOTICE,
                            params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                        }
                    })
            }]);

            self.emailValue = ko.observable("")
                .extend({ required: { params: true, message: REQUIRED_NOTICE } })
                .extend({ email: { params: true, message: WRONG_NOTICE } });
            self.emailValue.subscribe(function (value) {
                self.titleMainEmail(value);
            });

            self.workEmails = ko.observableArray([{ value: self.emailValue }]);

            self.profileImage = "";
            self.photoUrl = ko.observable('assets/img/faces/face-2.jpg');
        };

        // 
        // START UPLOAD IMAGE
        self.imageUpload = function (data, e) {
            var file = e.target.files[0];

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
                            message: WRONG_NOTICE,
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
                    .extend({ required: { params: false, message: REQUIRED_NOTICE } })
                    .extend({
                        required: false,
                        pattern: {
                            message: WRONG_NOTICE,
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
                            message: WRONG_NOTICE,
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
                .extend({ required: { params: true, message: REQUIRED_NOTICE } })
                .extend({ email: { params: true, message: WRONG_NOTICE } });
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

                app.showMessage(CREATE_CONFIRM, 'Verify', [YES, NO]).then(function (result) {
                    if (result == YES) {
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

                        http.post(DOMAIN_DEV + 'api/user', newProfile)
                            .then(function (response) {
                                // Created new user

                                app.showMessage(DONE, SUCCESS, [YES]).then(function (result) {
                                    if (result == YES) {
                                        //refreshView
                                        self.init();

                                        //navigateToProfile via id
                                        router.navigate('profile/' + response);
                                    }
                                });

                            }, function (response) {
                                if (response.status != 200) {

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
    }

    return new ProfileModel();
});