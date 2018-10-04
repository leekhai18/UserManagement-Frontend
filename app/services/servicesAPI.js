define(['durandal/app', 'plugins/http'], function (app, http) {

    var ServicesAPI = function () {
        var self = this;

        self.getAvailabelOrganizations = function () {
            return new Promise(function (resolve, reject) {
                http.get(`${DOMAIN_DEV}api/organization`)
                    .then(function (response) { 
                        resolve(response);
                    }, function(error) {
                        var err = LOADORGANIZATION_ERROR;
                        reject(err);
                        app.showMessage(err, 'Error', ['Yes'])
                    }
                );
            });
        };

        self.getAvailabelRoles = function () {
            return new Promise(function (resolve, reject) {
                http.get(`${DOMAIN_DEV}api/role`)
                    .then(function (response) {
                        resolve(response);
                    }, function (error) {
                        var err = LOADROLE_ERROR;
                        reject(err);
                        app.showMessage(err, 'Error', [YES])
                    }
                );
            });
        };

        self.getAvailabelGroups = function () {
            return new Promise(function(resolve, reject) {
                http.get(`${DOMAIN_DEV}api/group`)
                    .then(function (response) {
                        resolve(response);
                    }, function (error) {
                        var err = LOADGROUP_ERROR;
                        reject(err);
                        app.showMessage(err, 'Error', [YES])
                    }
                );
            });
        };

        self.getUser = function(id) {
            return new Promise(function(resolve, reject) {
                http.get(`${DOMAIN_DEV}api/user/` + id)
                    .then(function (user) {
                        resolve(user);
                    },
                    function (error) {
                        reject(error.statusText + " " + error.responseText);
                        app.showMessage(error.statusText + " " + error.responseText, 'Error!', [YES]);
                    }
                );
            });
        };
    }


    return new ServicesAPI();
});