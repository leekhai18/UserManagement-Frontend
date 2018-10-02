define(['durandal/app', 'plugins/http'], function (app, http) {

    var Organization = function (id, name) {
        this.id = id;
        this.name = name;
    };

    var Group = function (id, name, organization) {
        this.id = id;
        this.name = name;
        this.organization = organization;
    };

    var Role = function (id, name) {
        this.id = id;
        this.name = name;
    };

    var HttpProtocol = function (domain) {
        var self = this;

        self.domain = domain;

        // Init for available
        self.availableOrganizations = [];
        self.availableGroups = [];
        self.availableRoles = [];

        self.getRSForCreateUser = function () {
            // Get all organization
            http.get('${self.domain}/api/organization')
                .then(function (response) {
                    self.availableOrganizations.length = 0;
                    response.forEach(organization => {
                        self.availableOrganizations.push(new Organization(organization.id, organization.name));
                    });
                });

            // Get all role
            http.get(self.domain + '/api/role')
                .then(function (response) {
                    self.availableRoles.length = 0;
                    response.forEach(role => {
                        self.availableRoles.push(new Role(role.id, role.name));
                    });
                });

            // Get all group and handle for groupBelongOrganization
            return http.get(self.domain + '/api/group')
                .then(function (response) {
                    self.availableGroups.length = 0;
                    response.forEach(group => {
                        self.availableGroups.push(new Group(group.id, group.name, group.organization));
                    });
                },
                    function (error) {
                        alert('Can not connect to server!');
                    });
        };
    }


    return new HttpProtocol('https://localhost:5001');
});