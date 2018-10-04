define(['knockout',
        'plugins/http', 
        'plugins/router', 
        'services/servicesAPI', 
        'models/listModel',
        'models/constantUI'
    ],
    function (ko, http, router, servicesAPI) {
        ko.options.deferUpdates = true;

        var ProfileModel = function () {
            //create.variable
            var self = this;
            var timeout = null; //variable to set time out for search feature
            // --------

            //set String value from constant.js file to label
            self.text_ListModel = new List();
            self.text_constantUI = new ConstantUI(LIST_TITLE);
            self.variable = new Variable(ko);

            // --------
            
            self.activate = function () {
                var promises = [];
                promises.push(servicesAPI.getAvailabelOrganizations());
                promises.push(servicesAPI.getAvailabelGroups());
                promises.push(servicesAPI.getAvailabelRoles());
    
                var result =  Promise.all(promises).then(function(resultOfAllPromises) {
                    [self.variable.availableOrganizations, self.variable.availableGroups, self.variable.availableRoles] = resultOfAllPromises;
                });
    
                return  result.then(function() {       
                            self.getAllUsers();
                        }, 
                        function(error) {
                            throw new Error(error);
                        });
            };

            // for (var i = 0; i < self.variable.availableGroups.length; i++) {
            //     self.variable.availableGroupsBelongOrg.push(self.variable.availableGroups[i]);
            // };

            self.variable.selectedGroup.subscribe(function () {
                self.searchUser('');
            });

            self.variable.selectedOrganization.subscribe(function (value) {
                self.variable.availableGroupsBelongOrg([]);

                for (var i = 0; i < self.variable.availableGroups.length; i++) {
                    if (self.variable.availableGroups[i].organization.id == value) {
                        self.variable.availableGroupsBelongOrg.push(self.variable.availableGroups[i]);
                    }
                }

                if (value == null) {
                    for (var i = 0; i < self.variable.availableGroups.length; i++) {
                        self.variable.availableGroupsBelongOrg.push(self.variable.availableGroups[i]);
                    };
                }

                self.searchUser('');
            });

            
            self.variable.selectedRole.subscribe(function () {
                self.searchUser('');
            });

            self.addUser = function () {
                router.navigate("create");
            }

            self.showMessage = function(list){
                if(list().length == 0){
                    self.variable.displayMess(true);
                }
                else{
                    self.variable.displayMess(false);
                }
            }

            self.getAllUsers = function () {

                //clear
                self.variable.usersList.removeAll();

                http.get(DOMAIN_DEV + "api/user/light")
                    .then(function (u) {
                        self.variable.usersList(u);

                        self.showMessage(self.variable.usersList);

                    }, function (error) {
                        alert(ERROR_CONNECTION);
                    });
            }

            self.searchUser = function (keySearch) {
                self.variable.usersList.removeAll();

                var groupName = '';
                if (self.variable.selectedGroup() != null) {
                    groupName = self.variable.selectedGroup();
                }

                var roleName = '';
                if (self.variable.selectedRole() != null) {
                    roleName = self.variable.selectedRole();
                }

                var organizationName = '';
                for (var i = 0; i < self.variable.availableOrganizations.length; i++) {
                    if (self.variable.availableOrganizations[i].id == self.variable.selectedOrganization()) {
                        organizationName = self.variable.availableOrganizations[i].name;
                        break;
                    }
                };

                http.get(DOMAIN_DEV + 'api/search?&name='  + keySearch +
                                                        '&organizationName=' + organizationName + 
                                                        '&groupName=' + groupName + 
                                                        '&roleName=' + roleName)
                    .then(function (u) {
                        self.variable.usersList(u);

                        self.showMessage(self.variable.usersList);

                    }, function (error) {
                        alert(ERROR_CONNECTION);
                    });
            }

            self.viewProfile = function (profile) {
                router.navigate("profile/" + profile.id);
            }


            self.toggleVisibility = function () {
                self.variable.isShowAdvancedSearch(!self.variable.isShowAdvancedSearch());
            };

            self.search = function () {
                clearTimeout(timeout);

                timeout = setTimeout(function (e) {
                    self.searchUser(self.variable.keySearch());
                }, 400);
            };
        }

        return new ProfileModel();
    });