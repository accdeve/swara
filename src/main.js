/**
 * SWARA — Desktop Web Board Game & Edukasi Sentuhan Aman
 * Master Application Entry Point & Controller
 */

import { GameState, GAME_MODE, GAME_STATUS } from './engine/GameState.js';
import { PLAYER_1, PLAYER_2 } from './engine/SurakartaBoard.js';
import { BotAI } from './engine/BotAI.js';
import { BoardView } from './components/BoardView.js';
import { Scoreboard } from './components/Scoreboard.js';
import { CardModal } from './components/CardModal.js';
import { TutorialModal } from './components/TutorialModal.js';
import { GameOverModal } from './components/GameOverModal.js';
import { NameModal } from './components/NameModal.js';
import { audioManager } from './components/AudioManager.js';

class SwaraApp {
  constructor() {
    this.game = new GameState(GAME_MODE.LOCAL_2P);
    this.botAI = new BotAI(PLAYER_2);
    this.activeTrail = null;
    this.isBotThinking = false;
    this.isMoveAnimating = false;

    // DOM Elements
    this.boardContainer = document.getElementById('boardContainer');
    this.scoreboardContainer = document.getElementById('scoreboardContainer');
    this.cardModalContainer = document.getElementById('cardModalContainer');
    this.tutorialModalContainer = document.getElementById('tutorialModalContainer');
    this.nameModalContainer = document.getElementById('nameModalContainer');
    this.gameOverModalContainer = document.getElementById('gameOverModalContainer');

    // UI Controls
    this.btnModeLocal = document.getElementById('btnModeLocal');
    this.btnModeBot = document.getElementById('btnModeBot');
    this.btnAudioToggle = document.getElementById('btnAudioToggle');
    this.audioIcon = document.getElementById('audioIcon');
    this.btnOpenTutorial = document.getElementById('btnOpenTutorial');
    this.btnRestartGame = document.getElementById('btnRestartGame');
    this.btnSidebarTutorial = document.getElementById('btnSidebarTutorial');
    this.btnSidebarCardsInfo = document.getElementById('btnSidebarCardsInfo');

    // Sub-components
    this.boardView = new BoardView(this.boardContainer, (r, c) => this.handlePointClick(r, c));
    this.scoreboard = new Scoreboard(this.scoreboardContainer, (player) => this.openNameModal(player));
    this.cardModal = new CardModal(
      this.cardModalContainer,
      (optId) => this.handleCardAnswer(optId),
      () => this.handleCardModalClose()
    );
    this.tutorialModal = new TutorialModal(this.tutorialModalContainer);
    this.nameModal = new NameModal(this.nameModalContainer, (player, name) => this.handleSaveName(player, name));
    this.gameOverModal = new GameOverModal(
      this.gameOverModalContainer,
      () => this.handleRestart(),
      () => this.handleRestart()
    );

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.game.subscribe((event, payload) => this.handleGameEvent(event, payload));
    this.renderAll();
  }

  setupEventListeners() {
    // Mode Switching
    this.btnModeLocal.addEventListener('click', () => {
      if (this.isMoveAnimating) return;
      this.btnModeLocal.classList.add('active');
      this.btnModeBot.classList.remove('active');
      this.game.resetGame(GAME_MODE.LOCAL_2P);
      this.renderAll();
    });

    this.btnModeBot.addEventListener('click', () => {
      if (this.isMoveAnimating) return;
      this.btnModeBot.classList.add('active');
      this.btnModeLocal.classList.remove('active');
      this.game.resetGame(GAME_MODE.VS_BOT);
      this.renderAll();
    });

    // Audio Toggle
    this.btnAudioToggle.addEventListener('click', () => {
      const isMuted = audioManager.toggleMute();
      this.audioIcon.textContent = isMuted ? '🔇' : '🔊';
    });

    // Tutorial & Cards Gallery Modal Triggers
    this.btnOpenTutorial.addEventListener('click', () => this.tutorialModal.show('rules'));
    this.btnSidebarTutorial.addEventListener('click', () => this.tutorialModal.show('rules'));
    this.btnSidebarCardsInfo.addEventListener('click', () => this.tutorialModal.show('cards'));

    // Restart Game
    this.btnRestartGame.addEventListener('click', () => this.handleRestart());
  }

  openNameModal(player) {
    if (this.isMoveAnimating) return;
    const currentName = this.game.getPlayerName(player);
    this.nameModal.show(player, currentName);
  }

  handleSaveName(player, newName) {
    this.game.setPlayerName(player, newName);
    this.renderAll();
  }

  handleRestart() {
    this.activeTrail = null;
    this.isMoveAnimating = false;
    this.isBotThinking = false;
    this.cardModal.hide();
    this.gameOverModal.hide();
    this.nameModal.hide();
    this.game.resetGame();
    this.renderAll();
  }

  handlePointClick(r, c) {
    if (this.game.status !== GAME_STATUS.PLAYING) return;
    if (this.isMoveAnimating || this.boardView.isAnimating) return;
    if (this.game.mode === GAME_MODE.VS_BOT && this.game.currentTurn === PLAYER_2) return;

    const currentPiece = this.game.board.getPiece(r, c);

    if (this.game.selectedPiece) {
      // Cek apakah klik pada pion sendiri yang lain -> ganti seleksi
      if (currentPiece === this.game.currentTurn) {
        if (this.game.selectedPiece.r === r && this.game.selectedPiece.c === c) {
          this.game.deselectPiece();
        } else {
          this.game.selectPiece(r, c);
          audioManager.playMove();
        }
        this.renderAll();
        return;
      }

      // Cek apakah klik pada titik tujuan valid
      const move = this.game.validMoves.find(m => m.to.r === r && m.to.c === c);
      if (move) {
        this.executePlayerMove(r, c, move);
      } else {
        this.game.deselectPiece();
        this.renderAll();
      }
    } else {
      // Belum ada pion yang dipilih -> coba pilih pion
      if (currentPiece === this.game.currentTurn) {
        this.game.selectPiece(r, c);
        audioManager.playMove();
        this.renderAll();
      }
    }
  }

  executePlayerMove(toR, toC, move) {
    const player = this.game.currentTurn;
    this.isMoveAnimating = true;

    if (move.type === 'REGULAR') {
      audioManager.playMove();
    }

    this.boardView.animatePieceMovement(move, player, () => {
      if (move.type === 'CAPTURE') {
        this.activeTrail = move.path;
        audioManager.playCapture();
      } else {
        this.activeTrail = null;
      }

      this.game.executeMove(toR, toC);
      this.isMoveAnimating = false;
      this.renderAll();
    });
  }

  handleCardAnswer(optionId) {
    return this.game.answerCard(optionId);
  }

  handleCardModalClose() {
    this.activeTrail = null;
    this.game.closeCardModal();
    this.renderAll();

    // Trigger bot turn if in VS_BOT mode
    this.checkTriggerBotTurn();
  }

  handleGameEvent(event, payload) {
    if (event === 'CARD_EVENT_TRIGGERED') {
      setTimeout(() => {
        this.cardModal.show(payload.card, payload.player, payload.playerName);
      }, 150);
    } else if (event === 'GAME_OVER') {
      setTimeout(() => {
        this.gameOverModal.show(this.game);
      }, 400);
    } else if (event === 'TURN_CHANGED') {
      this.checkTriggerBotTurn();
    }
    this.renderAll();
  }

  checkTriggerBotTurn() {
    if (this.game.mode === GAME_MODE.VS_BOT && 
        this.game.currentTurn === PLAYER_2 && 
        this.game.status === GAME_STATUS.PLAYING &&
        !this.isBotThinking &&
        !this.isMoveAnimating) {
      
      this.isBotThinking = true;
      this.renderAll();

      setTimeout(() => {
        const bestMove = this.botAI.findBestMove(this.game.board);
        if (bestMove) {
          this.game.selectPiece(bestMove.from.r, bestMove.from.c);
          this.renderAll();

          setTimeout(() => {
            if (bestMove.type === 'REGULAR') {
              audioManager.playMove();
            }

            this.boardView.animatePieceMovement(bestMove, PLAYER_2, () => {
              if (bestMove.type === 'CAPTURE') {
                this.activeTrail = bestMove.path;
                audioManager.playCapture();
              } else {
                this.activeTrail = null;
              }

              this.game.executeMove(bestMove.to.r, bestMove.to.c);
              this.isBotThinking = false;
              this.renderAll();
            });
          }, 350);
        } else {
          this.isBotThinking = false;
          this.game.checkGameStatusAndProceed();
          this.renderAll();
        }
      }, 700);
    }
  }

  renderAll() {
    this.boardView.render(
      this.game.board,
      this.game.selectedPiece,
      this.game.validMoves,
      this.activeTrail
    );
    this.scoreboard.render(this.game);
  }
}

// Inisialisasi Aplikasi Web
document.addEventListener('DOMContentLoaded', () => {
  window.swaraApp = new SwaraApp();
});
