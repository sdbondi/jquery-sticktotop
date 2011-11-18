(function(document, $) {

  var body = document.body;

  $.fn.stickToTop = function(options) {
    options = $.extend({
      'scrollParent': window,
      'offset': {top: 0, left: 0},
      'bottomBound': 0,
      'initial': null,
    }, options, true);

    var zoom = 0,
    updateZoom = function() {
      zoom = document.documentElement.clientWidth / (window.innerWidth * 1.2);
    }
    updateZoom();
    $(window).resize(updateZoom);

    var lastApplied = '';

    return $(this).each(function() {
      var $sticky = $(this),
      initialOffset = $sticky.offset(),
      initialPositioning = $sticky.css('position'),

      fnScrollHandler = function() {
        var scrollTop = body.scrollTop,
        bottomBound = (options.bottomBound && document.height - options.bottomBound);

        var applyFixed = (scrollTop >= initialOffset.top - options.offset.top),
        applyBottomBound = (!!bottomBound && bottomBound < scrollTop),
        applyInitial = !applyFixed;
        
        if (applyBottomBound && lastApplied != 'bottomBound') {
          var currentPos = $sticky.position(),
          parentOffset = $sticky.parent().offset() || {top: 0, left: 0};

          var top = currentPos.top - parentOffset.top;
          if (top < 0)
            top = currentPos.top;

          var left = (currentPos.left - parentOffset.left);
          if (left < 0)
            left = currentPos.left;

          $sticky.css({'position': 'absolute', 'top': top + 'px' , 'left': left + 'px'});
          lastApplied = 'bottomBound';
          return;
        }

        if (applyInitial && lastApplied != 'initial') {
          $sticky.css({'position': initialPositioning, 'top': initialOffset.top, 'left': initialOffset.left});
          lastApplied = 'initial';
          return;
        }

        if (applyFixed && lastApplied != 'fixed') {
          $sticky.css({'position':'fixed', 'top': (options.offset.top || 0)+'px', 'left': (initialOffset.left + (options.offset.left || 0))+'px'});
          lastApplied = 'fixed';
          return;
        }
      };

      if (options.initial) {
        initialPositioning = options.initial.position;
        initialOffset = {'top': options.initial.top, 'left': options.initial.left};
        $sticky.css(options.initial);
      }

      if (initialPositioning == 'relative')
        initialPositioning = 'static';

      $(options.scrollParent).scroll(fnScrollHandler);   
    });
  };
}(document, jQuery))