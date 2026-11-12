
const express = require("express");
const router = express.Router();

const games = [
    {
        id: 1,
        title: "Minecraft",
        platforms: ["PC", "PlayStation", "Xbox", "Nintendo"]
    },
    {
        id: 2,
        title: "EA SPORTS FC 26",
        platforms: ["PC", "PlayStation", "Xbox", "Nintendo"]
    },
    {
        id: 3,
        title: "Cyberpunk 2077",
        platforms: ["PC", "PlayStation", "Xbox"]
    },
    {
        id: 4,
        title: "Mario Kart World",
        platforms: ["Nintendo Switch 2"]
    }
];

// Consultar todos os jogos
router.get("/", (req, res) => {
    res.json(games);
});

// Consultar um jogo específico
router.get("/:id", (req, res) => {
    const game = games.find(item => item.id === Number(req.params.id));

    if (!game) {
        return res.status(404).json({
            error: "Jogo não encontrado"
        });
    }

    res.json(game);
});

module.exports = router;
