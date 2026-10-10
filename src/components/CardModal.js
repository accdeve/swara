/**
 * CardModal
 * Pure Pastel 2D Card Modal Component untuk SWARA.
 * - Memastikan HANYA kartu yang berbalik dalam 3D, bukan seisi container.
 * - Teks, skenario, dan pilihan respon tetap tegak, jelas, dan stabil (tidak terbalik/mirror).
 * - Tampilan kartu edukasi dan ilustrasi otentik dalam resolusi HD transparan.
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
    this.hasAnswered = false;
  }

  show(card, player, playerName = '') {
    this.activeCard = card;
    this.player = player;
    this.playerName = playerName;
    this.isFlipped = false;
    this.hasAnswered = false;
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
    this.hasAnswered = false;
  }

  closeAndProceed() {
    this.hide();
    if (this.onModalClose) {
      this.onModalClose();
    }
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
    const flipper = this.container.querySelector('#card3dFlipper');
    if (flipper) {
      if (this.isFlipped) {
        flipper.classList.add('is-flipped');
      } else {
        flipper.classList.remove('is-flipped');
      }
    }
    const flipText = this.container.querySelector('#btnFlipText');
    if (flipText) {
      flipText.textContent = this.isFlipped ? 'Lihat Sisi Depan' : 'Lihat Sisi Belakang';
    }
    audioManager.playCardFlip();
  }

  flipToBack(isCorrect, selectedOptionId) {
    this.hasAnswered = true;
    this.isFlipped = true;

    // Pastikan gambar belakang pada flipper adalah kartu edukasi
    const backImg = this.container.querySelector('#cardBackImg');
    if (backImg && this.activeCard) {
      backImg.src = this.activeCard.backImage;
    }

    // Putar HANYA kartu flipper (bukan container)
    const flipper = this.container.querySelector('#card3dFlipper');
    if (flipper) {
      flipper.classList.add('is-flipped');
    }
    const flipText = this.container.querySelector('#btnFlipText');
    if (flipText) {
      flipText.textContent = 'Lihat Sisi Depan';
    }
    audioManager.playCardFlip();

    if (isCorrect) {
      audioManager.playCorrect();
      this.triggerConfetti();
    } else {
      audioManager.playWrong();
    }

    // Ganti fase di kolom konten tanpa memutar container
    const phaseQuestion = this.container.querySelector('#phaseQuestion');
    const phaseEducation = this.container.querySelector('#phaseEducation');
    if (phaseQuestion) phaseQuestion.style.display = 'none';
    if (phaseEducation) phaseEducation.style.display = 'flex';

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
    const headerThemeClass = isP1 ? '' : 'header-peach';

    this.container.innerHTML = `
      <div class="card-modal-backdrop" id="cardModalBackdrop">
        <div class="card-modal-dialog" id="cardModalDialog">

          <!-- HEADER MODAL (STATIS, TIDAK BERBALIK) -->
          <div class="card-modal-header ${headerThemeClass}">
            <div class="header-left">
              <span class="sheet-brand">SWARA</span>
              <span class="sheet-number">#${card.id}</span>
              <span class="sheet-player-tag ${playerBadgeClass}">🎯 ${playerBadgeText}</span>
            </div>
            <div class="header-right">
              <span class="sheet-category-pill">${card.category}</span>
              <button class="btn-close-card hidden" id="btnCloseCardModal" title="Tutup & Lanjutkan">&times;</button>
            </div>
          </div>

          <!-- MAIN BODY: DUA KOLOM (KARTU DI KIRI, KONTEN TEKS DI KANAN) -->
          <div class="card-modal-main">

            <!-- KOLOM KARTU: HANYA KARTU INI YANG BERBALIK 3D -->
            <div class="card-column">
              <div class="card-3d-scene" id="card3dScene" title="Klik untuk membalik kartu">
                <div class="card-3d-flipper ${this.isFlipped ? 'is-flipped' : ''}" id="card3dFlipper">
                  
                  <!-- SISI DEPAN: KARTU ILUSTRASI HD -->
                  <div class="card-face card-face-front">
                    <img src="${card.frontImage}" alt="${card.title}" class="card-standalone-img" />
                  </div>

                  <!-- SISI BELAKANG: COVER BIRU (SEBELUM DIJAWAB) / KARTU EDUKASI (SETELAH DIJAWAB) -->
                  <div class="card-face card-face-back">
                    <img src="${this.hasAnswered ? card.backImage : (card.coverImage || '/assets/cards/card_blue_back.png')}" alt="Sisi Belakang Kartu" class="card-standalone-img" id="cardBackImg" />
                  </div>

                </div>
              </div>

              <button class="btn-toggle-flip" id="btnToggleFlip" type="button" title="Balik Kartu">
                🔄 <span id="btnFlipText">${this.isFlipped ? 'Lihat Sisi Depan' : 'Lihat Sisi Belakang'}</span>
              </button>
            </div>

            <!-- KOLOM KONTEN: SELALU TEGAK & MUDAH DIBACA (TIDAK BERBALIK) -->
            <div class="content-column">

              <!-- FASE 1: PERTANYAAN & PILIHAN OPSI (SEBELUM DIJAWAB) -->
              <div class="phase-question" id="phaseQuestion" style="${this.hasAnswered ? 'display: none;' : 'display: flex;'}">
                <div class="question-container">
                  <div class="scenario-label">Skenario Interaktif:</div>
                  <p class="question-text">${card.question}</p>
                </div>

                <div class="options-container">
                  ${card.options.map(opt => `
                    <button class="flat-option-btn" data-opt-id="${opt.id}">
                      <span class="opt-key">${opt.id}</span>
                      <span class="opt-desc">${opt.text}</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- FASE 2: HASIL & PENJELASAN EDUKATIF (SETELAH DIJAWAB) -->
              <div class="phase-education" id="phaseEducation" style="${this.hasAnswered ? 'display: flex;' : 'display: none;'}">
                <div id="cardResultStatus" class="result-status-box"></div>

                <div class="education-content-box">
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
    `;

    this.attachEvents();
  }

  attachEvents() {
    // Klik pada scene kartu untuk membalik kartu saja
    const cardScene = this.container.querySelector('#card3dScene');
    if (cardScene) {
      cardScene.addEventListener('click', () => {
        this.toggleFlip();
      });
    }

    // Tombol Balik Kartu
    const toggleFlipBtn = this.container.querySelector('#btnToggleFlip');
    if (toggleFlipBtn) {
      toggleFlipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFlip();
      });
    }

    // Event Klik Opsi Jawaban
    const optionButtons = this.container.querySelectorAll('.flat-option-btn');
    optionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.hasAnswered) return;
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

            // Jeda sejenak untuk animasi tombol pilihan sebelum HANYA kartunya berputar ke sisi edukasi
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

    // Tombol Silang (✕) di Header
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
        if (e.target === backdrop && this.hasAnswered) {
          this.closeAndProceed();
        }
      });
    }
  }
}
