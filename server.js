const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

const publicDir = path.join(__dirname, 'public');
const disegniDir = path.join(__dirname, 'disegni');

// Crea la cartella disegni se non esiste
if (!fs.existsSync(disegniDir)) fs.mkdirSync(disegniDir);

// ─── MIDDLEWARE: log delle richieste con orario ───
app.use((req, res, next) => {
    const now = new Date();
    const orario = now.toLocaleString('it-IT', {
        timeZone: 'Europe/Rome',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    console.log(`[${orario}] ${req.method} ${req.url} — da ${req.ip}`);
    next();
});

app.use(express.json({ limit: '5mb' }));
app.use(express.static(publicDir));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

// ─── RICEZIONE DISEGNO ────────────────────────────
app.post('/disegno', (req, res) => {
    const { immagine } = req.body;
    if (!immagine || !immagine.startsWith('data:image/png;base64,')) {
        return res.status(400).json({ errore: 'immagine non valida' });
    }

    const base64 = immagine.replace('data:image/png;base64,', '');
    const buffer = Buffer.from(base64, 'base64');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const nomeFile = `disegno-${timestamp}.png`;
    const percorso = path.join(disegniDir, nomeFile);

    fs.writeFile(percorso, buffer, (err) => {
        if (err) {
            console.error('Errore nel salvare il disegno:', err);
            return res.status(500).json({ errore: 'salvataggio fallito' });
        }
        res.json({ ok: true });
    });
});

app.listen(port, () => {
    console.log(`🎂 Server compleanno in ascolto su http://localhost:${port}`);
});