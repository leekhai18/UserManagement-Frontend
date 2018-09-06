define(['knockout', 'jquery', 'durandal/app', 'plugins/http', 'knockout.validation'],
    function (ko, $, app, http) {
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

            self.personnelID = ko.observable("");

            self.availableOrganizations = ko.observableArray([]);
            self.selectedOrganization = ko.observable();

            self.availableGroups = [new Group('id1', 'group1'),
            new Group('id2', 'group2')];
            self.selectedGroups = ko.observableArray([{ value: ko.observable("") }]);
            self.addGroup = function () {
                self.selectedGroups.push({ value: ko.observable() });
            };
            self.removeGroup = function (group) {
                self.selectedGroups.remove(group);
            };

            self.availableRoles = [new Role('id1', 'role1'),
            new Role('id2', 'role2')];
            self.selectedRoles = ko.observableArray([{ value: ko.observable(new Role('id1', 'role1')) },
            { value: ko.observable(new Role('id1', 'role1')) }]);
            self.addRole = function () {
                self.selectedRoles.push({ value: ko.observable("") });
            };
            self.removeRole = function (role) {
                self.selectedRoles.remove(role);
            };

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

            self.privatePhoneNumbers = ko.observableArray([{
                value: ko.observable("")
                    .extend({
                        required: false,
                        pattern: {
                            message: 'This number is wrong.',
                            params: '([+]{1})([0-9]{2})([ .-]?)([0-9]{3})([ .-]?)([0-9]{4})([ .-]?)([0-9]{3})'
                        }
                    })
            }]);
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

            self.workEmails = ko.observableArray([{
                value: ko.observable("")
                    .extend({ required: { params: true, message: 'This field is required.' } })
                    .extend({ email: { params: true, message: 'This email is wrong.' } })
            }]);
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

            self.save = function () {
                if (!self.validated.isValid()) {
                    self.validated.errors.showAllMessages();
                } else {
                    app.showMessage('Are you sure you want to edit profile?', 'Verify', ['Yes', 'No'])
                        .then(function (result) {
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

                                console.log(newProfile);

                                self.visible(!self.visible());
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
            };

            self.edit = function () {
                app.showMessage('Make sure you want to EDIT', 'Verify', ['Yes', 'No'])
                    .then(function (result) {
                        if (result == "Yes") {
                            self.visible(!self.visible());
                        }
                    });
            };

            self.deleteProfile = function () {
                app.showMessage('REALLY. Make sure you want to DELETE?', 'Verify', ['Yes', 'No'])
                    .then(function (result) {
                        if (result == "Yes") {
                            self.visible(!self.visible());
                        }
                    });
            }

            self.visible = ko.observable(false);

            // ////// /////
            self.getAllOrganizations = function () {
                var Ors = ko.observableArray([]);

                //the router's activator calls this function and waits for it to complete before proceding
                if (Ors().length > 0) {
                    return;
                }

                // get organization from server
                http.get('https://localhost:5001/api/organization')
                    .then(function (u) {

                        u.forEach(element => {
                            Ors.push(new Organization(element.id, element.name))
                        });
                        // Ors(u);

                    });

                return Ors();
            }

            self.mapDataByObject = function (u) {

                //// simple
                self.firstName(u.firstName);
                self.lastName(u.lastName);
                self.personnelID(u.id);
                self.photoUrl(u.profileImage);

                //// binding for condition
                // self.availableOrganizations = ko.observableArray([new Organization("aab", "")]);
                // setTimeout(function () {
                //     self.availableOrganizations([
                //         new Organization("sdafasdf", "pencils"),
                //         new Organization("asdfasdf", "pen"),
                //         new Organization("aab", "marker"),
                //         new Organization("yddb", "crayon")
                //     ]);
                // }, 500);

                // self.availableOrganizations = ([
                //     new Organization("T5TSS", "one"),
                //     // new Organization(u.organization.id, "two"),
                //     new Organization("JZFUT", "twosss"),
                //     new Organization("12345", "three"),
                //     { id: "WPMGE", name: "four" },
                //     // { id: "3r", name: "three" }
                // ]);

                // self.availableOrganizations = ([
                //     new Organization("c00af6d2-5c26-44cc-8414-dbb420d0f942", "Rosen"),
                //     new Organization("a7bd1b7b-1110-4c6c-9fd6-f47a9cc7fbda", "UIT"),
                // ]);

                // console.log("----------------aALLLLL");
                // console.log(self.getAllOrganizations());
                // console.log(u.organization.id + " " + u.organization.name);
                // setTimeout(function() {

                // console.log("biv--------------------------------");
                // }, 2000);
     
                self.availableOrganizations = ko.observableArray(self.getAllOrganizations());
                self.selectedOrganization = ko.observable(u.organization.id);
                //  self.selectedOrganization = ko.observable(u);
            }

            self.bindingDataByID = function (id) {

                // recieve data from server 
                http.get('https://localhost:5001/api/user/' + id)
                    .then(function (u) {

                        console.log("------------ profile");
                        console.log(u);

                        self.mapDataByObject(u);

                    });

            }

            self.activate = function (id) {

                self.bindingDataByID(id);
                // self.mapDataByObject(id);

            };


        };



        return new ProfileModel();
    });
