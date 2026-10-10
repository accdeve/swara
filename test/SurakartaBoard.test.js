import { describe, it, expect } from 'vitest';
import { SurakartaBoard, PLAYER_1, PLAYER_2, BOARD_SIZE } from '../src/engine/SurakartaBoard.js';

describe('SurakartaBoard Engine Model', () => {
  it('should initialize with standard 6x6 setup: 12 pieces for P1, 12 pieces for P2', () => {
    const board = new SurakartaBoard();
    expect(board.size).toBe(6);
    expect(board.countPieces(PLAYER_1)).toBe(12);
    expect(board.countPieces(PLAYER_2)).toBe(12);

    // Rows 0 and 1 should be PLAYER_1
    for (let c = 0; c < 6; c++) {
      expect(board.getPiece(0, c)).toBe(PLAYER_1);
      expect(board.getPiece(1, c)).toBe(PLAYER_1);
    }

    // Rows 2 and 3 should be null
    for (let c = 0; c < 6; c++) {
      expect(board.getPiece(2, c)).toBeNull();
      expect(board.getPiece(3, c)).toBeNull();
    }

    // Rows 4 and 5 should be PLAYER_2
    for (let c = 0; c < 6; c++) {
      expect(board.getPiece(4, c)).toBe(PLAYER_2);
      expect(board.getPiece(5, c)).toBe(PLAYER_2);
    }
  });

  it('should correctly validate coordinates and handle boundary checks', () => {
    const board = new SurakartaBoard();
    expect(board.isValidPos(0, 0)).toBe(true);
    expect(board.isValidPos(5, 5)).toBe(true);
    expect(board.isValidPos(-1, 0)).toBe(false);
    expect(board.isValidPos(0, 6)).toBe(false);
    expect(board.getPiece(-1, 0)).toBeUndefined();
  });

  it('should move, set, remove, and clone pieces accurately', () => {
    const board = new SurakartaBoard();
    expect(board.getPiece(1, 1)).toBe(PLAYER_1);
    
    // Move piece from (1, 1) to (2, 1)
    const moved = board.movePiece(1, 1, 2, 1);
    expect(moved).toBe(true);
    expect(board.getPiece(1, 1)).toBeNull();
    expect(board.getPiece(2, 1)).toBe(PLAYER_1);

    // Clone board
    const clone = board.clone();
    expect(clone.getPiece(2, 1)).toBe(PLAYER_1);
    expect(clone.countPieces(PLAYER_1)).toBe(12);

    // Modifying clone does not mutate original
    clone.removePiece(2, 1);
    expect(clone.getPiece(2, 1)).toBeNull();
    expect(board.getPiece(2, 1)).toBe(PLAYER_1);
  });
});
