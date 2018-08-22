define(['knockout', './user', 'knockout.validation'], function (ko, User){
    ko.validation.init();

    var firstName = ko.observable(),
    	lastName = ko.observable(),
    	role = ko.observable(),
    	group = ko.observable(),
    	organization = ko.observable(),
    	image = ko.observable();

    return {
       firstName: 'Anh',
       lastName: 'Bui',
       role: 'Developer',
       group: 'Frontend',
       organization: 'UIT',
       image: image,

       
    };
});