import { describe, it, expect } from 'vitest';
import { SurakartaBoard, PLAYER_1, PLAYER_2 } from '../src/engine/SurakartaBoard.js';
import { SurakartaRules, DIRECTIONS } from '../src/engine/SurakartaRules.js';

describe('SurakartaRules Engine', () => {
  it('should correctly map all 8 corner loop transitions', () => {
    // Top-Left Outer: (0, 1) UP -> (1, 0) RIGHT
    const tlOuter1 = SurakartaRules.getLoopTransition(0, 1, DIRECTIONS.UP);
    expect(tlOuter1).toEqual({ newR: 1, newC: 0, newDir: DIRECTIONS.RIGHT, loopKey: 'TL_OUTER' });

    // Top-Left Outer Reverse: (1, 0) LEFT -> (0, 1) DOWN
    const tlOuter2 = SurakartaRules.getLoopTransition(1, 0, DIRECTIONS.LEFT);
    expect(tlOuter2).toEqual({ newR: 0, newC: 1, newDir: DIRECTIONS.DOWN, loopKey: 'TL_OUTER' });

    // Top-Right Outer: (0, 4) UP -> (1, 5) LEFT
    const trOuter1 = SurakartaRules.getLoopTransition(0, 4, DIRECTIONS.UP);
    expect(trOuter1).toEqual({ newR: 1, newC: 5, newDir: DIRECTIONS.LEFT, loopKey: 'TR_OUTER' });

    // Bottom-Left Inner: (5, 2) DOWN -> (3, 0) RIGHT
    const blInner1 = SurakartaRules.getLoopTransition(5, 2, DIRECTIONS.DOWN);
    expect(blInner1).toEqual({ newR: 3, newC: 0, newDir: DIRECTIONS.RIGHT, loopKey: 'BL_INNER' });

    // Bottom-Right Outer: (5, 4) DOWN -> (4, 5) LEFT
    const brOuter1 = SurakartaRules.getLoopTransition(5, 4, DIRECTIONS.DOWN);
    expect(brOuter1).toEqual({ newR: 4, newC: 5, newDir: DIRECTIONS.LEFT, loopKey: 'BR_OUTER' });

    // Invalid edge exit (corner or col without loop)
    expect(SurakartaRules.getLoopTransition(0, 0, DIRECTIONS.UP)).toBeNull();
    expect(SurakartaRules.getLoopTransition(0, 5, DIRECTIONS.UP)).toBeNull();
  });

  it('should find regular 1-step moves into empty adjacent cells', () => {
    const board = new SurakartaBoard();
    // Piece at (1, 1) of PLAYER_1
    // Adjacent: (0, 0) P1, (0, 1) P1, (0, 2) P1, (1, 0) P1, (1, 2) P1, (2, 0) empty, (2, 1) empty, (2, 2) empty
    const moves = SurakartaRules.getRegularMoves(board, 1, 1);
    expect(moves.length).toBe(3); // (2, 0), (2, 1), (2, 2)
    const targets = moves.map(m => `${m.to.r},${m.to.c}`);
    expect(targets).toContain('2,0');
    expect(targets).toContain('2,1');
    expect(targets).toContain('2,2');
  });

  it('should accurately detect capture moves across loop tracks', () => {
    const board = new SurakartaBoard();
    board.clear();

    // Place Player 1 at (1, 1)
    board.setPiece(1, 1, PLAYER_1);
    // Place Player 2 at (4, 1)
    board.setPiece(4, 1, PLAYER_2);

    // Scenario:
    // P1 at (1, 1) moves LEFT -> reaches (1, 0) -> exits LEFT into TL_OUTER loop
    // -> enters (0, 1) moving DOWN -> passes (1, 1)? No, (1, 1) is where it started!
    // But since (1, 1) is currently occupied by itself in board.getPiece, let's trace:
    // When moving left, ray is at (1, 0). Next is loop -> (0, 1) moving DOWN.
    // At (0, 1): empty. Next: (1, 1). Wait, (1, 1) has PLAYER_1 (friendly). So it hits itself!
    // Let's test a clean path:
    // P1 at (2, 0).
    // P1 moves LEFT -> exits (2, 0) into TL_INNER loop -> enters (0, 2) moving DOWN.
    // (1, 2) is empty. (2, 2) is empty. (3, 2) is empty. (4, 2) is empty.
    // If P2 is at (4, 2), P1 should successfully capture P2 at (4, 2)!
    board.clear();
    board.setPiece(2, 0, PLAYER_1);
    board.setPiece(4, 2, PLAYER_2);

    const captures = SurakartaRules.getCaptureMoves(board, 2, 0);
    expect(captures.length).toBeGreaterThanOrEqual(1);

    const targetCapture = captures.find(c => c.to.r === 4 && c.to.c === 2);
    expect(targetCapture).toBeDefined();
    expect(targetCapture.captured.player).toBe(PLAYER_2);
    expect(targetCapture.loops).toContain('TL_INNER');
  });

  it('should not allow capture if path is blocked before or during loop', () => {
    const board = new SurakartaBoard();
    board.clear();

    // P1 at (2, 0)
    board.setPiece(2, 0, PLAYER_1);
    // P2 at (4, 2)
    board.setPiece(4, 2, PLAYER_2);

    // Block path between loop entrance (0, 2) and target (4, 2) with an obstacle at (1, 2)
    board.setPiece(1, 2, PLAYER_1);

    const captures = SurakartaRules.getCaptureMoves(board, 2, 0);
    const tlInnerCapture = captures.find(c => c.to.r === 4 && c.to.c === 2 && c.loops.includes('TL_INNER'));
    expect(tlInnerCapture).toBeUndefined();
  });

  it('should correctly evaluate game over states', () => {
    const board = new SurakartaBoard();
    board.clear();

    // P1 has 0 pieces
    board.setPiece(4, 4, PLAYER_2);
    const res1 = SurakartaRules.isGameOver(board, 5, 0, 0);
    expect(res1.isOver).toBe(true);
    expect(res1.winner).toBe(PLAYER_2);

    // Deck empty evaluation
    board.setPiece(0, 0, PLAYER_1);
    const res2 = SurakartaRules.isGameOver(board, 0, 16, 8);
    expect(res2.isOver).toBe(true);
    expect(res2.winner).toBe(PLAYER_1);
  });
});
