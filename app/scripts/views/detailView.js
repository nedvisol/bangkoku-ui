'use strict'
define([
        'jst',
        'ui/formControl',
    ],
    function(_jst, formControl) {

        var DetailView = Backbone.View.extend({
            tagName: "div",
            id: "customerDetails",
            className: 'detail-view',
            template: JST['detail'],
            initialize: function(options) {
              var channel = Backbone.Radio.channel('view-'+this.id);
              channel.on('form:update', function($el){
                console.log('form update '+$el);
                this.$el.find('.cloud-upload,.cloud-cancel').removeClass('action-icon-invisible');
              }, this);
            },
            render: function(){
              this.$el.html(this.template());
              this.$el.find('.detail-form input.form-control').formControl('init', { viewId: this.id });
            },
        });

        return DetailView;
    });
