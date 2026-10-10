/**
 * Scoreboard
 * Pure Pastel Children's Game HUD & Info Panel.
 * Mendukung kustomisasi nama pemain (Player 1 & Player 2).
 */

import { PLAYER_1, PLAYER_2 } from '../engine/SurakartaBoard.js';
import { GAME_MODE } from '../engine/GameState.js';

export class Scoreboard {
  constructor(containerElement, onEditName) {
    this.container = containerElement;
    this.onEditName = onEditName; // callback(player)
  }

  render(state) {
    const isP1Turn = state.currentTurn === PLAYER_1;
    const isP2Turn = state.currentTurn === PLAYER_2;
    const isVsBot = state.mode === GAME_MODE.VS_BOT;

    const p1Name = state.getPlayerName(PLAYER_1);
    const p2Name = state.getPlayerName(PLAYER_2);

    const p1Pieces = state.board.countPieces(PLAYER_1);
    const p2Pieces = state.board.countPieces(PLAYER_2);
    const cardsLeft = state.deck.remainingCount;

    this.container.innerHTML = `
      <div class="pastel-sidebar-stack">
        
        <!-- Kartu Pemain 1 (Pastel Sky Blue) -->
        <div class="pastel-player-card p1-card ${isP1Turn ? 'is-active' : ''}">
          <div class="player-identity">
            <div class="player-icon-bubble p1-bubble">🌸</div>
            <div class="player-name-col">
              <div class="player-name-row">
                <span class="player-label">${p1Name}</span>
                <button class="btn-edit-name" data-player="1" title="Ubah Nama ${p1Name}">✏️</button>
              </div>
              <div class="player-sub">Kawan Biru</div>
            </div>
          </div>
          <div class="player-score-group">
            <div class="score-chip star-chip" title="${state.player1Stars} Bintang">
              <span class="chip-icon">⭐</span>
              <span class="chip-val">${state.player1Stars}</span>
            </div>
            <div class="score-chip piece-chip" title="${p1Pieces} Pion">
              <span class="chip-icon">♟️</span>
              <span class="chip-val">${p1Pieces}</span>
            </div>
          </div>
        </div>

        <!-- Papan Informasi Permainan (Unified Pastel Info Card) -->
        <div class="pastel-info-board">
          <div class="turn-status-banner ${isP1Turn ? 'turn-p1' : 'turn-p2'}">
            ${isP1Turn 
              ? `🌸 Giliran ${p1Name}` 
              : (isVsBot ? '🤖 Giliran Komputer' : `🍑 Giliran ${p2Name}`)
            }
          </div>
          
          <p class="turn-hint-text">
            ${isP1Turn 
              ? `Pilih pion biru ${p1Name} untuk melangkah atau serang lawan lewat lingkaran sudut.`
              : (isVsBot 
                  ? 'Komputer sedang memilih langkah terbaik...'
                  : `Pilih pion peach ${p2Name} untuk melangkah atau serang lawan lewat lingkaran sudut.`)
            }
          </p>

          <div class="deck-indicator-row">
            <span class="deck-emoji">🃏</span>
            <span class="deck-text">Sisa <strong>${cardsLeft}</strong> dari <strong>${state.deck.totalCards}</strong> Kartu Edukasi</span>
          </div>
        </div>

        <!-- Kartu Pemain 2 (Pastel Coral Peach) -->
        <div class="pastel-player-card p2-card ${isP2Turn ? 'is-active' : ''}">
          <div class="player-identity">
            <div class="player-icon-bubble p2-bubble">${isVsBot ? '🤖' : '🍑'}</div>
            <div class="player-name-col">
              <div class="player-name-row">
                <span class="player-label">${p2Name}</span>
                ${!isVsBot ? `<button class="btn-edit-name" data-player="2" title="Ubah Nama ${p2Name}">✏️</button>` : ''}
              </div>
              <div class="player-sub">${isVsBot ? 'Lawan AI' : 'Kawan Peach'}</div>
            </div>
          </div>
          <div class="player-score-group">
            <div class="score-chip star-chip" title="${state.player2Stars} Bintang">
              <span class="chip-icon">⭐</span>
              <span class="chip-val">${state.player2Stars}</span>
            </div>
            <div class="score-chip piece-chip" title="${p2Pieces} Pion">
              <span class="chip-icon">♟️</span>
              <span class="chip-val">${p2Pieces}</span>
            </div>
          </div>
        </div>

      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const editButtons = this.container.querySelectorAll('.btn-edit-name');
    editButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const player = parseInt(btn.getAttribute('data-player'), 10);
        if (this.onEditName) {
          this.onEditName(player);
        }
      });
    });
  }
}
