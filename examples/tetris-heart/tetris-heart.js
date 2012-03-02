(function(document, $, M) {
  "use strict";

  var shapes = {
    square: [[1,1],[1,1]],
    stepLeft: [[0,1,1],[1,1,0]],
    stepRight: [[1,1,0],[0,1,1]],
    t: [[0,1,0],[1,1,1]],
    longL: [[1,1,1,1]],
    lRight: [[1, 1, 1], [0, 0, 1]],
    lLeft: [[0, 0, 1], [1, 1, 1]],
    smallL: [[1, 1], [0, 1]]
  },
  colors = {
    square: '#78CB45',
    stepLeft: '#CECF49',
    stepRight: '#CF44A1',
    t: '#4C7CC7',
    longL: '#C64747',
    lLeft: '#48C7C7',
    lRight: '#C77D48',
    smallL: '#C77D48'
  },
  BLOCK_SIZE = 25,

  Block = function(shape, color, options) {
    
    if (typeof shape !== 'object' || !shape ||
        typeof color !== 'string' || !color) {
      throw new TypeError('Invalid Constructor');
    }

    // Private
    var rotation = 0;

    // Members    
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.shape = shape;
    this.color = color;
    this.options = options || {};

    // Methods
    this.initialize = function() {
      this.options = $.extend({
        blockSize: BLOCK_SIZE,
        css: null
      }, this.options)

      var dimension = Math.max(this.shape[0].length, this.shape.length);

      this.canvas.height = this.options.blockSize * dimension;
      this.canvas.width = this.options.blockSize * dimension;

      if (this.options.css) {
        $(this.canvas).css(this.options.css);
      }

      if (this.options.rotate) {
        this.rotate(rotate);
      }

      return this;
    }

    this.draw = function() {
      var ctx = this.context,
      shape = this.shape,
      color = this.color,
      i = shape.length,
      blockSize = this.options.blockSize,

      drawBlock = function(x, y, color) {
        ctx.beginPath();
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, blockSize, blockSize);
        
        var lingrad = ctx.createLinearGradient(0, 0, blockSize + x, blockSize + y);  
        lingrad.addColorStop(0, '#DAF1CB');
        lingrad.addColorStop(1, color);  
        
        ctx.fillStyle = lingrad;
        ctx.rect(x + 2, y + 2, blockSize - 4, blockSize - 4);
        ctx.fill();
        
        ctx.closePath();
      }
            
      while (i--) {
        var row = shape[i],
        j = row.length;
        
        while (j--) {
          if (row[j]) {
            drawBlock(blockSize * i, blockSize * j, color);
          }
        }
      }

      return this;
    };

    this.rotate = function(deg) {
      var canvas = this.canvas;
      rotation += deg;
      
      canvas.style[M.prefixed('Transform')] = 'rotate('+rotation+'deg)';
      return this;
    };


    // "Main"
    this.canvas.block = this;
    this.initialize();
  }

  $(function() {
    if (!M.canvas || !M.csstransforms) {
      throw new Error('Your browser does not support CSS3 transforms or Canvas.');
    }

    var parent = document.body,
    blocks = [
      {shape: shapes.stepRight, color: colors.stepRight ,coord: {x:1,  y:0}, rotation: 90},
      {shape: shapes.t, color: colors.t                 ,coord: {x:3,  y:0}, rotation: 90},
      {shape: shapes.square, color: colors.square       ,coord: {x:8,  y:0}, rotation: 0},
      {shape: shapes.lLeft, color: colors.lLeft         ,coord: {x:9, y:0}, rotation: 0},
      {shape: shapes.t, color: colors.t                 ,coord: {x:6,  y:1}, rotation: 90},
      {shape: shapes.stepRight, color: colors.stepRight ,coord: {x:11,  y:1}, rotation: 0},
      {shape: shapes.lRight, color: colors.lRight       ,coord: {x:0,  y:2}, rotation: 0},
      {shape: shapes.square, color: colors.square       ,coord: {x:1,  y:2}, rotation: 0},
      {shape: shapes.lRight, color: colors.lRight       ,coord: {x:2,  y:2}, rotation: 180},
      {shape: shapes.stepRight, color: colors.stepRight ,coord: {x:4,  y:2}, rotation: 180},
      {shape: shapes.longL, color: colors.longL         ,coord: {x:7,  y:3}, rotation: 90},
      {shape: shapes.t, color: colors.t                 ,coord: {x:10,  y:3}, rotation: 90},
      {shape: shapes.stepLeft, color: colors.stepLeft   ,coord: {x:1,  y:4}, rotation: 0},
      {shape: shapes.longL, color: colors.longL         ,coord: {x:3,  y:3}, rotation: 0},
      {shape: shapes.stepLeft, color: colors.stepLeft   ,coord: {x:4,  y:4}, rotation: 0},
      {shape: shapes.t, color: colors.t                 ,coord: {x:5,  y:5}, rotation: 90},
      {shape: shapes.lLeft, color: colors.lLeft         ,coord: {x:7,  y:3}, rotation: 270},
      {shape: shapes.stepLeft, color: colors.stepLeft   ,coord: {x:7,  y:5}, rotation: 90},
      {shape: shapes.square, color: colors.square       ,coord: {x:10,  y:5}, rotation: 0},
      {shape: shapes.lLeft, color: colors.lLeft         ,coord: {x:2,  y:6}, rotation: 90},
      {shape: shapes.stepRight, color: colors.stepRight ,coord: {x:4,  y:7}, rotation: 90},
      {shape: shapes.longL, color: colors.longL         ,coord: {x:7,  y:7}, rotation: 90},
      {shape: shapes.t, color: colors.t                 ,coord: {x:6,  y:7}, rotation: 270},
      {shape: shapes.smallL, color: colors.smallL       ,coord: {x:5,  y:9}, rotation: 180}
    ], l = blocks.length;
    
    while (l--) {
      var blockData = blocks[l],
      block = new Block(blockData.shape, blockData.color),
      randY = Math.round((Math.random() * 100) + 8),
      canvas = block.canvas;

      canvas.style.left = blockData.coord.x * BLOCK_SIZE;
      canvas.style.top = randY * BLOCK_SIZE;
      
      canvas.addEventListener('click', function(e) {
        this.block.rotate(90);
        e.preventDefault();
      });

      block.rotate(blockData.rotation).draw();      
      parent.appendChild(canvas);

      $(block.canvas).stickToTop({offset: {top: blockData.coord.y * BLOCK_SIZE}});
    }

    document.body.style.height = "3900px";
  });

}(window.document, jQuery.noConflict(), Modernizr));