define(['knockout', 'plugins/http', 'plugins/router', 'knockout.validation'],
    function (ko, http, router) {
        //list of users
        var lUsers = ko.observableArray([]);

        //Info of user
        function userInfo(data) {
            var self = this;
            self.firstName = ko.observable(data.firstName);
            self.lastName = ko.observable(data.lastName);
            self.role = ko.observable(data.role);
            self.group = ko.observable(data.group);
            self.organization = ko.observable(data.organization);
            self.image = ko.observable(data.image);
        }

        var addUser = function () {
            // console.log("Add User");
            router.navigate("create");
        }

        var getAllUsers = function () {

            //clear
            lUsers.removeAll();

            // use plugin HTTP of Durandaljs
            http.get('http://localhost:16567/api/user')
                .then(function (u) {

                    console.log(u);

                    u.forEach(element => {
                        lUsers.push(element);
                    });

                    // test 
                    lUsers.push(u[0]); 
                    lUsers.push(u[0]); 

                });
        }

        return {

            activate: function () {
                // console.log('Activate Page');
                getAllUsers();
            },

            lUsers: lUsers,
            addUser: addUser,
        };
    });