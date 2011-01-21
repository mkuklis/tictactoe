# slowly porting ttt to CoffeeScript

# default strategy
class Default
  solve: -> 
  _solve: ->

# Negamax strategy
class Negamax
  solve: -> 

# Board
class Board
  constructor: (board...) ->
    # represents game board
    @board = if board? then board else [0,0,0,0,0,0,0,0,0]
    
    @randMoves = [0,2,4,6,8]
    @strategies = {default: Default, negamax: Negamax}
    @wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]]
    # square state
    @EMPTY = 0, @X = 1, @O = 2;
    
  # returns array of available/empty indexes on the board
  getPossibleMoves: ->
    move for move in @board when move is @EMPTY    

  # checks if board is full
  isFull: ->
    _.any @board, (value, index, list) -> value is @EMPTY  
    
# Game
class Game
  constructor: ->
    @board = new Board

# Entry
class TicTacToe
  constructor: ->
    @game = new Game

