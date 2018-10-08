define([
    'plugins/router',
    'services/servicesAPI',
    'helpers/cssLoader',
    'models/profileModel',
    'models/constantUI'
], function (router, servicesAPI, cssLoader) {

    var ProfileViewModel = function () {
        var self = this;

        self.constantUI = new ConstantUI(DETAIL_TITLE);

        self.activate = function (id) {
            // Load css
            cssLoader.loadCss("app/css/profileStyle.css", "profileStyle");

            var result = servicesAPI.getUser(id);

            return  result.then(function(profile) {
                        self.model = new Profile(profile);
                    },  
                    function(error) {
                        throw new Error(error);
                    });
        };

        self.detached = function () {
            cssLoader.removeModuleCss("profileStyle");
            return true;
        }

        self.edit = function () {
            router.navigate('edit/' + self.model.personalID);
        };
    };

    return new ProfileViewModel();
});
