describe("TicTacToe", function() {
  var game;

  beforeEach(function() {
    game = TicTacToe.init({computerFirst: false});
    game.start();
  });

  describe("when game has been started and human goes first", function() {
    it("should have empty board", function() {
      expect(game.board.isEmpty()).toBeTruthy();
      expect(game.board.isFull()).toBeFalsy();
    });    
  });

  describe("when it's human's turn", function() {
    it("should be possible to make a move", function() {
      game.move(4);
      expect(game.board.getSquare(4)).toEqual(game.board.X);
    });
  });
});
