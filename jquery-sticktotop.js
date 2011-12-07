(function(document, $) {
  "use strict"

  var body = document.body;

  $.fn.stickToTop = function(options) {
    options = $.extend({
      'scrollParent': window,
      'offset': {top: 0, left: 0},
      'bottomBound': 0,
      'initial': null,
    }, options, true);

    var lastApplied = '';

    return $(this).each(function() {
      var $sticky = $(this),
      initialOffset = $sticky.offset(),
      initialPositioning = $sticky.css('position'),
      initialWidth = $sticky.width(),

      fnScrollHandler = function() {
        var scrollTop = body.scrollTop || $(document).scrollTop(),
        bottomBound = (options.bottomBound && document.height - options.bottomBound);

        var 
        applyBottomBound = (!!bottomBound && bottomBound < scrollTop),
        applyFixed = (scrollTop >= initialOffset.top - options.offset.top),
        applyInitial = !applyFixed;

        applyFixed = applyFixed && !applyBottomBound;

        if (applyBottomBound && lastApplied != 'bottomBound') {
          var currentPos = $sticky.position();
          $sticky.css({'position': 'absolute', 'top': bottomBound + 'px' , 'left': currentPos.left + 'px'});
          lastApplied = 'bottomBound';
          return;
        }

        if (applyInitial && lastApplied != 'initial') {
          var props = {'position': initialPositioning};
          if (initialPositioning != 'static')
            $.extend(props, {'top': initialOffset.top, 'left': initialOffset.left});
          $sticky.css(props);
          lastApplied = 'initial';
          return;
        }

        if (applyFixed && lastApplied != 'fixed') {
          $sticky.css({
            'position':'fixed', 
            'top': (options.offset.top || 0)+'px', 
            'left': (initialOffset.left + (options.offset.left || 0))+'px',
            'width': initialWidth+'px'
          });
          lastApplied = 'fixed';
          return;
        }
      };

      $(window).resize(function(e) { 
        var thisPositioning = $sticky.css('position');
        initialOffset.left = $sticky.css('position', initialPositioning).position().left;
        $sticky.css('position', thisPositioning);        
        lastApplied = ''; 
        fnScrollHandler();
      });

      if (options.initial) {
        initialPositioning = options.initial.position;
        initialOffset = {'top': options.initial.top, 'left': options.initial.left};
        $sticky.css(options.initial);
      }

      if (initialPositioning == 'relative')
        initialPositioning = 'static';

      $(options.scrollParent).scroll(fnScrollHandler);   
      fnScrollHandler();
    });
  };
}(self.document, self.jQuery))