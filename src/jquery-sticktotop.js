(function() {
  (function(document, $) {
    "use strict";
    $.fn.stickToTop = function(options) {
      var lastApplied, parentPosition, scrollParent;
      options = $.extend({
        scrollParent: window,
        offset: {
          top: 0,
          left: 0
        },
        minWindowHeight: false,
        minWindowWidth: false,
        preserveLayout: true,
        bottomBound: false,
        onStick: null,
        onDetach: null
      }, options, true);
      scrollParent = options.scrollParent;
      lastApplied = 0;
      parentPosition = $((scrollParent === window ? scrollParent.document.body : scrollParent)).offset();
      return $(this).each(function() {
        var $layoutDiv, $sticky, fnGetStickyProps, fnGetWindowSize, fnResizeHandler, fnScrollHandler, resizing, sticky, stickyProps, unsticking;
        sticky = this;
        $sticky = $(sticky);
        stickyProps = false;
        resizing = false;
        unsticking = false;
        $layoutDiv = options.preserveLayout ? $sticky.wrap("<div class=\"stickToTopLayout\"></div>").parent() : void 0;
        fnGetWindowSize = function() {
          var windowSize;
          windowSize = {
            width: 0,
            height: 0
          };
          if (typeof window.innerWidth === "number") {
            windowSize.width = window.innerWidth;
            windowSize.height = window.innerHeight;
          } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
            windowSize.width = document.documentElement.clientWidth;
            windowSize.height = document.documentElement.clientHeight;
          }
          return windowSize;
        };
        fnGetStickyProps = function() {
          var stickyProperties;
          stickyProperties = false;
          if (options.minWindowWidth && fnGetWindowSize().width >= options.minWindowWidth || !options.minWindowWidth) {
            stickyProperties = {
              offset: $sticky.offset(),
              position: $sticky.css("position"),
              width: $sticky.outerWidth(true),
              height: $sticky.outerHeight(true),
              marginTop: parseInt($sticky.css("margin-top"), 10),
              marginLeft: parseInt($sticky.css("margin-left"), 10)
            };
          }
          return stickyProperties;
        };
        fnScrollHandler = function() {
          var applyBottomBound, applyFixed, applyInitial, bottomBound, currentPos, parentHeight, parentWidth, props, scrollTop, windowSize;
          if (!stickyProps) {
            stickyProps = fnGetStickyProps();
          }
          scrollTop = scrollParent.scrollTop || $(document).scrollTop();
          windowSize = fnGetWindowSize();
          parentHeight = scrollParent === window ? windowSize.height : scrollParent.offsetHeight;
          parentWidth = scrollParent === window ? windowSize.width : scrollParent.offsetWidth;
          bottomBound = options.bottomBound && (parentHeight - options.bottomBound - stickyProps.height);
          applyBottomBound = !!bottomBound && bottomBound < scrollTop;
          applyFixed = scrollTop >= stickyProps.offset.top - options.offset.top - stickyProps.marginTop + parentPosition.top;
          applyInitial = !applyFixed;
          if (options.minWindowWidth && parentWidth < options.minWindowWidth) {
            applyInitial = true;
            applyFixed = false;
          }
          applyFixed = applyFixed && !applyBottomBound;
          if (applyBottomBound && lastApplied !== 1) {
            currentPos = $sticky.offset();
            $sticky.css({
              position: "absolute",
              top: bottomBound + "px",
              left: currentPos.left + "px"
            });
            lastApplied = 1;
            if (options.onDetach) {
              options.onDetach.call(sticky);
            }
            return;
          }
          if ((applyInitial && lastApplied !== 2) || (options.minWindowHeight && parentHeight < options.minWindowHeight)) {
            props = {
              position: stickyProps.position
            };
            if (stickyProps.position === "static" || stickyProps.position === "relative") {
              $sticky.removeAttr("style");
              if ($layoutDiv) {
                $layoutDiv.removeAttr("style");
              }
            } else {
              $.extend(props, {
                top: stickyProps.offset.top,
                left: stickyProps.offset.left
              });
            }
            lastApplied = 2;
            if (options.onDetach) {
              options.onDetach.call(sticky);
            }
            return;
          }
          if (applyFixed && lastApplied !== 3 && windowSize.height > stickyProps.height + options.offset.top) {
            $sticky.css({
              position: "fixed",
              top: parentPosition.top + (options.offset.top || 0),
              left: parentPosition.left + stickyProps.left + (options.offset.left - stickyProps.marginLeft || 0),
              width: stickyProps.width,
              "z-index": 1000
            });
            if (options.preserveLayout) {
              $layoutDiv.css({
                position: stickyProps.position,
                width: stickyProps.width,
                height: stickyProps.height,
                "margin-top": stickyProps.marginTop,
                "margin-left": stickyProps.marginLeft
              });
            }
            lastApplied = 3;
            if (options.onStick) {
              options.onStick.call(sticky);
            }
          }
        };
        fnResizeHandler = function(e) {
          if (resizing) {
            return;
          }
          resizing = true;
          window.setTimeout((function() {
            if (options.minWindowWidth && fnGetWindowSize().width < options.minWindowWidth) {
              return;
            }
            if (unsticking) {
              return;
            }
            $sticky.removeAttr('style');
            if (options.preserveLayout) {
              $layoutDiv.removeAttr('style');
            }
            stickyProps = fnGetStickyProps();
            lastApplied = "";
            fnScrollHandler();
            resizing = false;
          }), 50);
        };
        $(window).on("resize", fnResizeHandler);
        $(options.scrollParent).on("scroll", fnScrollHandler);
        this.unstickToTop = function() {
          unsticking = true;
          $(options.scrollParent).off("scroll", fnScrollHandler);
          $(window).off("resize", fnResizeHandler);
        };
      });
    };
  })(window.document, window.jQuery);

}).call(this);
