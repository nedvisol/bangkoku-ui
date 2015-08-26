'use strict'
define([
    'backbone',
    'backbone.marionette',
    'views/sample',
    'routers/appRouter'
  ],
  function(Backbone, Marionette, SampleView, AppRouter) {
    var bkkApp = new Backbone.Marionette.Application();

    /*MyApp.addRegions({
      mainRegion: "#mainContent"
    });*/

    bkkApp.root = function() {
      
    };

    bkkApp.addInitializer(function(options){
      bkkApp.router = new AppRouter({app: bkkApp});

      /*
      var SampleModel = Backbone.Model.extend({});
      var mdl = new SampleModel({foo: 'bar'});

      var sampleView = new SampleView({model: mdl});
      MyApp.mainRegion.show(sampleView);
      */

      Backbone.history.start();
      bkkApp.router.navigate('home', { trigger: true});

    });

    return bkkApp;
});
