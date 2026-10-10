/**
 * GameOverModal
 * Modal Selebrasi Kemenangan & Rekap Skor SWARA.
 */

import confetti from 'canvas-confetti';
import { PLAYER_1, PLAYER_2 } from '../engine/SurakartaBoard.js';
import { GAME_MODE } from '../engine/GameState.js';
import { audioManager } from './AudioManager.js';

export class GameOverModal {
  constructor(containerElement, onPlayAgain, onBackToMenu) {
    this.container = containerElement;
    this.onPlayAgain = onPlayAgain;
    this.onBackToMenu = onBackToMenu;
  }

  show(state) {
    this.render(state);
    this.container.classList.remove('hidden');
    this.container.classList.add('visible');
    audioManager.playVictory();
    this.triggerCelebration();
  }

  hide() {
    this.container.classList.remove('visible');
    this.container.classList.add('hidden');
  }

  triggerCelebration() {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#7BBDF5', '#FF9EAA', '#FDE047', '#86EFAC']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#7BBDF5', '#FF9EAA', '#FDE047', '#86EFAC']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  render(state) {
    const isVsBot = state.mode === GAME_MODE.VS_BOT;
    const p1Name = state.getPlayerName(PLAYER_1);
    const p2Name = state.getPlayerName(PLAYER_2);

    let winnerTitle = 'Permainan Selesai!';
    let winnerSubtitle = '';
    let winnerClass = '';

    if (state.winner === PLAYER_1) {
      winnerTitle = `🎉 Selamat! ${p1Name} Menang!`;
      winnerSubtitle = `Meraih bintang terbanyak (${state.player1Stars} ⭐) dengan pemahaman edukasi yang luar biasa!`;
      winnerClass = 'winner-p1';
    } else if (state.winner === PLAYER_2) {
      winnerTitle = isVsBot ? '🤖 Komputer (Bot) Menang!' : `🎉 Selamat! ${p2Name} Menang!`;
      winnerSubtitle = `Meraih bintang terbanyak (${state.player2Stars} ⭐)!`;
      winnerClass = 'winner-p2';
    } else {
      winnerTitle = '🤝 Permainan Berakhir Seri!';
      winnerSubtitle = 'Kedua pemain sama-sama hebat dan memahami batasan tubuh dengan baik!';
      winnerClass = 'winner-draw';
    }

    let reasonText = '';
    if (state.gameOverReason === 'DECK_EMPTY') reasonText = '🃏 Seluruh 10 Kartu Edukasi Telah Selesai Dimainkan!';
    else if (state.gameOverReason === 'P1_NO_PIECES') reasonText = `♟️ Seluruh Pion ${p1Name} Telah Dimakan!`;
    else if (state.gameOverReason === 'P2_NO_PIECES') reasonText = `♟️ Seluruh Pion ${p2Name} Telah Dimakan!`;
    else if (state.gameOverReason === 'STALEMATE') reasonText = '🔒 Tidak Ada Langkah Tersisa yang Dapat Dilakukan!';

    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="gameover-card ${winnerClass}">
          <div class="trophy-icon">🏆</div>
          <h2 class="gameover-title">${winnerTitle}</h2>
          <p class="gameover-reason-badge">${reasonText}</p>
          <p class="gameover-subtitle">${winnerSubtitle}</p>

          <div class="final-score-recap">
            
            <div class="score-card-box p1-box">
              <span class="score-player-name">🌸 ${p1Name}</span>
              <div class="score-num-row">
                <span class="stars-val">${state.player1Stars} ⭐</span>
                <span class="pieces-val">${state.board.countPieces(PLAYER_1)} Pion</span>
              </div>
            </div>

            <div class="score-card-box p2-box">
              <span class="score-player-name">${isVsBot ? '🤖 Komputer' : `🍑 ${p2Name}`}</span>
              <div class="score-num-row">
                <span class="stars-val">${state.player2Stars} ⭐</span>
                <span class="pieces-val">${state.board.countPieces(PLAYER_2)} Pion</span>
              </div>
            </div>

          </div>

          <div class="gameover-footer-actions">
            <button class="btn-primary-pastel" id="btnPlayAgain">Main Lagi 🔄</button>
            <button class="btn-secondary-pastel" id="btnBackMenu">Menu Utama 🏠</button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const playAgainBtn = this.container.querySelector('#btnPlayAgain');
    const backMenuBtn = this.container.querySelector('#btnBackMenu');

    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        this.hide();
        if (this.onPlayAgain) this.onPlayAgain();
      });
    }

    if (backMenuBtn) {
      backMenuBtn.addEventListener('click', () => {
        this.hide();
        if (this.onBackToMenu) this.onBackToMenu();
      });
    }
  }
}
