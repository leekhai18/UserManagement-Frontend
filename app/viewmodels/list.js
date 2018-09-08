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
            // http.get('http://localhost:16567/api/user')

            http.get('https://localhost:5001/api/user')
                .then(function (u) {

                    console.log(u);

                    u.forEach(element => {
                        lUsers.push(element);
                    });

                }, function (error) {
                    alert("Error: Can't connect to server.");
                });


            // $.ajax({
            //     url: 'https://localhost:5001/api/user',
            //     // data: this.toJSON(data),
            //     type: 'GET',
            //     contentType: 'application/json',
            //     dataType: 'json',
            //     // headers: ko.toJS(headers),
            //     success: function (u) {
            //         console.log(u);

            //         u.forEach(element => {
            //             lUsers.push(element);
            //         });
            //     },
            //     error: function (jqXHR, textStatus, errorThrown) {
            //         // if (jqXHR.status === '401') {
            //         // }

            //         alert("Error: Can't connect to server.");
            //     }

            // });
        }

        var searchUser = function(){
            http.get('https://localhost:5001/api/search')
                .then(function (u) {

                    console.log(u);

                    u.forEach(element => {
                        lUsers.push(element);
                    });

                }, function (error) {
                    alert("Error: Can't connect to server.");
                });
        }

        var viewProfile = function (profile) {
            console.log(profile);
            router.navigate("profile/" + profile.id);
        }

        return {

            activate: function () {
                // console.log('Activate Page');
                getAllUsers();
            },

            lUsers: lUsers,
            addUser: addUser,

            viewProfile: viewProfile,

            search: function(event){
                searchUser();
            }
        };
    });