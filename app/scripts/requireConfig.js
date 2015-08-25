require.config({
  deps: [
    'main','jquery','underscore','bootstrap'
  ],
  shim: {
    'backbone' : {
      deps: ['underscore','jquery']
    },
    'bootstrap' : {
      deps: ['jquery']
    }
  },
  paths: {
    backbone: '../bower_components/backbone/backbone',
    underscore: '../bower_components/underscore/underscore',
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
    jquery: '../bower_components/jquery/dist/jquery',
    'bootstrap-sass': '../bower_components/bootstrap-sass/assets/javascripts/bootstrap',
    'backbone.marionette': '../bower_components/backbone.marionette/lib/core/backbone.marionette',
    'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
    'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr'
  },
  packages: [

  ]
});
