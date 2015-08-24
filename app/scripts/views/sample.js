'use strict'
define([
        'backbone',
        'backbone.marionette',
        'jst'
    ],
    function(Backbone, Marionette) {

        var SampleView = Backbone.View.extend({
            tagName: "div",
            id: "sampleView",
            template: JST['sample'],
            render: function(){
              this.$el.html(this.template(this.model.toJSON()));
            }
        });

        return SampleView;
    });
