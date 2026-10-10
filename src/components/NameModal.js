/**
 * NameModal
 * Modal Interaktif untuk Mengubah Nama Pemain SWARA dengan Gaya Pastel Ramah Anak.
 */

export class NameModal {
  constructor(containerElement, onSave) {
    this.container = containerElement;
    this.onSave = onSave; // callback(player, newName)
    this.targetPlayer = 1;
    this.currentName = '';
  }

  show(player, currentName) {
    this.targetPlayer = player;
    this.currentName = currentName;
    this.render();
    this.container.classList.remove('hidden');
    this.container.classList.add('visible');

    const input = this.container.querySelector('#inputPlayerName');
    if (input) {
      input.focus();
      input.select();
    }
  }

  hide() {
    this.container.classList.remove('visible');
    this.container.classList.add('hidden');
    this.container.innerHTML = '';
  }

  render() {
    const isP1 = this.targetPlayer === 1;
    const playerBadgeClass = isP1 ? 'badge-p1-flat' : 'badge-p2-flat';
    const playerTitle = isP1 ? 'Pemain 1 (Kawan Biru)' : 'Pemain 2 (Kawan Peach)';

    this.container.innerHTML = `
      <div class="modal-backdrop" id="nameModalBackdrop">
        <div class="name-modal-card">
          <div class="name-modal-header">
            <span class="player-turn-flat-tag ${playerBadgeClass}">✏️ Ubah Nama ${playerTitle}</span>
            <button class="btn-close-modal" id="btnCloseNameModal">&times;</button>
          </div>

          <form id="formEditName" class="name-modal-body">
            <label for="inputPlayerName" class="name-input-label">Tuliskan nama barumu:</label>
            <input 
              type="text" 
              id="inputPlayerName" 
              class="name-text-input" 
              value="${this.currentName}" 
              maxlength="16" 
              placeholder="Contoh: Aditya, Budi, Siti..."
              required
            />

            <div class="name-modal-footer">
              <button type="button" class="btn-secondary-pastel" id="btnCancelName">Batal</button>
              <button type="submit" class="btn-primary-pastel" id="btnSaveName">Simpan Nama ✨</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const form = this.container.querySelector('#formEditName');
    const input = this.container.querySelector('#inputPlayerName');
    const cancelBtn = this.container.querySelector('#btnCancelName');
    const closeBtn = this.container.querySelector('#btnCloseNameModal');
    const backdrop = this.container.querySelector('#nameModalBackdrop');

    const handleSave = (e) => {
      e.preventDefault();
      const newName = (input.value || '').trim();
      if (newName) {
        if (this.onSave) {
          this.onSave(this.targetPlayer, newName);
        }
        this.hide();
      }
    };

    if (form) form.addEventListener('submit', handleSave);
    if (cancelBtn) cancelBtn.addEventListener('click', () => this.hide());
    if (closeBtn) closeBtn.addEventListener('click', () => this.hide());
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.hide();
      });
    }
  }
}
