import { Deck } from '../models/Deck';

export interface DeckService {
  generateNewDeck(): Promise<Deck>;
  // getCardFromAPI():any[];
  getCardFromApi(deckId: string, numOfCards: number): Promise<any[]>;
}
