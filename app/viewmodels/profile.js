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

            self.GroupsForMe = ko.observableArray();
            self.availableGroups = ko.observableArray();

            self.addGroup = function () {
                self.GroupsForMe.push(new Group("", "", {}));
            };

            self.removeGroup = function (group) {
                self.GroupsForMe.remove(group);
            };
            /////////////////////////  //////  //////  //////  //////  //////  //////  

            self.RolesForMe = ko.observableArray();
            self.availableRoles = ko.observableArray();

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
                                    mainGroup: ko.toJS(self.GroupsForMe())[0],
                                    groups: ko.toJS(self.GroupsForMe()),
                                    mainRole: ko.toJS(self.RolesForMe())[0],
                                    roles: ko.toJS(self.RolesForMe()),
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

                                console.log(ko.toJS(self.GroupsForMe()));
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
                let Ors = ko.observableArray([]);

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

            self.getAllGroups = function () {
                let Grs = [];

                //the router's activator calls this function and waits for it to complete before proceding
                if (Grs.length > 0) {
                    return;
                }

                // get Group list from server
                http.get('https://localhost:5001/api/group')
                    .then(function (u) {

                        u.forEach(element => {
                            Grs.push(new Group(element.id, element.name, element.organization))
                        });
                        // Grs(u);
                    });

                return Grs;
            }

            self.getAllRoles = function () {
                let Ros = [];

                //the router's activator calls this function and waits for it to complete before proceding
                if (Ros.length > 0) {
                    return;
                }

                // get Group list from server
                http.get('https://localhost:5001/api/role')
                    .then(function (u) {

                        u.forEach(element => {
                            Ros.push(new Role(element.id, element.name))
                        });
                        // Ros(u);
                    });

                return Ros;
            }

            self.mapDataByObject = function (u) {

                console.log("-----------------------------------------");
                console.log(u);


                //// simple
                self.firstName(u.firstName);
                self.lastName(u.lastName);
                self.personnelID(u.id);
                self.photoUrl(u.profileImage);

                // crazy
                self.availableOrganizations = ko.observableArray(self.getAllOrganizations());
                self.selectedOrganization = ko.observable(u.organization.id);

                console.log("-----------------------------------------");
                console.log(self.getAllGroups());
                console.log(u.groups);

                self.availableGroups(self.getAllGroups());
                u.groups.forEach(element => {
                    // self.GroupsForMe.push(element);
                    self.GroupsForMe.push(new Group(element.id, element.name, element.organization));
                })


                console.log("-----------------------------------------");
                console.log(self.getAllRoles());
                console.log(u.roles);

                self.availableRoles(self.getAllRoles());
                u.roles.forEach(element => {
                    // self.RolesForMe.push(element);
                    self.RolesForMe.push(new Role(element.id, element.name));
                })

                // self.workPhoneNumbers

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

                        self.mapDataByObject(u);

                    });

            }

            self.activate = function (id) {

                self.bindingDataByID(id);

            };


        };



        return new ProfileModel();
    });
