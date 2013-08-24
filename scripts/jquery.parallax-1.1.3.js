/*
Plugin: jQuery Parallax
Version 1.1.3
Author: Ian Lunn
Twitter: @IanLunn
Author URL: http://www.ianlunn.co.uk/
Plugin URL: http://www.ianlunn.co.uk/plugins/jquery-parallax/

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }
}(function ($) {

  var $window = $(window);
  var windowHeight = $window.height();

  $window.resize(function () {
    windowHeight = $window.height();
  });

  $.fn.parallax = function(xpos, speedFactor, outerHeight) {
    var getHeight,
        firstTop,
        $this = this;

    if (outerHeight) {
      getHeight = function(jqo) {
        return jqo.outerHeight(true);
      };
    } else {
      getHeight = function(jqo) {
        return jqo.height();
      };
    }
      
    firstTop = function(jqo) {
      if( typeof jqo.data('firstTop') === 'undefined')
        jqo.data( 'firstTop', parseInt( jqo.css('backgroundPosition').split(" ")[1] ) );

      return jqo.data('firstTop')
    }

    // setup defaults if arguments aren't specified
    if (arguments.length < 1 || xpos === null) xpos = "50%";
    if (arguments.length < 2 || speedFactor === null) speedFactor = 0.1;
    if (arguments.length < 3 || outerHeight === null) outerHeight = true;
    
    // function to be called whenever the window is scrolled or resized
    function update(){
      var pos = $window.scrollTop();        

      $this.each(function(){
        var $element = $(this);
        var top = $element.offset().top;
        var height = getHeight($element);
        var ypos = firstTop($element);
        
        // Check if totally above or totally below viewport
        if (top + height < pos || top > pos + windowHeight) {
          return;
        }

        $element.css('backgroundPosition', xpos + " " + (ypos + Math.round((top - (pos + windowHeight)) * speedFactor)) + "px");
      });
    }   

    $window.bind('scroll', update).resize(update);
    update();

    return this;
  };
}));

