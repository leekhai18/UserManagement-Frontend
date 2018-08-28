define(['knockout', 'plugins/router', 'knockout.validation'], function (ko, router){
    //list of users
    var lUsers = ko.observableArray([
        {firstName: 'Anh', lastName: 'Bui', role: 'Developer', group: 'Frontend', organization: 'UIT', image: "https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=50"},
        {firstName: 'Anh', lastName: 'Bui', role: 'Developer', group: 'Frontend', organization: 'University of Information Technology', image: "https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=50"}
        ]);

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

    function activate(data) {
        $.getJSON("/lUsers", function(allData) {
            var mappedUsers = $.map(allData, function(item) { return new userInfo(item) });
            console.log(lUsers);
            self.lUsers(mappedUsers);
        });
    }

    return {
        // Array of users
        users : ko.observableArray([
       		{firstName: 'Anh', lastName: 'Bui', role: 'Developer', group: 'Frontend', organization: 'UIT', image: "https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=50"},
       		{firstName: 'Anh', lastName: 'Bui', role: 'Developer', group: 'Frontend', organization: 'University of Information Technology', image: "https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=50"}
       		]),
       	
        // gotoCreate: gotoCreate,
        lUsers: lUsers,
        activate: activate,
    };
});