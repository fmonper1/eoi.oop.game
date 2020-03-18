import { DeckService } from './DeckService';
import { Deck } from '../models/Deck';
import { Card } from '../models/Card';

export class DeckCacheService implements DeckService {
  generateNewDeck(): Promise<Deck> {
    return Promise.resolve({
      remaining: 312,
      success: true,
      shuffled: true,
      deckId: '7u6xk6qcfs7c'
    });
  }

  getCardFromApi(deckId: string, numOfCards: number): Promise<Card[]> {
    return [
      {
        'code': 'KC', 'image': 'https://deckofcardsapi.com/static/img/KC.png',
        'value': 'KING', 'suit': 'CLUBS', 'images':
          { 'svg': 'https://deckofcardsapi.com/static/img/KC.svg', 'png': 'https://deckofcardsapi.com/static/img/KC.png' }
      },
      { 'code': '9S', 'image': 'https://deckofcardsapi.com/static/img/9S.png', 'value': '9', 'suit': 'SPADES',
        'images': { 'svg': 'https://deckofcardsapi.com/static/img/9S.svg', 'png': 'https://deckofcardsapi.com/static/img/9S.png' }
        },
      { 'code': '9H', 'image': 'https://deckofcardsapi.com/static/img/9H.png', 'value': '9', 'suit': 'HEARTS',
        'images': { 'svg': 'https://deckofcardsapi.com/static/img/9H.svg', 'png': 'https://deckofcardsapi.com/static/img/9H.png' } },
      { 'code': '5H', 'image': 'https://deckofcardsapi.com/static/img/5H.png', 'value': '5', 'suit': 'HEARTS', 'images':
          { 'svg': 'https://deckofcardsapi.com/static/img/5H.svg', 'png': 'https://deckofcardsapi.com/static/img/5H.png' } },
      { 'code': '5C', 'image': 'https://deckofcardsapi.com/static/img/5C.png', 'value': '5', 'suit': 'CLUBS', 'images':
          { 'svg': 'https://deckofcardsapi.com/static/img/5C.svg', 'png': 'https://deckofcardsapi.com/static/img/5C.png' } },
      { 'code': 'QS', 'image': 'https://deckofcardsapi.com/static/img/QS.png', 'value': 'QUEEN', 'suit': 'SPADES', 'images':
          { 'svg': 'https://deckofcardsapi.com/static/img/QS.svg', 'png': 'https://deckofcardsapi.com/static/img/QS.png' } },
      { 'code': 'QH', 'image': 'https://deckofcardsapi.com/static/img/QH.png', 'value': 'QUEEN', 'suit': 'HEARTS',
        'images': { 'svg': 'https://deckofcardsapi.com/static/img/QH.svg', 'png': 'https://deckofcardsapi.com/static/img/QH.png' } },
      { 'code': 'QH', 'image': 'https://deckofcardsapi.com/static/img/QH.png', 'value': 'QUEEN', 'suit': 'HEARTS', 'images': { 'svg': 'https://deckofcardsapi.com/static/img/QH.svg', 'png': 'https://deckofcardsapi.com/static/img/QH.png' } }, { 'code': '8D', 'image': 'https://deckofcardsapi.com/static/img/8D.png', 'value': '8', 'suit': 'DIAMONDS', 'images': { 'svg': 'https://deckofcardsapi.com/static/img/8D.svg', 'png': 'https://deckofcardsapi.com/static/img/8D.png' } }, { 'code': '8S', 'image': 'https://deckofcardsapi.com/static/img/8S.png', 'value': '8', 'suit': 'SPADES', 'images': { 'svg': 'https://deckofcardsapi.com/static/img/8S.svg', 'png': 'https://deckofcardsapi.com/static/img/8S.png' } }
    ];
  };
}
