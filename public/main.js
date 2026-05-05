// ─── CORIANDOLI ───────────────────────────────────
const colori = ['#FF69B4', '#FFB3D9', '#ff9dd4', '#ffe082', '#c678b8', '#fff', '#f9a8d4'];
const container = document.getElementById('confetti');

function creaConfetto() {
    const el = document.createElement('div');
    el.classList.add('confetto');
    el.style.left = Math.random() * 100 + 'vw';
    el.style.background = colori[Math.floor(Math.random() * colori.length)];
    el.style.width = (Math.random() * 8 + 5) + 'px';
    el.style.height = (Math.random() * 8 + 5) + 'px';
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    const dur = Math.random() * 2.5 + 1.5;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = Math.random() * 1.5 + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 1.5) * 1000);
}

// Burst iniziale
for (let i = 0; i < 60; i++) creaConfetto();
// Qualche coriandolo ogni tanto
setInterval(() => {
    for (let i = 0; i < 5; i++) creaConfetto();
}, 2500);

// ─── ACCORDION LETTERA ────────────────────────────
const btn = document.getElementById('toggleBtn');
const content = document.getElementById('lettera-content');

btn.addEventListener('click', () => {
    const aperto = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!aperto));
    content.setAttribute('aria-hidden', String(aperto));

    const url = '/letterOpened';
    navigator.sendBeacon(url, null);
});