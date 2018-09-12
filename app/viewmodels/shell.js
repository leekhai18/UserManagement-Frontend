define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        // search: function() {
        //     //It's really easy to show a message box.
        //     //You can add custom options too. Also, it returns a promise for the user's response.
        //     app.showMessage('Search not yet implemented...');
        // },
        activate: function () {
            router.map([
                { route: ['', 'name=(:queryName)'], moduleId: 'viewmodels/list', nav: true },
                { route: 'profile/:id', title:'', moduleId: 'viewmodels/profile', nav: false },
                { route: 'create', title:'', moduleId: 'viewmodels/create', nav: false },
            ]).buildNavigationModel();
            
            return router.activate();
        }
    };
});