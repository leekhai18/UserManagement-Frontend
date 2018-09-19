define(['knockout', 'plugins/http', './httpGet', 'plugins/router', 'jquery', 'knockout.validation', 'bootstrap.multiselect'],
    function (ko, http, httpGet, router, $) {

        var ProfileModel = function () {
            var self = this;

            // intit

            //list of users
            self.lUsers = ko.observableArray([]);
            self.keySearch = ko.observable();
            self.selectedOrganization = ko.observable();
            self.availableOrganizations = ko.observableArray([]);
            self.availableGroups = ko.observableArray([]);
            self.isShowAdvancedSearch = ko.observable(false);
            self.displayMess = ko.observable(false);

            self.addUser = function () {
                router.navigate("create");
            }

            self.getAllUsers = function () {

                //clear
                self.lUsers.removeAll();
                var dem = 0;

                http.get('https://localhost:5001/api/user/light')
                    .then(function (u) {

                        console.log('Getting all user by id');
                        console.log(u);
                        console.log('----------------------');

                        u.forEach(element => {
                            self.lUsers.push(element);
                            dem++;
                        });

                        console.log(dem);

                        if(dem == 0){
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

                http.get('https://localhost:5001/api/search?name=' + keySearch)
                    .then(function (u) {

                        console.log('Search user by name');
                        console.log(u);

                        var dem = 0;

                        u.forEach(element => {
                            self.lUsers.push(element);
                            dem++;
                        });

                        if(dem == 0){
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
                console.log("adfsdf")
                self.isShowAdvancedSearch(!self.isShowAdvancedSearch());
            };

            self.activate = function () {
                self.getAllUsers();
            };

            self.search = function () {
                console.log(self.keySearch());
                self.searchUser(self.keySearch());
            };

            // get data from server
            self.availableOrganizations(httpGet.availableOrganizations);
            self.availableGroups(httpGet.availableGroups);


        }

        return new ProfileModel();
    });