/**
 * SurakartaBoard
 * Representasi status papan grid 6x6 untuk permainan Surakarta.
 * Koordinat: r (row 0..5), c (col 0..5).
 * Nilai Cell: 1 (Player 1 / Biru), 2 (Player 2 / Peach/Coral), null (Kosong).
 */

export const BOARD_SIZE = 6;
export const PLAYER_1 = 1;
export const PLAYER_2 = 2;

export class SurakartaBoard {
  constructor() {
    this.size = BOARD_SIZE;
    this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(null));
    this.initStandardSetup();
  }

  initStandardSetup() {
    // Player 1 di baris 0 dan 1 (12 pion)
    for (let r = 0; r <= 1; r++) {
      for (let c = 0; c < this.size; c++) {
        this.grid[r][c] = PLAYER_1;
      }
    }

    // Baris 2 dan 3 kosong
    for (let r = 2; r <= 3; r++) {
      for (let c = 0; c < this.size; c++) {
        this.grid[r][c] = null;
      }
    }

    // Player 2 di baris 4 dan 5 (12 pion)
    for (let r = 4; r <= 5; r++) {
      for (let c = 0; c < this.size; c++) {
        this.grid[r][c] = PLAYER_2;
      }
    }
  }

  isValidPos(r, c) {
    return r >= 0 && r < this.size && c >= 0 && c < this.size;
  }

  getPiece(r, c) {
    if (!this.isValidPos(r, c)) return undefined;
    return this.grid[r][c];
  }

  setPiece(r, c, piece) {
    if (this.isValidPos(r, c)) {
      this.grid[r][c] = piece;
    }
  }

  removePiece(r, c) {
    if (this.isValidPos(r, c)) {
      const removed = this.grid[r][c];
      this.grid[r][c] = null;
      return removed;
    }
    return null;
  }

  movePiece(fromR, fromC, toR, toC) {
    if (!this.isValidPos(fromR, fromC) || !this.isValidPos(toR, toC)) return false;
    const piece = this.grid[fromR][fromC];
    this.grid[fromR][fromC] = null;
    this.grid[toR][toC] = piece;
    return true;
  }

  getPiecesOf(player) {
    const list = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === player) {
          list.push({ r, c });
        }
      }
    }
    return list;
  }

  countPieces(player) {
    let count = 0;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === player) count++;
      }
    }
    return count;
  }

  clone() {
    const cloned = new SurakartaBoard();
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        cloned.grid[r][c] = this.grid[r][c];
      }
    }
    return cloned;
  }

  clear() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        this.grid[r][c] = null;
      }
    }
  }
}
