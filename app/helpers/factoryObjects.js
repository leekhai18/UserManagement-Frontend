define([], function () {

    // 
    // 
    // Define objets
    // 
    //    

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

    var EMail = function (address, isMain) {
        this.address = address;
        this.isMain = isMain;
    }

    var PrivatePhoneNumbers = function (number, isMain) {
        this.number = number;
        this.isMain = isMain;
    }

    var WorkPhoneNumbers = function (number, isMain) {
        this.number = number;
        this.isMain = isMain;
    }

    var MobileNumbers = function (number, isMain) {
        this.number = number;
        this.isMain = isMain;
    }

    // 
    // 
    // Define model
    // 
    //    

    var FactoryObjectModel = function () {
        var self = this;

        self.createGroup = function (id, name, organization) {
            return new Group(id, name, organization);
        }

        self.createRole = function (id, name) {
            return new Role(id, name);
        }

        self.createOrganization = function (id, name) {
            return new Organization(id, name)
        }

        self.createEmail = function (address, isMain) {
            return new EMail(address, isMain);
        }

        self.createPrivatePhoneNumbers = function (number, isMain) {
            return new PrivatePhoneNumbers(number, isMain);
        }

        self.createWorkPhoneNumbers = function (number, isMain) {
            return new WorkPhoneNumbers(number, isMain);
        }

        self.createMobileNumbers = function (number, isMain) {
            return new MobileNumbers(number, isMain);
        }
    }

    return new FactoryObjectModel();
});