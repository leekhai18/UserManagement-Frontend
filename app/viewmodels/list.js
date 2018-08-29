define(['knockout', 'plugins/router', 'plugins/http', 'knockout.validation'], function (ko, router, http){
    //list of users
    var lUsers = ko.observableArray([]);
    var val = ko.observable();

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
    }

    var searchUsers = function() {
        lUsers.removeAll();

        http.get('')
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

        val: val,

        search: function(data, event) {
            console.log(this.val());
            //app.showMessage('Search not yet implemented...');

            // for (i = 0; i < li.length; i++) {
            //     a = li[i].getElementsByTagName("a")[0];
            //     if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            //         li[i].style.display = "";
            //     } else {
            //         li[i].style.display = "none";
            //     }
            // }
            searchUsers();
        },
    };
});