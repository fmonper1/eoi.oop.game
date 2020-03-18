import { Deck } from '../models/Deck';
import { Card } from '../models/Card';

export interface DeckService {
  generateNewDeck(): Promise<Deck>;

  // getCardFromAPI():any[];
  getCardFromApi(deckId: string, numOfCards: number): Promise<Card[]>;
}
