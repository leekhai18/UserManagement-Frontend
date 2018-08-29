define(['knockout', 'plugins/router', 'durandal/app', 'knockout.validation'], function (ko, router, app){
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

    // function activate(data) {
    //     $.getJSON("/lUsers", function(allData) {
    //         var mappedUsers = $.map(allData, function(item) { return new userInfo(item) });
    //         console.log(lUsers);
    //         self.lUsers(mappedUsers);
    //     });
    // }

    return {
        // Array of users
        // users : ko.observableArray([
        //     {firstName, lastName, role, group, organization, image},
       	// 	// {firstName: 'Anh', lastName: 'Bui', role: 'Developer', group: 'Frontend', organization: 'UIT', image: "https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=50"},
       	// 	// {firstName: 'Anh', lastName: 'Bui', role: 'Developer', group: 'Frontend', organization: 'University of Information Technology', image: "https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=50"}
       	// 	]),
       	
        // gotoCreate: gotoCreate,
        lUsers: lUsers,

        val: val,

        search: function(data, event) {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
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
        },
        // activate: activate,
    };
});