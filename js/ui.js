// Get DOM elements
const statusDiv = document.getElementById('statusDiv'),
    sampleDiv = document.getElementById('sampleDiv'),
    startBoardDiv = document.getElementById('startBoardDiv'),
    chessStatus = document.getElementById('chessStatus');

let board; // UI Board

/**
 * Draw position to the ui board
 *
 * @param {fen} encoded game position. If null draw the start position
 */
async function drawPosition(fen) {

    if (fen == null)
        fen = 'start';

    const config = {
        draggable: true,
        position: fen,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    }

    board = Chessboard('startBoardDiv', config);


}

/**
 * Draw sample moves to the sampleDiv
 *
 * @param {nextMoves} Array of possible next positions from the actual position
 */
async function drawSamples(nextMoves) {

    console.log(nextMoves);
    
    const sampleGame = new Chess(game.fen());

    for (let i = 0; i < nextMoves.length; i++) {
        
        sampleGame.move(nextMoves[i]);

        // Create a new chessboard div in ui
        sampleDiv.innerHTML += `<div class=col-sm-3><div id=chessBoard${i}></div></div>`;

        // Draw the end position to created chessboard
        const board = Chessboard(`chessBoard${i}`, sampleGame.fen());
        
        sampleGame.undo();

    }

}

/**
 * Called if a piece on the ui board is clicked
 *
 * @param {source}
 * @param {piece}
 * @param {position}
 * @param {orientation}
 */
function onDragStart(source, piece, position, orientation) {

    const gameOver = game.game_over(),
        blacksTurn = (game.turn() === 'b'),
        whitePiece = (game.turn() === 'w' && piece.search(/^b/) !== -1);

    // Do not pick up pieces if the game is over
    // Only pick up pieces for the side to move or it's blacks move
    if (gameOver || blacksTurn || whitePiece)
        return false
}

/**
 * Called if a piece on the ui board is dropped
 *
 * @param {source}
 * @param {target}
 */
function onDrop(source, target) {

    // See if the move is legal
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: Always promote to a queen for example simplicity
    })

    // Illegal move
    if (move === null) return 'snapback'

    // Initalze the next move of the ai
    makeNextMove();
    
}

/**
 * Update the board position after the piece snap for castling, en passant, pawn promotion
 */
function onSnapEnd() {
    board.position(game.fen())
}
