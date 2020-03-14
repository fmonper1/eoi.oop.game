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

      this.players[i].cards = cardsFromApi;
      this.players[i].score = calculatePlayerTotalScore(this.players[i].cards);
    }
  }
}
