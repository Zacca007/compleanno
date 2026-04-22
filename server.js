const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const publicDir = path.join(__dirname, 'public');

// ─── MIDDLEWARE: log delle richieste con orario ───
app.use((req, res, next) => {
    const now = new Date();
    const orario = now.toLocaleString('it-IT', {
        timeZone: 'Europe/Rome',
        day:    '2-digit',
        month:  '2-digit',
        year:   'numeric',
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    console.log(`[${orario}] ${req.method} ${req.url} — da ${req.ip}`);
    next();
});

app.use(express.static(publicDir));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(port, () => {
    console.log(`🎂 Server compleanno in ascolto su http://localhost:${port}`);
});