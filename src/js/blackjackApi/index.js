import { drawCardButton, endTurnButton } from "./userInteractions";
import { setupDeckData, setupPlayers, drawFirstRound } from "./blackjack";

const createGameObject = () => ({
  players: [],
  lastPlayerIndex: 0,
  deck: {},
  numOfPlayers: 4,
  isFinished: false
});

let gameObject = createGameObject();

// let bjGame = startGame(gameObject);
const initGame = async () => {
  let game = await setupDeckData(gameObject);
  game = await setupPlayers(game);
  game = await drawFirstRound(game);

  drawCardButton(game);
  endTurnButton(game);
};

initGame();
