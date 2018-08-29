define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        search: function() {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            app.showMessage('Search not yet implemented...');
        },
        activate: function () {
            router.map([
                { route: '', moduleId: 'viewmodels/list', nav: true },
                //{ route: 'flickr', moduleId: 'viewmodels/flickr', nav: true },
                { route: 'profile/:id', title:'Profile', moduleId: 'viewmodels/profile', nav: true },
                { route: 'create', title:'Create', moduleId: 'viewmodels/create', nav: true },
                // { route: 'btnAdd', moduleId: 'viewmodels/create', nav: true }
            ]).buildNavigationModel();
            
            return router.activate();
        }
    };
});