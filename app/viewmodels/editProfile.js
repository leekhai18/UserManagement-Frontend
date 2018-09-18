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

        self.textFieldRequired = ko.observable("This field is required");

        // 
        // START UPLOAD IMAGE
        self.photoUrl = ko.observable();
        self.profileImage = "";

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

        // Init For Name
        self.firstName = ko.observable("").extend({
            required: {
                params: true,
                message: 'This field is required.'
            }
        });

        self.lastName = ko.observable("").extend({
            required: {
                params: true,
                message: 'This field is required.'
            }
        });

        self.fullName = ko.computed(function () {
            return self.firstName() + " " + self.lastName();
        });

        // Init Id
        self.personnelID = ko.observable("");

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
        self.mainPrivatePhoneNumber = ko.observable().extend({ required: { params: true, message: '_' } });
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
            factoryObjects.addIntelValue(self.availableGroupsBelongOrg(), self.GroupsForMe, self.groupsIsSame);
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
            factoryObjects.addIntelValue(self.availableRoles, self.RolesForMe, self.rolesIsSame);
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
                            message: 'This number is wrong.',
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
                            message: 'This number is wrong.',
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
                            message: 'This number is wrong.',
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
                    .extend({ required: { params: true, message: 'This field is required.' } })
                    .extend({ email: { params: true, message: 'This email is wrong.' } })
            });
        };

        self.removeWorkEmail = function (workEmail) {
            self.workEmails.remove(workEmail);

            if (self.mainWorkEmail() == self.workEmails().length && self.workEmails().length > 0) {
                self.mainWorkEmail(self.workEmails().length - 1)
            }
        };

        self.personalID = null;

        self.validated = ko.validatedObservable(self);

        // Save func
        self.save = function () {

            if (!self.validated.isValid()) {
                self.validated.errors.showAllMessages();
            } else {

                app.showMessage('Are you sure you want to edit profile?', 'Verify', ['Yes', 'No'])
                    .then(function (result) {
                        if (result == 'Yes') {
                            var editedProfile = {
                                firstName: self.firstName(),
                                lastName: self.lastName(),
                                organizationId: self.selectedOrganization(),
                                groups: utilities.jsonSerializeSelected(self.GroupsForMe(), self.mainGroup()),
                                roles: utilities.jsonSerializeSelected(self.RolesForMe(), self.mainRole()),
                                workPhone: utilities.jsonSerializeInputText(self.workPhoneNumbers(), self.mainWorkPhoneNumber()),
                                privatePhone: utilities.jsonSerializeInputText(self.privatePhoneNumbers(), self.mainPrivatePhoneNumber()),
                                mobile: utilities.jsonSerializeInputText(self.mobileNumbers(), self.mainMobileNumber()),
                                email: utilities.jsonSerializeInputText(self.workEmails(), self.mainWorkEmail()),
                                profileImage: self.profileImage
                            };

                            console.log("editedProfile: ");
                            console.log(editedProfile);

                            // http.put('https://localhost:5001/api/user/' + self.personnelID(), editedProfile)
                            //     .then(function (response) {
                            //         console.log('Updating user by id');
                            //         console.log(response);
                            //         console.log('-------------------');

                            //         app.showMessage('Done!', 'Successfully', ['Yes']).then(function (result) {
                            //             if (result == 'Yes') {
                            //                 console.log(editedProfile);
                            //             }
                            //         });
                            //     }, function (error) {
                            //         console.log('ERROR when Update user by id');
                            //         console.log(error);
                            //         console.log('----------------------------');

                            //         app.showMessage(error.responseText, 'Error!', ['Yes']);
                            //     });
                        }
                    });
            }
        };

        // Delete profile func
        self.deleteProfile = function () {
            app.showMessage('Do you really want to delete this user profile permanently?', 'Verify', ['Yes', 'Can'])
                .then(function (result) {
                    if (result == "Yes") {
                        if (self.personnelID()) {

                            http.remove('https://localhost:5001/api/user/' + self.personnelID())
                                .then(function (response) {
                                    console.log('Deleting user by id');
                                    console.log(response);
                                    console.log('-------------------');

                                    app.showMessage('Done!', 'Successfully', ['Yes']).then(function (result) {
                                        if (result == 'Yes') {
                                            // navigate to home page
                                            router.navigate('');
                                        }
                                    });
                                }, function (error) {
                                    console.log('Error when Delete user by id');
                                    console.log(error);
                                    console.log('----------------------------');

                                    app.showMessage(error.responseText, 'Error!', ['Yes']);
                                });
                        }
                    }
                });
        }

        // Cancle func
        self.cancle = function () {
            router.navigate('profile/' + self.personalID);
        }


        // Mapping data func
        self.mapDataByObject = function (u) {
            // 
            // 
            // simple
            // 
            // 
            self.firstName(u.firstName);
            self.lastName(u.lastName);
            self.personnelID(u.id);
            self.photoUrl(u.profileImage);

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
            for (i = 0; i < self.availableGroups.length; i++) {
                if (self.availableGroups[i].organization.id == self.selectedOrganization()) {
                    self.availableGroupsBelongOrg.push(self.availableGroups[i]);
                }
            }

            // Clear
            self.GroupsForMe([]);
            // Binding Groups
            for (i = 0; i < u.groups.length; i++) {
                // Must get Object belong available list (== adress), to set default value of select element on DOM
                let index = 0;
                for (j = 0; j < self.availableGroupsBelongOrg().length; j++) {
                    if (self.availableGroupsBelongOrg()[j].id == u.groups[i].id) {
                        index = j;
                        break;
                    }
                }

                // Must use observable to subscribe
                let groupValue = ko.observable(self.availableGroupsBelongOrg()[index]);
                groupValue.subscribe(function () {
                    factoryObjects.handleOnSameSelected(self.GroupsForMe, self.groupsIsSame);            
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
            for (i = 0; i < u.roles.length; i++) {
                  // Must get Object belong available list (== adress), to set default value of select element on DOM
                  let index = 0;
                  for (j = 0; j < self.availableRoles.length; j++) {
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

            for (i = 0; i < u.workPhone.length; i++) {

                self.workPhoneNumbers.push({
                    value: ko.observable(u.workPhone[i].number)
                        .extend({
                            required: true,
                            pattern: {
                                message: 'This number is wrong.',
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

            for (i = 0; i < u.mobile.length; i++) {
                self.mobileNumbers.push({
                    value: ko.observable(u.mobile[i].number)
                        .extend({
                            required: true,
                            pattern: {
                                message: 'This number is wrong.',
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

            for (i = 0; i < u.privatePhone.length; i++) {

                self.privatePhoneNumbers.push({
                    value: ko.observable(u.privatePhone[i].number)
                        .extend({
                            required: false,
                            pattern: {
                                message: 'This number is wrong.',
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

            for (i = 0; i < u.email.length; i++) {
                self.workEmails.push({
                    value: ko.observable(u.email[i].address)
                        .extend({ required: { params: true, message: 'This field is required.' } })
                        .extend({ email: { params: true, message: 'This email is wrong.' } })
                });

                // binding main email
                if (u.email[i].isMain) {
                    self.mainWorkEmail(i);
                }
            }

        }

        self.bindingDataByID = function (id) {
            // recieve data from server 
            http.get('https://localhost:5001/api/user/' + id)
                .then(function (u) {
                    console.log('Geting user by id');
                    console.log(u);
                    console.log('-----------------');

                    self.personalID = u.id;
                    self.mapDataByObject(u);

                    // use data example (dataEx) to test
                    // self.mapDataByObject(dataEx);
                },
                    function (error) {
                        console.log('Error when Get user by id');
                        console.log(error);
                        console.log('-------------------------');

                        app.showMessage(error.statusText + " " + error.responseText, 'Error!', ['Yes']);
                    });
        }

        self.activate = function (id) {
            self.bindingDataByID(id);
        };

    };



    return new ProfileModel();
});
