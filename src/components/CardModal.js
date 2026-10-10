/**
 * CardModal
 * Pure Pastel 2D Card Modal Component untuk SWARA.
 * - Memastikan modal dapat ditutup dengan mulus melalui tombol "Lanjutkan Permainan", tombol silang (✕), atau klik backdrop.
 * - Tampilan kartu edukasi dan ilustrasi otentik tanpa potensi stuck/terjebak.
 */

import confetti from 'canvas-confetti';
import { audioManager } from './AudioManager.js';

export class CardModal {
  constructor(containerElement, onAnswerSubmit, onModalClose) {
    this.container = containerElement;
    this.onAnswerSubmit = onAnswerSubmit;
    this.onModalClose = onModalClose;
    this.activeCard = null;
    this.player = null;
    this.playerName = '';
    this.isFlipped = false;
  }

  show(card, player, playerName = '') {
    this.activeCard = card;
    this.player = player;
    this.playerName = playerName;
    this.isFlipped = false;
    this.render();
    this.container.classList.remove('hidden');
    this.container.classList.add('visible');
    audioManager.playCardFlip();
  }

  hide() {
    this.container.classList.remove('visible');
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
    this.activeCard = null;
    this.isFlipped = false;
  }

  closeAndProceed() {
    this.hide();
    if (this.onModalClose) {
      this.onModalClose();
    }
  }

  flipToBack(isCorrect, selectedOptionId) {
    this.isFlipped = true;
    const cardInner = this.container.querySelector('.card-flip-inner');
    if (cardInner) {
      cardInner.classList.add('is-flipped');
    }
    audioManager.playCardFlip();

    if (isCorrect) {
      audioManager.playCorrect();
      this.triggerConfetti();
    } else {
      audioManager.playWrong();
    }

    // Tampilkan tombol tutup silang di header setelah dijawab
    const closeBtn = this.container.querySelector('#btnCloseCardModal');
    if (closeBtn) {
      closeBtn.classList.remove('hidden');
    }
  }

  triggerConfetti() {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#7296C2', '#E68E8B', '#F4C76C', '#82CFA9']
    });
  }

  render() {
    if (!this.activeCard) {
      this.container.innerHTML = '';
      return;
    }

    const card = this.activeCard;
    const isP1 = this.player === 1;
    const playerBadgeText = this.playerName ? `${this.playerName} (${isP1 ? 'Kawan Biru' : 'Kawan Peach'})` : (isP1 ? 'Pemain 1 (Kawan Biru)' : 'Pemain 2 (Kawan Peach)');
    const playerBadgeClass = isP1 ? 'badge-p1-flat' : 'badge-p2-flat';

    this.container.innerHTML = `
      <div class="card-modal-backdrop" id="cardModalBackdrop">
        <div class="card-modal-frame" id="cardModalFrame">

          <div class="card-flip-viewport">
            <div class="card-flip-inner ${this.isFlipped ? 'is-flipped' : ''}">
              
              <!-- SISI DEPAN: KARTU ILUSTRASI (BIRU PASTEL) -->
              <div class="card-2d-sheet sheet-blue">
                
                <div class="sheet-header header-blue">
                  <div class="sheet-title-group">
                    <span class="sheet-brand">SWARA</span>
                    <span class="sheet-number">#${card.id}</span>
                    <span class="sheet-player-tag ${playerBadgeClass}">🎯 ${playerBadgeText}</span>
                  </div>
                  <span class="sheet-category-pill">${card.category}</span>
                </div>

                <div class="sheet-body">
                  <!-- Ilustrasi Asli Gambar Skenario -->
                  <div class="illustration-container">
                    <img src="${card.frontImage}" alt="${card.title}" class="illustration-media" />
                  </div>

                  <!-- Teks Pertanyaan -->
                  <div class="question-container">
                    <p class="question-text">${card.question}</p>
                  </div>

                  <!-- Pilihan Respon -->
                  <div class="options-container">
                    ${card.options.map(opt => `
                      <button class="flat-option-btn" data-opt-id="${opt.id}">
                        <span class="opt-key">${opt.id}</span>
                        <span class="opt-desc">${opt.text}</span>
                      </button>
                    `).join('')}
                  </div>
                </div>

              </div>

              <!-- SISI BELAKANG: KARTU EDUKASI (KUNING PASTEL) -->
              <div class="card-2d-sheet sheet-yellow">
                
                <div class="sheet-header header-yellow">
                  <div class="sheet-title-group">
                    <span class="sheet-brand-dark">SWARA</span>
                    <span class="sheet-number-dark">KARTU EDUKASI #${card.id}</span>
                  </div>
                  <button class="btn-close-card" id="btnCloseCardModal" title="Tutup & Lanjutkan">&times;</button>
                </div>

                <div class="sheet-body">
                  <!-- Status Hasil Jawaban -->
                  <div id="cardResultStatus" class="result-status-box"></div>

                  <!-- Penjelasan Edukatif -->
                  <div class="education-content-box">
                    <div class="edu-media-box">
                      <img src="${card.backImage}" alt="${card.explanationTitle}" class="edu-media" />
                    </div>
                    
                    <h3 class="edu-heading">${card.explanationTitle}</h3>
                    
                    <div class="edu-text-paper">
                      <p>${card.explanationText}</p>
                    </div>
                  </div>

                  <div class="sheet-footer">
                    <button class="btn-continue-flat" id="btnContinueGame">
                      Lanjutkan Permainan ➔
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Event Klik Opsi Jawaban
    const optionButtons = this.container.querySelectorAll('.flat-option-btn');
    optionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isFlipped) return;
        const optId = btn.getAttribute('data-opt-id');
        optionButtons.forEach(b => b.disabled = true);
        btn.classList.add('selected');

        if (this.onAnswerSubmit) {
          const result = this.onAnswerSubmit(optId);
          if (result) {
            // Animasi feedback visual langsung pada tombol pilihan
            if (result.isCorrect) {
              btn.classList.add('is-correct');
            } else {
              btn.classList.add('is-wrong');
              // Berikan hint lembut pada opsi yang tepat
              if (this.activeCard && this.activeCard.options) {
                const correctOpt = this.activeCard.options.find(o => o.isCorrect);
                if (correctOpt) {
                  const correctBtn = this.container.querySelector(`.flat-option-btn[data-opt-id="${correctOpt.id}"]`);
                  if (correctBtn) correctBtn.classList.add('is-hint-correct');
                }
              }
            }

            const statusEl = this.container.querySelector('#cardResultStatus');
            if (statusEl) {
              if (result.isCorrect) {
                statusEl.className = 'result-status-box status-correct';
                statusEl.innerHTML = `🎉 <strong>Jawabanmu Tepat Sekali!</strong> (+4 Bintang ⭐⭐⭐⭐)`;
              } else {
                statusEl.className = 'result-status-box status-incorrect';
                statusEl.innerHTML = `💡 <strong>Hampir Tepat!</strong> Simak penjelasan penting di bawah:`;
              }
            }

            // Jeda sejenak untuk animasi tombol pilihan sebelum kartu berputar mulus ke belakang
            setTimeout(() => {
              this.flipToBack(result.isCorrect, optId);
            }, 420);
          }
        }
      });
    });

    // Tombol Lanjutkan Permainan
    const continueBtn = this.container.querySelector('#btnContinueGame');
    if (continueBtn) {
      continueBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAndProceed();
      });
    }

    // Tombol Silang (✕) di Header Kartu Kuning
    const closeBtn = this.container.querySelector('#btnCloseCardModal');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAndProceed();
      });
    }

    // Klik Backdrop untuk menutup setelah dijawab
    const backdrop = this.container.querySelector('#cardModalBackdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop && this.isFlipped) {
          this.closeAndProceed();
        }
      });
    }
  }
}
