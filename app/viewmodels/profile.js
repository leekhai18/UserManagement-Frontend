define([
    'plugins/router',
    'services/getUsers',
    'models/profileModel'
], function (router, services) {

    var ProfileModel = function () {
        var self = this;

        self.constantUI = new ConstantUI();

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
