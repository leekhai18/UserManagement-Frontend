define([
    'knockout',
    'durandal/app',
    'plugins/http',
    'plugins/router',
    'factoryObjects',
    'httpGet',
    'knockout.validation'
], function (ko, app, http, router, factoryObjects, httpGet) {
    // 
    // 
    // Intit knockout
    //    
    // 
    var knockoutValidationSettings = {
        grouping: {
            deep: true,
            observable: true
        }
    };

    ko.validation.init(knockoutValidationSettings, true);

    // Define model
    var ProfileModel = function () {
        var self = this;

        // 
        // 
        // Declaration objects
        // 
        // 
        self.photoUrl = ko.observable();

        self.firstName = ko.observable("ss");
        self.lastName = ko.observable("");
        self.fullName = ko.computed(function () {
            return self.firstName() + " " + self.lastName();
        });

        self.personalID = ko.observable("");
        self.RolesForMe = ko.observableArray();
        self.GroupsForMe = ko.observableArray();
        self.organization = ko.observable();
        self.workPhoneNumbers = ko.observableArray();
        self.privatePhoneNumbers = ko.observableArray([]);
        self.mobileNumbers = ko.observableArray();
        self.workEmails = ko.observableArray();

        self.validated = ko.validatedObservable(self);

        self.edit = function () {
            // Navigate to edit page after click button edit
            if (personalID != null) {
                router.navigate('editProfile/' + personalID);
            }
        };

        // Mapping data func
        self.mapDataByObject = function (u) {
            // 
            // 
            // Simple
            // 
            // 

            self.firstName(u.firstName);
            self.lastName(u.lastName);
            self.personalID(u.id);
            self.photoUrl(u.profileImage);

            // 
            // 
            // Organization
            // 
            // 

            self.organization(u.organization.name);

            // 
            // 
            // Groups
            // 
            // 

            self.GroupsForMe([]);
            u.groups.forEach(element => {
                self.GroupsForMe.push(factoryObjects.createGroup(element.id, element.name, element.organization));
            })

            // 
            // 
            // Roles
            // 
            // 

            self.RolesForMe([]);
            u.roles.forEach(element => {
                self.RolesForMe.push(factoryObjects.createRole(element.id, element.name));
            })

            // 
            // 
            // WorkPhoneNumbers
            // 
            // 

            self.workPhoneNumbers([]);
            u.workPhone.forEach(element => {
                self.workPhoneNumbers.push(factoryObjects.createWorkPhoneNumbers(element.number, element.isMain));
            });

            // 
            // 
            // MobileNumbers
            // 
            // 

            self.mobileNumbers([]);
            u.mobile.forEach(element => {
                self.mobileNumbers.push(factoryObjects.createMobileNumbers(element.number, element.isMain));
            });

            // 
            // 
            // PrivatePhoneNumbers
            // 
            // 

            self.privatePhoneNumbers([]);
            u.privatePhone.forEach(element => {
                self.privatePhoneNumbers.push(factoryObjects.createPrivatePhoneNumbers(element.number, element.isMain));
            });


            // 
            // 
            // WorkEmails
            // 
            // 

            self.workEmails([]);
            // u.email.forEach(element => {
            //     self.workEmails.push({
            //         value: ko.observable(element.address)
            //             .extend({
            //                 required: {
            //                     params: true,
            //                     message: 'This field is required.'
            //                 }
            //             })
            //             .extend({
            //                 email: {
            //                     params: true,
            //                     message: 'This email is wrong.'
            //                 }
            //             })
            //     });
            // });

            u.email.forEach(element => {
                self.workEmails.push(new factoryObjects.createEmail(element.address, element.isMain));
            });

        }

        self.bindingDataByID = function (id) {
            // recieve data from server 
            http.get('https://localhost:5001/api/user/' + id)
                .then(function (u) {
                    console.log('Geting user by id');
                    console.log(u);
                    console.log('-----------------');

                    self.mapDataByObject(u);
                },
                    function (error) {
                        console.log('Error when Get user by id');
                        console.log(error);
                        console.log('-------------------------');

                        app.showMessage(error.statusText + " " + error.responseText, 'Error!', ['Yes']);
                    });
        }

        self.activate = function (id) {
            personalID = id;
            self.bindingDataByID(id);
            // httpGet.getUserByID(id).then(function (u) {
            //     console.log(u);
            // })

            // if (httpGet.getUserByID(id) != null)
            //     self.mapDataByObject(httpGet.getUserByID(id));
            // else {
            //     console.log('Error when Get user by id');
            //     console.log(error);
            //     console.log('-------------------------');

            //     app.showMessage(error.statusText + " " + error.responseText, 'Error!', ['Yes']);
            // }

        };


    };

    return new ProfileModel();
});
