import { UIManager } from './UIManager';
import { Game } from '../models/Game';
import { Player } from '../models/Player';
import { Card } from '../models/Card';

const getElementById = (element: string): HTMLElement | null => document.getElementById(element);

const renderCard = (playerCards: HTMLElement) => (card: Card) => {
  const img: any = document.createElement('img') as HTMLElement;
  img.src = card.image;
  img.classList = 'card-img';
  img.display = 'block';
  playerCards.appendChild(img); // si no la hago asyn aveces alguna carta no se renderiza ??
  card.isDirty = false;
};

const renderInChat = (playerName: string) => (card) => {
  const message = `<i class="far fa-hand-paper"></i> ${playerName} draw a ${card.value} of ${card.suit}`;
  const cssClass = 'chat-draw-card';
  const chatDiv = document.getElementById('chat');
  if (chatDiv) {
    const div: any = document.createElement('div');
    div.classList = `chat-log ${cssClass}`;
    div.innerHTML = message;

    chatDiv.insertBefore(div, chatDiv.firstChild);
  }
};

const isDirty = card => card.isDirty;

export class UIManagerVanilla implements UIManager {
  game: Game;

  constructor(game: Game) {
    this.game = game;
    this.initialize();
  }

  initialize() {
    getElementById('endTurn')!.addEventListener('click', () => this.onEndTurn());
    getElementById('drawCard')!.addEventListener('click', () => this.onDrawCard());
    getElementById('restartGame')!.addEventListener('click', () => this.onRestartGame());
  }

  async onDrawCard() {
    const player = await this.game.drawCard();
    // TODO this.updateTotalScore();
    // TODO this.checkIfPlayerBusted();
    // TODO this.renderPlayerScore(); // we need to check if it has busted first!
    // TODO this.finishTurnIfBusted();
    this.renderCards(player);
    // this.renderCards(newCardOrCards);
    // this.renderGameLog(newCardOrCards);
  }

  onEndTurn() {
  }

  onRestartGame() {
  }

  private renderCards = (owner: Player) => {
    const playerCardDiv = document.getElementById(`player-${owner.id}-cards`);
    if (playerCardDiv) {
      owner.cards.filter(isDirty).forEach(renderCard(playerCardDiv));
    }
  };

  private renderGameLog(newCardOrCards: any) {
    const { name } = this.game.players[this.game.lastPlayerIndex];
    newCardOrCards.forEach(renderInChat(name));
  }

  renderPlayers(players: Player[]) {
    players.forEach(player => this.renderCards(player));
  }
}
