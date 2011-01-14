// Tic Tac Toe View
var TicTacToeView = Backbone.View.extend({
  
  initialize: function() {
    _.bindAll(this, "render", "renderMark", "makeMove", "renderDraw", "renderWinner", "showMessage", "start", "clearBoard");
    this.el = $('#ttt');
    this.messageEl = this.el.find('.message');
    this.model
      .bind('game:move', this.renderMark)
      .bind('game:draw', this.renderDraw)
      .bind('game:winner', this.renderWinner);
    this.el.find('.start').bind('click', this.start);
    this.start();
  },

  // starts game
  start: function() {
	  this.clearBoard();
	  this.el.find('#footer').hide();
    $('.square', $(this.el)).bind('click', this.makeMove);
    this.model.start();
  },

  // places mark on the board
  renderMark: function(index, player) {
    var xo = (player == 1) ? 'X' : 'O';
    $('#square_' + index).html('<div class="mark">' + xo + '</div>');
    $('#square_' + index).unbind();    
  },

  // clears board
  clearBoard: function() {
    this.el.find('.square').html('');
  },

  // makes move
  makeMove: function(e) {
    var square = e.currentTarget,
    	self = this,
      index = $(square).attr('id').split('_')[1];
    this.renderMark(index, this.model.cur);
    setTimeout(function(){
    	self.model.move(index);
    }, 1000);
  },
  
  // renders draw
  renderDraw: function() {
    this.showMessage('draw!');
    this.el.find('.square').unbind();
  },

  // renders winner
  renderWinner: function(winner) {
    var xo = (winner == 1) ? 'X' : 'O';
    this.showMessage(xo + ' wins!');
    this.el.find('.square').unbind();
  },
  
  showMessage: function(m) {
	  this.messageEl.html(m);
	  this.el.find('#footer').show();
  }
});
