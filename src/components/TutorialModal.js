/**
 * TutorialModal
 * Panduan interaktif cara bermain SWARA dan Galeri 10 Kartu Edukasi Batasan Diri.
 */

import { CARDS_DATA } from '../data/cardsData.js';

export class TutorialModal {
  constructor(containerElement) {
    this.container = containerElement;
    this.activeTab = 'rules'; // 'rules' | 'cards'
  }

  show(tab = 'rules') {
    this.activeTab = tab;
    this.render();
    this.container.classList.remove('hidden');
    this.container.classList.add('visible');
  }

  hide() {
    this.container.classList.remove('visible');
    this.container.classList.add('hidden');
  }

  render() {
    this.container.innerHTML = `
      <div class="modal-backdrop">
        <div class="tutorial-modal-card">
          
          <div class="tutorial-header">
            <div class="tutorial-tab-bar">
              <button class="tab-btn ${this.activeTab === 'rules' ? 'active' : ''}" id="tabBtnRules">
                📖 Cara Bermain
              </button>
              <button class="tab-btn ${this.activeTab === 'cards' ? 'active' : ''}" id="tabBtnCards">
                🃏 10 Kartu Edukasi
              </button>
            </div>
            <button class="btn-close-modal" id="btnCloseTutorial">&times;</button>
          </div>

          <div class="tutorial-content-scroll">
            
            ${this.activeTab === 'rules' ? `
              <!-- TAB 1: PANDUAN ATURAN MAIN -->
              <div class="tutorial-step-card">
                <div class="step-badge">Langkah 1</div>
                <h3>Papan & Pion Permainan</h3>
                <p>SWARA menggunakan papan tradisional <strong>Surakarta (6 &times; 6 titik)</strong> dengan 8 kurva lingkaran sudut. Masing-masing pemain memiliki <strong>12 pion</strong> di 2 baris awal mereka.</p>
              </div>

              <div class="tutorial-step-card">
                <div class="step-badge">Langkah 2</div>
                <h3>Gerakan Biasa (Reguler)</h3>
                <p>Pemain bergantian menggerakkan 1 pion sebanyak <strong>1 langkah</strong> ke titik kosong di sekitarnya (bisa horizontal, vertikal, maupun diagonal).</p>
              </div>

              <div class="tutorial-step-card">
                <div class="step-badge highlight-badge">Langkah 3 ⭐</div>
                <h3>Cara Memakan Pion Lawan (Loop Attack)</h3>
                <p>Pionmu meluncur lurus dan <strong>wajib melintasi minimal 1 lintasan lingkaran sudut</strong> tanpa terhalang pion lain, lalu mendarat tepat di atas pion lawan untuk memakannya!</p>
              </div>

              <div class="tutorial-step-card">
                <div class="step-badge highlight-badge">Langkah 4 🃏</div>
                <h3>Tantangan Kartu Edukasi</h3>
                <p>Setelah memakan pion lawan, kamu akan membuka <strong>Kartu Ilustrasi (Biru)</strong>. Pilih jawaban yang tepat untuk membuka <strong>Kartu Edukasi (Kuning)</strong> dan meraih <strong>+4 Bintang ⭐</strong>!</p>
              </div>

              <div class="tutorial-step-card">
                <div class="step-badge">Langkah 5 🏆</div>
                <h3>Menentukan Pemenang</h3>
                <p>Permainan berakhir jika 10 kartu habis atau seluruh pion lawan habis. Pemain dengan <strong>Bintang Terbanyak</strong> menjadi pemenang!</p>
              </div>
            ` : `
              <!-- TAB 2: DAFTAR 10 KARTU EDUKASI RESMI -->
              <div class="cards-gallery-list">
                ${CARDS_DATA.map(card => `
                  <div class="card-gallery-item">
                    <div class="gallery-item-header">
                      <span class="gallery-badge-blue">Kartu #${card.id}</span>
                      <span class="gallery-category">${card.category}</span>
                    </div>
                    <div class="gallery-item-body">
                      <div class="gallery-img-thumb">
                        <img src="${card.frontImage}" alt="${card.title}" />
                      </div>
                      <div class="gallery-text-info">
                        <h4>${card.title}</h4>
                        <p class="gallery-q">${card.question}</p>
                        <div class="gallery-answer-box">
                          <strong>💡 Penjelasan Edukasi:</strong>
                          <p>${card.explanationText}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}

          </div>

          <div class="tutorial-footer">
            <button class="btn-primary-pastel" id="btnUnderstandTutorial">Saya Siap Bermain! 🚀</button>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const closeBtn = this.container.querySelector('#btnCloseTutorial');
    const understandBtn = this.container.querySelector('#btnUnderstandTutorial');
    const tabBtnRules = this.container.querySelector('#tabBtnRules');
    const tabBtnCards = this.container.querySelector('#tabBtnCards');

    if (closeBtn) closeBtn.addEventListener('click', () => this.hide());
    if (understandBtn) understandBtn.addEventListener('click', () => this.hide());

    if (tabBtnRules) {
      tabBtnRules.addEventListener('click', () => {
        this.activeTab = 'rules';
        this.render();
      });
    }

    if (tabBtnCards) {
      tabBtnCards.addEventListener('click', () => {
        this.activeTab = 'cards';
        this.render();
      });
    }
  }
}
