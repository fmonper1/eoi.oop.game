import { Game } from '../models/Game';
import { Player } from '../models/Player';

export interface UIManager {
  game: Game;

  initialize();

  onEndTurn();

  onDrawCard();

  onRestartGame();

  renderPlayers(players: Player[]);

  renderCards(initialCards: any): void;
}
