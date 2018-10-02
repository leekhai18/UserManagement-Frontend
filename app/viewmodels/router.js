define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        activate: function () {
            router.map([
                // { route: ['', 'name=(:queryName)'], moduleId: 'viewmodels/list', nav: false },
                { route: '', title: 'Home', moduleId: 'viewmodels/list', nav: true },
                { route: 'profile/:id', title: '', moduleId: 'viewmodels/profile', nav: false },
                { route: 'create', title: '', moduleId: 'viewmodels/create', nav: true },
                { route: 'editProfile/:id', title: '', moduleId: 'viewmodels/editProfile', nav: false },
            ]).buildNavigationModel();

            return router.activate();
        }
    };
});