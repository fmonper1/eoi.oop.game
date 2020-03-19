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

//  TODO preguntar Raul si esta funcion no deberia ser un private de la class UIManagerVanilla

const renderInChat = (msg: string, cssClass: string) => {
  const chatDiv = document.getElementById('chat');
  if (chatDiv) {
    const div: any = document.createElement('div');
    div.classList = `chat-log ${cssClass}`;
    div.innerHTML = msg;

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
    this.addEventListeners();
    this.initChat();
    this.enableActionButtons();
  }

  addEventListeners() {
    getElementById('endTurn')!.addEventListener('click', () => this.onEndTurn());
    getElementById('drawCard')!.addEventListener('click', () => this.onDrawCard());
    getElementById('restartGame')!.addEventListener('click', () => this.onRestartGame());
  }

  initChat() {
    getElementById('chat')!.innerHTML = '';
  }

  async onDrawCard() {
    const player = await this.game.drawCard();
    player.calculateTotalScore();
    player.checkIfBusted();
    this.renderCards(player);
    this.renderPlayerScore(player);
    this.finishTurnIfBusted(player);
    await this.canPlayDealerHand();
    this.canCheckWinners();
    // this.renderGameLog(newCardOrCards);
  }

  private canCheckWinners() {
    const winners = this.game.canCheckWinners();

    if (winners) {
      console.log(winners);
      for (const winner of winners) {
        renderInChat(`<i class="fas fa-trophy"></i> ${winner.name} won with a score of ${winner.score}`, 'chat-winner');
      }
    }
  }

  private finishTurnIfBusted = (player: Player) => {
    this.game.finishTurnIfBusted();
    // console.log('UIManager finishTurnIfBusted() player:', player);

    if (player.isBusted) {
      renderInChat(`<i class="fas fa-bomb"></i> ${player.name} busted! :(`, 'chat-busted');
    }
  };

  private canPlayDealerHand = async () => {
    const dealer = await this.game.canPlayDealerHand();

    if (dealer) {
      this.disableActionButtons();
      this.renderCards(dealer);
      this.renderPlayerScore(dealer);
    }
  };

  enableActionButtons() {
    getElementById('drawCard').disabled = false;
    getElementById('endTurn').disabled = false;
  }

  disableActionButtons() {
    const drawBtn = getElementById('drawCard');
    const endTurnBtn = getElementById('endTurn');
    if (drawBtn && endTurnBtn) {
      drawBtn.disabled = true;
      endTurnBtn.disabled = true;

      // drawBtn.removeEventListener('click', this.onDrawCard()); // NO FUNCIONA Y NO SABEMOS PORQUE
      // endTurnBtn.removeEventListener('click', this.onEndTurn()); // NO FUNCIONA Y NO SABEMOS PORQUE
    }
  }

  async onEndTurn() {
    const player = await this.game.finishTurn();

    renderInChat(`<i class="fas fa-forward"></i> ${player.name} finished his turn.`, 'chat-finish-turn');
    await this.canPlayDealerHand();
    this.canCheckWinners();
  }

  // TODO: ESTA ES PARA MILAN ESTO SOBRA YA

  async onRestartGame() {
    this.clearPlayerCards();
    this.game.resetGameParams();
    this.initialize();
    this.initChat();

    /*
        esto no furula "bien", es recursivo
      */
    // await this.game.initGame(); // ESTA CREANDO UN BUCLE INFINITO ESTO
  }

  clearPlayerCards() {
    for (let i = 0; i < this.game.players.length; i++) {
      const player = this.game.players[i];
      console.log(getElementById(`player-${player.id}-cards`));

      getElementById(`player-${player.id}-cards`)!.innerHTML = '';
    }
  }

  private renderCards = (owner: Player) => {
    const playerCardDiv = document.getElementById(`player-${owner.id}-cards`);
    if (playerCardDiv) {
      owner.cards.filter(isDirty).forEach(card => {
        renderCard(playerCardDiv)(card);
        renderInChat(`<i class="far fa-hand-paper"></i> ${owner.name} draw a ${card.value} of ${card.suit}`, 'chat-draw-card');
      });
    }
  };

  private renderPlayerScore = (owner: Player) => {
    const playerScoreDiv = document.getElementById(`player-${owner.id}-score`);
    if (playerScoreDiv) {
      playerScoreDiv.innerHTML = owner.isBusted ? 'Busted' : `${owner.score}`;
    }
  };

  // private renderGameLog(newCardOrCards: any) {
  //   const { name } = this.game.players[this.game.lastPlayerIndex];
  //   newCardOrCards.forEach(renderInChat(name));
  // }

  renderPlayers(players: Player[]) {
    players.forEach(player => this.renderCards(player));
  }

  renderScores(players: Player[]) {
    players.forEach(player => this.renderPlayerScore(player));
  }
}
