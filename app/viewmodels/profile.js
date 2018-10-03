define([
    'knockout',
    'plugins/router',
    'services/getUsers',
], function (ko, router, services) {

    // Define model
    var ProfileModel = function () {
        var self = this;

        self.activate = function (id) {
            var result = services.getUser(id);

            return  result.then(function(user) {
                        self.bindingData(user);
                    },
                    function(error) {
                        console.log(error);
                    });
        };

        // Init model
        self.personalID = "";
        self.photoUrl = "";

        self.firstName = "";
        self.lastName = "";
        self.fullName = ko.computed(function () {
            return `${self.firstName} ${self.lastName}`;
        });

        self.roles = [];
        self.groups = [];
        self.organization = [];
        self.workPhoneNumbers = [];
        self.privatePhoneNumbers = [];
        self.mobileNumbers = [];
        self.workEmails = []
        // Init model

        self.bindingData = function (user) {
            self.personalID = user.id;
            self.firstName = user.firstName;
            self.lastName = user.lastName;
            self.photoUrl = user.profileImage;
            self.organization = user.organization.name;
            self.groups = user.groups;
            self.roles = user.roles;
            self.workPhoneNumbers = user.workPhone;
            self.privatePhoneNumbers = user.privatePhone;
            self.mobileNumbers = user.mobile;
            self.workEmails = user.email;
        }

        self.edit = function () {
            router.navigate('editProfile/' + self.personalID);
        };
    };

    return new ProfileModel();
});
