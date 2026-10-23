const videos = [
    {
        id: 1,
        title: "Melhores momentos do futebol mundial",
        sport: "Futebol",
        duration: "8:24",
        views: "2,3 mi",
        image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80",
        youtube: "https://www.youtube.com/results?search_query=melhores+momentos+futebol",
        videoId: "kJQP7kiw5Fk"
    },
    {
        id: 2,
        title: "As jogadas mais incríveis do basquete",
        sport: "Basquete",
        duration: "10:12",
        views: "1,8 mi",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
        youtube: "https://www.youtube.com/results?search_query=melhores+jogadas+basquete",
        videoId: "aqz-KE-bpKQ"
    },
    {
        id: 3,
        title: "Grandes jogadas do vôlei",
        sport: "Vôlei",
        duration: "9:45",
        views: "1,2 mi",
        image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80",
        youtube: "https://www.youtube.com/results?search_query=melhores+jogadas+volei",
        videoId: "ScMzIvxBSi4"
    },
    {
        id: 4,
        title: "Os melhores pontos do tênis",
        sport: "Tênis",
        duration: "7:36",
        views: "980 mil",
        image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80",
        youtube: "https://www.youtube.com/results?search_query=melhores+pontos+tenis",
        videoId: "ysz5S6PUM-U"
    },
    {
        id: 5,
        title: "Velocidade e superação nas pistas",
        sport: "Corrida",
        duration: "6:42",
        views: "750 mil",
        image: "https://images.unsplash.com/photo-1533561052604-c3beb6d55b8d?auto=format&fit=crop&w=800&q=80",
        youtube: "https://www.youtube.com/results?search_query=melhores+momentos+atletismo",
        videoId: "ScMzIvxBSi4"
    },
    {
        id: 6,
        title: "Dribles e gols inesquecíveis",
        sport: "Futebol",
        duration: "5:28",
        views: "640 mil",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
        youtube: "https://www.youtube.com/results?search_query=gols+incriveis+futebol",
        videoId: "kJQP7kiw5Fk"
    },
    {
        id: 7,
        title: "Enterradas espetaculares",
        sport: "Basquete",
        duration: "8:16",
        views: "510 mil",
        image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80",
        youtube: "https://www.youtube.com/results?search_query=enterradas+nba",
        videoId: "aqz-KE-bpKQ"
    },
    {
        id: 8,
        title: "Ralis impressionantes no vôlei",
        sport: "Vôlei",
        duration: "6:53",
        views: "430 mil",
        image: "https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=800&q=80",
        youtube: "https://www.youtube.com/results?search_query=melhores+ralis+volei",
        videoId: "ScMzIvxBSi4"
    }
];

// Recupera os dados salvos no navegador.
function loadList(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

let favorites = loadList("sportvision-favorites");
let history = loadList("sportvision-history");

let currentPage = "inicio";
let currentSport = "";
let searchTerm = "";

const grid = document.getElementById("video-grid");
const title = document.getElementById("videos-title");
const count = document.getElementById("video-count");
const emptyMessage = document.getElementById("empty-message");

function saveData() {
    localStorage.setItem(
        "sportvision-favorites",
        JSON.stringify(favorites)
    );

    localStorage.setItem(
        "sportvision-history",
        JSON.stringify(history)
    );
}

function getVisibleVideos() {
    let result = [...videos];

    if (currentPage === "favoritos") {
        result = result.filter(video => favorites.includes(video.id));
    }

    if (currentPage === "historico") {
        result = history
            .map(id => videos.find(video => video.id === id))
            .filter(Boolean);
    }

    if (currentPage === "explorar") {
        result.reverse();
    }

    if (currentSport) {
        result = result.filter(video => video.sport === currentSport);
    }

    if (searchTerm) {
        result = result.filter(video => {
            const text = (
                video.title + " " + video.sport
            ).toLocaleLowerCase("pt-BR");

            return text.includes(searchTerm);
        });
    }

    return result;
}

function renderVideos() {
    const visibleVideos = getVisibleVideos();

    const titles = {
        inicio: "Vídeos em alta",
        explorar: "Explorar esportes",
        favoritos: "Seus favoritos",
        historico: "Vídeos assistidos"
    };

    title.textContent = currentSport
        ? `Vídeos de ${currentSport}`
        : titles[currentPage] || "Vídeos em alta";

    count.textContent = `${visibleVideos.length} vídeos`;

    emptyMessage.hidden = visibleVideos.length !== 0;

    grid.replaceChildren();

    visibleVideos.forEach(video => {
        const card = document.createElement("article");
        card.className = "video-card";

        const thumbnail = document.createElement("div");
        thumbnail.className = "thumbnail";
        thumbnail.tabIndex = 0;
        thumbnail.setAttribute("role", "button");
        thumbnail.setAttribute("aria-label", `Assistir ${video.title}`);

        const img = document.createElement("img");
        img.src = video.image;
        img.alt = video.title;
        img.loading = "lazy";

        const duration = document.createElement("span");
        duration.className = "duration";
        duration.textContent = video.duration;

        thumbnail.append(img, duration);

        thumbnail.addEventListener("click", () => openVideo(video.id));
        thumbnail.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openVideo(video.id);
            }
        });

        const info = document.createElement("div");
        info.className = "video-info";

        const text = document.createElement("div");
        text.className = "video-text";

        const videoTitle = document.createElement("p");
        videoTitle.className = "video-title";
        videoTitle.textContent = video.title;

        const meta = document.createElement("p");
        meta.className = "video-meta";
        meta.textContent = `${video.sport} • ${video.views} visualizações`;

        text.append(videoTitle, meta);

        const actions = document.createElement("div");
        actions.className = "video-actions";

        const favoriteButton = document.createElement("button");
        favoriteButton.className = "icon-btn";
        favoriteButton.classList.toggle(
            "favorite",
            favorites.includes(video.id)
        );

        favoriteButton.textContent =
            favorites.includes(video.id) ? "♥" : "♡";

        favoriteButton.title = "Adicionar ou remover dos favoritos";
        favoriteButton.setAttribute(
            "aria-label",
            `Favoritar ${video.title}`
        );

        favoriteButton.addEventListener("click", () => {
            toggleFavorite(video.id);
        });

        actions.append(favoriteButton);
        info.append(text, actions);
        card.append(thumbnail, info);
        grid.append(card);
    });
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
    } else {
        favorites.unshift(id);
    }

    saveData();
    renderVideos();
}

function openVideo(id) {
    const video = videos.find(item => item.id === id);
    if (!video) return;

    history = [
        id,
        ...history.filter(item => item !== id)
    ].slice(0, 50);

    saveData();
    renderVideos();

    document.getElementById("dialog-title").textContent = video.title;
    document.getElementById("dialog-description").textContent =
        `Modalidade: ${video.sport} • ${video.views} visualizações`;

    document.getElementById("youtube-link").href = video.youtube;

    const player = document.getElementById("player-container");
    player.replaceChildren();

    // Vídeos incorporados dependem de IDs válidos e permissão
    // do canal. Se o vídeo não puder ser incorporado, use o link.
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${video.videoId}`;
    iframe.title = video.title;
    iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";

    player.append(iframe);

    document.getElementById("video-dialog").showModal();
}

function selectPage(page) {
    currentPage = page;
    currentSport = "";

    document.querySelectorAll(".nav-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === page
        );
    });

    renderVideos();
}

function selectSport(sport) {
    currentPage = "explorar";
    currentSport = sport;

    document.querySelectorAll(".nav-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.sport === sport
        );
    });

    renderVideos();
}

document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => {
        selectPage(button.dataset.page);
    });
});

document.querySelectorAll("[data-sport]").forEach(button => {
    button.addEventListener("click", () => {
        selectSport(button.dataset.sport);
    });
});

document.getElementById("search").addEventListener("input", event => {
    searchTerm = event.target.value
        .trim()
        .toLocaleLowerCase("pt-BR");

    renderVideos();
});

document.getElementById("all-categories").addEventListener("click", () => {
    selectPage("explorar");
    document.getElementById("categories-section").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("watch-featured").addEventListener("click", () => {
    openVideo(1);
});

document.getElementById("see-highlights").addEventListener("click", () => {
    selectPage("explorar");
    document.querySelector(".section").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("mobile-menu").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.toggle("open");
});

document.getElementById("close-dialog").addEventListener("click", () => {
    document.getElementById("video-dialog").close();
});

document.getElementById("video-dialog").addEventListener("close", () => {
    document.getElementById("player-container").replaceChildren();
});

document.getElementById("profile").addEventListener("click", () => {
    document.getElementById("profile-dialog").showModal();
});

document.getElementById("close-profile").addEventListener("click", () => {
    document.getElementById("profile-dialog").close();
});

document.getElementById("clear-history").addEventListener("click", () => {
    history = [];
    saveData();
    renderVideos();
    document.getElementById("profile-dialog").close();
});

// Inicia o site.
renderVideos();
