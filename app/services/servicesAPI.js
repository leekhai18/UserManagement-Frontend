define(['durandal/app', 'plugins/http'], function (app, http) {

    var ServicesAPI = function () {
        var self = this;

        self.getAvailabelOrganizations = function () {
            return new Promise(function (resolve, reject) {
                http.get(`${DOMAIN_DEV}api/organization`)
                    .then(function (response) { 
                        resolve(response);
                    }, function(error) {
                        var err = 'Load organizations failed!';
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
                        var err = 'Load roles failed!';
                        reject(err);
                        app.showMessage(err, 'Error', ['Yes'])
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
                        var err = 'Load groups failed!';
                        reject(err);
                        app.showMessage(err, 'Error', ['Yes'])
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
                        app.showMessage(error.statusText + " " + error.responseText, 'Error!', ['Yes']);
                    }
                );
            });
        };
    }


    return new ServicesAPI();
});