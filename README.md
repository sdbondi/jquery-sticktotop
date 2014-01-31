# jquery-sticktotop.js Version 0.1.1

A JQuery plugin to make your elements stick to the top when scrolling a webpage.
It takes the initial position of any element and gives the element a fixed
position when scrolling past it, ensuring the element always stays in view.
Perfect for sidebars.

## Bower

```
bower install jQuery-stickToTop
```

## Usage

```javascript
$('aside').stickToTop(options);
```
## Options

<table>
  <tr>
    <th>Option</th>
    <th>Description</th>
  </tr>
  <tr>
    <th>scrollParent:</th>
    <td>Element in which scrolling is monitored. <br><br>
    default: DOM window</td>
  </tr>
  <tr>
    <th>offset:</th>
    <td>Scroll offset to apply fixed positioning (sticking).
    Basically the gap left at all times between the scrollParent and the target element.  <br><br>
    default: {top: 0, left: 0}</td>
  </tr>
  <tr>
    <th>bottomBound:</th>
    <td>  Scroll value relative to the bottom which to stop the element
    from sticking (absolute positioning).<br>
    Useful if you have a large footer and dont want your sidebar
    crashing into it.<br><br>
    default: false (no bottom bound)</td>
  </tr>
  <tr>
    <th>minParentHeight:</th>
    <td>The minimum height of the parent/window in which stickToTop will be active.<br>
    If less than the minimum height stickToTop will have no effect but will
    become active as soon as the parent/window height is greater than minParentHeight.<br><br>
    default: false (no min height)</td>
  </tr>
  <tr>
    <th>minParentWidth:</th>
    <td>The minimum width of the parent/window in which stickToTop will be active.<br>
    If less than the minimum width stickToTop will have no effect but will
    become active as soon as the parent/window width is greater than minParentWidth.<br>
    Useful for disabling stickToTop for mobile and tablet viewports.<br><br>

    **Note: If using ems for your media queries, make sure to multiply the respective value by 16.<br>
    <a href="http://filamentgroup.com/lab/how_we_learned_to_leave_body_font_size_alone/">Browsers calculate media-query widths from the base UA font size</a>, <strong>NOT</strong> stylesheet base font size.<br><br>
    default: false (no min width)</td>
  </tr>
  <tr>
    <th>preserveLayout:</th>
    <td>Preserves layout of sticky elements by adding a div which
    occupies the original flow.<br><br>

    **Note: Floated elements do not occupy flow in the same manner as non-floated elements.<br>
    preserveLayout should be set to false when stickToTop is applied to floated elements.<br><br>
    default: true</td>
  </tr>
  <tr>
    <th>onStick:</th>
    <td>Callback for when the element becomes sticky.<br><br>
    default: null</td>
  </tr>
  <tr>
    <th>onDetach:</th>
    <td>Callback for when the element becomes detached. <br>
    Also fires when the bottomBound is reached.<br><br>
    default: null</td>
  </tr>
</table>

**Note**: bottomBound now includes the height of the sticky element in the calculation
to make bottomBound more intuitive (issue #1)

## unstickToTop

You can detach stickToTop from your element by using the unstickToTop() function

```javascript
var $aside = $('aside');

// Attach
$aside.stickToTop();

...
// Detach
$aside.get(0).unstickToTop();
```
## Examples

### Sidebar

The "normal" use-case for this plugin demostrated applying the plugin to a side and menu bar.

### Tetris Hearts

Using this plugin to position many elements (in this case a canvas with a tetris block painted
inside of it) and stick them to their appropriate places while scrolling to form a heart.

Visit [this blog post](http://mopo.ws/wZz1Xb) for a full explanation

## License

See the file [LICENSE](https://github.com/sdbondi/JQuery-StickToTop/blob/master/LICENSE.txt)
