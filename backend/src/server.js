
/* =====================================
   NuageGames - Backend Server
   Version 1.1.0
===================================== */

const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
// Permitir pedidos do frontend
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});
// Importar rotas
const gamesRoutes = require("./routes/games");
const pricesRoutes = require("./routes/prices");
// Rota principal
app.get("/", (req, res) => {
    res.json({
        name: "NuageGames API",
        status: "online",
        version: "1.1.0",
        message: "O servidor da NuageGames está a funcionar!"
    });
});

// Rota dos jogos
app.use("/api/games", gamesRoutes);
app.use("/api/prices", pricesRoutes);
// Iniciar servidor
app.listen(PORT, () => {
    console.log(`NuageGames API disponível em http://localhost:${PORT}`);
});
