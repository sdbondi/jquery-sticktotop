/* global window */
(function(document, $) {
	"use strict";

	$.fn.stickToTop = function(options) {
		options = $.extend({
			scrollParent: window,
			offset: {top: 0, left: 0},
			minParentHeight: false,
			minParentWidth: false,
			preserveLayout: true,
			bottomBound: false,
			onStick: null,
			onDetach: null
		}, options, true);

		var scrollParent = options.scrollParent,
		/*
		1: BottomBound
		2: Initial
		3: Fixed
		*/
		lastApplied = 0,
		parentPosition = $((scrollParent === window) ? scrollParent.document.body : scrollParent).offset();


		return $(this).each(function() {
			var sticky = this,
				$sticky = $(sticky),
				initialPosition = $sticky.offset(),
				initialPositioning = $sticky.css('position'),
				isFloated = ($sticky.css('float') === 'none' ? false : true),
				initialWidth = $sticky.outerWidth(true),
				initialHeight = $sticky.outerHeight(true),
				initialMarginTop = (parseInt($sticky.css('margin-top'),10)),
				initialMarginLeft = (parseInt($sticky.css('margin-left'),10)),
				resizing = false,
				unsticking = false,
				$layoutDiv,

			fnGetWindowSize = function() {
				var windowSize = {
					width: 0,
					height: 0
				};

				if( typeof( window.innerWidth ) == 'number' ) {
					//Non-IE
					windowSize.width = window.innerWidth;
					windowSize.height = window.innerHeight;
				} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
					//IE 6+ in 'standards compliant mode'
					windowSize.width = document.documentElement.clientWidth;
					windowSize.height = document.documentElement.clientHeight;
				}

				return windowSize;
			},
			fnScrollHandler = function() {
				var scrollTop = scrollParent.scrollTop || $(document).scrollTop(),
				parentHeight = ((scrollParent == window) ? window.document.body : scrollParent).offsetHeight,
				parentWidth = ((scrollParent == window) ? window.document.body : scrollParent).offsetWidth,
				windowSize = fnGetWindowSize(),
				// If bottomBound, calculate bottom bound including height of the sticky
				bottomBound = options.bottomBound && (parentHeight - options.bottomBound - initialHeight),

				applyBottomBound = (!!bottomBound && bottomBound < scrollTop),

				applyFixed = (scrollTop >= initialPosition.top - options.offset.top - initialMarginTop + parentPosition.top),
				applyInitial = !applyFixed;

				if (options.minParentWidth && parentWidth < options.minParentWidth ) {
					applyInitial = true;
					applyFixed = false;
				}

				applyFixed = applyFixed && !applyBottomBound;

				// bottom bound
				if (applyBottomBound && lastApplied !== 1) {
					var currentPos = $sticky.offset();
					$sticky.css({'position': 'absolute', 'top': bottomBound + 'px' , 'left': currentPos.left  + 'px'});
					lastApplied = 1;
					if (options.onDetach) {
					options.onDetach.call(sticky);
					}
					return;
				}

				// initial
				if ((applyInitial && lastApplied !== 2) ||
					(options.minParentHeight && parentHeight < options.minParentHeight)) {
					var props = {'position': initialPositioning};
					if (initialPositioning === 'static') {
						$sticky.removeAttr('style');

					if ($layoutDiv && parentWidth < options.minParentWidth){
						$layoutDiv.removeAttr('style');
					}
					} else {
						$.extend(props, {'top': initialPosition.top + 'px', 'left': initialPosition.left});
					}
					$sticky.css(props);
					lastApplied = 2;
					if (options.onDetach) {
						options.onDetach.call(sticky);
					}
					return;
				}

				// fixed
				if (applyFixed && lastApplied !== 3 && windowSize.height > initialHeight + options.offset.top) {

					if (isFloated) initialWidth = $sticky.outerWidth();

					$sticky.css({
						'position':'fixed',
						'top': parentPosition.top + (options.offset.top || 0),
						'left': (parentPosition.left + initialPosition.left + (options.offset.left - initialMarginLeft || 0)),
						'width': initialWidth,
						'z-index': 1000
					});

					lastApplied = 3;
					if (options.onStick) {
						options.onStick.call(sticky);
					}
					return;
				}

			},
			fnResizeHandler = function(e) {
				var updatedHeight = $sticky.outerHeight(true),
						updatedWidth = $sticky.outerWidth(true);

				if (resizing) {
					return;
				}

				resizing = true;
				window.setTimeout(function() {

					if (unsticking) {
						return;
					}

					initialPosition.left = $sticky.css('position', initialPositioning).offset().left;

					if (options.preserveLayout) {
						$layoutDiv.css({
							width: 'auto',
							height: 'auto'
						});

						if (!isFloated) initialWidth = $layoutDiv.outerWidth(true);
						updatedHeight = $sticky.outerHeight(true);

						// Update layout div
						$layoutDiv.css({
							height: updatedHeight - initialMarginTop,
							'margin-top': initialMarginTop
						});
					}

					lastApplied = '';
					fnScrollHandler();
					resizing = false;
				}, 50);
			};

			$(window).on('resize', fnResizeHandler);

			if (initialPositioning === 'relative') {
				initialPositioning = 'static';
			}

			$(options.scrollParent).on('scroll', fnScrollHandler);

			if ( options.preserveLayout ) {
				var layoutWidth = (isFloated) ? 100 + '%' : initialWidth;

				$layoutDiv = $('<div class="stickToTopLayout"></div>').css({
					'height': initialHeight - initialMarginTop,
					'width': layoutWidth,
					'margin-top': initialMarginTop
				});
				$layoutDiv = $sticky.wrap($layoutDiv).parent();
			}

			// Function to stop stickToTop
			this.unstickToTop = function() {
				unsticking = true;
				$(options.scrollParent).off('scroll', fnScrollHandler);
				$(window).off('resize', fnResizeHandler);
			};
		});
	};

}(window.document, window.jQuery));