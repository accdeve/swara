/**
 * SurakartaRules
 * Engine aturan resmi permainan Surakarta:
 * 1. Validasi gerakan biasa (1 langkah 8 arah ke titik kosong).
 * 2. Validasi penyerangan/memakan (melintasi minimal 1 loop sudut, jalur bebas rintangan).
 * 3. Pathfinding pencarian semua langkah valid untuk AI dan Player.
 * 4. Pengecekan kondisi Game Over.
 */

import { PLAYER_1, PLAYER_2, BOARD_SIZE } from './SurakartaBoard.js';

export const DIRECTIONS = {
  UP: { dr: -1, dc: 0, name: 'UP' },
  DOWN: { dr: 1, dc: 0, name: 'DOWN' },
  LEFT: { dr: 0, dc: -1, name: 'LEFT' },
  RIGHT: { dr: 0, dc: 1, name: 'RIGHT' }
};

// 8 arah untuk gerakan reguler 1 langkah
export const ALL_8_DIRECTIONS = [
  { dr: -1, dc: 0 },
  { dr: 1, dc: 0 },
  { dr: 0, dc: -1 },
  { dr: 0, dc: 1 },
  { dr: -1, dc: -1 },
  { dr: -1, dc: 1 },
  { dr: 1, dc: -1 },
  { dr: 1, dc: 1 }
];

export class SurakartaRules {
  /**
   * Pemetaan transisi 8 loop sudut Surakarta:
   * (r, c, dirName) -> { newR, newC, newDir, loopKey, arcDescription }
   */
  static getLoopTransition(r, c, dir) {
    // TOP EXIT (r === 0, moving UP)
    if (r === 0 && dir.dr === -1 && dir.dc === 0) {
      if (c === 1) return { newR: 1, newC: 0, newDir: DIRECTIONS.RIGHT, loopKey: 'TL_OUTER' };
      if (c === 2) return { newR: 2, newC: 0, newDir: DIRECTIONS.RIGHT, loopKey: 'TL_INNER' };
      if (c === 3) return { newR: 2, newC: 5, newDir: DIRECTIONS.LEFT, loopKey: 'TR_INNER' };
      if (c === 4) return { newR: 1, newC: 5, newDir: DIRECTIONS.LEFT, loopKey: 'TR_OUTER' };
    }

    // BOTTOM EXIT (r === 5, moving DOWN)
    if (r === 5 && dir.dr === 1 && dir.dc === 0) {
      if (c === 1) return { newR: 4, newC: 0, newDir: DIRECTIONS.RIGHT, loopKey: 'BL_OUTER' };
      if (c === 2) return { newR: 3, newC: 0, newDir: DIRECTIONS.RIGHT, loopKey: 'BL_INNER' };
      if (c === 3) return { newR: 3, newC: 5, newDir: DIRECTIONS.LEFT, loopKey: 'BR_INNER' };
      if (c === 4) return { newR: 4, newC: 5, newDir: DIRECTIONS.LEFT, loopKey: 'BR_OUTER' };
    }

    // LEFT EXIT (c === 0, moving LEFT)
    if (c === 0 && dir.dr === 0 && dir.dc === -1) {
      if (r === 1) return { newR: 0, newC: 1, newDir: DIRECTIONS.DOWN, loopKey: 'TL_OUTER' };
      if (r === 2) return { newR: 0, newC: 2, newDir: DIRECTIONS.DOWN, loopKey: 'TL_INNER' };
      if (r === 3) return { newR: 5, newC: 2, newDir: DIRECTIONS.UP, loopKey: 'BL_INNER' };
      if (r === 4) return { newR: 5, newC: 1, newDir: DIRECTIONS.UP, loopKey: 'BL_OUTER' };
    }

    // RIGHT EXIT (c === 5, moving RIGHT)
    if (c === 5 && dir.dr === 0 && dir.dc === 1) {
      if (r === 1) return { newR: 0, newC: 4, newDir: DIRECTIONS.DOWN, loopKey: 'TR_OUTER' };
      if (r === 2) return { newR: 0, newC: 3, newDir: DIRECTIONS.DOWN, loopKey: 'TR_INNER' };
      if (r === 3) return { newR: 5, newC: 3, newDir: DIRECTIONS.UP, loopKey: 'BR_INNER' };
      if (r === 4) return { newR: 5, newC: 4, newDir: DIRECTIONS.UP, loopKey: 'BR_OUTER' };
    }

    return null;
  }

  /**
   * Mendapatkan semua gerakan reguler (1 langkah ke titik kosong sekitar)
   */
  static getRegularMoves(board, r, c) {
    const moves = [];
    const player = board.getPiece(r, c);
    if (!player) return moves;

    for (const dir of ALL_8_DIRECTIONS) {
      const targetR = r + dir.dr;
      const targetC = c + dir.dc;

      if (board.isValidPos(targetR, targetC)) {
        if (board.getPiece(targetR, targetC) === null) {
          moves.push({
            type: 'REGULAR',
            from: { r, c },
            to: { r: targetR, c: targetC },
            path: [{ r, c }, { r: targetR, c: targetC }],
            captured: null,
            loops: []
          });
        }
      }
    }
    return moves;
  }

  /**
   * Melakukan raycasting mencari gerakan memakan lawan melalui loop sudut
   */
  static getCaptureMoves(board, startR, startC) {
    const player = board.getPiece(startR, startC);
    if (!player) return [];
    const opponent = player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    const captureMoves = [];

    const cardinalDirs = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT];

    for (const initDir of cardinalDirs) {
      let currentR = startR;
      let currentC = startC;
      let currentDir = initDir;
      let loopCount = 0;
      const path = [{ r: startR, c: startC }];
      const traversedLoops = [];
      const visitedStates = new Set();

      while (true) {
        const stateKey = `${currentR},${currentC},${currentDir.name}`;
        if (visitedStates.has(stateKey)) {
          // Cycle loop tanpa menangkap
          break;
        }
        visitedStates.add(stateKey);

        const nextR = currentR + currentDir.dr;
        const nextC = currentC + currentDir.dc;

        if (board.isValidPos(nextR, nextC)) {
          // Masih di dalam papan
          currentR = nextR;
          currentC = nextC;
          path.push({ r: currentR, c: currentC });

          const piece = board.getPiece(currentR, currentC);
          if (piece !== null) {
            if (loopCount > 0) {
              if (piece === opponent) {
                // Berhasil memakan pion lawan setelah minimal 1 loop!
                captureMoves.push({
                  type: 'CAPTURE',
                  from: { r: startR, c: startC },
                  to: { r: currentR, c: currentC },
                  path: [...path],
                  captured: { r: currentR, c: currentC, player: opponent },
                  loops: [...traversedLoops]
                });
              }
              // Jalur terhenti setelah menabrak pion apapun
              break;
            } else {
              // Menabrak pion sebelum melewati loop -> terhalang
              break;
            }
          }
        } else {
          // Keluar dari batas papan -> cek transisi loop sudut
          const transition = this.getLoopTransition(currentR, currentC, currentDir);
          if (!transition) {
            // Menabrak pinggir tanpa loop -> terhenti
            break;
          }

          loopCount++;
          traversedLoops.push(transition.loopKey);
          currentR = transition.newR;
          currentC = transition.newC;
          currentDir = transition.newDir;
          path.push({ r: currentR, c: currentC, isLoopEntry: true, loopKey: transition.loopKey });

          const entryPiece = board.getPiece(currentR, currentC);
          if (entryPiece !== null) {
            if (entryPiece === opponent) {
              // Pion lawan tepat di titik masuk loop
              captureMoves.push({
                type: 'CAPTURE',
                from: { r: startR, c: startC },
                to: { r: currentR, c: currentC },
                path: [...path],
                captured: { r: currentR, c: currentC, player: opponent },
                loops: [...traversedLoops]
              });
            }
            break;
          }
        }
      }
    }

    return captureMoves;
  }

  /**
   * Mengambil semua gerakan valid (reguler + capture) untuk 1 pion
   */
  static getValidMovesForPiece(board, r, c) {
    const regular = this.getRegularMoves(board, r, c);
    const captures = this.getCaptureMoves(board, r, c);
    return [...captures, ...regular];
  }

  /**
   * Mengambil semua gerakan valid untuk suatu pemain
   */
  static getAllValidMoves(board, player) {
    const pieces = board.getPiecesOf(player);
    const allMoves = [];
    for (const p of pieces) {
      const moves = this.getValidMovesForPiece(board, p.r, p.c);
      allMoves.push(...moves);
    }
    return allMoves;
  }

  /**
   * Cek apakah game sudah selesai
   */
  static isGameOver(board, deckRemainingCount, player1Stars = 0, player2Stars = 0) {
    const p1Count = board.countPieces(PLAYER_1);
    const p2Count = board.countPieces(PLAYER_2);

    if (p1Count === 0) {
      return { isOver: true, reason: 'P1_NO_PIECES', winner: PLAYER_2 };
    }
    if (p2Count === 0) {
      return { isOver: true, reason: 'P2_NO_PIECES', winner: PLAYER_1 };
    }

    // Cek stalemate (tidak ada langkah)
    const p1Moves = this.getAllValidMoves(board, PLAYER_1);
    const p2Moves = this.getAllValidMoves(board, PLAYER_2);

    if (p1Moves.length === 0 && p2Moves.length === 0) {
      return {
        isOver: true,
        reason: 'STALEMATE',
        winner: player1Stars > player2Stars ? PLAYER_1 : (player2Stars > player1Stars ? PLAYER_2 : 0)
      };
    }

    // Cek kartu habis
    if (deckRemainingCount === 0) {
      let winner = 0;
      if (player1Stars > player2Stars) winner = PLAYER_1;
      else if (player2Stars > player1Stars) winner = PLAYER_2;
      else {
        // Jika bintang sama, hitung jumlah pion
        if (p1Count > p2Count) winner = PLAYER_1;
        else if (p2Count > p1Count) winner = PLAYER_2;
        else winner = 0; // Draw
      }
      return { isOver: true, reason: 'DECK_EMPTY', winner };
    }

    return { isOver: false, reason: null, winner: null };
  }
}
