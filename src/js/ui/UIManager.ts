import { Game } from '../models/Game';
import { Player } from '../models/Player';

export interface UIManager {
  game: Game;

  initialize();

  addEventListeners();

  initChat();

  onEndTurn();

  onDrawCard();

  onRestartGame();

  disableActionButtons();

  enableActionButtons();

  renderPlayers(players: Player[]);

  renderCards(initialCards: any): void;
}
