import { drawCardLogic, finishTurn } from "./blackjack";

export const endTurnButton = game => {
  const endTurnBtn = document.getElementById("endTurn");
  endTurnBtn.addEventListener("click", () => {
    console.log("turn ended");
    console.log("endTurnButton() game is equal to", game, typeof game);

    // return finishTurn(game);
    return game.then(game => finishTurn(game));
  });
};

export const drawCardButton = game => {
  const drawCardBtn = document.getElementById("drawCard");
  drawCardBtn.addEventListener("click", () => {
    // console.log("bjGame", bjGame);
    // .then(game => );
    return drawCardLogic(game);
  });
};

// const dealerFinalHand = game => {
//   if (game.lastPlayerIndex === game.numOfPlayers) {
//     while (game.players[game.numOfPlayers].score < 16) {
//       return drawCardLogic(game);
//     }
//   }
//   return game;
// };
