/*global window */
(function(document, $) {
  "use strict";

  $.fn.stickToTop = function(options) {
    options = $.extend({
      scrollParent: window,
      offset: {top: 0, left: 0},
      bottomBound: 0,
      initial: null
    }, options, true);

    var scrollParent = options.scrollParent,
    lastApplied = '',
    parentPosition = $((scrollParent === window) ? scrollParent.document.body : scrollParent).offset();

    return $(this).each(function() {
      var $sticky = $(this),
      initialPosition = $sticky.position(),
      initialPositioning = $sticky.css('position'),
      initialWidth = $sticky.width(),
      resizing = false,

      fnScrollHandler = function() {
        var scrollTop = scrollParent.scrollTop || $(document).scrollTop(),
        bottomBound = (options.bottomBound && scrollParent.offsetHeight - options.bottomBound),
        applyBottomBound = (!!bottomBound && bottomBound < scrollTop),
        applyFixed = (scrollTop >= initialPosition.top - options.offset.top),
        applyInitial = !applyFixed;

        applyFixed = applyFixed && !applyBottomBound;

        if (applyBottomBound && lastApplied !== 'bottomBound') {
          var currentPos = $sticky.position();
          $sticky.css({'position': 'absolute', 'top': bottomBound + 'px' , 'left': currentPos.left + 'px'});
          lastApplied = 'bottomBound';
          return;
        }

        if (applyInitial && lastApplied !== 'initial') {
          var props = {'position': initialPositioning};
          if (initialPositioning !== 'static') {
            $.extend(props, {'top': initialPosition.top + 'px', 'left': initialPosition.left + 'px'});
          }
          $sticky.css(props);
          lastApplied = 'initial';
          return;
        }

        if (applyFixed && lastApplied !== 'fixed') {
          $sticky.css({
            'position':'fixed', 
            'top': parentPosition.top + (options.offset.top || 0)+'px', 
            'left': (parentPosition.left + initialPosition.left + (options.offset.left || 0))+'px',
            'width': initialWidth+'px'
          });
          lastApplied = 'fixed';
          return;
        }
      };

      $(window).resize(function(e) { 
        if (resizing) {
          return;
        }

        resizing = true;
        window.setTimeout(function() {
          var thisPositioning = $sticky.css('position');
          initialPosition.left = $sticky.css('position', initialPositioning).position().left;
          $sticky.css('position', thisPositioning);        
          lastApplied = ''; 
          fnScrollHandler();
          resizing = false;
        }, 50);
      });

      if (options.initial) {
        initialPositioning = options.initial.position;
        initialPosition = {'top': options.initial.top, 'left': options.initial.left};
        $sticky.css(options.initial);
      }

      if (initialPositioning === 'relative') {
        initialPositioning = 'static';
      }

      $(options.scrollParent).scroll(fnScrollHandler);   
      fnScrollHandler();
    });
  };
}(window.document, window.jQuery));