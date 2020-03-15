import { DeckService } from '../deck/DeckService';
import { calculatePlayerTotalScore } from '../utils';
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

  async setupDeckData() {
    this.deck = await this.deckService.generateNewDeck();
  }

  // hacemos numOfPlayers + 1 para añadir el dealer al final del arra
  // entonces players[this.numOfPlayers] accede al ultimo elemento que es el Dealer
  setupPlayers() {
    this.players = new Array(this.numOfPlayers + 1).fill('').map(() => this.createPlayer());
    this.players[this.numOfPlayers].isDealer = true;
    this.players[this.numOfPlayers].name = 'JohnDealer';
  }

  createPlayer = (): Player => ({
    name: 'JohnDoe',
    cards: [],
    score: 0,
    isBusted: false,
    isDealer: false
  });

  async drawFirstRound() {
    for (let i = 0; i < this.numOfPlayers + 1; i++) {
      await this.drawCard(2);
      this.updateTotalScore();
      this.renderPlayerScore();
      this.lastPlayerIndex++;
    }
    this.lastPlayerIndex = 0;
  }

  async drawCard(numberOfCards = 1) {
    const currentPlayer = this.players[this.lastPlayerIndex];
    const newCard = await this.deckService.getCardFromApi(this.deck.deckId, numberOfCards);
    currentPlayer.cards = currentPlayer.cards.concat(newCard);

    // Render time
    const isDealer = currentPlayer.isDealer ? 'dealer' : this.lastPlayerIndex.toString();
    this.renderCards(isDealer, newCard);
  }

  async finishTurnIfBusted() {
    if (this.players[this.lastPlayerIndex].isBusted) {
      this.finishTurn();
      await this.canPlayDealerHand();
      this.checkWinners();
    }
  }

  finishTurn() {
    if (!this.isFinished) {
      this.lastPlayerIndex++;
    }
  }

  async canPlayDealerHand() {
    if (this.lastPlayerIndex === this.numOfPlayers) {
      // console.log('executing dealerFinalHand()');
      while (this.players[this.numOfPlayers].score < 17) {
        await this.drawCardLogic();
      }
      this.checkWinners();
    }
  }

  private checkIfPlayerBusted = () => {
    if (this.players[this.lastPlayerIndex].score > 21) {
      this.players[this.lastPlayerIndex].isBusted = true;
    }
  };

  private updateTotalScore = () => {
    this.players[this.lastPlayerIndex].score = calculatePlayerTotalScore(this.players[this.lastPlayerIndex].cards);
  };

  async drawCardLogic() {
    await this.drawCard();
    this.updateTotalScore();
    this.checkIfPlayerBusted();
    this.renderPlayerScore(); // we need to check if it has busted first!
    this.finishTurnIfBusted();
  }

  checkWinners() {
    if (this.lastPlayerIndex >= this.numOfPlayers && !this.isFinished) {
      console.log('checkingForWinners...');
      const dealer = this.players[this.numOfPlayers]; // No es total?? Esto es un any[]

      for (let i = 0; i < this.numOfPlayers; i++) {
        if (this.players[i].score > dealer.score && !dealer.isBusted && !this.players[i].isBusted) {
          console.log('winner', this.players[i]);
          this.winners.push(this.players[i]);
        } else if (!this.players[i].isBusted && dealer.isBusted) {
          this.winners.push(this.players[i]);
        }
      }
      if (this.winners.length === 0) {
        this.winners.push(this.players[this.numOfPlayers]);
      }
      console.log('Ganadores', this.winners);
      this.renderWinners();
      this.isFinished = true;
    }
  }

  async finishTurnFromUI() {
    if (!this.isFinished) {
      this.finishTurn();
      await this.canPlayDealerHand();
      this.checkWinners();
    }
  }

  async drawCardFromUI() {
    this.drawCardLogic();
  }

  private renderCards = (id: string, cards: any[]) => {
    const playerCards = document.getElementById(`player-${id}-cards`);
    cards.forEach(async card => {
      const img = document.createElement('img');
      img.src = card.images.png;
      img.classList = 'card-img';
      img.display = 'block';
      playerCards.appendChild(img); // si no la hago asyn aveces alguna carta no se renderiza ??
    });
  };

  private renderPlayerScore = () => {
    // si el indice es el ultimo hay que devolver dealer para encontrar el div por ID
    const playerIdentifier = this.players[this.lastPlayerIndex].isDealer ? 'dealer' : this.lastPlayerIndex;

    const playerScoreDiv = document.getElementById(`player-${playerIdentifier}-score`);

    playerScoreDiv.innerHTML = this.players[this.lastPlayerIndex].isBusted ? 'Busted' : this.players[this.lastPlayerIndex].score;
  };

  private renderWinners = () => {
    const chatDiv = document.getElementById('chat');

    this.winners.forEach(winner => {
      const div = document.createElement('div');
      div.classList = 'chat-log winner-log';
      div.innerHTML = `Player ${winner.name} won with a score of ${winner.score}`;

      chatDiv.appendChild(div);
    });
  };
}
