define([
    'knockout',
    'durandal/app',
    'plugins/http',
    'plugins/router',
    './httpGet',
    'factoryObjects',
    'utilities',
    'data.ex.profile',
    'knockout.validation'
], function (ko, app, http, router, httpGet, factoryObjects, utilities, dataEx) {

    // 
    // 
    // Config KO Validation
    // 
    // 

    var knockoutValidationSettings = {
        grouping: {
            deep: true,
            observable: true
        }
    };
    ko.validation.init(knockoutValidationSettings, true);

    // 
    // 
    // Define model 
    // 
    // 

    var ProfileModel = function () {
        var self = this;

        self.pageTitle = DETAIL_TITLE;

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

        self.textFieldRequired = ko.observable(REQUIRED_NOTICE);

        // 
        // START UPLOAD IMAGE
        self.photoUrl = ko.observable();
        self.profileImage = "";

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

        // Init For Name
        self.firstName = ko.observable("").extend({
            required: {
                params: true,
                message: REQUIRED_NOTICE
            }
        });

        self.lastName = ko.observable("").extend({
            required: {
                params: true,
                message: REQUIRED_NOTICE
            }
        });

        self.fullName = ko.computed(function () {
            return self.firstName() + " " + self.lastName();
        });

        // Init Id
        self.personnelID = null;

        // Init for available
        self.availableGroups = httpGet.availableGroups;
        self.availableOrganizations = httpGet.availableOrganizations;
        self.availableRoles = httpGet.availableRoles;
        self.availableGroupsBelongOrg = ko.observableArray([]);

        // Init for mainSelected
        self.mainGroup = ko.observable(0).extend({ required: { params: true, message: '_' } });
        self.mainRole = ko.observable(0).extend({ required: { params: true, message: '_' } });
        self.mainWorkPhoneNumber = ko.observable().extend({ required: { params: true, message: '_' } });
        self.mainMobileNumber = ko.observable().extend({ required: { params: true, message: '_' } });
        self.mainPrivatePhoneNumber = ko.observable().extend({ required: { params: false, message: '_' } });
        self.mainWorkEmail = ko.observable().extend({ required: { params: true, message: '_' } });

        // Init for isSameValue
        self.groupsIsSame = ko.observable(false);
        self.rolesIsSame = ko.observable(false);

        //  Init for selectedOranization
        self.selectedOrganization = ko.observable();
        self.selectedOrganization.subscribe(function () {
            // Clear
            self.availableGroupsBelongOrg.removeAll();
            self.GroupsForMe.removeAll();

            // Set default one field 
            self.addGroup();

            for (i = 0; i < self.availableGroups.length; i++) {
                if (self.availableGroups[i].organization.id == self.selectedOrganization()) {
                    self.availableGroupsBelongOrg.push(self.availableGroups[i]);
                }
            }
        });

        // Init for selectedGroup 
        self.GroupsForMe = ko.observableArray();

        // Init for selectedRole
        self.RolesForMe = ko.observableArray();

        /////////////////////////  //////  //////  //////  //////  //////  //////  

        self.addGroup = function () {
            factoryObjects.addIntelValue(self.availableGroupsBelongOrg(), self.GroupsForMe, self.groupsIsSame, null, null);
        };

        self.removeGroup = function (group) {
            self.GroupsForMe.remove(group);
            factoryObjects.handleOnSameSelected(self.GroupsForMe, self.groupsIsSame);            

            if (self.mainGroup() == self.GroupsForMe().length && self.GroupsForMe().length > 0) {
                self.mainGroup(self.GroupsForMe().length - 1)
            }
        };

        /////////////////////////  //////  //////  //////  //////  //////  //////  

        self.addRole = function () {
            factoryObjects.addIntelValue(self.availableRoles, self.RolesForMe, self.rolesIsSame, null, null);
        };

        self.removeRole = function (role) {
            self.RolesForMe.remove(role);
            factoryObjects.handleOnSameSelected(self.RolesForMe, self.rolesIsSame);

            if (self.mainRole() == self.RolesForMe().length && self.RolesForMe().length > 0) {
                self.mainRole(self.RolesForMe().length - 1)
            }
        };

        //////  //////  //////  //////  //////  //////  //////  //////  //////  //////  

        self.workPhoneNumbers = ko.observableArray();
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

            if (self.mainWorkPhoneNumber() == self.workPhoneNumbers().length && self.workPhoneNumbers().length > 0) {
                self.mainWorkPhoneNumber(self.workPhoneNumbers().length - 1)
            }
        };

        /////////////////////////  //////  //////  //////  //////  //////  //////  

        self.privatePhoneNumbers = ko.observableArray([]);
        self.addPrivatePhoneNumber = function () {
            self.privatePhoneNumbers.push({
                value: ko.observable("")
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

            if (self.mainPrivatePhoneNumber() == self.privatePhoneNumbers().length && self.privatePhoneNumbers().length > 0) {
                self.mainPrivatePhoneNumber(self.privatePhoneNumbers().length - 1)
            }
        };

        /////////////////////////  //////  //////  //////  //////  //////  //////  

        self.mobileNumbers = ko.observableArray();
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

            if (self.mainMobileNumber() == self.mobileNumbers().length && self.mobileNumbers().length > 0) {
                self.mainMobileNumber(self.mobileNumbers().length - 1)
            }
        };


        /////////////////////////  //////  //////  //////  //////  //////  //////  

        self.workEmails = ko.observableArray();

        self.addWorkEmail = function () {
            self.workEmails.push({
                value: ko.observable("")
                    .extend({ required: { params: true, message: REQUIRED_NOTICE } })
                    .extend({ email: { params: true, message: WRONG_NOTICE } })
            });
        };

        self.removeWorkEmail = function (workEmail) {
            self.workEmails.remove(workEmail);

            if (self.mainWorkEmail() == self.workEmails().length && self.workEmails().length > 0) {
                self.mainWorkEmail(self.workEmails().length - 1)
            }
        };

        self.validated = ko.validatedObservable(self);

        // Save func
        self.save = function () {

            if (!self.validated.isValid() || self.rolesIsSame() || self.groupsIsSame()) {
                self.validated.errors.showAllMessages();
            } else {

                app.showMessage(EDIT_CONFORM, 'Verify', [YES, NO])
                    .then(function (result) {
                        // Contract update
                        if (result == YES) {
                            var editedProfile = {
                                id: self.personnelID,
                                firstName: self.firstName(),
                                lastName: self.lastName(),
                                organizationId: self.selectedOrganization(),
                                groups: utilities.jsonSerializeSelected(self.GroupsForMe(), self.mainGroup()),
                                roles: utilities.jsonSerializeSelected(self.RolesForMe(), self.mainRole()),
                                workPhone: utilities.jsonSerializeInputTextForNumber(self.workPhoneNumbers(), self.mainWorkPhoneNumber()),
                                privatePhone: utilities.jsonSerializeInputTextForNumber(self.privatePhoneNumbers(), self.mainPrivatePhoneNumber()),
                                mobile: utilities.jsonSerializeInputTextForNumber(self.mobileNumbers(), self.mainMobileNumber()),
                                email: utilities.jsonSerializeInputTextForEmail(self.workEmails(), self.mainWorkEmail()),
                                profileImage: self.profileImage
                            };

                            http.put(DOMAIN_DEV + 'api/user/', editedProfile)
                                .then(function (response) {

                                    app.showMessage(DONE, SUCCESS, [YES]).then(function (result) {
                                        if (result == YES) {
                                            // navigate to home page
                                            router.navigate('profile/' + response);
                                        }
                                    });
                                }, function (error) {

                                    app.showMessage(error.responseText, 'Error!', [YES]);
                                });
                        }
                    });
            }
        };

        // Delete profile func
        self.deleteProfile = function () {
            app.showMessage(DELETE_CONFIRM, 'Verify', [YES, NO])
                .then(function (result) {
                    if (result == "Yes") {
                        if (self.personnelID) {

                            http.remove(DOMAIN_DEV + 'api/user/' + self.personnelID)
                                .then(function (response) {

                                    app.showMessage(DONE, SUCCESS, [YES]).then(function (result) {
                                        if (result ==YES) {
                                            // navigate to home page
                                            router.navigate('');
                                        }
                                    });
                                }, function (error) {

                                    app.showMessage(error.responseText, 'Error!', [YES]);
                                });
                        }
                    }
                });
        }

        // Cancle func
        self.cancle = function () {
            router.navigate('profile/' + self.personnelID);
        }


        // Mapping data func
        self.mapDataByObject = function (u) {
            // Check via id user
            if (self.personnelID != u.id) {
                app.showMessage('Get Wrong User', 'Wrong!', [YES]);
                router.navigate('');
            }
        

            // 
            // 
            // simple
            // 
            // 
            self.firstName(u.firstName);
            self.lastName(u.lastName);
            self.photoUrl(u.profileImage);
            self.profileImage = u.profileImage;

            // 
            // 
            // organizations
            // 
            // 

            self.selectedOrganization(u.organization.id);

            // 
            // 
            // groups
            // 
            // 

            self.availableGroupsBelongOrg([]);
            var len = 0;
            for (let i = 0; i < self.availableGroups.length; i++) {
                if (self.availableGroups[i].organization.id == self.selectedOrganization()) {
                    self.availableGroupsBelongOrg.push(self.availableGroups[i]);
                    len++;
                }
            }

            if (self.availableGroupsBelongOrg().length == 0)
                return;

            // Clear
            self.GroupsForMe([]);

            // Binding Groups
            for (let i = 0; i < u.groups.length; i++) {
                // Must get Object belong available list (== adress), to set default value of select element on DOM
                let index = 0;
                for (let j = 0; j < self.availableGroupsBelongOrg().length; j++) {
                    if (self.availableGroupsBelongOrg()[j].id == u.groups[i].id) {
                        index = j;
                        break;
                    }
                }

                // Must use observable to subscribe
                let groupValue = ko.observable(self.availableGroupsBelongOrg()[index]);
                groupValue.subscribe(function () {
                    // Must wait for availableGroupsBelongOrg init done.
                    if (self.availableGroupsBelongOrg().length == len) {
                        factoryObjects.handleOnSameSelected(self.GroupsForMe, self.groupsIsSame);
                    }
                });

                self.GroupsForMe.push( {value: groupValue} );

                // Set main group
                if (u.groups[i].isMain) {
                    self.mainGroup(i);
                }
            }

            // 
            // 
            // roles
            // 
            // 

            // Clear
            self.RolesForMe([]);

            // Binding Roles
            for (let i = 0; i < u.roles.length; i++) {
                  // Must get Object belong available list (== adress), to set default value of select element on DOM
                  let index = 0;
                  for (let j = 0; j < self.availableRoles.length; j++) {
                      if (self.availableRoles[j].id == u.roles[i].id) {
                          index = j;
                          break;
                      }
                  }
  
                  // Must use observable to subscribe
                  let roleValue = ko.observable(self.availableRoles[index]);
                  roleValue.subscribe(function () {
                      factoryObjects.handleOnSameSelected(self.RolesForMe, self.rolesIsSame);            
                  });
  
                  self.RolesForMe.push( {value: roleValue} );

                // binding main role
                if (u.roles[i].isMain) {
                    self.mainRole(i);
                }

            }

            // 
            // 
            // workPhoneNumbers
            // 
            // 

            self.workPhoneNumbers([]);

            for (let i = 0; i < u.workPhone.length; i++) {

                self.workPhoneNumbers.push({
                    value: ko.observable(u.workPhone[i].number)
                        .extend({
                            required: true,
                            pattern: {
                                message: WRONG_NOTICE,
                                params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                            }
                        })
                });

                // binding main work phone
                if (u.workPhone[i].isMain) {
                    self.mainWorkPhoneNumber(i);
                }

            }

            // 
            // 
            // mobileNumbers
            // 
            // 

            self.mobileNumbers([]);

            for (let i = 0; i < u.mobile.length; i++) {
                self.mobileNumbers.push({
                    value: ko.observable(u.mobile[i].number)
                        .extend({
                            required: true,
                            pattern: {
                                message: WRONG_NOTICE,
                                params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                            }
                        })
                });

                // binding main mobile phone
                if (u.mobile[i].isMain) {
                    self.mainMobileNumber(i);
                }
            }

            // 
            // 
            // privatePhoneNumbers
            // 
            // 

            self.privatePhoneNumbers([]);

            for (let i = 0; i < u.privatePhone.length; i++) {

                self.privatePhoneNumbers.push({
                    value: ko.observable(u.privatePhone[i].number)
                        .extend({
                            required: false,
                            pattern: {
                                message: WRONG_NOTICE,
                                params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                            }
                        })
                });

                // binding main private phone
                if (u.privatePhone[i].isMain) {
                    self.mainPrivatePhoneNumber(i);
                }

            }


            // 
            // 
            // workEmails
            // 
            // 

            self.workEmails([]);

            for (let i = 0; i < u.email.length; i++) {
                self.workEmails.push({
                    value: ko.observable(u.email[i].address)
                        .extend({ required: { params: true, message: REQUIRED_NOTICE } })
                        .extend({ email: { params: true, message: WRONG_NOTICE } })
                });

                // binding main email
                if (u.email[i].isMain) {
                    self.mainWorkEmail(i);
                }
            }

        }

        self.bindingDataByID = function (id) {
            // recieve data from server 
            http.get(DOMAIN_DEV + 'api/user/' + id)
                .then(function (u) {

                    self.personnelID = u.id;
                    self.mapDataByObject(u);

                    // use data example (dataEx) to test
                    // self.mapDataByObject(dataEx);
                },
                    function (error) {

                        app.showMessage(error.statusText + " " + error.responseText, 'Error!', [YES]);
                    });
        }

        self.activate = function (id) {
            self.groupsIsSame(false);
            self.rolesIsSame(false);

            self.bindingDataByID(id);
        };

    };



    return new ProfileModel();
});
