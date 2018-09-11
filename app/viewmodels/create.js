define(['knockout', 'jquery', 'durandal/app', './httpGet', 'plugins/router', 'knockout.validation'], function (ko, $, app, httpGet, router) {
    var knockoutValidationSettings = {
        grouping: {
            deep: true,
            observable: true
        }
    };
    ko.validation.init(knockoutValidationSettings, true);

    var ProfileModel = function () {
        var self = this;

        self.init = function() {
            self.firstName = ko.observable("").extend({ required: { params: true, message: 'This field is required.' } });
            self.lastName = ko.observable("").extend({ required: { params: true, message: 'This field is required.' } });
            self.fullName = ko.computed(function () {
                return self.firstName() + " " + self.lastName();
            });

            // Init for available
            self.availableOrganizations = httpGet.availableOrganizations;
            self.availableGroups = httpGet.availableGroups;
            self.availableRoles = httpGet.availableRoles;
            self.availableGroupsBelongOrg = ko.observableArray([]);

            //  Init for selected
            self.selectedOrganization = ko.observable();
            self.selectedOrganization.subscribe(function(){
                self.availableGroupsBelongOrg([]);

                for (i = 0; i < self.availableGroups.length; i++) {
                    if (self.availableGroups[i].organization.id == self.selectedOrganization().id) {
                        self.availableGroupsBelongOrg.push(self.availableGroups[i]);
                    }
                }
            });

            self.selectedGroups = ko.observableArray([{ value: ko.observable("") }]);
            self.selectedRoles = ko.observableArray([{ value: ko.observable("") }]);
            
            self.workPhoneNumbers = ko.observableArray([{ value: ko.observable("")
            .extend({   required: true,
                        pattern: {
                            message: 'This number is wrong.',
                            params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                        }}) }]);

            self.privatePhoneNumbers = ko.observableArray([{ value: ko.observable("")
            .extend({   required: true,
                        pattern: {
                            message: 'This number is wrong.',
                            params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                        }}) }]);

            self.mobileNumbers = ko.observableArray([{ value: ko.observable("")
            .extend({   required: true,
                        pattern: {
                            message: 'This number is wrong.',
                            params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                        }}) }]);

            self.workEmails = ko.observableArray([{ value: ko.observable("")
            .extend({ required: { params: true, message: 'This field is required.' } })
            .extend({ email: { params: true, message: 'This email is wrong.' } }) }]);

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
            self.selectedGroups.push({ value: ko.observable() });
        };
        self.removeGroup = function (group) {
            self.selectedGroups.remove(group);
        };
        
        // Functions on Role
        self.addRole = function () {
            self.selectedRoles.push({ value: ko.observable() });
        };
        self.removeRole = function (role) {
            self.selectedRoles.remove(role);
        };

        // Functions on WorkPhoneNumber
        self.addWorkPhoneNumber = function () {
            self.workPhoneNumbers.push({ value: ko.observable("")
                    .extend({   required: true,
                                pattern: {
                                    message: 'This number is wrong.',
                                    params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                                }}) });
        };
        self.removeWorkPhoneNumber = function (workPhoneNumber) {
            self.workPhoneNumbers.remove(workPhoneNumber);
        };

        // Functions on PrivateNumber
        self.addPrivatePhoneNumber = function () {
            self.privatePhoneNumbers.push({ value: ko.observable("")
                    .extend({   required: true,
                                pattern: {
                                    message: 'This number is wrong.',
                                    params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                                }}) });
        };
        self.removePrivatePhoneNumber = function (privatePhoneNumber) {
            self.privatePhoneNumbers.remove(privatePhoneNumber);
        };

        // Functions on MobileNumber
        self.addMobileNumber = function () {
            self.mobileNumbers.push({ value: ko.observable("")
                    .extend({   required: true,
                                pattern: {
                                    message: 'This number is wrong.',
                                    params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                                }}) });
        };
        self.removeMobileNumber = function (mobileNumber) {
            self.mobileNumbers.remove(mobileNumber);
        };

        // Functions on Email
        self.addWorkEmail = function () {
            self.workEmails.push({ value: ko.observable("")
                                        .extend({ required: { params: true, message: 'This field is required.' } })
                                        .extend({ email: { params: true, message: 'This email is wrong.' } }) });
        };
        self.removeWorkEmail = function (workEmail) {
            self.workEmails.remove(workEmail);
        };

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

        // Handle for format contract
        var handleJSON = function (baseArray) {
            var result = [];
            for (i = 0; i < baseArray.length; i++) {
                result.push(baseArray[i].value);
            }

            return result;
        };

        var handleJSONForEmail = function (baseArray) {
            var result = [];

            result.push({   address: baseArray[0].value,
                            isMain: true});

            for (i = 1; i < baseArray.length; i++) {
                result.push({   address: baseArray[i].value,
                                isMain: false});
            }

            return result;
        };

        var handleJSONForNumber = function (baseArray) {
            var result = [];

            result.push({   number: baseArray[0].value,
                            isMain: true});

            for (i = 1; i < baseArray.length; i++) {
                result.push({   number: baseArray[i].value,
                                isMain: false});
            }

            return result;
        };

        var navigateToProfile = function(id) {
            router.navigate('profile/' + id);
        }

        // Submit form
        self.create = function () {
            if (!self.validated.isValid()) {
                self.validated.errors.showAllMessages();
            } else {
                if ( !isUniqueValuesArray(handleJSON(ko.toJS(self.selectedGroups())) )) {
                    app.showMessage('Group / Department must be Unique values!', 'Warning', ['Yes']);
                    return;
                }

                if ( !isUniqueValuesArray(handleJSON(ko.toJS(self.selectedRoles())) )) {
                    app.showMessage('Role / Job Title must be Unique values!', 'Warning', ['Yes']);
                    return;
                }

                app.showMessage('Are you sure you want to create new User?', 'Verify', ['Yes', 'No']).then(function (result) {
                    if (result == 'Yes') {
                        var newProfile = {
                            firstName: self.firstName(),
                            lastName: self.lastName(),
                            organization: self.selectedOrganization(),
                            mainGroup: ko.toJS(self.selectedGroups())[0].value,
                            groups: handleJSON(ko.toJS(self.selectedGroups())),
                            mainRole: ko.toJS(self.selectedRoles())[0].value,
                            roles: handleJSON(ko.toJS(self.selectedRoles())),
                            workPhone: handleJSONForNumber(ko.toJS(self.workPhoneNumbers())),
                            privatePhone: handleJSONForNumber(ko.toJS(self.privatePhoneNumbers())),
                            mobile: handleJSONForNumber(ko.toJS(self.mobileNumbers())),
                            email: handleJSONForEmail(ko.toJS(self.workEmails())), 
                            profileImage: self.profileImage
                        };

                        http.post('https://localhost:5001/api/user', newProfile)
                        .then(function(response) {
                            app.showMessage('Done!', 'Successfully', ['Yes']).then(function (result) {
                                if (result == 'Yes') {
                                    //refreshView
                                    self.init();
                                                            
                                    //navigateToProfile
                                    navigateToProfile(response);
                                }
                            });
                        },
                        function(error) {
                            app.showMessage(error, 'Error!', ['Yes']);
                        });
                    }
                });
            }
        };

        self.activate = function() {
            self.init();
        };

        // init validated all form
        self.compositionComplete = function(){
            self.validated = ko.validatedObservable(self);
        };
    }

    return new ProfileModel();
});