define(['knockout', './user', 'knockout.validation'], function (ko, User){
    ko.validation.init();
    return {
        users: ko.observableArray([
            new User('Lee 0', 18, '01232312312', 'leekhai18@gmail.com'),
            new User('Lee 1', 18, '01232312312', 'leekhai18@gmail.com'),
            new User('Lee 2', 18, '01232312312', 'leekhai18@gmail.com'),
            new User('Lee 3', 18, '01232312312', 'leekhai18@gmail.com'),
            new User('Lee 4', 18, '01232312312', 'leekhai18@gmail.com')
        ])
    };
});