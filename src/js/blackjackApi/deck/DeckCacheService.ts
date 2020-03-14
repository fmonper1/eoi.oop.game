import { DeckService } from './DeckService';
import { Deck } from '../models/Deck';

export class DeckAPIService implements DeckService {

  generateNewDeck(): Promise<Deck> {
    return Promise.resolve({
      deckId: 'rwglve1yntp9',
      remaining: 312,
      shuffled: true,
      success: true
    });
  }
}
