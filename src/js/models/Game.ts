import { DeckService } from '../deck/DeckService';
// import { calculatePlayerTotalScore } from '../utils';
import { Player } from './Player';
import { Card } from './Card';

/*
Testing private methods
https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-typescript-for-private-methods-with-jasm
*/

const isNotDealer = player => !player.isDealer;

export class Game {
  private deckService: DeckService;

  players: Player[];
  lastPlayerIndex: number;
  deck: any;
  numOfPlayers: number;
  isFinished: boolean;
  winners: Player[];

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
    await this.generateFirstRound();
  };

  setupDeckData = async () => {
    this.deck = await this.deckService.generateNewDeck();
  };

  // hacemos numOfPlayers + 1 para añadir el dealer al final del arra
  // entonces players[this.numOfPlayers] accede al ultimo elemento que es el Dealer
  setupPlayers() {
    for (let i = 0; i < this.numOfPlayers + 1; i++) {
      this.players.push(new Player(`${i}`));
    }
    this.players[this.numOfPlayers].isDealer = true;
    this.players[this.numOfPlayers].name = 'JohnDealer';
    this.players[this.numOfPlayers].id = 'dealer';
  }

  async generateFirstRound() {
    console.log('drawFirstRound', this);
    const newCard: Card[] = await this.deckService.getCardFromApi(this.deck.deckId, this.players.length * 2);
    for (const player of this.players) {
      player.addCardToHand(newCard.splice(0, 2));
      player.calculateTotalScore();
      // FIXME this.renderPlayerScore();
    }
  }

  drawCard = async (numberOfCards = 1): Promise<Player> => {
    const player = this.players[this.lastPlayerIndex];

    const newCardOrCards = await this.deckService.getCardFromApi(this.deck.deckId, numberOfCards);
    player.addCardToHand(newCardOrCards);
    this.deck.remaining -= numberOfCards;

    return player;
  };

  finishTurnIfBusted = () => {
    if (this.players[this.lastPlayerIndex].isBusted) {
      this.finishTurn();
    }
  };

  finishTurn = (): Player => {
    const playerFinishedTurn = this.players[this.lastPlayerIndex];

    if (!this.isFinished && this.lastPlayerIndex <= this.players.length) {
      this.lastPlayerIndex++;
    }
    return playerFinishedTurn;
  };

  // is turn of Dealer?
  canPlayDealerHand = async () => {
    if (this.lastPlayerIndex === this.numOfPlayers) {
      const dealer = this.players[this.lastPlayerIndex];
      while (dealer.score < 17) {
        const newCards = await this.deckService.getCardFromApi(this.deck.deckId, 1);
        dealer.addCardToHand(newCards);
        dealer.calculateTotalScore();
        dealer.checkIfBusted();
      }
      // No deberia terminar el turno aqui?
      // this.checkWinners();
      return dealer;
    }
  };

  canCheckWinners = () => {
    // TODO: PREGUNTAR RAUL PORQUE SI PONEMOS PLAYER[] CANTA EL LINTER
    if (this.lastPlayerIndex >= this.numOfPlayers && !this.isFinished) {
      console.log('checkingForWinners...');
      const dealer = this.players[this.numOfPlayers];

      for (const player of this.players.filter(isNotDealer)) {
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
      this.isFinished = true;
      return this.winners;
    }
  };
}
