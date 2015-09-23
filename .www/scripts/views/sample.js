'use strict'
define([
        'jst'
    ],
    function(_jst) {

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
