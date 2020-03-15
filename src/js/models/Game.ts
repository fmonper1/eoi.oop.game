import { DeckService } from '../deck/DeckService';
import { calculatePlayerTotalScore } from '../utils';
import { Player } from './Player';

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

  // hacemos numOfPlayers + 1 para añadir el dealer al final del arra
  // entonces players[this.numOfPlayers] accede al ultimo elemento que es el Dealer
  setupPlayers() {
    this.players = new Array(this.numOfPlayers + 1).fill('').map(() => this.createPlayer());
    this.players[this.numOfPlayers].isDealer = true;
    this.players[this.numOfPlayers].name = 'JohnDealer';

    console.log('SetupPlayers() game is equals to', this);
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

  async finishTurnFromUI() {
    if (!this.isFinished) {
      this.finishTurn();

      await this.canPlayDealerHand();
      this.checkWinners();
    }
  }

  finishTurnIfBusted() {
    if (this.players[this.lastPlayerIndex].isBusted) {
      this.finishTurn();
    }
  }

  finishTurn() {
    if (!this.isFinished) {
      this.lastPlayerIndex++;
      console.log('game cuando es el turno del player', this.lastPlayerIndex, this);
    }
  }

  async canPlayDealerHand() {
    if (this.lastPlayerIndex === this.numOfPlayers) {
      console.log('executing dealerFinalHand()');

      while (this.players[this.numOfPlayers].score < 17) {
        console.log(this.players[this.numOfPlayers].score);

        await this.drawCardLogic();
      }
    }
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
    console.log('drawCardLogic() game is equal to', this, typeof this);

    await this.drawCard();
    this.updateTotalScore();
    this.isBusted();
    this.renderPlayerScore(); // WTF!
    await this.canPlayDealerHand();
    this.checkWinners();
    this.finishTurnIfBusted();
  }

  checkWinners() {
    if (this.lastPlayerIndex === this.numOfPlayers && !this.isFinished) {
      console.log('checkingForWinners...');
      const dealer = this.players[this.numOfPlayers]; // No es total?? Esto es un any[]
      const winners: Player[] = []; // MAGIA DE TYPESCRIPT ??
      for (let i = 0; i < this.numOfPlayers; i++) {
        if (this.players[i].score > dealer.score && !dealer.isBusted && !this.players[i].isBusted) {
          console.log('winner', this.players[i]);
          console.log('winner', this.players[i]);
          winners.push(this.players[i]);
          //  lo que hay que comprobar si gano el dealer o un player
        }
        if (!this.players[i].isBusted && dealer.isBusted) {
          winners.push(this.players[i]);
        }
      }
      console.log('Ganadores', winners); // ahora imprime un array vacioy sde supone que gano el dealer EKISDE
      this.isFinished = true; // aqui se acaba la partida srry no discord
      // pruebalo ahora ;)
    }
  }

  renderCards = (id: string, cards: any[]) => {
    const playerCards = document.getElementById(`player-${id}-cards`);

    cards.forEach(async card => {
      const img = document.createElement('img');
      img.src = card.images.png;
      img.classList = 'card-img';
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
