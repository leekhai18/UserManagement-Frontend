define(['knockout', 'plugins/http', './httpGet', 'plugins/router', 'jquery', 'knockout.validation', 'bootstrap.multiselect'],
    function (ko, http, httpGet, router, $) {

        var ProfileModel = function () {
            var self = this;
            var timeout = null;

            // intit

            //list of users
            self.usersList = ko.observableArray([]);
            self.keySearch = ko.observable();
            self.isShowAdvancedSearch = ko.observable(false);
            self.displayMess = ko.observable(false);

            self.availableGroups = httpGet.availableGroups;
            self.availableGroupsBelongOrg = ko.observableArray([]);
            for (var i = 0; i < self.availableGroups.length; i++) {
                self.availableGroupsBelongOrg.push(self.availableGroups[i]);
            };
            self.selectedGroup = ko.observable();
            self.selectedGroup.subscribe(function () {
                self.searchUser('');
            });

            self.availableOrganizations = httpGet.availableOrganizations;
            self.selectedOrganization = ko.observable();
            self.selectedOrganization.subscribe(function (value) {
                self.availableGroupsBelongOrg([]);

                for (var i = 0; i < self.availableGroups.length; i++) {
                    if (self.availableGroups[i].organization.id == value) {
                        self.availableGroupsBelongOrg.push(self.availableGroups[i]);
                    }
                }

                if (value == null) {
                    for (var i = 0; i < self.availableGroups.length; i++) {
                        self.availableGroupsBelongOrg.push(self.availableGroups[i]);
                    };
                }

                self.searchUser('');
            });

            self.availableRoles  = httpGet.availableRoles;
            self.selectedRole = ko.observable();
            self.selectedRole.subscribe(function () {
                self.searchUser('');
            });

            self.addUser = function () {
                router.navigate("create");
            }

            self.getAllUsers = function () {

                //clear
                self.usersList.removeAll();
                var temp = 0;

                http.get('https://localhost:5001/api/user/light')
                    .then(function (u) {
                        self.usersList(u);

                        if(self.usersList().length == 0){
                            self.displayMess(true);
                        }
                        else{
                            self.displayMess(false);
                        }

                    }, function (error) {
                        alert("Error: Can't connect to server.");
                    });
            }

            self.searchUser = function (keySearch) {
                self.usersList.removeAll();

                var groupName = '';
                if (self.selectedGroup() != null) {
                    groupName = self.selectedGroup();
                }

                var roleName = '';
                if (self.selectedRole() != null) {
                    roleName = self.selectedRole();
                }

                var organizationName = '';
                for (var i = 0; i < self.availableOrganizations.length; i++) {
                    if (self.availableOrganizations[i].id == self.selectedOrganization()) {
                        organizationName = self.availableOrganizations[i].name;
                        break;
                    }
                };

                http.get('https://localhost:5001/api/search?&name='  + keySearch +
                                                        '&organizationName=' + organizationName + 
                                                        '&groupName=' + groupName + 
                                                        '&roleName=' + roleName)
                    .then(function (u) {

                        var temp = 0;

                        self.usersList(u);

                        if(self.usersList().length == 0){
                            self.displayMess(true);
                        }
                        else{
                            self.displayMess(false);
                        }

                    }, function (error) {
                        alert("Error: Can't connect to server.");
                    });
            }

            self.viewProfile = function (profile) {
                router.navigate("profile/" + profile.id);
            }


            self.toggleVisibility = function () {
                self.isShowAdvancedSearch(!self.isShowAdvancedSearch());
            };

            self.activate = function () {
                self.getAllUsers();
            };

            self.search = function () {
                clearTimeout(timeout);

                timeout = setTimeout(function (e) {
                    self.searchUser(self.keySearch());
                }, 1000);
            };
        }

        return new ProfileModel();
    });