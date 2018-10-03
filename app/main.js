requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'durandal': '../lib/durandal/js',
        'plugins': '../lib/durandal/js/plugins',
        'transitions': '../lib/durandal/js/transitions',
        'knockout': '../lib/knockout/knockout-3.4.0',
        'bootstrap': '../assets/js/bootstrap.min',
        'bootstrap.multiselect': '../assets/js/bootstrap-multiselect',
        'jquery': '../assets/js/jquery-1.10.2',
        'knockout.validation': '../lib/knockout/knockout.validation/dist/knockout.validation.min',
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        }
    }
});

define([
    'durandal/system',
    'durandal/app',
    'durandal/viewLocator',
    'bootstrap'
], function (system, app, viewLocator) {
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'Durandal Starter Kit';

    app.configurePlugins({
        router: true,
        dialog: true,
        http: true
    });


    app.start().then(function () {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/router', 'entrance');
    })

});