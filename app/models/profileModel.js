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