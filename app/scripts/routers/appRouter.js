'use strict'
define([
        'backbone',
        'backbone.marionette'
    ],
    function(Backbone, Marionette) {
        var AppRouter = Marionette.AppRouter.extend({
            _app: null,
            initialize: function(options) {
              this._app = options.app;
            },
            /* standard routes can be mixed with appRoutes/Controllers above */
            routes: {
                'home': 'root',
            },
            root: function() {
                // do something here.
                this._app.root();
            }

        });

        return AppRouter;
    });
