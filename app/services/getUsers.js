define(['durandal/app', 'plugins/http'], function (app, http) {

    var GetUser = function () {
        var self = this;

        self.getUser = function(id) {
            return new Promise(function(resolve, reject) {
                http.get('https://localhost:5001/api/user/' + id)
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

    return new GetUser();
});