class List {
    constructor() {
        this.advancedSearch = ADVANCED_SEARCH;
        this.labelMessage = MESSAGE;
    }   
}

class Variable {
    constructor(ko){
        this.availableGroups = [];
        this.availableOrganizations = [];
        this.availableRoles = [];

        this.availableGroupsBelongOrg = ko.observableArray([]);
        this.selectedGroup = ko.observable();
        this.selectedOrganization = ko.observable();
        this.selectedRole = ko.observable();

        this.usersList = ko.observableArray([]);
        this.keySearch = ko.observable();
        this.isShowAdvancedSearch = ko.observable(false);
        this.displayMess = ko.observable(false);
}
}