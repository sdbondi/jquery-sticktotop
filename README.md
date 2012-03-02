# jquery-sticktotop.js

A JQuery plugin to make your elements stick to the top when scrolling a webpage.
It takes the initial position of any element and gives the element a fixed 
position when scrolling past it, ensuring the element always stays in view.
Perfect for sidebars.

## Usage

   $('aside').stickToTop(options);

## Options

scrollParent: 
  Element in which scrolling is monitored.
  default: DOM window

offset:
  Scroll offset to apply fixed positioning (sticking).
  Basically the gap left at all times between the scrollParent 
  and the target element.
  default: {top: 0, left: 0}

bottomBound:
  Scroll value relative to the bottom which to stop the element
  from sticking (absolute positioning).
  Useful if you have a large footer and dont want your sidebar 
  crashing into it.
  default: 0

onStick: 
  Callback for when the element becomes sticky.
  default: null

onDetach:
  Callback for when the element becomes detached. Also fires when 
  the bottomBound is reached.
  default: null

## License

See the file [LICENSE](https://github.com/sdbondi/JQuery-StickToTop/blob/master/LICENSE.txt)
