/*global window */
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
					initialPosition = $sticky.position(),
					initialPositioning = $sticky.css('position'),
					initialWidth = $sticky.outerWidth(true),
					initialHeight = $sticky.outerHeight(true),
					resizing = false,
					unsticking = false,
					$layoutDiv,

			getParentWidth = function() {
				var width = (scrollParent == window ? window.document.body : scrollParent).offsetWidth;
				return width;
			},

			fnScrollHandler = function() {
				var scrollTop = scrollParent.scrollTop || $(document).scrollTop(),
				parentHeight = ((scrollParent == window) ? window.document.body : scrollParent).offsetHeight,
				parentWidth = ((scrollParent == window) ? window.document.body : scrollParent).offsetWidth,
				// If bottomBound, calculate bottom bound including height of the sticky
				bottomBound = options.bottomBound && (parentHeight - options.bottomBound - initialHeight),

				applyBottomBound = (!!bottomBound && bottomBound < scrollTop),

				applyFixed = (scrollTop >= initialPosition.top - options.offset.top + parentPosition.top),
				applyInitial = !applyFixed;

				if (options.minParentWidth && parentWidth < options.minParentWidth ) {
					applyInitial = true;
					applyFixed = false;
				}

				applyFixed = applyFixed && !applyBottomBound;

				// bottom bound
				if (applyBottomBound && lastApplied !== 1) {
					var currentPos = $sticky.position();
					$sticky.css({'position': 'absolute', 'top': bottomBound + 'px' , 'left': currentPos.left + 'px'});
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
						$.extend(props, {'top': initialPosition.top + 'px', 'left': initialPosition.left + 'px'});
					}
					$sticky.css(props);
					lastApplied = 2;
					if (options.onDetach) {
						options.onDetach.call(sticky);
					}
					return;
				}

				// fixed
				if (applyFixed && lastApplied !== 3) {
					$sticky.css({
						'position':'fixed',
						'top': parentPosition.top + (options.offset.top || 0)+'px',
						'left': (parentPosition.left + initialPosition.left + (options.offset.left || 0))+'px',
						'width': initialWidth+'px',
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
				var updatedHeight = initialHeight;

				if (resizing || (options.minParentWidth && getParentWidth() < options.minParentWidth)) {
					return;
				}

				resizing = true;
				window.setTimeout(function() {

					if (unsticking) {
						return;
					}

					var thisPositioning = $sticky.css('position');

					initialPosition.left = $sticky.css('position', initialPositioning).position().left;
					initialPosition.top = $sticky.css('position', initialPositioning).position().top;

					$sticky.css({
						position: thisPositioning,
						width: 'auto'
					});

					if (options.preserveLayout) {
						$layoutDiv.css({
							width: 'auto',
							height: 'auto'
						});

						initialWidth = $layoutDiv.outerWidth(true);
						updatedHeight = $layoutDiv.outerHeight(true);

						// UpdatedHeight will somehow be assigned 0 breaking layout.
						// Check for this explicitly, and don't assign initialHeight
						// this value unless it is not 0.
						if (updatedHeight !==0 ) {
							initialHeight = updatedHeight;
						}

						// Update layout div
						$layoutDiv.css({
							width: initialWidth + 'px',
							height: initialHeight + 'px'
						});
					}

					$sticky.css({
						width: initialWidth,
						height: initialHeight
					});

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

				if ( getParentWidth() >= options.minParentWidth ) {
					$layoutDiv = $('<div></div>').css({'height': initialHeight, 'width': initialWidth});
				} else {
					$layoutDiv = $('<div></div>').css({'height': 'auto', 'width': 'auto'});
				}

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

