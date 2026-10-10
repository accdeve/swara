/**
 * BoardView
 * Flat 2D Vector SVG Renderer untuk Papan Permainan Tradisional Surakarta.
 * - Gaya board game anak-anak yang ramah, hangat, dan taktil.
 * - Lingkaran putus-putus statis untuk arah langkah.
 * - Viewbox 720x720 bebas terpotong.
 * - Sistem Animasi Pergerakan Bidak Meluncur (Capture & Regular Move) di sepanjang lintasan dan lingkaran sudut.
 */

import { PLAYER_1, PLAYER_2 } from '../engine/SurakartaBoard.js';
import { audioManager } from './AudioManager.js';

export class BoardView {
  constructor(containerElement, onPointClick) {
    this.container = containerElement;
    this.onPointClick = onPointClick;
    this.size = 720;
    this.padding = 185;
    this.step = 70;
    this.isAnimating = false;
  }

  coordToPixel(r, c) {
    return {
      x: this.padding + c * this.step,
      y: this.padding + r * this.step
    };
  }

  getArcCommand(prev, curr) {
    const s = this.step;
    const pad = this.padding;
    const minX = pad;
    const maxX = pad + 5 * s;
    const minY = pad;
    const maxY = pad + 5 * s;

    // TL_OUTER (r0,c1) <-> (r1,c0)
    if (prev.r === 0 && prev.c === 1 && curr.r === 1 && curr.c === 0) {
      return `A ${s} ${s} 0 1 0 ${minX} ${minY + s}`;
    }
    if (prev.r === 1 && prev.c === 0 && curr.r === 0 && curr.c === 1) {
      return `A ${s} ${s} 0 1 1 ${minX + s} ${minY}`;
    }

    // TL_INNER (r0,c2) <-> (r2,c0)
    if (prev.r === 0 && prev.c === 2 && curr.r === 2 && curr.c === 0) {
      return `A ${2*s} ${2*s} 0 1 0 ${minX} ${minY + 2*s}`;
    }
    if (prev.r === 2 && prev.c === 0 && curr.r === 0 && curr.c === 2) {
      return `A ${2*s} ${2*s} 0 1 1 ${minX + 2*s} ${minY}`;
    }

    // TR_OUTER (r0,c4) <-> (r1,c5)
    if (prev.r === 0 && prev.c === 4 && curr.r === 1 && curr.c === 5) {
      return `A ${s} ${s} 0 1 1 ${maxX} ${minY + s}`;
    }
    if (prev.r === 1 && prev.c === 5 && curr.r === 0 && curr.c === 4) {
      return `A ${s} ${s} 0 1 0 ${maxX - s} ${minY}`;
    }

    // TR_INNER (r0,c3) <-> (r2,c5)
    if (prev.r === 0 && prev.c === 3 && curr.r === 2 && curr.c === 5) {
      return `A ${2*s} ${2*s} 0 1 1 ${maxX} ${minY + 2*s}`;
    }
    if (prev.r === 2 && prev.c === 5 && curr.r === 0 && curr.c === 3) {
      return `A ${2*s} ${2*s} 0 1 0 ${maxX - 2*s} ${minY}`;
    }

    // BL_OUTER (r5,c1) <-> (r4,c0)
    if (prev.r === 5 && prev.c === 1 && curr.r === 4 && curr.c === 0) {
      return `A ${s} ${s} 0 1 1 ${minX} ${maxY - s}`;
    }
    if (prev.r === 4 && prev.c === 0 && curr.r === 5 && curr.c === 1) {
      return `A ${s} ${s} 0 1 0 ${minX + s} ${maxY}`;
    }

    // BL_INNER (r5,c2) <-> (r3,c0)
    if (prev.r === 5 && prev.c === 2 && curr.r === 3 && curr.c === 0) {
      return `A ${2*s} ${2*s} 0 1 1 ${minX} ${maxY - 2*s}`;
    }
    if (prev.r === 3 && prev.c === 0 && curr.r === 5 && curr.c === 2) {
      return `A ${2*s} ${2*s} 0 1 0 ${minX + 2*s} ${maxY}`;
    }

    // BR_OUTER (r5,c4) <-> (r4,c5)
    if (prev.r === 5 && prev.c === 4 && curr.r === 4 && curr.c === 5) {
      return `A ${s} ${s} 0 1 0 ${maxX} ${maxY - s}`;
    }
    if (prev.r === 4 && prev.c === 5 && curr.r === 5 && curr.c === 4) {
      return `A ${s} ${s} 0 1 1 ${maxX - s} ${maxY}`;
    }

    // BR_INNER (r5,c3) <-> (r3,c5)
    if (prev.r === 5 && prev.c === 3 && curr.r === 3 && curr.c === 5) {
      return `A ${2*s} ${2*s} 0 1 0 ${maxX} ${maxY - 2*s}`;
    }
    if (prev.r === 3 && prev.c === 5 && curr.r === 5 && curr.c === 3) {
      return `A ${2*s} ${2*s} 0 1 1 ${maxX - 2*s} ${maxY}`;
    }

    const p = this.coordToPixel(curr.r, curr.c);
    return `L ${p.x} ${p.y}`;
  }

  buildSvgPathFromMove(move) {
    if (!move || !move.path || move.path.length < 2) return '';
    const startPt = this.coordToPixel(move.path[0].r, move.path[0].c);
    let d = `M ${startPt.x} ${startPt.y}`;

    for (let i = 1; i < move.path.length; i++) {
      const prev = move.path[i - 1];
      const curr = move.path[i];
      if (curr.isLoopEntry) {
        d += ` ${this.getArcCommand(prev, curr)}`;
      } else {
        const pt = this.coordToPixel(curr.r, curr.c);
        d += ` L ${pt.x} ${pt.y}`;
      }
    }
    return d;
  }

  animatePieceMovement(move, playerPiece, onComplete) {
    const svgEl = this.container.querySelector('.surakarta-svg');
    if (!svgEl || !move || !move.path || move.path.length < 2) {
      if (onComplete) onComplete();
      return;
    }

    this.isAnimating = true;
    const isCapture = move.type === 'CAPTURE';
    const isP1 = playerPiece === PLAYER_1;
    const fillColor = isP1 ? '#7296C2' : '#E68E8B';
    const strokeColor = isP1 ? '#4A6E99' : '#C96B68';
    const symbolIcon = isP1 ? '🌸' : '🍑';

    // Sembunyikan bidak awal di papan selama terbang
    const originPiece = svgEl.querySelector(`.piece[data-r="${move.from.r}"][data-c="${move.from.c}"]`);
    if (originPiece) {
      originPiece.classList.add('piece-hidden-origin');
    }

    const pathD = this.buildSvgPathFromMove(move);

    // Buat layer SVG untuk animasi
    const animLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    animLayer.setAttribute('id', 'activeAnimationLayer');

    // Jalur referensi koordinat gerak (invisible)
    const motionPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    motionPath.setAttribute('d', pathD);
    motionPath.setAttribute('fill', 'none');
    motionPath.setAttribute('stroke', 'transparent');
    animLayer.appendChild(motionPath);

    // Garis jejak bercahaya yang muncul di belakang bidak
    const glowTrail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    glowTrail.setAttribute('d', pathD);
    glowTrail.setAttribute('fill', 'none');
    glowTrail.setAttribute('stroke', isCapture ? '#E59819' : (isP1 ? '#7296C2' : '#E68E8B'));
    glowTrail.setAttribute('stroke-width', isCapture ? '4' : '2.5');
    glowTrail.setAttribute('stroke-dasharray', '0 99999');
    glowTrail.setAttribute('stroke-linecap', 'round');
    glowTrail.setAttribute('stroke-linejoin', 'round');
    glowTrail.setAttribute('class', 'flight-glow-trail');
    glowTrail.setAttribute('opacity', '0.85');
    animLayer.appendChild(glowTrail);

    // Bidak yang meluncur
    const startPt = this.coordToPixel(move.from.r, move.from.c);
    const flyingPiece = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    flyingPiece.setAttribute('class', 'piece-in-flight');
    flyingPiece.setAttribute('transform', `translate(${startPt.x}, ${startPt.y})`);
    flyingPiece.innerHTML = `
      <circle cx="0" cy="0" r="20" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.5" />
      <circle cx="0" cy="0" r="15" fill="none" stroke="rgba(255, 255, 255, 0.7)" stroke-width="1.5" />
      <text x="0" y="4.5" font-size="12" text-anchor="middle" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700">${symbolIcon}</text>
    `;
    animLayer.appendChild(flyingPiece);

    svgEl.appendChild(animLayer);

    const totalLength = motionPath.getTotalLength();
    
    // Tentukan durasi berdasarkan jenis gerakan & panjang lintasan
    const duration = isCapture ? Math.max(750, Math.min(1250, totalLength * 1.05)) : 220;
    const startTime = performance.now();

    if (isCapture) {
      audioManager.playLoopWhoosh();
    }

    const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const animateStep = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easedT = isCapture ? easeInOutQuad(progress) : progress;
      const currentDist = easedT * totalLength;

      const point = motionPath.getPointAtLength(currentDist);
      flyingPiece.setAttribute('transform', `translate(${point.x}, ${point.y})`);
      glowTrail.setAttribute('stroke-dasharray', `${currentDist} 99999`);

      if (progress < 1) {
        requestAnimationFrame(animateStep);
      } else {
        // Efek hantaman mendarat pada target (impact pulse)
        if (isCapture) {
          const impact = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          const targetPt = this.coordToPixel(move.to.r, move.to.c);
          impact.setAttribute('cx', targetPt.x);
          impact.setAttribute('cy', targetPt.y);
          impact.setAttribute('r', '18');
          impact.setAttribute('fill', '#E68E8B');
          impact.setAttribute('class', 'capture-impact-pulse');
          animLayer.appendChild(impact);
        }

        setTimeout(() => {
          if (animLayer && animLayer.parentNode) {
            animLayer.parentNode.removeChild(animLayer);
          }
          this.isAnimating = false;
          if (onComplete) onComplete();
        }, isCapture ? 100 : 30);
      }
    };

    requestAnimationFrame(animateStep);
  }

  render(board, selectedPiece, validMoves = [], activeTrail = null) {
    const s = this.step;
    const pad = this.padding;
    const minX = pad;
    const maxX = pad + 5 * s;
    const minY = pad;
    const maxY = pad + 5 * s;

    // Lookup valid moves
    const moveLookup = new Map();
    for (const move of validMoves) {
      moveLookup.set(`${move.to.r},${move.to.c}`, move);
    }

    let svgHtml = `
      <svg class="surakarta-svg" viewBox="0 0 ${this.size} ${this.size}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        
        <!-- Papan Dasar Seamless Senada (Satu Permukaan Mulus Tanpa Kotak Kontras) -->
        <rect x="20" y="20" width="${this.size - 40}" height="${this.size - 40}" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" />

        <!-- 8 Corner Loops of Surakarta (100% Utuh & Terlihat Jelas) -->
        <g class="surakarta-loops" fill="none" stroke-linecap="round">
          
          <!-- Top-Left Corner Loops -->
          <path d="M ${minX + s} ${minY} A ${s} ${s} 0 1 0 ${minX} ${minY + s}" stroke="#7296C2" stroke-width="3" class="flat-loop-path" />
          <path d="M ${minX + 2*s} ${minY} A ${2*s} ${2*s} 0 1 0 ${minX} ${minY + 2*s}" stroke="#7296C2" stroke-width="2.5" class="flat-loop-path" />

          <!-- Top-Right Corner Loops -->
          <path d="M ${maxX} ${minY + s} A ${s} ${s} 0 1 0 ${maxX - s} ${minY}" stroke="#7296C2" stroke-width="3" class="flat-loop-path" />
          <path d="M ${maxX} ${minY + 2*s} A ${2*s} ${2*s} 0 1 0 ${maxX - 2*s} ${minY}" stroke="#7296C2" stroke-width="2.5" class="flat-loop-path" />

          <!-- Bottom-Left Corner Loops -->
          <path d="M ${minX} ${maxY - s} A ${s} ${s} 0 1 0 ${minX + s} ${maxY}" stroke="#7296C2" stroke-width="3" class="flat-loop-path" />
          <path d="M ${minX} ${maxY - 2*s} A ${2*s} ${2*s} 0 1 0 ${minX + 2*s} ${maxY}" stroke="#7296C2" stroke-width="2.5" class="flat-loop-path" />

          <!-- Bottom-Right Corner Loops -->
          <path d="M ${maxX - s} ${maxY} A ${s} ${s} 0 1 0 ${maxX} ${maxY - s}" stroke="#7296C2" stroke-width="3" class="flat-loop-path" />
          <path d="M ${maxX - 2*s} ${maxY} A ${2*s} ${2*s} 0 1 0 ${maxX} ${maxY - 2*s}" stroke="#7296C2" stroke-width="2.5" class="flat-loop-path" />
        </g>

        <!-- Garis Grid Surakarta (Senada dengan Lingkaran Sudut) -->
        <g class="surakarta-grid" stroke="#7296C2" stroke-width="2.5" stroke-linecap="round">
    `;

    // Horizontal grid
    for (let r = 0; r < 6; r++) {
      const y = pad + r * s;
      svgHtml += `<line x1="${minX}" y1="${y}" x2="${maxX}" y2="${y}" />`;
    }

    // Vertical grid
    for (let c = 0; c < 6; c++) {
      const x = pad + c * s;
      svgHtml += `<line x1="${x}" y1="${minY}" x2="${x}" y2="${maxY}" />`;
    }

    // Garis Diagonal Halus
    svgHtml += `
      <line x1="${minX}" y1="${minY}" x2="${maxX}" y2="${maxY}" stroke="#CBD7E6" stroke-width="1.5" />
      <line x1="${minX}" y1="${maxY}" x2="${maxX}" y2="${minY}" stroke="#CBD7E6" stroke-width="1.5" />
      <line x1="${minX + s}" y1="${minY}" x2="${maxX}" y2="${maxY - s}" stroke="#DCE5EE" stroke-width="1.2" stroke-dasharray="3,3"/>
      <line x1="${minX}" y1="${minY + s}" x2="${maxX - s}" y2="${maxY}" stroke="#DCE5EE" stroke-width="1.2" stroke-dasharray="3,3"/>
      <line x1="${maxX - s}" y1="${minY}" x2="${minX}" y2="${maxY - s}" stroke="#DCE5EE" stroke-width="1.2" stroke-dasharray="3,3"/>
      <line x1="${maxX}" y1="${minY + s}" x2="${minX + s}" y2="${maxY}" stroke="#DCE5EE" stroke-width="1.2" stroke-dasharray="3,3"/>
    </g>`;

    // Jejak Langkah Trail
    if (activeTrail && activeTrail.length > 1) {
      const pathD = this.buildSvgPathFromMove({ path: activeTrail });
      if (pathD) {
        svgHtml += `
          <path d="${pathD}" fill="none" stroke="#F4C76C" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5,5" class="flat-trail-line"/>
        `;
      }
    }

    // Titik Simpul & Indikator Arah Statis
    svgHtml += `<g class="surakarta-nodes">`;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const { x, y } = this.coordToPixel(r, c);
        const isMoveTarget = moveLookup.has(`${r},${c}`);
        const moveObj = moveLookup.get(`${r},${c}`);
        const isCapture = moveObj && moveObj.type === 'CAPTURE';

        svgHtml += `<circle cx="${x}" cy="${y}" r="3.5" fill="#7296C2" class="grid-dot" />`;

        if (isMoveTarget) {
          if (isCapture) {
            svgHtml += `
              <circle cx="${x}" cy="${y}" r="22" fill="rgba(230, 142, 139, 0.22)" stroke="#E68E8B" stroke-width="2" stroke-dasharray="4,3" class="static-capture-ring" data-r="${r}" data-c="${c}"/>
              <circle cx="${x}" cy="${y}" r="5.5" fill="#C96B68" data-r="${r}" data-c="${c}"/>
            `;
          } else {
            svgHtml += `
              <circle cx="${x}" cy="${y}" r="15" fill="rgba(114, 150, 194, 0.22)" stroke="#7296C2" stroke-width="1.8" stroke-dasharray="3,3" class="static-move-ring" data-r="${r}" data-c="${c}"/>
              <circle cx="${x}" cy="${y}" r="4.5" fill="#4A6E99" data-r="${r}" data-c="${c}"/>
            `;
          }
        }
      }
    }
    svgHtml += `</g>`;

    // Keping Bidak Permainan (Tactile Wooden Token)
    svgHtml += `<g class="surakarta-pieces">`;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const piece = board.getPiece(r, c);
        if (piece !== null) {
          const { x, y } = this.coordToPixel(r, c);
          const isSelected = selectedPiece && selectedPiece.r === r && selectedPiece.c === c;
          const isP1 = piece === PLAYER_1;

          const fillColor = isP1 ? '#7296C2' : '#E68E8B';
          const strokeColor = isP1 ? '#4A6E99' : '#C96B68';
          const symbolIcon = isP1 ? '🌸' : '🍑';

          if (isSelected) {
            // Lingkaran Putus Statis saat Terpilih
            svgHtml += `
              <circle cx="${x}" cy="${y}" r="26" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-dasharray="4,4" class="static-selection-ring" />
            `;
          }

          svgHtml += `
            <g class="piece ${isP1 ? 'piece-p1' : 'piece-p2'} ${isSelected ? 'is-selected' : ''}" data-r="${r}" data-c="${c}" cursor="pointer">
              <!-- Keping Bidak Datar -->
              <circle cx="${x}" cy="${y}" r="19" fill="${fillColor}" />
              <!-- Cincin Putih Halus Ukiran -->
              <circle cx="${x}" cy="${y}" r="14.5" fill="none" stroke="rgba(255, 255, 255, 0.6)" stroke-width="1.5" />
              <!-- Ikon Simbol 2D -->
              <text x="${x}" y="${y + 4.5}" font-size="12" text-anchor="middle" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700" pointer-events="none">${symbolIcon}</text>
            </g>
          `;
        }
      }
    }
    svgHtml += `</g>`;

    // Hitboxes
    svgHtml += `<g class="surakarta-hitboxes">`;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const { x, y } = this.coordToPixel(r, c);
        svgHtml += `
          <circle cx="${x}" cy="${y}" r="26" fill="transparent" class="point-hitbox" data-r="${r}" data-c="${c}" cursor="pointer" />
        `;
      }
    }
    svgHtml += `</g>`;

    svgHtml += `</svg>`;

    this.container.innerHTML = svgHtml;
    this.attachEventListeners();
  }

  attachEventListeners() {
    const hitboxes = this.container.querySelectorAll('.point-hitbox, .piece, .static-move-ring, .static-capture-ring');
    hitboxes.forEach(el => {
      el.addEventListener('click', () => {
        if (this.isAnimating) return;
        const r = parseInt(el.getAttribute('data-r'), 10);
        const c = parseInt(el.getAttribute('data-c'), 10);
        if (!isNaN(r) && !isNaN(c) && this.onPointClick) {
          this.onPointClick(r, c);
        }
      });
    });
  }
}
