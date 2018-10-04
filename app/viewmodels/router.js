define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        copyright: COPYRIGHT,
        logo: LOGO,
        router: router,
        activate: function () {
            router.map([
                { route: '', title: 'Home', moduleId: 'viewmodels/list', nav: true },
                { route: 'profile/:id', title: '', moduleId: 'viewmodels/profile', nav: false },
                { route: ['create', 'edit/:id'], title: '', moduleId: 'viewmodels/create', nav: true },
                // { route: 'editProfile/:id', title: '', moduleId: 'viewmodels/editProfile', nav: false },
            ]).buildNavigationModel();

            return router.activate();
        }
    };
});