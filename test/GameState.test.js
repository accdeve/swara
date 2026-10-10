import { describe, it, expect } from 'vitest';
import { GameState, GAME_STATUS, GAME_MODE } from '../src/engine/GameState.js';
import { PLAYER_1, PLAYER_2 } from '../src/engine/SurakartaBoard.js';

describe('GameState Controller & State Machine', () => {
  it('should initialize with PLAYER_1 turn and default names', () => {
    const game = new GameState(GAME_MODE.LOCAL_2P);
    expect(game.currentTurn).toBe(PLAYER_1);
    expect(game.status).toBe(GAME_STATUS.PLAYING);
    expect(game.player1Name).toBe('Pemain 1');
    expect(game.player2Name).toBe('Pemain 2');
    expect(game.getPlayerName(PLAYER_1)).toBe('Pemain 1');
    expect(game.getPlayerName(PLAYER_2)).toBe('Pemain 2');
    expect(game.player1Stars).toBe(0);
    expect(game.player2Stars).toBe(0);
  });

  it('should allow customizing player names properly', () => {
    const game = new GameState(GAME_MODE.LOCAL_2P);
    game.setPlayerName(PLAYER_1, 'Budi');
    game.setPlayerName(PLAYER_2, 'Siti');
    expect(game.player1Name).toBe('Budi');
    expect(game.player2Name).toBe('Siti');
    expect(game.getPlayerName(PLAYER_1)).toBe('Budi');
    expect(game.getPlayerName(PLAYER_2)).toBe('Siti');

    // In VS_BOT mode, Player 2 is Komputer
    game.mode = GAME_MODE.VS_BOT;
    expect(game.getPlayerName(PLAYER_2)).toBe('Komputer');
  });

  it('should select friendly piece and calculate valid moves', () => {
    const game = new GameState();
    // Cannot select P2 piece on P1 turn
    const selectedP2 = game.selectPiece(4, 0);
    expect(selectedP2).toBe(false);
    expect(game.selectedPiece).toBeNull();

    // Can select P1 piece
    const selectedP1 = game.selectPiece(1, 1);
    expect(selectedP1).toBe(true);
    expect(game.selectedPiece).toEqual({ r: 1, c: 1 });
    expect(game.validMoves.length).toBeGreaterThan(0);
  });

  it('should execute regular move and switch turn to PLAYER_2', () => {
    const game = new GameState();
    game.selectPiece(1, 1);
    const res = game.executeMove(2, 1);
    expect(res.success).toBe(true);
    expect(res.isCapture).toBe(false);
    expect(game.board.getPiece(1, 1)).toBeNull();
    expect(game.board.getPiece(2, 1)).toBe(PLAYER_1);
    expect(game.currentTurn).toBe(PLAYER_2);
  });

  it('should trigger card modal on capture, award stars on correct answer, and close modal', () => {
    const game = new GameState();
    game.board.clear();
    // Setup capture scenario: P1 at (2, 0), P2 at (4, 2)
    game.board.setPiece(2, 0, PLAYER_1);
    game.board.setPiece(4, 2, PLAYER_2);

    game.selectPiece(2, 0);
    const res = game.executeMove(4, 2);
    expect(res.success).toBe(true);
    expect(res.isCapture).toBe(true);
    expect(res.cardEvent).toBe(true);
    expect(game.status).toBe(GAME_STATUS.CARD_EVENT);
    expect(game.activeCardModal.isOpen).toBe(true);
    expect(game.activeCardModal.triggeringPlayer).toBe(PLAYER_1);

    // Answer card correctly
    const card = game.activeCardModal.card;
    const correctOpt = card.options.find(o => o.isCorrect);
    const ansRes = game.answerCard(correctOpt.id);
    expect(ansRes.isCorrect).toBe(true);
    expect(game.player1Stars).toBe(4);

    // Close card modal
    game.closeCardModal();
    expect(game.activeCardModal.isOpen).toBe(false);
    // Since P2 has 0 pieces left after capture, game over triggers!
    expect(game.status).toBe(GAME_STATUS.GAME_OVER);
    expect(game.winner).toBe(PLAYER_1);
  });
});
