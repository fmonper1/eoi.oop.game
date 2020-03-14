import { DeckService } from './DeckService';
import { Deck } from '../models/Deck';

const DECK_ROOT_API = 'https://deckofcardsapi.com/api';

const toJSON = res => res.json();
const toDeck = (json): Deck => ({
  deckId: json.deck_id,
  success: json.success,
  shuffled: json.shuffled,
  remaining: json.remaining
});

const request = window.fetch || require('node-fetch');

export class DeckAPIService implements DeckService {
  generateNewDeck(): Promise<Deck> {
    return request(`${DECK_ROOT_API}/deck/new/shuffle/?deck_count=6`)
      .then(toJSON)
      .then(toDeck);
  }

  getCardFromApi(deckId: string, numOfCards: number): Promise<any[]> {
    return request(`${DECK_ROOT_API}/deck/${deckId}/draw/?count=${numOfCards}`)
      .then(toJSON)
      .then(body => body.cards);
  }
}
