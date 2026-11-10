/**
 * ARTUR GARCIA 22 ANOS — CLIENT-SIDE JAVASCRIPT
 * Handles RSVP submission, live countdown, confetti micro-interactions,
 * clipboard copy, and full Admin Dashboard.
 */

// Target Event Date: Sexta-feira, 13 de Novembro de 2026 às 19:00
const EVENT_DATE = new Date('2026-11-13T19:00:00');

// Local storage keys for offline / Cloudflare Pages static fallback
const STORAGE_RSVP_KEY = 'artur22_my_rsvp';
const STORAGE_ALL_RSVPS_KEY = 'artur22_all_rsvps';
const STORAGE_AUTH_TOKEN = 'artur22_admin_token';

// State
let allGuests = [];
let currentFilter = 'all';
let searchQuery = '';

// ==========================================
// 1. COUNTDOWN TIMER
// ==========================================
function updateCountdown() {
  const now = new Date();
  const diff = EVENT_DATE - now;

  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMins');
  const secsEl = document.getElementById('cdSecs');

  if (!daysEl) return;

  if (diff <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minsEl.textContent = '00';
    secsEl.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / 1000 / 60) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minsEl.textContent = String(mins).padStart(2, '0');
  secsEl.textContent = String(secs).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ==========================================
// 2. RSVP FORM INTERACTION
// ==========================================
let pendingAttendingStatus = null;

function handleSelection(attending) {
  const nameInput = document.getElementById('guestName');
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.focus();
    nameInput.style.borderColor = '#FF2B43';
    nameInput.style.boxShadow = '0 0 0 3px rgba(229, 9, 20, 0.4)';
    
    const tip = document.getElementById('formTip');
    tip.innerHTML = '<span style="display:inline-flex;align-items:center;gap:5px;color:#FFA5A8;"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Digite seu nome ou apelido primeiro.</span>';

    setTimeout(() => {
      nameInput.style.borderColor = '';
      nameInput.style.boxShadow = '';
      tip.textContent = 'Selecione uma das opções acima para registrar sua confirmação.';
      tip.style.color = '';
    }, 3000);
    return;
  }

  pendingAttendingStatus = attending;
  executeRSVPSubmission(name, attending);
}

function submitRSVP(event) {
  event.preventDefault();
  // Default to true if submitted by pressing Enter
  handleSelection(pendingAttendingStatus !== null ? pendingAttendingStatus : true);
}

async function executeRSVPSubmission(name, attending) {
  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');
  btnYes.disabled = true;
  btnNo.disabled = true;

  try {
    let savedEntry = null;

    // 1. Try sending to local Node.js / Cloudflare backend API
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, attending })
      });
      if (response.ok) {
        const data = await response.json();
        savedEntry = data.rsvp;
      }
    } catch (apiErr) {
      console.warn('Backend API not responding; using browser client persistence fallback.');
    }

    // 2. Fallback client-side persistence (for Cloudflare Pages static hosting)
    if (!savedEntry) {
      savedEntry = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        name: name,
        attending: attending,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const localList = getLocalRSVPList();
      const existingIdx = localList.findIndex(r => r.name.toLowerCase() === name.toLowerCase());
      if (existingIdx >= 0) {
        localList[existingIdx] = savedEntry;
      } else {
        localList.unshift(savedEntry);
      }
      localStorage.setItem(STORAGE_ALL_RSVPS_KEY, JSON.stringify(localList));
    }

    // Save my response in browser session
    localStorage.setItem(STORAGE_RSVP_KEY, JSON.stringify(savedEntry));

    // Show celebration or empathetic state
    showSuccessState(savedEntry);

  } catch (err) {
    console.error('RSVP submission error:', err);
    alert('Ocorreu um erro ao registrar sua confirmação. Tente novamente.');
  } finally {
    btnYes.disabled = false;
    btnNo.disabled = false;
  }
}

function showSuccessState(rsvp) {
  const form = document.getElementById('rsvpForm');
  const successCard = document.getElementById('rsvpSuccess');
  const successIcon = document.getElementById('successIcon');
  const successTitle = document.getElementById('successTitle');
  const successMsg = document.getElementById('successMsg');

  form.classList.add('hidden');
  successCard.classList.remove('hidden');

  if (rsvp.attending) {
    successIcon.className = 'success-icon-badge confirmed';
    successIcon.innerHTML = `
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M12 2c-1 3-3.5 5-5 7-1.8 2.4-2.5 4.7-2 7.2.7 3.5 3.8 6.1 7.4 5.8 4.2-.3 7.4-3.8 7-8-.3-3.2-2.4-5.8-4.4-8-1-1.1-2-2.5-3-4z"/>
        <path d="M12 18c-1.5 0-2.5-1.2-2-2.7.4-1.3 1.8-2.3 2.5-3.3.7 1 2 2 2.3 3.3.4 1.5-.6 2.7-2.8 2.7z"/>
      </svg>
    `;
    successTitle.textContent = 'Presença Confirmada!';
    successMsg.innerHTML = `Show de bola, <strong>${escapeHTML(rsvp.name)}</strong>! Seu nome já está na lista.<br>Nos vemos dia 13/11 às 19:00 no Carneiro do Ordones!`;

    // Trigger Impeccable celebratory red & gold confetti
    triggerCelebrationConfetti();
  } else {
    successIcon.className = 'success-icon-badge declined';
    successIcon.innerHTML = `
      <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    `;
    successTitle.textContent = 'Resposta Registrada';
    successMsg.innerHTML = `Valeu por avisar, <strong>${escapeHTML(rsvp.name)}</strong>! Vai fazer falta na comemoração, mas com certeza nos encontramos em breve!`;
  }
}

function resetRSVPForm() {
  const form = document.getElementById('rsvpForm');
  const successCard = document.getElementById('rsvpSuccess');
  const nameInput = document.getElementById('guestName');

  successCard.classList.add('hidden');
  form.classList.remove('hidden');
  nameInput.focus();
}

// Celebration Confetti
function triggerCelebrationConfetti() {
  if (typeof confetti !== 'function') return;

  const count = 120;
  const defaults = {
    origin: { y: 0.65 },
    colors: ['#E50914', '#FF2B43', '#FFFFFF', '#FFA5A8', '#FFD700']
  };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

// Check if user already responded previously on this device
function checkPreviousResponse() {
  try {
    const raw = localStorage.getItem(STORAGE_RSVP_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && saved.name) {
        document.getElementById('guestName').value = saved.name;
        showSuccessState(saved);
      }
    }
  } catch (e) {}
}

// ==========================================
// 3. COPY ADDRESS CLIPBOARD
// ==========================================
function copyVenueAddress(btn) {
  const addressText = 'Av. Jovita Feitosa, 289 - Parquelândia, Fortaleza - CE';
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(addressText).then(() => {
      showCopyFeedback(btn);
    }).catch(() => fallbackCopy(addressText, btn));
  } else {
    fallbackCopy(addressText, btn);
  }
}

function fallbackCopy(text, btn) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showCopyFeedback(btn);
}

function showCopyFeedback(btn) {
  const label = btn.querySelector('.copy-label');
  const original = label.textContent;
  label.textContent = '✓ Copiado!';
  btn.style.borderColor = '#10B981';
  btn.style.color = '#10B981';

  setTimeout(() => {
    label.textContent = original;
    btn.style.borderColor = '';
    btn.style.color = '';
  }, 2200);
}

// ==========================================
// 4. ADMIN AUTHENTICATION
// ==========================================
function openAdminModal() {
  const token = localStorage.getItem(STORAGE_AUTH_TOKEN);
  if (token) {
    openDashboardModal();
  } else {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('adminUser').focus();
  }
}

function closeAdminModal() {
  document.getElementById('loginModal').classList.add('hidden');
  document.getElementById('loginError').classList.add('hidden');
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const usernameInput = document.getElementById('adminUser');
  const passwordInput = document.getElementById('adminPass');
  const errorEl = document.getElementById('loginError');
  const btn = document.getElementById('btnLogin');

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  btn.disabled = true;
  btn.textContent = 'Entrando...';
  errorEl.classList.add('hidden');

  try {
    let authenticated = false;
    let token = null;

    // 1. Try API login
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        authenticated = true;
        token = data.token;
      }
    } catch (apiErr) {
      console.warn('API unavailable, checking client credentials');
    }

    // 2. Client verification fallback (matches Artur's specified credentials)
    if (!authenticated) {
      if (username === 'artur.garcia' && password === 'Mateus17') {
        authenticated = true;
        token = 'local_session_' + Date.now();
      }
    }

    if (authenticated) {
      localStorage.setItem(STORAGE_AUTH_TOKEN, token);
      closeAdminModal();
      openDashboardModal();
    } else {
      errorEl.classList.remove('hidden');
      passwordInput.value = '';
      passwordInput.focus();
    }
  } catch (err) {
    console.error('Login error:', err);
    errorEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Entrar no Painel';
  }
}

function handleAdminLogout() {
  localStorage.removeItem(STORAGE_AUTH_TOKEN);
  closeDashboardModal();
}

// ==========================================
// 5. ADMIN DASHBOARD & LIST MANAGEMENT
// ==========================================
function openDashboardModal() {
  document.getElementById('dashboardModal').classList.remove('hidden');
  loadGuestList();
}

function closeDashboardModal() {
  document.getElementById('dashboardModal').classList.add('hidden');
}

async function loadGuestList() {
  const token = localStorage.getItem(STORAGE_AUTH_TOKEN);
  allGuests = [];

  // Try API first
  try {
    const res = await fetch('/api/admin/rsvps', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      allGuests = data.rsvps || [];
    }
  } catch (e) {
    console.warn('Cannot fetch from API, reading local storage');
  }

  // Fallback / merge with local list
  if (allGuests.length === 0) {
    allGuests = getLocalRSVPList();
  }

  renderDashboard();
}

function getLocalRSVPList() {
  try {
    const raw = localStorage.getItem(STORAGE_ALL_RSVPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function renderDashboard() {
  // Update stats counters
  const total = allGuests.length;
  const confirmed = allGuests.filter(g => g.attending).length;
  const declined = allGuests.filter(g => !g.attending).length;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statConfirmed').textContent = confirmed;
  document.getElementById('statDeclined').textContent = declined;

  // Filter list
  let filtered = allGuests;

  if (currentFilter === 'confirmed') {
    filtered = filtered.filter(g => g.attending);
  } else if (currentFilter === 'declined') {
    filtered = filtered.filter(g => !g.attending);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(g => g.name.toLowerCase().includes(q));
  }

  const tbody = document.getElementById('guestTableBody');
  const emptyState = document.getElementById('emptyState');
  tbody.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  filtered.forEach(guest => {
    const tr = document.createElement('tr');

    const dateFormatted = guest.createdAt 
      ? new Date(guest.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
      : '—';

    tr.innerHTML = `
      <td class="guest-name-cell">${escapeHTML(guest.name)}</td>
      <td>
        <span class="status-badge ${guest.attending ? 'confirmed' : 'declined'}">
          ${guest.attending 
            ? `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Confirmado` 
            : `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Não vai`}
        </span>
      </td>
      <td style="color: #8E8E9A; font-size: 11px;">${dateFormatted}</td>
      <td class="th-actions">
        <button class="btn-del-rsvp" onclick="deleteGuest('${guest.id}')" title="Excluir">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-pills .pill-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderDashboard();
}

function filterGuestList() {
  searchQuery = document.getElementById('searchInput').value.trim();
  renderDashboard();
}

async function deleteGuest(id) {
  if (!confirm('Deseja realmente remover esta resposta?')) return;

  const token = localStorage.getItem(STORAGE_AUTH_TOKEN);

  try {
    await fetch(`/api/admin/rsvps/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  } catch (e) {}

  // Update in memory & local storage
  allGuests = allGuests.filter(g => g.id !== id);
  localStorage.setItem(STORAGE_ALL_RSVPS_KEY, JSON.stringify(allGuests));
  renderDashboard();
}

// ==========================================
// 6. EXPORT HELPERS (WHATSAPP & CSV)
// ==========================================
function copyWhatsAppList() {
  const confirmedGuests = allGuests.filter(g => g.attending);
  const declinedGuests = allGuests.filter(g => !g.attending);

  let msg = `*CONFIRMAÇÃO DE PRESENÇA — ARTUR 22 ANOS*\n`;
  msg += `Data: Sexta, 13/11 às 19:00 no Carneiro do Ordones\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  msg += `*CONFIRMADOS (${confirmedGuests.length}):*\n`;
  if (confirmedGuests.length === 0) {
    msg += `_Nenhum confirmado ainda_\n`;
  } else {
    confirmedGuests.forEach((g, i) => {
      msg += `${i + 1}. ${g.name}\n`;
    });
  }

  msg += `\n*NÃO VÃO (${declinedGuests.length}):*\n`;
  if (declinedGuests.length === 0) {
    msg += `_Ninguém recusou_\n`;
  } else {
    declinedGuests.forEach((g, i) => {
      msg += `• ${g.name}\n`;
    });
  }

  msg += `\nTotal de respostas: ${allGuests.length}`;

  navigator.clipboard.writeText(msg).then(() => {
    alert('Lista copiada com sucesso! Cole no WhatsApp.');
  }).catch(() => {
    prompt('Copie a lista abaixo:', msg);
  });
}

function exportCSV() {
  if (allGuests.length === 0) {
    alert('Nenhum dado para exportar.');
    return;
  }

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'Nome,Status,Data de Resposta\n';

  allGuests.forEach(g => {
    const status = g.attending ? 'Confirmado' : 'Não vai';
    const date = g.createdAt || '';
    csvContent += `"${g.name.replace(/"/g, '""')}","${status}","${date}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `convidados_artur_22_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// XSS Sanitizer Helper
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

// Initial check on load
document.addEventListener('DOMContentLoaded', () => {
  checkPreviousResponse();
  initScrollController();
  initScrollReveal();
});

// ==========================================
// 7. SCROLL-DOWN & SCROLL-UP MOTION CONTROLLER
// ==========================================
let lastScrollTop = 0;
let ticking = false;

function initScrollController() {
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScrollPhysics();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  handleScrollPhysics();
}

function handleScrollPhysics() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  // 1. Top Glowing Progress Bar
  const progressBar = document.getElementById('scrollProgressBar');
  if (progressBar) {
    progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
  }

  // 2. Direction detection (Scroll-Down vs Scroll-Up)
  const delta = scrollTop - lastScrollTop;
  if (Math.abs(delta) > 4) {
    if (delta > 0) {
      document.body.classList.add('scrolling-down');
      document.body.classList.remove('scrolling-up');
    } else {
      document.body.classList.add('scrolling-up');
      document.body.classList.remove('scrolling-down');
    }
    lastScrollTop = scrollTop;
  }

  // 3. Scroll Cue visibility
  const cue = document.getElementById('scrollCue');
  if (cue) {
    if (scrollTop > 60) {
      cue.classList.add('hidden-cue');
    } else {
      cue.classList.remove('hidden-cue');
    }
  }

  // 4. Floating Scroll-Up Button
  const floatingBtn = document.getElementById('floatingScrollUpBtn');
  if (floatingBtn) {
    if (scrollTop > 340) {
      floatingBtn.classList.remove('hidden');
    } else {
      floatingBtn.classList.add('hidden');
    }
  }

  // 5. Parallax on Ambient Background Glows
  const glowTop = document.getElementById('glowTop');
  const glowMiddle = document.getElementById('glowMiddle');
  if (glowTop) {
    glowTop.style.transform = `translateX(-50%) translateY(${scrollTop * 0.18}px)`;
  }
  if (glowMiddle) {
    glowMiddle.style.transform = `translateX(-50%) translateY(${scrollTop * -0.12}px)`;
  }
}

function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        // Re-animate when scrolling back into view from above or below
        const rect = entry.target.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) {
          entry.target.classList.remove('in-view');
        }
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

function scrollToRSVP() {
  const rsvp = document.getElementById('rsvpSection');
  if (rsvp) {
    rsvp.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
