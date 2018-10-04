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

        this.profileImage = ko.observable('assets/img/faces/face-2.jpg');
    }

    initializeWithUserProfile(profile) {
        this.personnelID(profile.id);
        this.firstName(profile.firstName);
        this.lastName(profile.lastName);


        // ông làm tiếp nhé.. 6h rồi t đi ngủ phát :v 
        // Công việc còn lại:
        // hoàn thành func này nè
        // tách css
        // xư lý mấy nút edit, delete, cancle
        // xong nhớ del file editprofile luôn hé...
        // ... xử đẹp đi nhen chú ;) 
    }

    initialize(knockout, titleMainGroup, titleMainRole, titleMainEmail) {
        this.addGroup(knockout, titleMainGroup);
        this.addRole(knockout, titleMainRole);
        this.addWorkPhoneNumber(knockout);
        this.addMobileNumber(knockout);
        this.addPrivatePhoneNumber(knockout);
        this.addWorkEmail(knockout, titleMainEmail);

        this.mainRole(0);
        this.mainGroup(0);
        this.mainWorkPhoneNumber(0);
        this.mainPrivatePhoneNumber(0);
        this.mainMobileNumber(0);
        this.mainWorkEmail(0);
    }

    refreshValue(knockout) {
        this.personnelID = knockout.observable("").extend({ required: { params: true, message: REQUIRED_NOTICE } });
        this.firstName = knockout.observable("").extend({ required: { params: true, message: REQUIRED_NOTICE} });
        this.lastName = knockout.observable("").extend({ required: { params: true, message: REQUIRED_NOTICE } });

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
        this.selectedOrganization.subscribe( (idOrganizationSelected) => {
            this.selectedGroups.removeAll();
            this.addGroup(knockout, titleMainGroup);

            this.availableGroupsBelongOrg.removeAll();
            this.availableGroups.forEach(avaiGroup => {
                if (avaiGroup.organization.id == idOrganizationSelected) {
                    this.availableGroupsBelongOrg.push(avaiGroup);
                }
            });

            this.availableOrganizations.forEach(org => {
                if (org.id == idOrganizationSelected) {
                    titleOrganization(org.name);
                }
            });
        });
    }

    addGroup(knockout, titleMainGroup) {
        var group = this.getUniqueValueOn(this.availableGroupsBelongOrg(), this.selectedGroups, this.isSameGroups, this.mainGroup, titleMainGroup, knockout);
        this.selectedGroups.push({ value: group });
    }

    addRole(knockout, titleMainRole) {
        var role = this.getUniqueValueOn(this.availableRoles, this.selectedRoles, this.isSameRoles, this.mainRole, titleMainRole, knockout);
        this.selectedRoles.push({ value: role });
    }

    addWorkPhoneNumber(knockout) {
        var workPhoneNumber = this.getValueFollow(true, PARAMS_PATTERN_PHONE_NUMBER, knockout);
        workPhoneNumber.subscribe( () => {
            this.isSameWorkPhoneNumbers(this.checkSelectedListIsSame(this.workPhoneNumbers));
        });
        this.workPhoneNumbers.push({ value: workPhoneNumber });
    }

    addPrivatePhoneNumber(knockout) {
        var privatePhoneNumber = this.getValueFollow(false, PARAMS_PATTERN_PHONE_NUMBER, knockout);
        privatePhoneNumber.subscribe( () => {
            this.isSamePrivatePhoneNumbers(this.checkSelectedListIsSame(this.privatePhoneNumbers));
        });
        this.privatePhoneNumbers.push({ value: privatePhoneNumber });
    }

    addMobileNumber(knockout) {
        var mobileNumber = this.getValueFollow(true, PARAMS_PATTERN_PHONE_NUMBER, knockout);
        mobileNumber.subscribe( () => {
            this.isSameMobilePhoneNumbers(this.checkSelectedListIsSame(this.mobileNumbers));
        });
        this.mobileNumbers.push({ value: mobileNumber });
    }

    addWorkEmail(knockout, titleMainEmail) {
        var workEmail = knockout.observable().extend({
            required: { params: true, message: REQUIRED_NOTICE },
            email: { params: true, message: WRONG_NOTICE }
        });
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
}