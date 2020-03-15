import { drawCardButton, endTurnButton } from './userInteractions';
import { Game } from './models/Game';
import { DeckAPIService } from './deck/DeckAPIService';

export const initGame = async () => {
  const deckService = new DeckAPIService();

  const game = new Game(4, deckService);
  await game.initGame();

  console.log('newgameobject', game);

  drawCardButton(game);
  endTurnButton(game);
};

initGame();
