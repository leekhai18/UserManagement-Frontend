class ProfileEnableInteraction {
    constructor(ko) {
        this.personnelID = ko.observable("").extend({ required: { params: true, message: REQUIRED_NOTICE } });
        this.firstName = ko.observable("").extend({ required: { params: true, message: REQUIRED_NOTICE} });
        this.lastName = ko.observable("").extend({ required: { params: true, message: REQUIRED_NOTICE } });
        this.fullName = ko.computed( () => this.firstName() + " " + this.lastName() );

        this.mainGroup = ko.observable(0).extend({ required: { params: true, message: '_' } });
        this.mainRole = ko.observable(-1).extend({ required: { params: true, message: '_' } });
        this.mainWorkPhoneNumber = ko.observable(0).extend({ required: { params: true, message: '_' } });
        this.mainMobileNumber = ko.observable(0).extend({ required: { params: true, message: '_' } });
        this.mainPrivatePhoneNumber = ko.observable(0).extend({ required: { params: true, message: '_' } });
        this.mainWorkEmail = ko.observable(-1).extend({ required: { params: true, message: '_' } });

        this.availableOrganizations = [];
        this.availableGroups = [];
        this.availableRoles = [];
        this.availableGroupsBelongOrg = ko.observableArray([]);

        this.selectedOrganization = ko.observable();
        this.selectedGroups = ko.observableArray();
        this.selectedRoles = ko.observableArray();
        this.workPhoneNumbers = ko.observableArray();
        this.privatePhoneNumbers = ko.observableArray();
        this.mobileNumbers = ko.observableArray();
        this.workEmails = ko.observableArray();

        this.isSameGroups = ko.observable(false);
        this.isSameRoles = ko.observable(false);
        this.isSameWorkPhoneNumbers = ko.observable(false);
        this.isSamePrivatePhoneNumbers = ko.observable(false);
        this.isSameMobilePhoneNumbers = ko.observable(false);
        this.isSameWorkEmails = ko.observable(false);

        this.profileImage = ko.observable("assets/img/faces/face-2.jpg");
        this.promise = undefined;
    }

    initializeWithUserProfile(knockout, profile, titleMainGroup, titleMainRole, titleMainEmail) {
        this.personnelID(profile.id);
        this.firstName(profile.firstName);
        this.lastName(profile.lastName);
        this.profileImage(profile.profileImage);
        this.selectedOrganization(profile.organization.id);

        var self = this;
        this.promise.then(function() {
            self.selectedGroups.removeAll();

            profile.groups.forEach(function(group, i) {
                for (var i = 0; i < self.availableGroupsBelongOrg().length; i++) {
                    if (group.id == self.availableGroupsBelongOrg()[i].id) {
                        self.addGroup(knockout, titleMainGroup, self.availableGroupsBelongOrg()[i]);
                        break;
                    }
                }

                if (group.isMain)
                    self.mainGroup(i);
            });
        });

        profile.roles.forEach(function(role, i) {
            for (var i = 0; i < self.availableRoles.length; i++) {
                if (self.availableRoles[i].id == role.id) {
                    self.addRole(knockout, titleMainRole, self.availableRoles[i]);
                    break;
                }    
            }

            if (role.isMain)
                self.mainRole(i);
        });

        profile.workPhone.forEach(function(workPhone, i) {
            self.addWorkPhoneNumber(knockout, workPhone.number);

            if (workPhone.isMain)
                self.mainWorkPhoneNumber(i);
        });

        profile.mobile.forEach(function(mobile, i) {
            self.addMobileNumber(knockout, mobile.number);

            if (mobile.isMain)
                self.mainMobileNumber(i);
        });

        profile.privatePhone.forEach(function(privatePhone, i) {
            self.addPrivatePhoneNumber(knockout, privatePhone.number);

            if (privatePhone.isMain)
                self.mainPrivatePhoneNumber(i);
        });

        profile.email.forEach(function(email, i) {
            self.addWorkEmail(knockout, titleMainEmail, email.address);

            if (email.isMain)
                self.mainWorkEmail(i);
        });
    }

    initialize(knockout, titleMainGroup, titleMainRole, titleMainEmail) {XMLDocument
        this.mainRole(0);
        this.mainGroup(0);
        this.mainWorkPhoneNumber(0);
        this.mainPrivatePhoneNumber(0);
        this.mainMobileNumber(0);
        this.mainWorkEmail(0);

        this.addRole(knockout, titleMainRole);
        this.addWorkPhoneNumber(knockout);
        this.addMobileNumber(knockout);
        this.addPrivatePhoneNumber(knockout);
        this.addWorkEmail(knockout, titleMainEmail);
    }

    refreshValue() {
        this.personnelID("");
        this.firstName("");
        this.lastName("");
        this.profileImage("assets/img/faces/face-2.jpg");

        this.selectedOrganization(this.availableOrganizations[0]);
        this.selectedGroups([]);
        this.selectedRoles([]);
        this.workPhoneNumbers([]);
        this.privatePhoneNumbers([]);
        this.mobileNumbers([]);
        this.workEmails([]);
    }

    subscribeTitleMainGroup(titleMainGroup) {
        this.mainGroup.subscribe( (index) => {
            if (this.selectedGroups()[index] != undefined)
                titleMainGroup(this.selectedGroups()[index].value().name);
        });
    }

    subscribeTitleMainRole(titleMainRole) {
        this.mainRole.subscribe( (index) => {
            titleMainRole(this.selectedRoles()[index].value().name);
        });
    }

    subscribeTitleMainEmail(titleMainEmail) {
        this.mainWorkEmail.subscribe( (index) => {
            titleMainEmail(this.workEmails()[index].value());
        });
    }

    subscribeSelectedOrganization(titleOrganization, titleMainGroup, knockout) {
        var self = this;
        this.promise = new Promise(function (resolve, reject) {
            self.selectedOrganization.subscribe( (idOrganizationSelected) => {
                self.selectedGroups.removeAll();
                self.addGroup(knockout, titleMainGroup);
                self.mainGroup(0);
    
                self.availableGroupsBelongOrg.removeAll();
                self.availableGroups.forEach(avaiGroup => {
                    if (avaiGroup.organization.id == idOrganizationSelected) {
                        self.availableGroupsBelongOrg.push(avaiGroup);
                    }
                });
    
                self.availableOrganizations.forEach(org => {
                    if (org.id == idOrganizationSelected) {
                        titleOrganization(org.name);
                    }
                });

                resolve(self.availableGroupsBelongOrg());
            });
        }); 
    }

    addGroup(knockout, titleMainGroup, preValue = undefined) {
        var group = this.getUniqueValueOn(this.availableGroupsBelongOrg(), this.selectedGroups, this.isSameGroups, this.mainGroup, titleMainGroup, knockout);
        if (preValue != undefined) 
            group(preValue);  

        this.selectedGroups.push({ value: group });
    }

    addRole(knockout, titleMainRole, preValue = undefined) {
        var role = this.getUniqueValueOn(this.availableRoles, this.selectedRoles, this.isSameRoles, this.mainRole, titleMainRole, knockout);
        if (preValue != undefined) 
            role(preValue); 

        this.selectedRoles.push({ value: role });
    }

    addWorkPhoneNumber(knockout, preValue = undefined) {
        var workPhoneNumber = this.getValueFollow(true, PARAMS_PATTERN_PHONE_NUMBER, knockout);
        if (preValue != undefined) 
            workPhoneNumber(preValue); 

        workPhoneNumber.subscribe( () => {
            this.isSameWorkPhoneNumbers(this.checkSelectedListIsSame(this.workPhoneNumbers));
        });

        this.workPhoneNumbers.push({ value: workPhoneNumber });
    }

    addPrivatePhoneNumber(knockout, preValue = undefined) {
        var privatePhoneNumber = this.getValueFollow(false, PARAMS_PATTERN_PHONE_NUMBER, knockout);
        if (preValue != undefined) 
            privatePhoneNumber(preValue); 

        privatePhoneNumber.subscribe( () => {
            this.isSamePrivatePhoneNumbers(this.checkSelectedListIsSame(this.privatePhoneNumbers));
        });

        this.privatePhoneNumbers.push({ value: privatePhoneNumber });
    }

    addMobileNumber(knockout, preValue = undefined) {
        var mobileNumber = this.getValueFollow(true, PARAMS_PATTERN_PHONE_NUMBER, knockout);
        if (preValue != undefined) 
            mobileNumber(preValue); 
        
        mobileNumber.subscribe( () => {
            this.isSameMobilePhoneNumbers(this.checkSelectedListIsSame(this.mobileNumbers));
        });
        
        this.mobileNumbers.push({ value: mobileNumber });
    }

    addWorkEmail(knockout, titleMainEmail, preValue = undefined) {
        var workEmail = knockout.observable().extend({
            required: { params: true, message: REQUIRED_NOTICE },
            email: { params: true, message: WRONG_NOTICE }
        });

        if (preValue != undefined) 
            workEmail(preValue); 

        workEmail.subscribe( (value) => {
            if (this.workEmails()[this.mainWorkEmail()].value() == value) {
                titleMainEmail(value);
            }

            this.isSameWorkEmails(this.checkSelectedListIsSame(this.workEmails));
        });

        this.workEmails.push({ value: workEmail });
    }

    removeGroup(group) {
        this.selectedGroups.remove(group);
        this.isSameGroups(this.checkSelectedListIsSame(this.selectedGroups));
        this.reSetIndexMain(this.mainGroup, this.selectedGroups);
    }

    removeRole(role) {
        this.selectedRoles.remove(role);
        this.isSameRoles(this.checkSelectedListIsSame(this.selectedRoles));
        this.reSetIndexMain(this.mainRole, this.selectedRoles);
    }

    removeWorkPhoneNumber(workPhoneNumber) {
        this.workPhoneNumbers.remove(workPhoneNumber);
        this.isSameWorkPhoneNumbers(this.checkSelectedListIsSame(this.workPhoneNumbers));
        this.reSetIndexMain(this.mainWorkPhoneNumber, this.workPhoneNumbers);
    }

    removePrivatePhoneNumber(privatePhoneNumber) {
        this.privatePhoneNumbers.remove(privatePhoneNumber);
        this.isSamePrivatePhoneNumbers(this.checkSelectedListIsSame(this.privatePhoneNumbers));
        this.reSetIndexMain(this.mainPrivatePhoneNumber, this.privatePhoneNumbers);
    }

    removeMobileNumber(mobileNumber) {
        this.mobileNumbers.remove(mobileNumber);
        this.isSameMobilePhoneNumbers(this.checkSelectedListIsSame(this.mobileNumbers));
        this.reSetIndexMain(this.mainMobileNumber, this.mobileNumbers);
    }

    removeWorkEmail(workEmail) {
        this.workEmails.remove(workEmail);
        this.isSameWorkEmails(this.checkSelectedListIsSame(this.workEmails));
        this.reSetIndexMain(this.mainWorkEmail, this.workEmails);
    }

    //
    // Utilities Func
    //
    getUniqueValueOn(baseAvailables, listSelected, isSameWhat, mainWhat, titleMainWhat, ko) {
        var uniqueValue = ko.observable();

        uniqueValue.subscribe(function (value) {
            var arraySelectedValue = listSelected().map(a => a.value());

            if (mainWhat != null) {
                if (value != null && arraySelectedValue.indexOf(value) == mainWhat()) {
                    titleMainWhat(value.name);
                }
            }

            if ((new Set(arraySelectedValue)).size !== arraySelectedValue.length) {
                isSameWhat(true);
            } else {
                isSameWhat(false);
            }
        });

        var availables = baseAvailables.filter( (baseAvailableValue) => !listSelected().map(selected => selected.value()).includes(baseAvailableValue) );
        if (availables != null) {
            uniqueValue(availables[0]);
        }

        return uniqueValue;
    }

    getValueFollow(isRequired, paramsPattern, ko) {
        return ko.observable().extend({
                        required: { params: isRequired, message: REQUIRED_NOTICE },
                        pattern: { params: paramsPattern, message: WRONG_NOTICE },
                    });
    }

    checkSelectedListIsSame(selectedList) {
        var arraySelectedValue = selectedList().map(selected => selected.value());
            
        if ((new Set(arraySelectedValue)).size !== arraySelectedValue.length) {
            return true;
        }

        return false;
    }

    reSetIndexMain(mainIndex, selectedList) {
        if (mainIndex() == selectedList().length && selectedList().length > 0) {
            mainIndex(selectedList().length - 1)
        }
    }

    getContract(utilities) {
        return {
            id: this.personnelID(),
            firstName: this.firstName(),
            lastName: this.lastName(),
            organizationId: this.selectedOrganization(),
            groups: utilities.jsonSerializeSelected(this.selectedGroups(), this.mainGroup()),
            roles: utilities.jsonSerializeSelected(this.selectedRoles(), this.mainRole()),
            workPhone: utilities.jsonSerializeInputTextForNumber(this.workPhoneNumbers(), this.mainWorkPhoneNumber()),
            privatePhone: utilities.jsonSerializeInputTextForNumber(this.privatePhoneNumbers(), this.mainPrivatePhoneNumber()),
            mobile: utilities.jsonSerializeInputTextForNumber(this.mobileNumbers(), this.mainMobileNumber()),
            email: utilities.jsonSerializeInputTextForEmail(this.workEmails(), this.mainWorkEmail()),
            profileImage: this.profileImage()
        };
    }
}