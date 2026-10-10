import { describe, it, expect } from 'vitest';
import { CARDS_DATA, CardDeck } from '../src/data/cardsData.js';

describe('Cards Data & Deck System', () => {
  it('should contain exactly 10 cards with unique IDs', () => {
    expect(CARDS_DATA).toHaveLength(10);
    const ids = CARDS_DATA.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(10);
  });

  it('should have valid structure for every card', () => {
    for (const card of CARDS_DATA) {
      expect(card.id).toBeGreaterThanOrEqual(1);
      expect(card.id).toBeLessThanOrEqual(10);
      expect(card.title).toBeDefined();
      expect(card.question).toBeDefined();
      expect(card.options).toBeDefined();
      expect(card.options.length).toBeGreaterThanOrEqual(2);
      expect(card.explanationTitle).toBeDefined();
      expect(card.explanationText).toBeDefined();
      expect(card.stars).toBe(4);

      // Verify exactly one option is marked isCorrect === true
      const correctOptions = card.options.filter(o => o.isCorrect);
      expect(correctOptions.length).toBe(1);
    }
  });

  it('CardDeck should handle draw, shuffle, and reset', () => {
    const deck = new CardDeck();
    expect(deck.remainingCount).toBe(10);
    expect(deck.totalCards).toBe(10);

    const drawn = [];
    for (let i = 0; i < 10; i++) {
      const card = deck.drawCard();
      expect(card).toBeDefined();
      drawn.push(card);
    }
    expect(deck.remainingCount).toBe(0);

    // Drawing again should reshuffle discard pile
    const card11 = deck.drawCard();
    expect(card11).toBeDefined();

    // Resetting deck
    deck.reset();
    expect(deck.remainingCount).toBe(10);
  });
});
