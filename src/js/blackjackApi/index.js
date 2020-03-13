import { drawCardButton, endTurnButton } from "./userInteractions";
import {
  startGame,
  setupDeckData,
  setupPlayers,
  drawFirstRound
} from "./blackjack";

let gameObject = {
  players: [],
  lastPlayerIndex: 0,
  deck: {},
  numOfPlayers: 4,
  isFinished: false
};

// let bjGame = startGame(gameObject);
const initGame = async () => {
  let game = await setupDeckData(gameObject);
  game = await setupPlayers(game);
  game = await drawFirstRound(game);

  drawCardButton(game);
  endTurnButton(game);
};

initGame();
