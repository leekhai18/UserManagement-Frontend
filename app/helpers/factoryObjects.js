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

    var Group = function (id, name, organization, isMain) {
        this.id = id;
        this.name = name;
        this.organization = organization;
        this.isMain = isMain;
    };

    var Role = function (id, name, isMain) {
        this.id = id;
        this.name = name;
        this.isMain = isMain;
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

        self.createGroup = function (id, name, organization, isMain) {
            return new Group(id, name, organization, isMain);
        }

        self.createRole = function (id, name, isMain) {
            return new Role(id, name, isMain);
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

        self.addIntelValue = function (availables, selecteds, isSame, main, titleMain) {
            let value = ko.observable();
            value.subscribe(function (val) {
                let tempSelecteds = selecteds().map(a => a.value());

                if (main != null) {
                    if (tempSelecteds.indexOf(val) == main()) {
                        titleMain(val.name);
                    }
                }

                if ((new Set(tempSelecteds)).size !== tempSelecteds.length) {
                    isSame(true);
                } else {
                    isSame(false);
                }
            });

            let tempAvailable = availables.filter( (el) => !selecteds().map(a => a.value()).includes(el) );
            if (tempAvailable != null) {
                value(tempAvailable[0]);
            }

            selecteds.push({ value: value });
        };

        self.handleOnSameSelected = function(selecteds, isSame) {
            let tempSelected = selecteds().map(a => a.value());
            
            if ((new Set(tempSelected)).size !== tempSelected.length) {
                isSame(true);
            } else {
                isSame(false);
            }
        };
    }

    return new FactoryObjectModel();
});