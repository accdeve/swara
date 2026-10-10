/**
 * GameState
 * State Machine & Game Controller untuk SWARA.
 * Mendukung kustomisasi nama pemain, sistem kartu bolak-balik 2 sisi, dan logika aturan Surakarta.
 */

import { SurakartaBoard, PLAYER_1, PLAYER_2 } from './SurakartaBoard.js';
import { SurakartaRules } from './SurakartaRules.js';
import { CardDeck } from '../data/cardsData.js';

export const GAME_MODE = {
  LOCAL_2P: 'LOCAL_2P',
  VS_BOT: 'VS_BOT',
  TUTORIAL: 'TUTORIAL'
};

export const GAME_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  PLAYING: 'PLAYING',
  CARD_EVENT: 'CARD_EVENT',
  GAME_OVER: 'GAME_OVER'
};

export class GameState {
  constructor(mode = GAME_MODE.LOCAL_2P, deck = new CardDeck()) {
    this.mode = mode;
    this.deck = deck;
    this.board = new SurakartaBoard();
    this.currentTurn = PLAYER_1;
    this.status = GAME_STATUS.PLAYING;
    this.player1Name = 'Pemain 1';
    this.player2Name = 'Pemain 2';
    this.player1Stars = 0;
    this.player2Stars = 0;
    this.selectedPiece = null; // { r, c }
    this.validMoves = []; // array of move objects
    this.activeCardModal = {
      isOpen: false,
      card: null,
      answered: false,
      isCorrect: false,
      chosenOptionId: null,
      triggeringPlayer: null
    };
    this.winner = null;
    this.gameOverReason = null;
    this.moveHistory = [];
    this.listeners = new Set();
  }

  setPlayerName(player, name) {
    const cleanName = (name || '').trim();
    if (!cleanName) return;
    if (player === PLAYER_1) {
      this.player1Name = cleanName;
    } else if (player === PLAYER_2) {
      this.player2Name = cleanName;
    }
    this.notify('PLAYER_NAME_CHANGED', { player, name: cleanName, p1Name: this.player1Name, p2Name: this.player2Name });
  }

  getPlayerName(player) {
    if (player === PLAYER_1) return this.player1Name;
    if (player === PLAYER_2) {
      return this.mode === GAME_MODE.VS_BOT ? 'Komputer' : this.player2Name;
    }
    return 'Pemain';
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, payload = {}) {
    for (const listener of this.listeners) {
      listener(event, payload, this);
    }
  }

  selectPiece(r, c) {
    if (this.status !== GAME_STATUS.PLAYING) return false;
    const piece = this.board.getPiece(r, c);
    if (piece !== this.currentTurn) {
      this.deselectPiece();
      return false;
    }

    this.selectedPiece = { r, c };
    this.validMoves = SurakartaRules.getValidMovesForPiece(this.board, r, c);
    this.notify('PIECE_SELECTED', { r, c, validMoves: this.validMoves });
    return true;
  }

  deselectPiece() {
    this.selectedPiece = null;
    this.validMoves = [];
    this.notify('PIECE_DESELECTED');
  }

  executeMove(toR, toC) {
    if (!this.selectedPiece || this.status !== GAME_STATUS.PLAYING) return null;

    const move = this.validMoves.find(m => m.to.r === toR && m.to.c === toC);
    if (!move) return null;

    const from = { ...this.selectedPiece };
    const player = this.currentTurn;

    // Eksekusi pergerakan di board
    this.board.movePiece(from.r, from.c, toR, toC);

    const isCapture = move.type === 'CAPTURE';
    let capturedPlayer = null;

    if (isCapture) {
      capturedPlayer = move.captured.player;
    }

    this.moveHistory.push({
      player,
      move,
      timestamp: Date.now()
    });

    this.selectedPiece = null;
    this.validMoves = [];

    this.notify('MOVE_EXECUTED', { move, player, isCapture });

    // Jika memakan pion lawan -> Masuk ke Card Event
    if (isCapture) {
      const drawnCard = this.deck.drawCard();
      if (drawnCard) {
        this.status = GAME_STATUS.CARD_EVENT;
        this.activeCardModal = {
          isOpen: true,
          card: drawnCard,
          answered: false,
          isCorrect: false,
          chosenOptionId: null,
          triggeringPlayer: player
        };
        this.notify('CARD_EVENT_TRIGGERED', { card: drawnCard, player, playerName: this.getPlayerName(player) });
        return { success: true, isCapture: true, cardEvent: true, move };
      }
    }

    // Jika tidak memakan pion, atau kartu habis, cek status game over / ganti giliran
    this.checkGameStatusAndProceed();
    return { success: true, isCapture: false, cardEvent: false, move };
  }

  answerCard(optionId) {
    if (this.status !== GAME_STATUS.CARD_EVENT || !this.activeCardModal.isOpen) return null;

    const card = this.activeCardModal.card;
    const selectedOption = card.options.find(o => o.id === optionId);
    if (!selectedOption) return null;

    const isCorrect = selectedOption.isCorrect === true;
    const player = this.activeCardModal.triggeringPlayer;

    if (isCorrect) {
      if (player === PLAYER_1) this.player1Stars += card.stars;
      else if (player === PLAYER_2) this.player2Stars += card.stars;
    }

    this.activeCardModal.answered = true;
    this.activeCardModal.isCorrect = isCorrect;
    this.activeCardModal.chosenOptionId = optionId;

    this.notify('CARD_ANSWERED', {
      card,
      optionId,
      isCorrect,
      player,
      playerName: this.getPlayerName(player),
      p1Stars: this.player1Stars,
      p2Stars: this.player2Stars
    });

    return { isCorrect, stars: card.stars };
  }

  closeCardModal() {
    if (this.status !== GAME_STATUS.CARD_EVENT) return;

    this.activeCardModal = {
      isOpen: false,
      card: null,
      answered: false,
      isCorrect: false,
      chosenOptionId: null,
      triggeringPlayer: null
    };

    this.status = GAME_STATUS.PLAYING;
    this.notify('CARD_MODAL_CLOSED');
    this.checkGameStatusAndProceed();
  }

  checkGameStatusAndProceed() {
    const gameOverCheck = SurakartaRules.isGameOver(
      this.board,
      this.deck.remainingCount,
      this.player1Stars,
      this.player2Stars
    );

    if (gameOverCheck.isOver) {
      this.status = GAME_STATUS.GAME_OVER;
      this.winner = gameOverCheck.winner;
      this.gameOverReason = gameOverCheck.reason;
      this.notify('GAME_OVER', {
        winner: this.winner,
        winnerName: this.getPlayerName(this.winner),
        reason: this.gameOverReason,
        p1Stars: this.player1Stars,
        p2Stars: this.player2Stars,
        p1Name: this.player1Name,
        p2Name: this.getPlayerName(PLAYER_2)
      });
    } else {
      this.switchTurn();
    }
  }

  switchTurn() {
    this.currentTurn = this.currentTurn === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    this.notify('TURN_CHANGED', { currentTurn: this.currentTurn, playerName: this.getPlayerName(this.currentTurn) });
  }

  resetGame(mode = this.mode) {
    this.mode = mode;
    this.deck.reset();
    this.board = new SurakartaBoard();
    this.currentTurn = PLAYER_1;
    this.status = GAME_STATUS.PLAYING;
    this.player1Stars = 0;
    this.player2Stars = 0;
    this.selectedPiece = null;
    this.validMoves = [];
    this.activeCardModal = {
      isOpen: false,
      card: null,
      answered: false,
      isCorrect: false,
      chosenOptionId: null,
      triggeringPlayer: null
    };
    this.winner = null;
    this.gameOverReason = null;
    this.moveHistory = [];
    this.notify('GAME_RESET', { mode });
  }
}
