define([
    'plugins/router',
    'services/getUsers',
    'models/profileModel'
], function (router, services) {

    var ProfileModel = function () {
        var self = this;

        self.pageTitle = DETAIL_TITLE;

        self.labelOrganization = ORGANIZATION;
        self.labelGroup = GROUP;
        self.labelRole = ROLE;
        self.labelFirstName = FIRS_TNAME;
        self.labelLastName = LAST_NAME;
        self.labelPersonnelID = PERSONNEL_ID;
        self.labelMobilePhone = MOBILE;
        self.labelPrivatePhone = PRIVATE_PHONE;
        self.labelWorkPhone = WORK_PHONE;
        self.labelEmail = EMAIL;

        self.activate = function (id) {
            var result = services.getUser(id);

            return  result.then(function(profile) {
                        self.model = new Profile(profile);
                    },  
                    function(error) {
                        throw new Error(error);
                    });
        };

        self.edit = function () {
            router.navigate('editProfile/' + self.personalID);
        };
    };

    return new ProfileModel();
});
