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
  gameObject = await setupDeckData(gameObject);
  gameObject = await setupPlayers(gameObject);
  gameObject = await drawFirstRound(gameObject);

  drawCardButton(gameObject);
  endTurnButton(gameObject);
};

initGame();
