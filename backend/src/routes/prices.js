
const express = require("express");
const router = express.Router();

// Identificadores dos jogos na Steam
const steamGames = {
    2: 3405690,  // EA SPORTS FC 26
    3: 1091500   // Cyberpunk 2077
};

// Consultar preços
router.get("/:gameId/:platform", async (req, res) => {

    const gameId = Number(req.params.gameId);
    const platform = req.params.platform;

    // Por enquanto, só temos integração real com PC / Steam
    if (platform !== "PC") {
        return res.json({
            gameId,
            platform,
            offers: []
        });
    }

    const appId = steamGames[gameId];

    // O jogo não está disponível na Steam
    if (!appId) {
        return res.json({
            gameId,
            platform,
            offers: []
        });
    }

    try {

        const steamUrl =
            `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=pt&l=portuguese`;

        const response = await fetch(steamUrl);

        if (!response.ok) {
            throw new Error("Erro ao consultar a Steam.");
        }

        const data = await response.json();
        const gameData = data[appId]?.data;

        if (!data[appId]?.success || !gameData) {
            throw new Error("Jogo não encontrado na Steam.");
        }

        const priceInfo = gameData.price_overview;

        if (!priceInfo) {
            return res.json({
                gameId,
                platform,
                offers: []
            });
        }

        const offers = [{
            store: "Steam",
            platform: "PC",
            price: priceInfo.final / 100,
            currency: priceInfo.currency,
            url: `https://store.steampowered.com/app/${appId}/?cc=pt`
        }];

        res.json({
            gameId,
            platform,
            offers
        });

    } catch (error) {

        console.error("Erro Steam:", error.message);

        res.status(502).json({
            error: "Não foi possível obter os preços da Steam."
        });
    }
});

module.exports = router;
