define([
    'plugins/router',
    'services/servicesAPI',
    'models/profileModel'
], function (router, servicesAPI) {

    var ProfileModel = function () {
        var self = this;

        self.constantUI = new ConstantUI();

        self.activate = function (id) {
            var result = servicesAPI.getUser(id);

            return  result.then(function(profile) {
                        self.model = new Profile(profile);
                    },  
                    function(error) {
                        throw new Error(error);
                    });
        };

        self.edit = function () {
            router.navigate('edit/' + self.personalID);
        };
    };

    return new ProfileModel();
});
