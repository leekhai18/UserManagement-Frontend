define(['knockout', 'jquery', 'knockout.validation'], function (ko, $){
    ko.validation.init();
    
    var ProfileModel = function (){
        var self = this;

        self.groups = ko.observableArray([{nameGroup: ""}]);

        self.addGroup = function (){
            self.groups.push({nameGroup: ""});
        };

        self.removeGroup = function (group){
            console.log(self.groups());
            self.groups.remove(group);
        };
    }
    
    return new ProfileModel();
});