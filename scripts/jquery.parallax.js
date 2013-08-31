/*
Plugin: jQuery Simple Parallax
Version 0.1
Author: Jason Hummel
Twitter: @jhummel
Author URL: http://www.wearechalk.com/
Plugin URL: http://www.github.com/madebychalk/jQuery-Parallax

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html

Inspired by jQuery Prallax by Ian Lunn
https://github.com/IanLunn/jQuery-Parallax
*/

(function(factory) {
  if(typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery, window);
  }
})(function($, undefined){
  'use strict';

  var Pub, 
      Parallax,
      guid,
      parseArgs,
      $window = $(window),
      scrollTop = $window.scrollTop(),
      windowHeight = $window.height();

  $window.on('resize', function(){ windowHeight = $window.height(); });
  $window.on('scroll', function(){ Pub.notify(); });

  guid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  };

  Pub = (function(){
    var subscribers = {};

    return {
      subscribe: function(id, obj){
        subscribers[id] = obj;
      },

      remove: function(id){
        delete subscribers[id];
      },

      each: function(func) {
        $.each(subscribers, function(k,v) {
          func.apply(v);
        });
      },

      count: function() {
        var size = 0,
            key;

        for(key in subscribers) {
          if(obj.hasOwnProperty(key)) size++;
        } 

        return size;
      },

      remove_all: function() {
        this.each(function(){ this.destroy(); });
      },

      notify: function() {
        scrollTop = $window.scrollTop();
        this.each(function(){ this.update(); });
      }
    };
  })();

  Parallax = function(jqo, options){
    this.options  = options;
    this.$el      = jqo;
    this.ypos = parseInt( jqo.css('backgroundPosition').split(" ")[1] );
    this.guid = guid();
    this.refresh();

    Pub.subscribe(this.guid, this);
  };


  Parallax.prototype = {
    _onScreen: function() {
      return !(this.top + this.height < this.pos || this.top > this.pos + windowHeight)
    },

    _getHeight: function() {
      return (this.options.outerHeight) ?
        this.$el.outerHeight(true) :
        this.$el.height();
    },

    refresh: function() {
      this.height = this._getHeight();
      this.top = this.$el.offset().top;
    },

    update: function() {
      if( this._onScreen() )
        this.$el.css('backgroundPosition', this.options.xpos + " " + (this.ypos + Math.round((this.top - (scrollTop + windowHeight)) * this.options.speed)) + "px");
    },

    destroy: function() {
      Pub.remove(this.guid);
      this.$el.removeData('parallax');
    }
  };

  $.fn.parallax = function(options) {
    var args  = $.makeArray(arguments),
        after = args.slice(1);

    return this.each(function() {
      var instance,
          $el = $(this);

      instance = $el.data('parallax');

      if(instance) {
        instance[args[0]].apply(instance, after);
      } else {
        options = $.extend({
          xpos: '50%',
          speed: 0.25,
          outerHeight: true
        }, options);

        $el.data( 'parallax', new Parallax($el, options) );
      }

    });
  };

  $.Parallax = {
    destroy_all: function() {
      Pub.remove_all();
    }
  };

});




