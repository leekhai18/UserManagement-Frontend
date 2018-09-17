define([
    'knockout',
    'durandal/app',
    'plugins/http',
    'plugins/router',
    './httpGet',
    'data.ex.profile',
    'knockout.validation'
], function (ko, app, http, router, httpGet, dataEx) {
    var knockoutValidationSettings = {
        grouping: {
            deep: true,
            observable: true
        }
    };
    ko.validation.init(knockoutValidationSettings, true);


    // Bind Twitter Tooltip
    ko.bindingHandlers.tooltip = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var $element, options, tooltip;
            options = ko.utils.unwrapObservable(valueAccessor());
            $element = $(element);
            tooltip = $element.data('tooltip');
            if (tooltip) {
                $.extend(tooltip.options, options);
            } else {
                $element.tooltip(options);
            }
        }
    };

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
        self.availableGroups = [];
        self.availableGroupsBelongOrg = ko.observableArray([]);
        self.availableOrganizations = ko.observableArray();
        self.availableRoles = ko.observableArray();

        // Init for selected
        self.RolesForMe = ko.observableArray();
        self.GroupsForMe = ko.observableArray();
        self.selectedOrganization = ko.observable();

        self.selectedOrganization.subscribe(function () {

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

        /////////////////////////  //////  //////  //////  //////  //////  //////  

        self.addGroup = function () {
            self.GroupsForMe.push(new Group("", "", {}));
        };

        self.removeGroup = function (group) {
            self.GroupsForMe.remove(group);

            if (self.mainGroupForMe() == self.GroupsForMe().length &&
                self.GroupsForMe().length > 0) {

                self.mainGroupForMe(self.GroupsForMe().length - 1)
            }
        };

        self.mainGroupForMe = ko.observable();

        /////////////////////////  //////  //////  //////  //////  //////  //////  

        self.addRole = function () {
            self.RolesForMe.push(new Role("", ""));
        };

        self.removeRole = function (role) {
            self.RolesForMe.remove(role);

            if (self.mainRoleForMe() == self.RolesForMe().length &&
                self.RolesForMe().length > 0) {

                self.mainRoleForMe(self.RolesForMe().length - 1)
            }
        };

        self.mainRoleForMe = ko.observable();

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

            if (self.mainWorkPhoneForMe() == self.workPhoneNumbers().length &&
                self.workPhoneNumbers().length > 0) {

                self.mainWorkPhoneForMe(self.workPhoneNumbers().length - 1)
            }
        };

        self.mainWorkPhoneForMe = ko.observable();

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

            if (self.mainPrivatePhoneForMe() == self.privatePhoneNumbers().length &&
                self.privatePhoneNumbers().length > 0) {

                self.mainPrivatePhoneForMe(self.privatePhoneNumbers().length - 1)
            }
        };

        self.mainPrivatePhoneForMe = ko.observable();

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

            if (self.mainMobilePhoneForMe() == self.mobileNumbers().length &&
                self.mobileNumbers().length > 0) {

                self.mainMobilePhoneForMe(self.mobileNumbers().length - 1)
            }
        };

        self.mainMobilePhoneForMe = ko.observable();


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

            if (self.mainWorkEmailForMe() == self.workEmails().length &&
                self.workEmails().length > 0) {

                self.mainWorkEmailForMe(self.workEmails().length - 1)
            }
        };

        self.mainWorkEmailForMe = ko.observable();

        self.personalID = null;

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

        var jsonSerializeSelected = function (arr, mainIndex) {
            var result = [];

            // arr.forEach(element => {

            //     // if (element.id == mainValue) {
            //     //     result.push({
            //     //         id: element.id,
            //     //         isMain: true,
            //     //     })
            //     // } else {
            //     //     result.push({
            //     //         id: element.id,
            //     //         isMain: false,
            //     //     })
            //     // }
            // });


            console.log("mainIndex---------------");
            console.log(mainIndex);

            for (i = 0; i < arr.length; i++) {
                if (mainIndex == i) {
                    result.push({
                        id: arr[i].id,
                        isMain: true,
                    })
                } else {
                    result.push({
                        id: arr[i].id,
                        isMain: false,
                    })
                }
            }


            return result;
        }

        var jsonSerializeInputText = function (arr, mainIndex) {
            arr = ko.toJS(arr);

            var result = [];

            for (i = 0; i < arr.length; i++) {
                if (mainIndex == i) {
                    result.push({
                        number: arr[i].value,
                        isMain: true,
                    })
                } else {
                    result.push({
                        number: arr[i].value,
                        isMain: false,
                    })
                }
            }

            return result;

        }

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
                                groups: jsonSerializeSelected(self.GroupsForMe(), self.mainGroupForMe()),
                                roles: jsonSerializeSelected(self.RolesForMe(), self.mainRoleForMe()),
                                workPhone: jsonSerializeInputText(self.workPhoneNumbers(), self.mainWorkPhoneForMe()),
                                privatePhone: jsonSerializeInputText(self.privatePhoneNumbers(), self.mainPrivatePhoneForMe()),
                                mobile: jsonSerializeInputText(self.mobileNumbers(), self.mainMobilePhoneForMe()),
                                email: jsonSerializeInputText(self.workEmails(), self.mainWorkEmailForMe()),
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

            for (i = 0; i < u.groups.length; i++) {
                self.GroupsForMe.push(new Group(u.groups[i].id, u.groups[i].name, u.groups[i].organization));

                // binding main group
                if (u.groups[i].isMain) {
                    self.mainGroupForMe(i);
                }

            }

            // 
            // 
            // roles
            // 
            // 

            self.availableRoles(httpGet.availableRoles);
            self.RolesForMe([]);

            for (i = 0; i < u.roles.length; i++) {
                self.RolesForMe.push(new Role(u.roles[i].id, u.roles[i].name));

                // binding main role
                if (u.roles[i].isMain) {
                    self.mainRoleForMe(i);
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
                    self.mainWorkPhoneForMe(i);
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
                    self.mainMobilePhoneForMe(i);
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
                    self.mainPrivatePhoneForMe(i);
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
                    self.mainWorkEmailForMe(i);
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
                    // self.mapDataByObject(u);

                    // use data example (dataEx) to test
                    self.mapDataByObject(dataEx);

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
