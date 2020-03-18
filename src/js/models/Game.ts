import { DeckService } from '../deck/DeckService';
// import { calculatePlayerTotalScore } from '../utils';
import { Player } from './Player';

/*
Testing private methods
https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-typescript-for-private-methods-with-jasm
*/
export class Game {
  private deckService: DeckService;

  players: any[];
  lastPlayerIndex: number;
  deck: any;
  numOfPlayers: number;
  isFinished: boolean;
  winners: [];

  constructor(numOfPlayers: number, deckService: DeckService) {
    this.numOfPlayers = numOfPlayers;
    this.deckService = deckService;
    this.isFinished = false;
    this.lastPlayerIndex = 0;
    this.players = [];
    this.winners = [];
  }

  initGame = async () => {
    await this.setupDeckData();
    this.setupPlayers();
    await this.drawFirstRound();
  };

  setupDeckData = async () => {
    this.deck = await this.deckService.generateNewDeck();
  };

  // hacemos numOfPlayers + 1 para añadir el dealer al final del arra
  // entonces players[this.numOfPlayers] accede al ultimo elemento que es el Dealer
  setupPlayers() {
    for (let i = 0; i < this.numOfPlayers + 1; i++) {
      this.players.push(new Player());
    }
    this.players[this.numOfPlayers].isDealer = true;
    this.players[this.numOfPlayers].name = 'JohnDealer';
  }

  async drawFirstRound() {
    console.log('drawFirstRound', this);
    for (let i = 0; i < this.numOfPlayers + 1; i++) {
      await this.drawCard(2);
      this.updateTotalScore();
      this.renderPlayerScore();
      this.lastPlayerIndex++;
    }
    this.lastPlayerIndex = 0;
  }

  drawCard = async (numberOfCards?: number) => {
    numberOfCards = numberOfCards || 1;
    const player = this.players[this.lastPlayerIndex];
    const newCardOrCards = await this.deckService.getCardFromApi(this.deck.deckId, numberOfCards);
    player.addCardToHand(newCardOrCards);
    this.deck.remaining -= numberOfCards;
    // Render time
    this.renderCards(newCardOrCards);
    newCardOrCards.forEach(card => {
      this.renderInChat(`<i class="far fa-hand-paper"></i> ${player.name} draw a ${card.value} of ${card.suit}`, 'chat-draw-card');
    });
  };

  finishTurnIfBusted = async () => {
    if (this.players[this.lastPlayerIndex].isBusted) {
      this.finishTurn();
      await this.canPlayDealerHand();
      this.checkWinners();
    }
  };

  private finishTurn = () => {
    if (!this.isFinished) {
      this.lastPlayerIndex++;
    }
  };

  private canPlayDealerHand = async () => {
    if (this.lastPlayerIndex === this.numOfPlayers) {
      // console.log('executing dealerFinalHand()');
      while (this.players[this.numOfPlayers].score < 17) {
        await this.drawCardLogic();
      }
      this.checkWinners();
    }
  };

  private checkIfPlayerBusted = () => {
    const player = this.players[this.lastPlayerIndex];
    if (player.checkIfBusted()) {
      this.renderInChat(`<i class="fas fa-bomb"></i> ${player.name} busted! :(`, 'chat-busted');
    }
  };

  private updateTotalScore = () => {
    this.players[this.lastPlayerIndex].calculateTotalScore();
  };

  drawCardLogic = async () => {
    await this.drawCard();
    this.updateTotalScore();
    this.checkIfPlayerBusted();
    this.renderPlayerScore(); // we need to check if it has busted first!
    this.finishTurnIfBusted();
  };

  checkWinners = () => {
    if (this.lastPlayerIndex >= this.numOfPlayers && !this.isFinished) {
      console.log('checkingForWinners...');
      const dealer = this.players[this.numOfPlayers];

      for (let i = 0; i < this.numOfPlayers; i++) {
        const player = this.players[i];
        if (player.score > dealer.score && !dealer.isBusted && !player.isBusted) {
          console.log('winner', player);
          this.winners.push(player);
        } else if (!player.isBusted && dealer.isBusted) {
          this.winners.push(player);
        }
      }
      if (this.winners.length === 0) {
        this.winners.push(dealer);
      }
      console.log('Ganadores', this.winners);
      this.renderWinners();
      this.isFinished = true;
    }
  };

  async finishTurnFromUI() {
    if (!this.isFinished) {
      const player = this.players[this.lastPlayerIndex];
      this.renderInChat(`<i class="fas fa-forward"></i> ${player.name} finished his turn.`, 'chat-finish-turn');

      this.finishTurn();
      await this.canPlayDealerHand();
      this.checkWinners();
    }
  }

  async drawCardFromUI() {
    this.drawCardLogic();
  }

  private renderCards = (cards: any[]) => {
    const id = this.players[this.lastPlayerIndex].isDealer ? 'dealer' : this.lastPlayerIndex.toString();

    const playerCards = document.getElementById(`player-${id}-cards`);
    cards.forEach(async card => {
      const img = document.createElement('img');
      img.src = card.images.png;
      img.classList = 'card-img';
      img.display = 'block';
      await playerCards.appendChild(img); // si no la hago asyn aveces alguna carta no se renderiza ??
    });
  };

  private renderPlayerScore = () => {
    // si el indice es el ultimo hay que devolver dealer para encontrar el div por ID
    const playerIdentifier = this.players[this.lastPlayerIndex].isDealer ? 'dealer' : this.lastPlayerIndex;

    const playerScoreDiv = document.getElementById(`player-${playerIdentifier}-score`);

    playerScoreDiv.innerHTML = this.players[this.lastPlayerIndex].isBusted ? 'Busted' : this.players[this.lastPlayerIndex].score;
  };

  private renderWinners = () => {
    this.winners.forEach(winner => {
      this.renderInChat(`<i class="fas fa-trophy"></i> ${winner.name} won with a score of ${winner.score}`, 'chat-winner');
    });
  };

  private renderInChat = (msg: string, cssClass?: string) => {
    console.log(msg);
    const chatDiv = document.getElementById('chat');

    const div = document.createElement('div');
    div.classList = `chat-log ${cssClass}`;
    div.innerHTML = msg;

    chatDiv.insertBefore(div, chatDiv.firstChild);
  };
}
