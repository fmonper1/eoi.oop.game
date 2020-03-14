import { drawCardButton, endTurnButton } from './userInteractions';
import { setupDeckData, setupPlayers, drawFirstRound } from './blackjack';
import { Game } from './models/Game';
import { DeckAPIService } from './deck/DeckAPIService';

const createGameObject = () => ({
  players: [],
  lastPlayerIndex: 0,
  deck: {},
  numOfPlayers: 4,
  isFinished: false
});

// let bjGame = startGame(gameObject);
export const initGame = async () => {
  const deckService = new DeckAPIService();

  const game = new Game(4, deckService);
  await game.setupDeckData();
  game.setupPlayers();
  await game.drawFirstRound();

  console.log('newgameobject', game);

  let gameObject = createGameObject();
  gameObject = await setupDeckData(gameObject);
  gameObject = await setupPlayers(gameObject);
  gameObject = await drawFirstRound(gameObject);

  drawCardButton(gameObject);
  endTurnButton(gameObject);
};

initGame();
