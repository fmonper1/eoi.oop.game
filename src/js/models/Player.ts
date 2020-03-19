export class Player {
  id: string;
  name: string;
  cards: any[];
  score: number;
  isBusted: boolean;
  isDealer: boolean;

  constructor(id: string) {
    this.id = id;
    this.name = 'JohnDoe';
    this.cards = [];
    this.score = 0;
    this.isBusted = false;
    this.isDealer = false;
  }

  addCardToHand = cards => {
    // console.log('cards', cards);

    cards.forEach(card => {
      this.cards.push(card);
    });
    // console.log('player.addCardToHand() after adding card', this);
  };

  calculateTotalScore = () => {
    let totalScore = 0;
    this.cards.forEach(card => {
      totalScore += this.convertCardValueToInt(card.value);
    });
    this.score = totalScore;
  };

  convertCardValueToInt = value => {
    if (value === 'JACK' || value === 'QUEEN' || value === 'KING') {
      return 10;
    } else if (value === 'ACE') {
      return 11;
    } else {
      return parseInt(value);
    }
  };

  checkIfBusted = () => {
    if (this.score > 21) {
      this.isBusted = true;
      return true;
    }
    return false;
  };
}
