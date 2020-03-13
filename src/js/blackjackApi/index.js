import { drawCardButton, endTurnButton } from "./htmlEventListeners";
import { startGame } from "./blackjack";

let gameObject = {
  players: [],
  lastPlayerIndex: 0,
  deck: {},
  numOfPlayers: 4,
  isFinished: false
};

let bjGame = startGame(gameObject);
drawCardButton(bjGame);
endTurnButton(bjGame);
