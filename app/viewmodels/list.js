define(['knockout', 'plugins/http', './httpGet', 'plugins/router', 'jquery', 'knockout.validation', 'bootstrap.multiselect'],
    function (ko, http, httpGet, router, $) {

        var ProfileModel = function () {
            var self = this;

            // intit

            //list of users
            self.lUsers = ko.observableArray([]);
            self.keySearch = ko.observable();
            self.isShowAdvancedSearch = ko.observable(false);
            self.displayMess = ko.observable(false);

            self.availableGroups = httpGet.availableGroups;
            self.availableGroupsBelongOrg = ko.observableArray([]);
            for (let i = 0; i < self.availableGroups.length; i++) {
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

                for (let i = 0; i < self.availableGroups.length; i++) {
                    if (self.availableGroups[i].organization.id == value) {
                        self.availableGroupsBelongOrg.push(self.availableGroups[i]);
                    }
                }

                if (value == null) {
                    for (let i = 0; i < self.availableGroups.length; i++) {
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
                self.lUsers.removeAll();
                var temp = 0;

                http.get('https://localhost:5001/api/user/light')
                    .then(function (u) {

                        console.log('Getting all user by id');
                        console.log(u);
                        console.log('----------------------');

                        u.forEach(element => {
                            self.lUsers.push(element);
                            temp++;
                        });

                        if(temp == 0){
                            self.displayMess(true);
                            console.log('dont have any user');
                        }
                        else{
                            self.displayMess(false);
                        }

                    }, function (error) {
                        alert("Error: Can't connect to server.");
                    });
            }

            self.searchUser = function (keySearch) {
                self.lUsers.removeAll();

                let groupName = '';
                if (self.selectedGroup() != null) {
                    groupName = self.selectedGroup();
                }

                let roleName = '';
                if (self.selectedRole() != null) {
                    roleName = self.selectedRole();
                }

                let organizationName = '';
                for (let i = 0; i < self.availableOrganizations.length; i++) {
                    if (self.availableOrganizations[i].id == self.selectedOrganization()) {
                        organizationName = self.availableOrganizations[i].name;
                        break;
                    }
                };

                console.log('https://localhost:5001/api/search?&name='  + keySearch +
                '&organizationName=' + organizationName + 
                '&groupName=' + groupName + 
                '&roleName=' + roleName);

                http.get('https://localhost:5001/api/search?&name='  + keySearch +
                                                        '&organizationName=' + organizationName + 
                                                        '&groupName=' + groupName + 
                                                        '&roleName=' + roleName)
                    .then(function (u) {

                        console.log('Search user by name');
                        console.log(u);

                        var temp = 0;

                        u.forEach(element => {
                            self.lUsers.push(element);
                            temp++;
                        });

                        if(temp == 0){
                            self.displayMess(true);
                            console.log('dont have any user');
                        }
                        else{
                            self.displayMess(false);
                        }

                    }, function (error) {
                        alert("Error: Can't connect to server.");
                    });
            }

            self.viewProfile = function (profile) {
                console.log(profile);
                router.navigate("profile/" + profile.id);
            }


            self.toggleVisibility = function () {
                self.isShowAdvancedSearch(!self.isShowAdvancedSearch());
            };

            self.activate = function () {
                self.getAllUsers();
            };

            self.search = function () {
                console.log(self.keySearch());
                self.searchUser(self.keySearch());
            };
        }

        return new ProfileModel();
    });