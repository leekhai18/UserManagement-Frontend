define(['knockout',
        'plugins/http', 
        'plugins/router', 
        'services/servicesAPI', 
        'models/listModel'
    ],
    function (ko, http, router, servicesAPI) {

        var ProfileModel = function () {
            //create variable
            var self = this;
            var timeout = null; //variable to set time out for search feature
            // --------

            //set String value from constant.js file to label
            self.labelOrganization = ORGANIZATION;
            self.labelGroup = GROUP;
            self.labelRole = ROLE;
            self.advancedSearch = ADVANCED_SEARCH;
            self.labelMessage = MESSAGE;
            // --------
            
            self.activate = function () {
                var promises = [];
                promises.push(servicesAPI.getAvailabelOrganizations());
                promises.push(servicesAPI.getAvailabelGroups());
                promises.push(servicesAPI.getAvailabelRoles());
    
                var result =  Promise.all(promises).then(function(resultOfAllPromises) {
                    [self.availableOrganizations, self.availableGroups, self.availableRoles] = resultOfAllPromises;
                });
    
                return  result.then(function() {       
                            self.getAllUsers();
                        }, 
                        function(error) {
                            throw new Error(error);
                        });
            };

            // init available
            self.availableGroups = [];
            self.availableOrganizations = [];
            self.availableRoles = [];

            //list of users
            self.usersList = ko.observableArray([]);
            self.keySearch = ko.observable();
            self.isShowAdvancedSearch = ko.observable(false);
            self.displayMess = ko.observable(false);

            
            self.availableGroupsBelongOrg = ko.observableArray([]);
            for (var i = 0; i < self.availableGroups.length; i++) {
                self.availableGroupsBelongOrg.push(self.availableGroups[i]);
            };
            self.selectedGroup = ko.observable();
            self.selectedGroup.subscribe(function () {
                self.searchUser('');
            });

            
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

            
            self.selectedRole = ko.observable();
            self.selectedRole.subscribe(function () {
                self.searchUser('');
            });

            self.addUser = function () {
                router.navigate("create");
            }

            self.showMessage = function(list){
                if(list().length == 0){
                    self.displayMess(true);
                }
                else{
                    self.displayMess(false);
                }
            }

            self.getAllUsers = function () {

                //clear
                self.usersList.removeAll();

                http.get(DOMAIN_DEV + "api/user/light")
                    .then(function (u) {
                        self.usersList(u);

                        self.showMessage(self.usersList);

                    }, function (error) {
                        alert(ERROR_CONNECTION);
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

                http.get(DOMAIN_DEV + 'api/search?&name='  + keySearch +
                                                        '&organizationName=' + organizationName + 
                                                        '&groupName=' + groupName + 
                                                        '&roleName=' + roleName)
                    .then(function (u) {
                        self.usersList(u);

                        self.showMessage(self.usersList);

                    }, function (error) {
                        alert(ERROR_CONNECTION);
                    });
            }

            self.viewProfile = function (profile) {
                router.navigate("profile/" + profile.id);
            }


            self.toggleVisibility = function () {
                self.isShowAdvancedSearch(!self.isShowAdvancedSearch());
            };

            self.search = function () {
                clearTimeout(timeout);

                timeout = setTimeout(function (e) {
                    self.searchUser(self.keySearch());
                }, 400);
            };
        }

        return new ProfileModel();
    });