/**
 * BotAI
 * Logika kecerdasan buatan untuk mode VS AI (Single Player) SWARA.
 */

import { PLAYER_1, PLAYER_2 } from './SurakartaBoard.js';
import { SurakartaRules } from './SurakartaRules.js';

export class BotAI {
  constructor(player = PLAYER_2, difficulty = 'MEDIUM') {
    this.player = player;
    this.opponent = player === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    this.difficulty = difficulty; // 'EASY', 'MEDIUM', 'HARD'
  }

  /**
   * Menentukan langkah terbaik untuk AI
   */
  findBestMove(board) {
    const allMoves = SurakartaRules.getAllValidMoves(board, this.player);
    if (allMoves.length === 0) return null;

    // Filter capture moves vs regular moves
    const captureMoves = allMoves.filter(m => m.type === 'CAPTURE');

    if (captureMoves.length > 0) {
      // Prioritas 1: Selalu eksekusi capture jika ada
      return this.selectBestCapture(board, captureMoves);
    }

    // Prioritas 2: Pilih langkah reguler terbaik
    return this.selectBestRegularMove(board, allMoves);
  }

  selectBestCapture(board, captureMoves) {
    // Beri bobot lebih jika menangkap pion yang berada di tengah atau posisi strategis
    let bestMove = captureMoves[0];
    let maxScore = -Infinity;

    for (const move of captureMoves) {
      let score = 100; // Base capture reward
      // Cek apakah posisi tujuan aman setelah memakan
      const testBoard = board.clone();
      testBoard.movePiece(move.from.r, move.from.c, move.to.r, move.to.c);
      const opponentCounterCaptures = SurakartaRules.getAllValidMoves(testBoard, this.opponent)
        .filter(m => m.type === 'CAPTURE' && m.to.r === move.to.r && m.to.c === move.to.c);

      if (opponentCounterCaptures.length > 0) {
        score -= 40; // Kurangi poin jika bisa langsung dimakan balik
      }

      if (score > maxScore) {
        maxScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  selectBestRegularMove(board, moves) {
    let bestMove = moves[0];
    let maxScore = -Infinity;

    for (const move of moves) {
      let score = 0;

      // 1. Dekati loop atau titik tengah (r: 2, 3, c: 2, 3)
      const centerDist = Math.abs(move.to.r - 2.5) + Math.abs(move.to.c - 2.5);
      score += (5 - centerDist) * 2;

      // 2. Simulasi langkah untuk mengecek keamanan
      const testBoard = board.clone();
      testBoard.movePiece(move.from.r, move.from.c, move.to.r, move.to.c);

      const opponentCaptures = SurakartaRules.getAllValidMoves(testBoard, this.opponent)
        .filter(m => m.type === 'CAPTURE');

      const isVulnerable = opponentCaptures.some(m => m.to.r === move.to.r && m.to.c === move.to.c);
      if (isVulnerable) {
        score -= 50; // Sangat berbahaya jika melangkah ke jalur tembak lawan
      }

      // 3. Tambahkan sedikit variasi acak agar permainan tidak monoton
      score += Math.random() * 2;

      if (score > maxScore) {
        maxScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  /**
   * Menentukan jawaban bot untuk kartu edukasi (akurasi 85% untuk bot ramah edukasi)
   */
  chooseCardAnswer(card) {
    const isCorrect = Math.random() < 0.85;
    if (isCorrect) {
      const correctOption = card.options.find(o => o.isCorrect);
      return correctOption ? correctOption.id : card.options[0].id;
    } else {
      const wrongOptions = card.options.filter(o => !o.isCorrect);
      return wrongOptions.length > 0 ? wrongOptions[0].id : card.options[0].id;
    }
  }
}
