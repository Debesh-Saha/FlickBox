const apiKey = "5a4f9451";
const baseURL = "https://www.omdbapi.com/";

let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");
let container = document.querySelector(".container");

// Movie category elements
let trendingContainer = document.getElementById("trending");
let actionContainer = document.getElementById("action");
let comedyContainer = document.getElementById("comedy");
let horrorContainer = document.getElementById("horror");

// Initially hide the search result container
container.style.display = "none";

// Function to fetch and display movie details
let getMovie = (movieName) => {
    let movieTitle = movieName || movieNameRef.value.trim();
    if (movieTitle.length === 0) {
        container.style.display = "none";
        return;
    }

    let url = `${baseURL}?t=${movieTitle}&apikey=${apiKey}`;

    fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
            if (data.Response == "True") {
                result.innerHTML = `
                    <button id="close-btn">&times;</button>
                    <div class="info">
                        <img src="${data.Poster}" class="poster">
                        <div>
                            <h2>${data.Title}</h2>
                            <div class="rating">
                                <img src="/IMAGES/star.svg" alt="">
                                <h4>${data.imdbRating}</h4>
                            </div>
                            <div class="details">
                                <span>${data.Rated}</span>
                                <span>${data.Year}</span>
                                <span>${data.Runtime}</span>
                            </div>
                            <div class="genre">
                                <div>${data.Genre.split(",").join("</div><div>")}</div>
                            </div>
                        </div>
                    </div>
                    <h3>Plot:</h3>
                    <p>${data.Plot}</p>
                    <h3>Cast:</h3>
                    <p>${data.Actors}</p> 
                `;

                container.style.display = "block";

                document.getElementById("close-btn").addEventListener("click", () => {
                    container.style.display = "none";
                });
            } else {
                container.style.display = "none";
            }
        })
        .catch(() => {
            container.style.display = "none";
        });
};

// Function to fetch multiple movies for a category
let fetchMoviesByCategory = (searchTerms, container) => {
    container.innerHTML = ""; // Clear previous results

    searchTerms.forEach(movieTitle => {
        let url = `${baseURL}?t=${movieTitle}&apikey=${apiKey}`;

        fetch(url)
            .then(resp => resp.json())
            .then(data => {
                if (data.Response == "True") {
                    let movieCard = document.createElement("div");
                    movieCard.classList.add("movie-card");
                    movieCard.innerHTML = `
                        <img src="${data.Poster}" alt="${data.Title}" class="movie-poster">
                    `;
                    movieCard.addEventListener("click", () => getMovie(data.Title)); 
                    container.appendChild(movieCard);
                }
            })
            .catch(error => console.error("Error fetching movies:", error));
    });
};

// Fetch movie categories
let trendingMovies = [
    "Interstellar", "Inception", "The Dark Knight", "Avengers", "Joker",
    "Oppenheimer", "Parasite", "The Wolf of Wall Street", "The Revenant", "Whiplash"
];
let actionMovies = [
    "Mad Max", "John Wick", "Gladiator", "Die Hard", "The Matrix",
    "Black Panther", "Terminator 2: Judgment Day", "Kill Bill", "The Equalizer", "Mission Impossible"
];
let comedyMovies = [
    "The Hangover", "Superbad", "Step Brothers", "Dumb and Dumber", "Ted",
    "21 Jump Street", "Mean Girls", "Zombieland", "Kung Fu Hustle", "The Dictator"
];
let horrorMovies = [
    "The Conjuring", "It", "A Nightmare on Elm Street", "Halloween", "The Ring",
    "Insidious", "Sinister", "Hereditary", "The Exorcist", "A Quiet Place"
];

fetchMoviesByCategory(trendingMovies, trendingContainer);
fetchMoviesByCategory(actionMovies, actionContainer);
fetchMoviesByCategory(comedyMovies, comedyContainer);
fetchMoviesByCategory(horrorMovies, horrorContainer);

// Event listener for search button
searchBtn.addEventListener("click", () => getMovie());

// Light and Dark Mode
let lightmode = localStorage.getItem("lightmode");
const themeSwitch = document.getElementById("theme-switch");

const enableLightmode = () => {
    document.body.classList.add("lightmode");
    localStorage.setItem("lightmode", "active");
};

const disableLightmode = () => {
    document.body.classList.remove("lightmode");
    localStorage.setItem("lightmode", null);
};

if (lightmode === "active") {
    enableLightmode();
}

themeSwitch.addEventListener("click", () => {
    lightmode = localStorage.getItem("lightmode");
    if (lightmode !== "active") {
        enableLightmode();
    } else {
        disableLightmode();
    }
});

/* ======= Carousel ======= */
let items = document.querySelectorAll('.slider .list .item, .slider .list .item_active');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let thumbnails = document.querySelectorAll('.thumbnail .item, .thumbnail .item_active');

let countItem = items.length;
let itemActive = 0;

// Auto slider interval
let refreshInterval;

// Function to show slider
function showSlider() {
    let itemActiveOld = document.querySelector('.slider .list .item.active, .slider .list .item_active.active');
    let thumbnailActiveOld = document.querySelector('.thumbnail .item.active, .thumbnail .item_active.active');

    if (itemActiveOld) itemActiveOld.classList.remove('active');
    if (thumbnailActiveOld) thumbnailActiveOld.classList.remove('active');

    items[itemActive].classList.add('active');
    thumbnails[itemActive].classList.add('active');

    setPositionThumbnail();
    handleTrailerButtons();

    clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
        next.click();
    }, 5000);
}

function setPositionThumbnail() {
    let thumbnailActive = document.querySelector('.thumbnail .item.active, .thumbnail .item_active.active');
    if (thumbnailActive) {
        let rect = thumbnailActive.getBoundingClientRect();
        if (rect.left < 0 || rect.right > window.innerWidth) {
            thumbnailActive.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
        }
    }
}

// Next click
next.onclick = function() {
    itemActive = (itemActive + 1) % countItem;
    showSlider();
};

// Prev click
prev.onclick = function() {
    itemActive = (itemActive - 1 + countItem) % countItem;
    showSlider();
};

// Click thumbnail
thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener('click', () => {
        itemActive = index;
        showSlider();
    });
});

// Initial run
showSlider();

// Handle trailer button click
function handleTrailerButtons() {
    // Remove previous event listeners
    document.querySelectorAll('.watch').forEach(btn => {
        btn.onclick = null;
    });

    // Add listener only to the active item
    let activeItem = items[itemActive];
    let trailerBtn = activeItem.querySelector('.watch');
    if (trailerBtn) {
        trailerBtn.onclick = () => {
            const link = trailerBtn.getAttribute('data-link');
            if (link) window.open(link, '_blank');
        };
    }
}