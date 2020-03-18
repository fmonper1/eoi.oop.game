import { Game } from './models/Game';
import { DeckAPIService } from './deck/DeckAPIService';
import { UIManagerVanilla } from './ui/UIManagerVanilla';
import { DeckCacheService } from './deck/DeckCacheService';

export const initGame = async () => {
  // const deckService = new DeckAPIService();
  // const deckService = new DeckCacheService();
  const deckService = new DeckSlackService();

  const game = new Game(4, deckService);

  const uiManager = new UIManagerVanilla(game);

  await game.initGame();
  uiManager.renderPlayers(game.players);

  // drawCardButton(game);
  // endTurnButton(game);
};

initGame().catch(console.error);
