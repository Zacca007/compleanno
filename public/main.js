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
}, 3000);

// ─── CANVAS ───────────────────────────────────────
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Dimensiona il canvas alla larghezza reale in pixel
function ridimensionaCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = Math.round(w * 0.55); // proporzione 16:9 circa
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    canvas.style.height = h + 'px';
    ctx.scale(ratio, ratio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}
ridimensionaCanvas();

let coloreAttuale = '#3a1a2e';
let spessoreAttuale = 3;
let disegnando = false;
let ultimoX = 0, ultimoY = 0;

function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return {
        x: src.clientX - rect.left,
        y: src.clientY - rect.top,
    };
}

function inizia(e) {
    e.preventDefault();
    disegnando = true;
    const { x, y } = getPos(e);
    ultimoX = x; ultimoY = y;
    ctx.beginPath();
    ctx.arc(x, y, spessoreAttuale / 2, 0, Math.PI * 2);
    ctx.fillStyle = coloreAttuale;
    ctx.fill();
}

function disegna(e) {
    if (!disegnando) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(ultimoX, ultimoY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = coloreAttuale;
    ctx.lineWidth = spessoreAttuale;
    ctx.stroke();
    ultimoX = x; ultimoY = y;
}

function ferma() { disegnando = false; }

canvas.addEventListener('mousedown', inizia);
canvas.addEventListener('mousemove', disegna);
canvas.addEventListener('mouseup', ferma);
canvas.addEventListener('mouseleave', ferma);
canvas.addEventListener('touchstart', inizia, { passive: false });
canvas.addEventListener('touchmove', disegna, { passive: false });
canvas.addEventListener('touchend', ferma);

// Colori
document.querySelectorAll('.colore-btn').forEach(b => {
    b.addEventListener('click', () => {
        document.querySelectorAll('.colore-btn').forEach(x => x.classList.remove('attivo'));
        b.classList.add('attivo');
        coloreAttuale = b.dataset.colore;
    });
});

// Spessori
document.querySelectorAll('.spessore-btn').forEach(b => {
    b.addEventListener('click', () => {
        document.querySelectorAll('.spessore-btn').forEach(x => x.classList.remove('attivo'));
        b.classList.add('attivo');
        spessoreAttuale = parseInt(b.dataset.size);
    });
});

// Cancella
document.getElementById('clearCanvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Invia
document.getElementById('inviaDisegno').addEventListener('click', async () => {
    const btn = document.getElementById('inviaDisegno');
    if (btn.classList.contains('inviato')) return;

    const dataUrl = canvas.toDataURL('image/png');
    try {
        await fetch('/disegno', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ immagine: dataUrl }),
        });
    } catch (e) { /* silenzioso */ }

    btn.classList.add('inviato');
    btn.querySelector('.invia-label').hidden = true;
    btn.querySelector('.invia-ok').hidden = false;
    btn.disabled = true;
});


const btn = document.getElementById('toggleBtn');
const content = document.getElementById('lettera-content');

btn.addEventListener('click', () => {
    const aperto = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!aperto));
    content.setAttribute('aria-hidden', String(aperto));

    navigator.sendBeacon('/letterOpened', null);
});