
/* =====================================
   NuageGames - Game Details
   Version 1.3.0
===================================== */

const games = [
    {
        id: 1,
        title: "Minecraft",
        genre: "Sandbox / Sobrevivência",
        description: "Explora mundos infinitos, constrói estruturas incríveis, sobrevive a criaturas perigosas e cria a tua própria aventura.",
        platforms: ["PC", "PlayStation", "Xbox", "Nintendo"],
        image: "public/assents/images/games/minecraft.jpg"
    },
    {
        id: 2,
        title: "EA SPORTS FC 26",
        genre: "Desporto",
        description: "Vive a experiência do futebol virtual, constrói a tua equipa e compete contra jogadores de todo o mundo.",
        platforms: ["PC", "PlayStation", "Xbox", "Nintendo"],
        image: "public/assents/images/games/fc26.jpg"
    },
    {
        id: 3,
        title: "Cyberpunk 2077",
        genre: "RPG / Ação",
        description: "Explora Night City, uma metrópole futurista cheia de perigos, tecnologia avançada e oportunidades.",
        platforms: ["PC", "PlayStation", "Xbox"],
        image: "public/assents/images/games/cyberpunk2077.jpg"
    },
    {
        id: 4,
        title: "Mario Kart World",
        genre: "Corridas",
        description: "Entra em corridas emocionantes, explora um mundo aberto e compete com personagens do universo Mario.",
        platforms: ["Nintendo Switch 2"],
        image: "public/assents/images/games/mariokartworld.jpg"
    }
];

// Identificar o jogo
const params = new URLSearchParams(window.location.search);
const gameId = Number(params.get("id"));
const game = games.find(item => item.id === gameId);

// Elementos HTML
const title = document.querySelector("#game-title");
const genre = document.querySelector("#game-genre");
const description = document.querySelector("#game-description");
const platforms = document.querySelector("#game-platforms");
const image = document.querySelector("#game-image");

const platformSelect = document.querySelector("#price-platform");
const priceResults = document.querySelector("#price-results");

// Apresentar jogo
if (game) {

    document.title = `${game.title} | NuageGames`;

    title.textContent = game.title;
    genre.textContent = game.genre;
    description.textContent = game.description;
    platforms.textContent = game.platforms.join(" · ");

    image.src = game.image;
    image.alt = `Capa de ${game.title}`;

    image.onerror = () => {
        image.style.display = "none";
    };

    if (platformSelect && priceResults) {

        platformSelect.innerHTML = "";

        game.platforms.forEach(platform => {
            const option = document.createElement("option");
            option.value = platform;
            option.textContent = platform;
            platformSelect.appendChild(option);
        });

        // Carregar preços diretamente do backend
        async function renderPrices() {

            const selectedPlatform = platformSelect.value;

            const platformKey =
                selectedPlatform === "Nintendo Switch 2"
                    ? "Nintendo"
                    : selectedPlatform;

            priceResults.innerHTML = `
                <p class="price-empty">A carregar preços...</p>
            `;

            try {

                const response = await fetch(
                    `http://localhost:3000/api/prices/${game.id}/${encodeURIComponent(platformKey)}`
                );

                if (!response.ok) {
                    throw new Error("Não foi possível carregar os preços.");
                }

                const data = await response.json();
                const offers = data.offers || [];

                priceResults.innerHTML = "";

                if (offers.length === 0) {
                    priceResults.innerHTML = `
                        <p class="price-empty">
                            Ainda não existem ofertas disponíveis
                            para ${selectedPlatform}.
                        </p>
                    `;
                    return;
                }

                // Ordenar do mais barato para o mais caro
                const sortedOffers = [...offers].sort(
                    (a, b) => Number(a.price) - Number(b.price)
                );

                const lowestPrice = Number(sortedOffers[0].price);

                sortedOffers.forEach(offer => {

                    const row = document.createElement("div");
                    row.className = "price-header price-offer-row";

                    const store = document.createElement("span");
                    store.textContent = offer.store;

                    const platform = document.createElement("span");
                    platform.textContent = selectedPlatform;

                    const price = document.createElement("span");
                    price.textContent = `${Number(offer.price).toFixed(2)} €`;

                    // Destacar a oferta mais barata
                    if (Number(offer.price) === lowestPrice) {

                        row.classList.add("cheapest-offer");

                        const badge = document.createElement("small");
                        badge.className = "cheapest-badge";
                        badge.textContent = "Mais barato";

                        price.appendChild(badge);
                    }

                    const link = document.createElement("a");
                    link.textContent = "Visitar loja";
                    link.href = offer.url;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";

                    row.append(store, platform, price, link);
                    priceResults.appendChild(row);

                });

            } catch (error) {

                console.error("Erro ao carregar preços:", error);

                priceResults.innerHTML = `
                    <p class="price-empty">
                        Não foi possível carregar os preços.
                        Verifica se o servidor está ligado.
                    </p>
                `;
            }
        }

        platformSelect.addEventListener("change", renderPrices);

        renderPrices();
    }

} else {

    title.textContent = "Jogo não encontrado";
    genre.textContent = "";
    description.textContent = "Não conseguimos encontrar este jogo.";
    platforms.textContent = "";
    image.style.display = "none";

}

console.log("NuageGames: página individual carregada!");
