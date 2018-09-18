define(['knockout',], function (ko) {

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

        self.addIntelValue = function (availables, selecteds, isSame) {
            let value = ko.observable();
            value.subscribe(function () {
                let tempSelecteds = selecteds().map(a => a.value());
                if ((new Set(tempSelecteds)).size !== tempSelecteds.length) {
                    isSame(true);
                } else {
                    isSame(false);
                }
            });

            let tempAvailableGroups = availables.filter( (el) => !selecteds().map(a => a.value()).includes(el) );
            if (tempAvailableGroups != null) {
                value(tempAvailableGroups[0]);
            }

            selecteds.push({ value: value });
        };

        self.handleOnSameSelected = function(selecteds, isSame) {
            let tempSelectedGroups = selecteds().map(a => a.value());
            if ((new Set(tempSelectedGroups)).size !== tempSelectedGroups.length) {
                isSame(true);
            } else {
                isSame(false);
            }
        };
    }

    return new FactoryObjectModel();
});