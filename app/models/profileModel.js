class Profile {
    constructor(props) {
        this.personalID = props.id;
        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.fullName = `${this.firstName} ${this.lastName}`;
        this.profileImage = props.profileImage;
        this.organization = props.organization.name;
        this.groups = props.groups;
        this.roles = props.roles;
        this.workPhoneNumbers = props.workPhone;
        this.privatePhoneNumbers = props.privatePhone;
        this.mobileNumbers = props.mobile;
        this.workEmails = props.email;
    }   
}

class ConstantUI {
    constructor() {
        this.pageTitle = DETAIL_TITLE;

        this.labelOrganization = ORGANIZATION;
        this.labelGroup = GROUP;
        this.labelRole = ROLE;
        this.labelFirstName = FIRS_TNAME;
        this.labelLastName = LAST_NAME;
        this.labelPersonnelID = PERSONNEL_ID;
        this.labelMobilePhone = MOBILE;
        this.labelPrivatePhone = PRIVATE_PHONE;
        this.labelWorkPhone = WORK_PHONE;
        this.labelEmail = EMAIL;
    }   
}