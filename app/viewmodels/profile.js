define([
    'plugins/router',
    'services/servicesAPI',
    'models/profileModel',
    'models/constantUI'
], function (router, servicesAPI) {

    var ProfileViewModel = function () {
        var self = this;

        self.constantUI = new ConstantUI(DETAIL_TITLE);

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
            router.navigate('edit/' + self.model.personalID);
        };
    };

    return new ProfileViewModel();
});
