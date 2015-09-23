'use strict'
define([
    ],
    function() {
        $.fn.formControl = function(action, options){
          if (!action) {
            action = 'init';
          }

          var channel = Backbone.Radio.channel('view-'+options.viewId);

          return this.each(function(){
            $(this).attr('orig-value', $(this).val());
            $(this).change(function(){
              var $this = $(this);
              if ($this.val() != $this.attr('orig-value')) {
                $this.addClass('bk-updated');
                channel.trigger('form:update', { $el: $this });
              } else {
                $this.removeClass('bk-updated');
              }
            });
          });
        }
        return $;
    });
