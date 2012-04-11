/*global window */
(function(document, $) {
  "use strict";

  $.fn.stickToTop = function(options) {
    options = $.extend({
      scrollParent: window,
      offset: {top: 0, left: 0},
      bottomBound: 0,
      onStick: null,
      onDetach: null
    }, options, true);

    var scrollParent = options.scrollParent,
    lastApplied = '',
    parentPosition = $((scrollParent === window) ? scrollParent.document.body : scrollParent).offset();

    return $(this).each(function() {
      var sticky = this,
      $sticky = $(sticky),
      initialPosition = $sticky.position(),
      initialPositioning = $sticky.css('position'),
      initialWidth = $sticky.width(),
      stickyHeight = $sticky.outerHeight(true),
      resizing = false,

      fnScrollHandler = function() {
        var scrollTop = scrollParent.scrollTop || $(document).scrollTop(),
        parentHeight = ((scrollParent == window) ? window.document.body : scrollParent).offsetHeight,
        // If bottomBound, calculate bottom bound including height of the sticky
        bottomBound = options.bottomBound && (parentHeight - options.bottomBound - stickyHeight),

        applyBottomBound = (!!bottomBound && bottomBound < scrollTop),

        applyFixed = (scrollTop >= initialPosition.top - options.offset.top + parentPosition.top),
        applyInitial = !applyFixed;

        applyFixed = applyFixed && !applyBottomBound;

        if (applyBottomBound && lastApplied !== 'bottomBound') {
          var currentPos = $sticky.position();
          $sticky.css({'position': 'absolute', 'top': bottomBound + 'px' , 'left': currentPos.left + 'px'});
          lastApplied = 'bottomBound';
          if (options.onDetach) {
            options.onDetach.call(sticky);
          }
          return;
        }

        if (applyInitial && lastApplied !== 'initial') {
          var props = {'position': initialPositioning};
          if (initialPositioning !== 'static') {
            $.extend(props, {'top': initialPosition.top + 'px', 'left': initialPosition.left + 'px'});
          }
          $sticky.css(props);
          lastApplied = 'initial';
          if (options.onDetach) {
            options.onDetach.call(sticky);
          }
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
          if (options.onStick) {
            options.onStick.call(sticky);
          }
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

      if (initialPositioning === 'relative') {
        initialPositioning = 'static';
      }

      $(options.scrollParent).scroll(fnScrollHandler);   
    });
  };
}(window.document, window.jQuery));