'use strict'
define([
    'backbone',
    'backbone.marionette',
    'views/sample'
  ],
  function(Backbone, Marionette, SampleView) {
    var MyApp = new Backbone.Marionette.Application();

    MyApp.addRegions({
      mainRegion: "#mainContent"
    });

    MyApp.addInitializer(function(options){

      var SampleModel = Backbone.Model.extend({});
      var mdl = new SampleModel({foo: 'bar'});

      var sampleView = new SampleView({model: mdl});
      MyApp.mainRegion.show(sampleView);
    });

    return MyApp;
});
