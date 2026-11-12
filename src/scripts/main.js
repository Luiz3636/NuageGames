
/* =====================================
   NuageGames - Main JavaScript
   Version 0.4.1
===================================== */

const games = [
    {
        id: 1,
        title: "Minecraft",
        platforms: ["PC", "PlayStation", "Xbox", "Nintendo"],
        platformLabel: "PC · PlayStation · Xbox · Nintendo",
        genre: "Sandbox / Sobrevivência",
        description: "Explora mundos infinitos, constrói e sobrevive.",
        image: "public/assents/images/games/minecraft.jpg"
    },
    {
        id: 2,
        title: "EA SPORTS FC 26",
        platforms: ["PC", "PlayStation", "Xbox", "Nintendo"],
        platformLabel: "PC · PlayStation · Xbox · Nintendo",
        genre: "Desporto",
        description: "Vive a experiência do futebol virtual.",
        image: "public/assents/images/games/fc26.jpg"
    },
    {
        id: 3,
        title: "Cyberpunk 2077",
        platforms: ["PC", "PlayStation", "Xbox"],
        platformLabel: "PC · PlayStation · Xbox",
        genre: "RPG / Ação",
        description: "Explora Night City num mundo futurista.",
        image: "public/assents/images/games/cyberpunk2077.jpg"
    },
    {
        id: 4,
        title: "Mario Kart World",
        platforms: ["Nintendo"],
        platformLabel: "Nintendo Switch 2",
        genre: "Corridas",
        description: "Compete em corridas num mundo aberto.",
        image: "public/assents/images/games/mariokartworld.jpg"
    }
];

// Elementos HTML
const searchInput = document.querySelector("#game-search");
const searchButton = document.querySelector(".search-container button");
const gamesContainer = document.querySelector("#games-container");
const platformButtons = document.querySelectorAll(".platform-list button");

// Estado dos filtros
let activePlatform = "Todas";
let searchTerm = "";

// Mostrar jogos
function renderGames(filteredGames) {
    if (!gamesContainer) return;

    gamesContainer.innerHTML = "";

    if (filteredGames.length === 0) {
        gamesContainer.innerHTML = `
            <p class="empty-state">Não foram encontrados jogos.</p>
        `;
        return;
    }

    filteredGames.forEach(game => {
        const card = document.createElement("article");
        card.className = "game-card";
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
            window.location.href = `game.html?id=${game.id}`;
        });

        const cover = document.createElement("div");
        cover.className = "game-cover";

        const img = document.createElement("img");
        img.src = game.image;
        img.alt = `Capa de ${game.title}`;

        img.onerror = () => {
            cover.classList.add("no-image");
            cover.innerHTML = `<span>${game.title}</span>`;
        };

        cover.appendChild(img);

        const platform = document.createElement("p");
        platform.className = "game-platform";
        platform.textContent = game.platformLabel;

        const title = document.createElement("h3");
        title.textContent = game.title;

        const genre = document.createElement("p");
        genre.className = "game-genre";
        genre.textContent = game.genre;

        const description = document.createElement("p");
        description.className = "game-description";
        description.textContent = game.description;

        const price = document.createElement("p");
        price.className = "game-price";
        price.textContent = "Comparação de preços em breve";

        card.append(
            cover,
            platform,
            title,
            genre,
            description,
            price
        );

        gamesContainer.appendChild(card);
    });
}

// Filtrar jogos
function filterGames() {
    const filteredGames = games.filter(game => {
        const matchesPlatform =
            activePlatform === "Todas" ||
            game.platforms.includes(activePlatform);

        const matchesSearch =
            game.title.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesPlatform && matchesSearch;
    });

    renderGames(filteredGames);
}

// Pesquisa
if (searchInput) {
    searchInput.addEventListener("input", () => {
        searchTerm = searchInput.value.trim();
        filterGames();
    });
}

if (searchButton && searchInput) {
    searchButton.addEventListener("click", () => {
        searchTerm = searchInput.value.trim();
        filterGames();
    });
}

// Botões das plataformas
platformButtons.forEach(button => {
    button.addEventListener("click", () => {
        platformButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        activePlatform = button.textContent.trim();

        filterGames();
    });
});

// Inicialização
renderGames(games);

console.log("NuageGames carregada com sucesso!");
