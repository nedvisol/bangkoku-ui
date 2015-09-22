'use strict'
define([
    ],
    function() {
        var AppRouter = Backbone.Marionette.AppRouter.extend({
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
