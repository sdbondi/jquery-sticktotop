# global window
((document, $) ->
	"use strict"
	$.fn.stickToTop = (options) ->
		options = $.extend(
			scrollParent: window
			offset:
				top: 0
				left: 0

			minWindowHeight: false
			minWindowWidth: false
			preserveLayout: true
			bottomBound: false
			onStick: null
			onDetach: null
			, options, true)
		scrollParent = options.scrollParent

		#
		#		1: BottomBound
		#		2: Initial
		#		3: Fixed
		#
		lastApplied = 0
		parentPosition = $((if (scrollParent is window) then scrollParent.document.body else scrollParent)).offset()
		$(this).each ->
			sticky = this
			$sticky = $(sticky)
			stickyProps = false
			resizing = false
			unsticking = false
			$layoutDiv = if options.preserveLayout then $sticky.wrap("<div class=\"stickToTopLayout\"></div>").parent() else undefined


			fnGetWindowSize = ->
				windowSize =
					width: 0
					height: 0

				if typeof (window.innerWidth) is "number"

					#Non-IE
					windowSize.width = window.innerWidth
					windowSize.height = window.innerHeight
				else if document.documentElement and (document.documentElement.clientWidth or document.documentElement.clientHeight)

					#IE 6+ in 'standards compliant mode'
					windowSize.width = document.documentElement.clientWidth
					windowSize.height = document.documentElement.clientHeight
				windowSize


			fnGetStickyProps = ->
				stickyProperties = false
				if options.minWindowWidth and fnGetWindowSize().width >= options.minWindowWidth or not options.minWindowWidth
					stickyProperties =
						offset: $sticky.offset()
						position: $sticky.css("position")
						width: $sticky.outerWidth(true)
						height: $sticky.outerHeight(true)
						marginTop: parseInt($sticky.css("margin-top"), 10)
						marginLeft: parseInt($sticky.css("margin-left"), 10)
				return stickyProperties


			fnScrollHandler = ->
				if not stickyProps
					stickyProps = fnGetStickyProps()
				scrollTop = scrollParent.scrollTop or $(document).scrollTop()
				windowSize = fnGetWindowSize()
				parentHeight = if scrollParent is window then windowSize.height else scrollParent.offsetHeight
				parentWidth = if scrollParent is window then windowSize.width else scrollParent.offsetWidth

				# If bottomBound, calculate bottom bound including height of the sticky
				bottomBound = options.bottomBound and (parentHeight - options.bottomBound - stickyProps.height)
				applyBottomBound = !!bottomBound and bottomBound < scrollTop
				applyFixed = scrollTop >= stickyProps.offset.top - options.offset.top - stickyProps.marginTop + parentPosition.top
				applyInitial = not applyFixed
				if options.minWindowWidth and parentWidth < options.minWindowWidth
					applyInitial = true
					applyFixed = false
				applyFixed = applyFixed and not applyBottomBound

				# bottom bound
				if applyBottomBound and lastApplied isnt 1
					currentPos = $sticky.offset()
					$sticky.css
						position: "absolute"
						top: bottomBound + "px"
						left: currentPos.left + "px"

					lastApplied = 1
					options.onDetach.call sticky if options.onDetach
					return

				# initial
				if (applyInitial and lastApplied isnt 2) or (options.minWindowHeight and parentHeight < options.minWindowHeight)
					props = position: stickyProps.position
					if stickyProps.position is "static" or stickyProps.position is "relative"
						$sticky.removeAttr "style"
						$layoutDiv.removeAttr "style" if $layoutDiv
					else
						$.extend props,
							top: stickyProps.offset.top
							left: stickyProps.offset.left

					lastApplied = 2
					options.onDetach.call sticky if options.onDetach
					return

				# fixed
				if applyFixed and lastApplied isnt 3 and windowSize.height > stickyProps.height+ options.offset.top
					$sticky.css
						position: "fixed"
						top: parentPosition.top + (options.offset.top or 0)
						left: (parentPosition.left + stickyProps.left + (options.offset.left - stickyProps.marginLeft or 0))
						width: stickyProps.width
						"z-index": 1000

					if options.preserveLayout
						$layoutDiv.css
							position: stickyProps.position
							width: stickyProps.width
							height: stickyProps.height
							"margin-top": stickyProps.marginTop
							"margin-left": stickyProps.marginLeft

					lastApplied = 3
					options.onStick.call sticky if options.onStick
					return


			fnResizeHandler = (e) ->
				return if resizing
				resizing = true
				window.setTimeout (->
					return if options.minWindowWidth and fnGetWindowSize().width < options.minWindowWidth
					return if unsticking

					$sticky.removeAttr('style')

					if options.preserveLayout
						$layoutDiv.removeAttr('style')

					stickyProps = fnGetStickyProps()
					lastApplied = ""
					fnScrollHandler()
					resizing = false
					return
				), 50
				return


			$(window).on "resize", fnResizeHandler

			$(options.scrollParent).on "scroll", fnScrollHandler


			# Function to stop stickToTop
			@unstickToTop = ->
				unsticking = true
				$(options.scrollParent).off "scroll", fnScrollHandler
				$(window).off "resize", fnResizeHandler
				return

			return

	return
) window.document, window.jQuery
