'use strict'
define([
    'views/sample',
    'routers/appRouter',
    'views/navigationBarView',
    'views/detailView'
  ],
  function(SampleView, AppRouter, NavigationBarView, DetailView) {
    var bkkApp = new Backbone.Marionette.Application();

    bkkApp.addRegions({
      mainRegion: "#mainContent",
      navigationRegion: "#navigationContent"
    });

    bkkApp.root = function() {
      var dv = new DetailView();
      bkkApp.mainRegion.show(dv);
    };

    bkkApp.addInitializer(function(options){
      bkkApp.router = new AppRouter({app: bkkApp});

      /*
      var SampleModel = Backbone.Model.extend({});
      var mdl = new SampleModel({foo: 'bar'});

      var sampleView = new SampleView({model: mdl});
      MyApp.mainRegion.show(sampleView);
      */

      var navBar = new NavigationBarView();
      bkkApp.navigationRegion.show(navBar);

      Backbone.history.start();
      bkkApp.router.navigate('home', { trigger: true});

    });

    return bkkApp;
});
