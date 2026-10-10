import { describe, it, expect } from 'vitest';
import { BotAI } from '../src/engine/BotAI.js';
import { SurakartaBoard, PLAYER_1, PLAYER_2 } from '../src/engine/SurakartaBoard.js';
import { CARDS_DATA } from '../src/data/cardsData.js';

describe('BotAI Strategy Engine', () => {
  it('should find regular move when starting from initial board', () => {
    const ai = new BotAI(PLAYER_2);
    const board = new SurakartaBoard();
    const move = ai.findBestMove(board);
    expect(move).toBeDefined();
    expect(move.from.r).toBeGreaterThanOrEqual(4);
    expect(move.type).toBe('REGULAR');
  });

  it('should prioritize CAPTURE move when available', () => {
    const ai = new BotAI(PLAYER_2);
    const board = new SurakartaBoard();
    board.clear();

    // Setup: P2 at (2, 0), P1 at (4, 2)
    board.setPiece(2, 0, PLAYER_2);
    board.setPiece(4, 2, PLAYER_1);

    const move = ai.findBestMove(board);
    expect(move).toBeDefined();
    expect(move.type).toBe('CAPTURE');
    expect(move.to.r).toBe(4);
    expect(move.to.c).toBe(2);
  });

  it('should answer cards and pick options appropriately', () => {
    const ai = new BotAI(PLAYER_2);
    const card = CARDS_DATA[0];
    const answer = ai.chooseCardAnswer(card);
    expect(['A', 'B', 'C']).toContain(answer);
  });
});
