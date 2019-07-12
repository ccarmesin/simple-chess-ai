const humanPlayer = 'b',
    aiPlayer = 'w',
    depth = 3, // This is the maximum number of recursion steps, you can change it
    game = new Chess();

let functionCallsAB = 0;

/**
 * EMake next move of the AI(helper function)
 */
async function makeNextMove() {

    // Draw all next moves
    drawSamples(game.moves());

    const bestMove = minimaxAB(game, -Infinity, Infinity, depth);
    console.log(bestMove);
    console.log(functionCallsAB);

    // Make move
    game.move(bestMove.move);

}

/**
 * Evaluate the board at a given game state for a given color
 *
 * @param {game} game state to evaluate
 * @param {color} color to apply the evaluation on
 *
 * @return evluation value of the move. The higher the better!
 */
function evaluateBoard(game, color) {

    // Sets the value for each piece using standard piece value
    const pieceValue = {
        'p': 100,
        'n': 350,
        'b': 350,
        'r': 525,
        'q': 1000,
        'k': 10000
    };

    // Loop through all pieces on the board and sum up total
    let value = 0;
    game.forEach(function (row) {
        row.forEach(function (piece) {
            if (piece) {
                // Subtract piece value if it is opponent's piece
                value += pieceValue[piece['type']] * (piece['color'] === color ? 1 : -1);
            }
        });
    });

    return value;

};

/**
 * Minimax algorithm with alpha-beta pruning, that removes unnecessary parts of the tree to reduce runtime of the function
 *
 * @param game (at current time)
 * @param alpha
 * @param beta
 * @param depth (current depth of the tree)
 *
 * @return best move as json object with move and score parameter
 */
function minimaxAB(game, alpha, beta, depth) {

    functionCallsAB++;

    // Get actual and next player(if it is aiPlayer then the next is humanPlayer and so on)
    const actualPlayer = game.turn();
    const nextPlayer = actualPlayer === aiPlayer ? humanPlayer : aiPlayer;

    // If depth is 0 just return the current board evaluation 
    if (depth === 0) {

        const score = evaluateBoard(game.board(), actualPlayer);

        return {
            score: score
        }

    }

    // Get empty cells
    const moves = game.moves();

    let bestMove;

    // Iterate over all cells
    for (let i = 0; i < moves.length; i++) {

        // Make move
        game.move(moves[i]);

        // Draw this move
        drawSample(game.fen(), i);

        // Call miniax one depth deeper on the tree
        const result = minimaxAB(game, alpha, beta, depth - 1);

        // Undo the move
        game.undo();

        if (actualPlayer == aiPlayer) {

            if (alpha < result.score) {
                bestMove = moves[i];
                alpha = result.score;
            }
            if (beta <= alpha) break;

        } else {

            if (beta > result.score) {
                bestMove = moves[i];
                beta = result.score;
            }
            if (beta <= alpha) break;

        }

    }

    const bestScore = actualPlayer == aiPlayer ? alpha : beta;

    return {
        move: bestMove,
        score: bestScore
    };

}
