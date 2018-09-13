define(['knockout', 'jquery', 'durandal/app', 'plugins/http', './httpGet', 'plugins/router', 'knockout.validation'],
    function (ko, $, app, http, httpGet, router) {
        var knockoutValidationSettings = {
            grouping: {
                deep: true,
                observable: true
            }
        };
        ko.validation.init(knockoutValidationSettings, true);

        var Organization = function (id, name) {
            this.id = id;
            this.name = name;
        };

        var Group = function (id, name, organization) {
            this.id = id;
            this.name = name;
            this.organization = organization;
        };

        var Role = function (id, name) {
            this.id = id;
            this.name = name;
        };

        var ProfileModel = function () {
            var self = this;

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
            self.availableGroups = [];
            self.availableGroupsBelongOrg = ko.observableArray([]);
            self.availableOrganizations = ko.observableArray();
            self.availableRoles = ko.observableArray();

            // Init for selected
            self.RolesForMe = ko.observableArray();
            self.GroupsForMe = ko.observableArray();
            self.selectedOrganization = ko.observable();
            self.selectedOrganization.subscribe(function () {
                if (self.visible()) {

                    self.availableGroupsBelongOrg([]);

                    for (i = 0; i < self.availableGroups.length; i++) {
                        if (self.availableGroups[i].organization.id == self.selectedOrganization()) {
                            self.availableGroupsBelongOrg.push(self.availableGroups[i]);
                        }
                    }
                }
            });

            /////////////////////////  //////  //////  //////  //////  //////  //////  

            self.addGroup = function () {
                self.GroupsForMe.push(new Group("", "", {}));
            };

            self.removeGroup = function (group) {
                self.GroupsForMe.remove(group);
            };

            /////////////////////////  //////  //////  //////  //////  //////  //////  

            self.addRole = function () {
                self.RolesForMe.push(new Role("", ""));
            };
            self.removeRole = function (role) {
                self.RolesForMe.remove(role);
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
            };

            self.validated = ko.validatedObservable(self);

            // Check unique array   
            var isUniqueValuesArray = function (arr) {

                for (i = 0; i < arr.length - 1; i++) {
                    for (j = i + 1; j < arr.length; j++) {
                        if (arr[i].id == arr[j].id)
                            return false;
                    }
                }

                return true;
            }

            // Handle to format contract
            var handleJSON = function (baseArray) {
                var result = [];

                result.push({
                    id: baseArray[0].id,
                    isMain: true
                });

                for (i = 1; i < baseArray.length; i++) {
                    result.push({
                        id: baseArray[i].id,
                        isMain: false
                    });
                }

                return result;
            };

            var handleJSONForEmail = function (baseArray) {
                var result = [];

                result.push({
                    address: baseArray[0].value,
                    isMain: true
                });

                for (i = 1; i < baseArray.length; i++) {
                    result.push({
                        address: baseArray[i].value,
                        isMain: false
                    });
                }

                return result;
            };

            var handleJSONForNumber = function (baseArray) {
                var result = [];

                result.push({
                    number: baseArray[0].value,
                    isMain: true
                });

                for (i = 1; i < baseArray.length; i++) {
                    result.push({
                        number: baseArray[i].value,
                        isMain: false
                    });
                }

                return result;
            };


            // Save func
            self.save = function () {

                if (!self.validated.isValid()) {
                    self.validated.errors.showAllMessages();
                } else {
                    if (!isUniqueValuesArray(self.GroupsForMe())) {
                        app.showMessage('Group / Department must be Unique values!', 'Warning', ['Yes']);
                        return;
                    }

                    if (!isUniqueValuesArray(self.RolesForMe())) {
                        app.showMessage('Role / Job Title must be Unique values!', 'Warning', ['Yes']);
                        return;
                    }

                    app.showMessage('Are you sure you want to edit profile?', 'Verify', ['Yes', 'No'])
                        .then(function (result) {
                            if (result == 'Yes') {
                                var editedProfile = {
                                    firstName: self.firstName(),
                                    lastName: self.lastName(),
                                    organizationId: self.selectedOrganization(),
                                    groups: handleJSON(ko.toJS(self.GroupsForMe())),
                                    roles: handleJSON(ko.toJS(self.RolesForMe())),
                                    workPhone: handleJSONForNumber(ko.toJS(self.workPhoneNumbers())),
                                    privatePhone: handleJSONForNumber(ko.toJS(self.privatePhoneNumbers())),
                                    mobile: handleJSONForNumber(ko.toJS(self.mobileNumbers())),
                                    email: handleJSONForEmail(ko.toJS(self.workEmails())),
                                    profileImage: self.profileImage
                                };

                                http.put('https://localhost:5001/api/user/' + self.personnelID(), editedProfile)
                                    .then(function (response) {
                                        console.log('Updating user by id');
                                        console.log(response);
                                        console.log('-------------------');

                                        app.showMessage('Done!', 'Successfully', ['Yes']).then(function (result) {
                                            if (result == 'Yes') {
                                                console.log(editedProfile);
                                                self.visible(!self.visible());
                                            }
                                        });
                                    },
                                    function (error) {
                                        console.log('ERROR when Update user by id');
                                        console.log(error);
                                        console.log('----------------------------');

                                        app.showMessage(error.responseText, 'Error!', ['Yes']);
                                    });
                            }
                        });
                }
            };

            // Edit profile func
            self.edit = function () {
                app.showMessage('Make sure you want to EDIT', 'Verify', ['Yes', 'No'])
                    .then(function (result) {
                        if (result == "Yes") {
                            self.visible(!self.visible());
                        }
                    });
            };

            // Delete profile func
            self.deleteProfile = function () {
                app.showMessage('Do you really want to delete this user profile permanently?', 'Verify', ['Yes', 'Can'])
                    .then(function (result) {
                        if (result == "Yes") {
                            self.visible(!self.visible());
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
                                    }, 
                                    function (error) {
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
                self.visible(false);
            }

            // Flag to switch edit, can
            self.visible = ko.observable(false);

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

                self.availableOrganizations(httpGet.availableOrganizations);
                self.selectedOrganization(u.organization.id);

                // 
                // 
                // groups
                // 
                // 

                self.availableGroups = httpGet.availableGroups;
                self.availableGroupsBelongOrg([]);
                for (i = 0; i < self.availableGroups.length; i++) {
                    if (self.availableGroups[i].organization.id == self.selectedOrganization()) {
                        self.availableGroupsBelongOrg.push(self.availableGroups[i]);
                    }
                }

                self.GroupsForMe([]);
                u.groups.forEach(element => {
                    self.GroupsForMe.push(new Group(element.id, element.name, element.organization));
                })

                // 
                // 
                // roles
                // 
                // 

                self.availableRoles(httpGet.availableRoles);

                self.RolesForMe([]);
                u.roles.forEach(element => {
                    self.RolesForMe.push(new Role(element.id, element.name));
                })

                // 
                // 
                // workPhoneNumbers
                // 
                // 

                self.workPhoneNumbers([]);
                u.workPhone.forEach(element => {
                    self.workPhoneNumbers.push({
                        value: ko.observable(element.number)
                            .extend({
                                required: true,
                                pattern: {
                                    message: 'This number is wrong.',
                                    params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                                }
                            })
                    });
                });

                // 
                // 
                // mobileNumbers
                // 
                // 

                self.mobileNumbers([]);
                u.mobile.forEach(element => {
                    self.mobileNumbers.push({
                        value: ko.observable(element.number)
                            .extend({
                                required: true,
                                pattern: {
                                    message: 'This number is wrong.',
                                    params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                                }
                            })
                    });
                });

                // 
                // 
                // privatePhoneNumbers
                // 
                // 

                self.privatePhoneNumbers([]);
                u.privatePhone.forEach(element => {
                    self.privatePhoneNumbers.push({
                        value: ko.observable(element.number)
                            .extend({
                                required: false,
                                pattern: {
                                    message: 'This number is wrong.',
                                    params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                                }
                            })
                    });
                });


                // 
                // 
                // workEmails
                // 
                // 

                self.workEmails([]);
                u.email.forEach(element => {
                    self.workEmails.push({
                        value: ko.observable(element.address)
                            .extend({ required: { params: true, message: 'This field is required.' } })
                            .extend({ email: { params: true, message: 'This email is wrong.' } })
                    });
                });

            }


            self.bindingDataByID = function (id) {
                // recieve data from server 
                http.get('https://localhost:5001/api/user/' + id)
                    .then(function (u) {
                        console.log('Geting user by id');
                        console.log(u);
                        console.log('-----------------');

                        self.mapDataByObject(u);
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
