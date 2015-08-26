'use strict'
define([
        'backbone',
        'jst'
    ],
    function(Backbone, Marionette) {

        var NavigationBarView = Backbone.View.extend({
            tagName: "div",
            id: "navigationBar",
            template: JST['navigation-bar'],
            render: function(){
              this.$el.html(this.template());
            }
        });

        return NavigationBarView;
    });
