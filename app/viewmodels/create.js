define(['knockout', 'jquery', 'durandal/app', 'plugins/http', 'knockout.validation'], function (ko, $, app, http) {
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

    var Group = function (id, name) {
        this.id = id;
        this.name = name;
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

        self.firstName = ko.observable("").extend({ required: { params: true, message: 'This field is required.' } });

        self.lastName = ko.observable("").extend({ required: { params: true, message: 'This field is required.' } });

        self.fullName = ko.computed(function () {
            return self.firstName() + " " + self.lastName();
        });

        self.availableOrganizations = [];
        self.selectedOrganization = ko.observable();

        self.availableGroups = [];
        self.selectedGroups = ko.observableArray([{ value: ko.observable("") }]);
        self.addGroup = function () {
            self.selectedGroups.push({ value: ko.observable() });
        };
        self.removeGroup = function (group) {
            self.selectedGroups.remove(group);
        };

        self.availableRoles = [];
        self.selectedRoles = ko.observableArray([{ value: ko.observable("") }]);
        self.addRole = function () {
            self.selectedRoles.push({ value: ko.observable("") });
        };
        self.removeRole = function (role) {
            self.selectedRoles.remove(role);
        };

        self.workPhoneNumbers = ko.observableArray([{ value: ko.observable("")
                    .extend({   required: true,
                                pattern: {
                                    message: 'This number is wrong.',
                                    params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                                }}) }]);
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

        self.privatePhoneNumbers = ko.observableArray([{ value: ko.observable("")
                    .extend({   required: false,
                                pattern: {
                                    message: 'This number is wrong.',
                                    params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                                }}) }]);
        self.addPrivatePhoneNumber = function () {
            self.privatePhoneNumbers.push({ value: ko.observable("")
                    .extend({   required: false,
                                pattern: {
                                    message: 'This number is wrong.',
                                    params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                                }}) });
        };
        self.removePrivatePhoneNumber = function (privatePhoneNumber) {
            self.privatePhoneNumbers.remove(privatePhoneNumber);
        };

        self.mobileNumbers = ko.observableArray([{ value: ko.observable("")
                    .extend({   required: true,
                                pattern: {
                                    message: 'This number is wrong.',
                                    params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                                }}) }]);
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

        self.workEmails = ko.observableArray([{ value: ko.observable("")
                                                .extend({ required: { params: true, message: 'This field is required.' } })
                                                .extend({ email: { params: true, message: 'This email is wrong.' } }) }]);
        self.addWorkEmail = function () {
            self.workEmails.push({ value: ko.observable("")
                                        .extend({ required: { params: true, message: 'This field is required.' } })
                                        .extend({ email: { params: true, message: 'This email is wrong.' } }) });
        };
        self.removeWorkEmail = function (workEmail) {
            self.workEmails.remove(workEmail);
        };

        self.validated = ko.validatedObservable(self);

        self.create = function () {
            if (!self.validated.isValid()) {
                self.validated.errors.showAllMessages();
            } else {
                app.showMessage('Are you sure you want to create new User?', 'Verify', ['Yes', 'No']).then(function (result) {
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
                            },
                            profileImage: self.profileImage
                        };

                        http.post('https://localhost:5001/api/user', newProfile)
                        .then(function(response) {
                            app.showMessage('Done!', 'Successfully', ['Yes']).then(function (result) {
                                //navigate
                            });
                        },
                        function(error) {
                            console.log(error);
                        });
                    }
                });
            }

            var reduceJSON = function (baseArray) {
                var result = [];
                for (i = 0; i < baseArray.length; i++) {
                    result.push(baseArray[i].value);
                }

                return result;
            };
        }

        self.activate = function() {
            http.get('https://localhost:5001/api/organization')
            .then(function(response) {
                response.forEach(organization => {
                    self.availableOrganizations.push(new Organization(organization.id, organization.name));
                });
            },
            function(error) {
                console.log(error);
            });

            http.get('https://localhost:5001/api/group')
            .then(function(response) {
                response.forEach(group => {
                    self.availableGroups.push(new Group(group.id, group.name));
                });
            },
            function(error) {
                console.log(error);
            });

            http.get('https://localhost:5001/api/role')
            .then(function(response) {
                response.forEach(role => {
                    self.availableRoles.push(new Role(role.id, role.name));
                });
            },
            function(error) {
                console.log(error);
            });
        }
    }

    

    return new ProfileModel();
});