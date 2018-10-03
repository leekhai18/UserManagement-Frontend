define(['durandal/app', 'plugins/http'], function (app, http) {

    var GetAvailables = function () {
        var self = this;

        self.getAvailabelOrganizations = function () {
            return new Promise(function (resolve, reject) {
                http.get('https://localhost:5001/api/organization')
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
                http.get('https://localhost:5001/api/role')
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
                http.get('https://localhost:5001/api/group')
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

        self.getAvailables = function() {
            var promises = [];
            promises.push(self.getAvailabelOrganizations());
            promises.push(self.getAvailabelGroups());
            promises.push(self.getAvailabelRoles());

            return  Promise.all(promises);
        };
    }


    return new GetAvailables();
});