//   tic tac toe 0.1 game implementation 
//   with backbone under the hood
//   Two different strategies are provided:
//   1. negamax http://en.wikipedia.org/wiki/Negamax (no alpha beta pruning is used)
//   2. default strategy http://en.wikipedia.org/wiki/Tic-tac-toe
//
//   Copyright 2011 Michal Kuklis
//   Released under the MIT and GPL licenses.

(function(){

  // tic tac toe namespace
  var TicTacToe;
  if (typeof exports !== 'undefined') {
    TicTacToe = exports;
  } else {
    TicTacToe = this.TicTacToe = {};
  }
  
  // game options
  TicTacToe.options = {
    depth: 6,
    computerFirst: true,
    strategy: "default"
  };

  // convenient rand helper 
  TicTacToe.rand = function(max) {
    return Math.floor(Math.random() * max);
  }
  
  // initialize game
  TicTacToe.init = function(options) {
    _.extend(TicTacToe.options, options);
    return new Game();
  }

  // game constructor
  var Game = function() {
    var that = this;

    this.randMoves = [0,2,4,6,8];
    this.strategies = {default: Default, negamax: Negamax};
    
    this.bind('game:move', function(position) {
      var winner = that.board.getWinner();
      // checks if winner present
      if (winner === this.players[0] || winner == this.players[1]) {
        this.trigger("game:winner", winner);
      }
      // checks if board is full
      else if (that.board.isFull()) { 
        this.trigger("game:draw");
      }
      else { // game continues
        that.cur = (that.cur === that.board.X) ? that.board.O : that.board.X;
        // computer turn?
        if (that.cur === that.comp) {
          var move = that.solver.solve(that.board, this.cur);
          that.move(move);
        }
      }
    });
  }

  // game prototype
  _.extend(Game.prototype, Backbone.Events, {
    // makes move
    move: function(index, options) {
      options = options || {};
      this.board.move(index, this.cur);
      if (!options.silent) {
        this.trigger("game:move", index, this.cur);
      }
    }, 
    
    // starts game
    start: function() {
      this.board = new Board();
      this.solver = new this.strategies[TicTacToe.options.strategy](TicTacToe.options.depth);        
      this.players = [this.board.X, this.board.O];
      // current player
      this.cur = this.players[0];
      // computer player
      this.comp = this.cur;
      
      if (!TicTacToe.options.computerFirst) {
        this.comp = this.players[1];
      }
      
      if (TicTacToe.options.computerFirst) {
        var index = TicTacToe.rand(5);
        this.move(this.randMoves[index]);
      }
    }
  });
  
  // board constructor
  var Board = function() {
    // represents game board
    this.board = [0,0,0,0,0,0,0,0,0];
    
    // wining positions
    this.wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]];
            
    // square state
    this.EMPTY = 0;
    this.X = 1;
    this.O = 2;

    // fills board with values if board
    // is passed as an argument in the constructor
    if (arguments.length > 0) {
      for (var i = 0; i < 9; i++) {
        this.board[i] = arguments[0][i];
      }   
    }
  }

  // board prototype
  Board.prototype = {
    // returns array of available/empty indexes on the board
    getPossibleMoves: function() {
      var moves = [];
      for (var i = 0; i < 9; i++) {
        if (this.board[i] === this.EMPTY) {
          moves.push(i);
        }
      }
      return moves;
    },
    
    // checks if board is full
    isFull: function() {
      for(var i = 0; i < 9; i++) {
        if (this.board[i] === this.EMPTY) {
          return false;
        }
      }
      return true;
    },

    // returns value from the board for given index
    getSquare: function(index) {
      return this.board[index];
    },

    // makes move
    move: function(index, player) {
      if (index < 0 || index > 8)
        throw ("opps index is not valid: " +  index);
      this.board[index] = player;
    },
    
    // returns copy of the board
    copy: function() {
      return new Board(this.board);
    },

    // checks if board has a winner
    getWinner: function() {
      this.w = this.wins;
      this.s = this.getSquare;
      for (var i = 0; i < 8; i++) {
        if (this.s(this.w[i][0]) === this.s(this.w[i][1]) 
          && this.s(this.w[i][0]) === this.s(this.w[i][2]) 
          && this.s(this.w[i][0]) != this.EMPTY) {
          return this.s(this.w[i][0]);
        }
      }
      return -1;
    },

    // pretty prints the board
    prettyPrint: function() {
      var str = "";
      for (var i = 0; i < 9; i++) {
        str += ((i + 1) % 3 == 0) ? this.board[i] + "\n" : this.board[i]; 
      }
      return str;
    }
  }

  // solver based on strategy desribed here http://en.wikipedia.org/wiki/Tic-tac-toe
  var Default = function() {
    this.twoTaken = [
      {t:[0,1],m:2},{t:[1,2],m:0},{t:[0,2],m:1}, // first row
      {t:[3,4],m:5},{t:[4,5],m:3},{t:[3,5],m:4}, // second row
      {t:[6,7],m:8},{t:[7,8],m:6},{t:[6,8],m:7}, // third row
      {t:[0,3],m:6},{t:[0,6],m:3},{t:[3,6],m:0}, // first column
      {t:[1,4],m:7},{t:[4,7],m:1},{t:[1,7],m:4}, // second column
      {t:[2,5],m:8},{t:[5,8],m:2},{t:[2,8],m:5}, // third column
      {t:[0,4],m:8},{t:[4,8],m:0},{t:[0,8],m:4}, // first diagonal
      {t:[2,4],m:6},{t:[4,6],m:2},{t:[2,6],m:4}, // second diagonal    
    ];
    this.bestMoves = [0,2,6,8,1,3,5,7];
  }

  Default.prototype = {
    solve: function (board, player, depth) {
      var opponent = (player == board.X) ? board.O : board.X;
      if (board.getWinner() > -1) {
        return -1;
      }
      else if (board.isFull()) {
        return -1;
      }

      var moves = board.getPossibleMoves(),
      defense = null,
      split = null;

      // attack/defense
      for (var i = 0, len = this.twoTaken.length; i < len; i++) {
        var taken = this.twoTaken[i].t,
          moveTo = this.twoTaken[i].m;
      
        // attack
        if (board.getSquare(taken[0]) === board.getSquare(taken[1]) 
          && board.getSquare(taken[0]) === player 
          && board.getSquare(moveTo) === 0) {
            return this.twoTaken[i].m;
        }

        // defense
        if (board.getSquare(taken[0]) === board.getSquare(taken[1]) 
          && board.getSquare(taken[0]) === opponent 
          && board.getSquare(moveTo) === 0
          && defense === null) {
            defense = this.twoTaken[i].m;
        }

        // split
        if ((board.getSquare(taken[0]) === 0 || board.getSquare(taken[1]) === 0) 
          && board.getSquare(moveTo) === 0 
          && split === null) {
            split = this.twoTaken[i].m;
        }
      }

      if (defense) {
        return defense;
      }

      //check center
      if (board.getSquare(4) == 0) {
        return 4;
      }

      if (split) {
        return split;
      }

      // corners and sides
      for (var i = 0, len = this.bestMoves.length; i < len; i++) {
        if (board.getSquare(this.bestMoves[i]) == 0) {
          return this.bestMoves[i];
        }
      }
    }
  }

  // negamax implementation with a twist to choose best move at random
  // http://en.wikipedia.org/wiki/Negamax
  var Negamax = function(maxDepth) {
    this.INFINITY = 999,
    this.maxDepth = maxDepth,
    this.bestmove = -1;
  }

  // negmax prototype
  Negamax.prototype = {
    // returns next best move based on the negamax
    _solve: function(board, player, depth) {
      // max depth reached
      if (depth > this.maxDepth) {
        return 0;
      }
    
      var opponent = (player == board.X) ? board.O : board.X,
        winner = board.getWinner();

      if (winner === player) {
        return this.INFINITY;
      }
      else if (winner === opponent) {
        return -1 * this.INFINITY;
      }
      // tie game
      else if (board.isFull()) {
        return 0;
      }
      
      // get possible moves
      var moves = board.getPossibleMoves(),
        alpha = -1 * this.INFINITY,
        // store possible moves
        bestmoves = [];
        
      for (var i = 0, len = moves.length; i < len; i++) {
        newboard = board.copy();
        newboard.move(moves[i], player);

        var subalpha = -1 * this._solve(newboard, opponent, depth + 1);
        if (alpha < subalpha) {
          alpha = subalpha;
        }
      
        if (depth === 0) {
          bestmoves.push(subalpha);
        }
      }

      // randomly choose best move
      // from possible moves
      if (depth === 0) {
        var candidates = [];
        for (var i = 0, len = bestmoves.length; i < len; i++) {
          if (bestmoves[i] === alpha) {
            candidates.push(moves[i]);
          }
        }

        var randIndex = TicTacToe.rand(candidates.length);
        this.bestmove = candidates[randIndex];
      }
   
      return alpha;
    },

    solve: function(board, player) {
      this.bestmove = -1;
      var alpha = this._solve(board, player, 0);
      return this.bestmove;
    }
  }
}).call(this);
