define(['knockout', 'jquery', 'knockout.validation'], function (ko, $){
    ko.validation.init();
    
    var ProfileModel = function (){
        var self = this;

        self.firstName = ko.observable("");

        self.lastName = ko.observable("");

        self.fullName = ko.computed(function() {
            return self.firstName() + " " + self.lastName();
        });

        self.groups = ko.observableArray([{value: ""}]);
        self.addGroup = function() {
            self.groups.push({value: ""});
        };
        self.removeGroup = function(group) {
            self.groups.remove(group);
        };

        self.roles = ko.observableArray([{value: ""}]);
        self.addRole = function() {
            self.roles.push({value: ""});
        };
        self.removeRole = function(role) {
            self.roles.remove(role);
        };

        self.workPhoneNumbers = ko.observableArray([{value: ""}]);
        self.addWorkPhoneNumber = function() {
            self.workPhoneNumbers.push({value: ""});
        };
        self.removeWorkPhoneNumber = function(workPhoneNumber) {
            self.workPhoneNumbers.remove(workPhoneNumber);
        };

        self.mobileNumbers = ko.observableArray([{value: ""}]);
        self.addMobileNumber = function() {
            self.mobileNumbers.push({value: ""});
        };
        self.removeMobileNumber = function(mobileNumber) {
            self.mobileNumbers.remove(mobileNumber);
        };

        // self.email = ko.observable("Hello");
        // self.workEmails = ko.observableArray([{value: self.email}]);
        self.workEmails = ko.observableArray([{value: ""}]);
        self.addWorkEmail = function() {
            self.workEmails.push({value: ""});
        };
        self.removeWorkEmail = function(workEmail) {
            self.workEmails.remove(workEmail);
        };

        self.create = function() {
            
        }
    }
    
    return new ProfileModel();
});