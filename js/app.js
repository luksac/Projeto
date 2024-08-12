const express = require('express');
const path = require('path');
const app = express();
const PORT = 3333;

// Configurar pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para servir o HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});