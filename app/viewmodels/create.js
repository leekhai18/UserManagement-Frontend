define(['knockout',
    'durandal/app',
    'plugins/http',
    'plugins/router',
    'helpers/utilities',
    'services/servicesAPI',
    'helpers/cssLoader',
    'knockout.validation',
    'models/constantUI',
    'models/createModel'
], function (ko, app, http, router, utilities, servicesAPI, cssLoader) {
    var knockoutValidationSettings = {
        grouping: {
            deep: true,
            observable: true
        }
    };
    ko.validation.init(knockoutValidationSettings, true);

    ko.options.deferUpdates = true;

    var CreateViewModel = function () {
        var self = this;

        self.model = new ProfileEnableInteraction(ko);

        self.constantUI = new ConstantUI(CREATE_TITLE);

        self.isEditing = ko.observable(false);

        self.activate = function (idUserEdit) {
            // Load css
            cssLoader.loadCss("app/css/createStyle.css", "createStyle");

            var promises = [];
            promises.push(servicesAPI.getAvailabelOrganizations());
            promises.push(servicesAPI.getAvailabelGroups());
            promises.push(servicesAPI.getAvailabelRoles());

            self.isEditing((idUserEdit != undefined) ? true : false);
            if (self.isEditing()) {
                self.constantUI.pageTitle = `${EDIT_TITLE}: ${idUserEdit}`;
                promises.push(servicesAPI.getUser(idUserEdit));
            } else {
                self.constantUI.pageTitle = CREATE_TITLE;
            }

            var result = Promise.all(promises).then(function (resultOfAllPromises) {
                [self.model.availableOrganizations,
                self.model.availableGroups,
                self.model.availableRoles,
                self.profileEdit] = resultOfAllPromises;
            });

            return result.then(function () {
                self.errorList([]);
                self.validated = ko.validatedObservable(self);

                if (self.profileEdit != undefined && self.isEditing()) {
                    self.model.initializeWithUserProfile(ko, self.profileEdit, self.titleMainGroup, self.titleMainRole, self.titleMainEmail);
                } else {
                    self.model.initialize(ko, self.titleMainGroup, self.titleMainRole, self.titleMainEmail);
                    self.validated.errors.showAllMessages(false);
                }
            },
                function (error) {
                    throw new Error(error);
                });
        };

        self.canDeactivate = function () {
            self.model.refreshValue();
            self.titleOrganization("");
            self.titleMainGroup("");
            self.titleMainRole("");
            self.titleMainEmail("");

            return true;
        }

        self.detached = function () {
            cssLoader.removeModuleCss("createStyle");
        };

        // Main title
        self.titleOrganization = ko.observable();
        self.titleMainGroup = ko.observable();
        self.titleMainRole = ko.observable();
        self.titleMainEmail = ko.observable();

        self.model.subscribeTitleMainGroup(self.titleMainGroup);
        self.model.subscribeTitleMainRole(self.titleMainRole);
        self.model.subscribeTitleMainEmail(self.titleMainEmail);
        self.model.subscribeSelectedOrganization(self.titleOrganization, self.titleMainGroup, ko);

        // Init observable error show on popup
        self.textFieldRequired = ko.observable(REQUIRED_NOTICE);

        // Init error when server sendback
        self.errorList = ko.observableArray([]);

        // Rewrite adds func because of reference knockout
        self.addGroup = function () {
            self.model.addGroup(ko, self.titleMainGroup);
        }

        self.addRole = function () {
            self.model.addRole(ko, self.titleMainRole);
        }

        self.addWorkPhoneNumber = function () {
            self.model.addWorkPhoneNumber(ko);
        }

        self.addPrivatePhoneNumber = function () {
            self.model.addPrivatePhoneNumber(ko);
        }

        self.addMobileNumber = function () {
            self.model.addMobileNumber(ko);
        }

        self.addWorkEmail = function () {
            self.model.addWorkEmail(ko, self.titleMainEmail);
        }

        // Rewrite removes func because of only current context can detect obj to remove
        self.removeGroup = function (group) {
            self.model.removeGroup(group);
        }

        self.removeRole = function (role) {
            self.model.removeRole(role);
        }

        self.removeWorkPhoneNumber = function (workPhoneNumber) {
            self.model.removeWorkPhoneNumber(workPhoneNumber);
        }

        self.removePrivatePhoneNumber = function (privatePhoneNumber) {
            self.model.removePrivatePhoneNumber(privatePhoneNumber);
        }

        self.removeMobileNumber = function (mobileNumber) {
            self.model.removeMobileNumber(mobileNumber);
        }

        self.removeWorkEmail = function (workEmail) {
            self.model.removeWorkEmail(workEmail);
        }

        // Upload Image
        self.imageUpload = function (data, e) {
            var file = e.target.files[0];

            var reader = new FileReader();

            reader.onloadend = function (onloadend_e) {
                self.model.profileImage(reader.result);
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        }

        // Create func onClick
        self.create = function () {
            if (!self.validated.isValid() || self.model.isSameGroups() || self.model.isSameRoles()
                || self.model.isSameWorkPhoneNumbers() || self.model.isSamePrivatePhoneNumbers()
                || self.model.isSameMobilePhoneNumbers() || self.model.isSameWorkEmails()) {
                self.validated.errors.showAllMessages();
            } else {

                app.showMessage(CREATE_CONFIRM, 'Verify', [YES, NO]).then(function (result) {
                    if (result == YES) {
                        var newProfile = self.model.getContract(utilities);

                        http.post(DOMAIN_DEV + 'api/user', newProfile)
                            .then(function (response) {
                                app.showMessage(DONE, SUCCESS, [YES]).then(function (result) {
                                    if (result == YES) {
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
                            }
                        );
                    }
                });
            }
        };

        // Save func onClick
        self.save = function () {
            if (!self.validated.isValid() || self.model.isSameGroups() || self.model.isSameRoles()
                || self.model.isSameWorkPhoneNumbers() || self.model.isSamePrivatePhoneNumbers()
                || self.model.isSameMobilePhoneNumbers() || self.model.isSameWorkEmails()) {
                self.validated.errors.showAllMessages();
            } else {
                app.showMessage(EDIT_CONFIRM, 'Verify', [YES, NO])
                    .then(function (result) {
                        // Contract update
                        if (result == YES) {
                            var editedProfile = self.model.getContract(utilities);

                            http.put(DOMAIN_DEV + 'api/user/', editedProfile)
                                .then(function (response) {
                                    app.showMessage(DONE, SUCCESS, [YES]).then(function (result) {
                                        if (result == YES) {
                                            router.navigate('profile/' + response);
                                        }
                                    });
                                }, function (error) {
                                    app.showMessage(error.responseText, 'Error!', [YES]);
                                }
                            );
                        }
                    }
                );
            }
        }

        // Delete profile func
        self.deleteProfile = function () {
            app.showMessage(DELETE_CONFIRM, 'Verify', [YES, NO])
                .then(function (result) {
                    if (result == "Yes") {
                        if (self.model.personnelID()) {
                            http.remove(DOMAIN_DEV + 'api/user/' + self.model.personnelID())
                                .then(function (response) {
                                    app.showMessage(DONE, SUCCESS, [YES]).then(function (result) {
                                        if (result == YES) {
                                            // navigate to home page
                                            router.navigate('');
                                        }
                                    });
                                }, function (error) {

                                    app.showMessage(error.responseText, 'Error!', [YES]);
                                }
                            );
                        }
                    }
                });
        }

        // Cancel func onClick
        self.cancel = function () {
            router.navigate('profile/' + self.model.personnelID());
        }
    }

    return new CreateViewModel();
});