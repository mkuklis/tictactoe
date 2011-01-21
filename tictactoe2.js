(function() {
  var Board, Default, Game, Negamax, TicTacToe;
  var __slice = Array.prototype.slice;
  Default = (function() {
    function Default() {}
    Default.prototype.solve = function() {};
    Default.prototype._solve = function() {};
    return Default;
  })();
  Negamax = (function() {
    function Negamax() {}
    Negamax.prototype.solve = function() {};
    return Negamax;
  })();
  Board = (function() {
    function Board() {
      var board;
      board = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.board = board != null ? board : [0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.randMoves = [0, 2, 4, 6, 8];
      this.strategies = {
        "default": Default,
        negamax: Negamax
      };
      this.wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
      this.EMPTY = 0;
      this.X = 1;
      this.O = 2;
    }
    Board.prototype.getPossibleMoves = function() {
      var move, _i, _len, _ref, _results;
      _ref = this.board;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        move = _ref[_i];
        if (move === this.EMPTY) {
          _results.push(move);
        }
      }
      return _results;
    };
    Board.prototype.isFull = function() {
      return _.any(this.board, function(value, index, list) {
        return value === this.EMPTY;
      });
    };
    return Board;
  })();
  Game = (function() {
    function Game() {
      this.board = new Board;
    }
    return Game;
  })();
  TicTacToe = (function() {
    function TicTacToe() {
      this.game = new Game;
    }
    return TicTacToe;
  })();
}).call(this);
