import { Deck } from '../models/Deck';

export interface DeckService {
  generateNewDeck(): Promise<Deck>;
}
