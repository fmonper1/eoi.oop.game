import { DeckService } from '../deck/DeckService';
import { calculatePlayerTotalScore } from '../utils';

export class Game {
  private deckService: DeckService;

  players: any[];
  lastPlayerIndex: number;
  deck: any;
  numOfPlayers: number;
  isFinished: boolean;

  constructor(numOfPlayers: number, deckService: DeckService) {
    this.numOfPlayers = numOfPlayers;
    this.deckService = deckService;
    this.isFinished = false;
    this.lastPlayerIndex = 0;
    this.players = [];
  }

  async setupDeckData() {
    this.deck = await this.deckService.generateNewDeck();
  }

  // hacemos numOfPlayers + 1 para añadir el dealer al final del array
  setupPlayers() {
    this.players = new Array(this.numOfPlayers + 1).fill('').map(() => ({
      cards: [],
      score: 0,
      isBusted: false,
      isDealer: false
    }));
    this.players[this.numOfPlayers].isDealer = true;

    console.log('SetupPlayers() game is equals to', this);
  }

  async drawFirstRound() {
    for (let i = 0; i < this.numOfPlayers + 1; i++) {
      const cardsFromApi = await this.deckService.getCardFromApi(this.deck.deckId, 2);

      this.lastPlayerIndex = i;
      this.players[i].cards = cardsFromApi;
      this.players[i].score = calculatePlayerTotalScore(this.players[i].cards);

      // Render time
      const isDealer = this.players[i].isDealer ? 'dealer' : this.lastPlayerIndex.toString();
      this.renderCards(isDealer, this.players[i].cards);
      this.renderPlayerScore();
    }

    this.lastPlayerIndex = 0;
  }

  async drawCard() {
    const i = this.lastPlayerIndex;
    const newCard = await this.deckService.getCardFromApi(this.deck.deckId, 1);
    this.players[i].cards = this.players[i].cards.concat(newCard);

    // Render time
    const isDealer = this.players[i].isDealer ? 'dealer' : this.lastPlayerIndex.toString();
    this.renderCards(isDealer, newCard);
  }

  finishTurnIfBusted() {
    if (this.players[this.lastPlayerIndex].isBusted) {
      this.finishTurn();
    }
  }

  finishTurn() {
    if (!this.isFinished) {
      this.lastPlayerIndex++;
    }

    console.log('game cuando es el turno del player', this.lastPlayerIndex, this);

    if (this.lastPlayerIndex === this.numOfPlayers) {
      console.log('game cuando es el turno del dealer', this);
      this.dealerFinalHand();
    }
  }

  async dealerFinalHand() {
    console.log('executing dealerFinalHand()');
    if (this.lastPlayerIndex === this.numOfPlayers) {
      while (this.players[this.numOfPlayers].score < 17) {
        console.log(this.players[this.numOfPlayers].score);

        await this.drawCardLogic();
      }
    }
    this.isFinished = true;
  }

  isBusted = () => {
    if (this.players[this.lastPlayerIndex].score > 21) {
      this.players[this.lastPlayerIndex].isBusted = true;
    }
  };

  updateTotalScore = () => {
    this.players[this.lastPlayerIndex].score = calculatePlayerTotalScore(this.players[this.lastPlayerIndex].cards);
  };

  async drawCardLogic() {
    if (this.isFinished) {
      return;
    }
    console.log('drawCardLogic() game is equal to', this, typeof this);

    await this.drawCard();
    this.updateTotalScore();
    this.isBusted();
    this.renderPlayerScore(); // WTF!
    this.finishTurnIfBusted();
  }

  renderCards = (id: string, cards: any[]) => {
    const playerCards = document.getElementById(`player-${id}-cards`);

    cards.forEach(async card => {
      const img = document.createElement('img');
      img.src = card.images.png;
      // img.classList.add('card-img'); // Maybe?
      img.classList = 'card-img';
      // img.display.add('card-img'); // Maybe one more time??
      img.display = 'block';

      playerCards.appendChild(img); // si no la hago asyn aveces alguna carta no se renderiza ??
    });
  };

  renderPlayerScore = () => {
    // si el indice es el ultimo hay que devolver dealer para encontrar el div por ID
    const playerIdentifier = this.players[this.lastPlayerIndex].isDealer ? 'dealer' : this.lastPlayerIndex;

    const playerScoreDiv = document.getElementById(`player-${playerIdentifier}-score`);

    playerScoreDiv.innerHTML = this.players[this.lastPlayerIndex].isBusted ? 'Busted' : this.players[this.lastPlayerIndex].score;
  };
}
