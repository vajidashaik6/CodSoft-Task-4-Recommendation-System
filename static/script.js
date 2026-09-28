async function getRecommendations() {

    const movieSelect = document.getElementById("movieSelect");
    const selectedMovie = movieSelect.value;

    const loading = document.getElementById("loading");
    const resultsSection = document.getElementById("resultsSection");
    const recommendations = document.getElementById("recommendations");
    const errorMessage = document.getElementById("errorMessage");
    const button = document.getElementById("recommendBtn");

    // Reset previous results
    resultsSection.classList.add("hidden");
    errorMessage.classList.add("hidden");
    recommendations.innerHTML = "";

    // Check selection
    if (!selectedMovie) {

        errorMessage.textContent =
            "Please select a movie first.";

        errorMessage.classList.remove("hidden");

        return;
    }

    // Show loading
    loading.classList.remove("hidden");
    button.disabled = true;
    button.innerHTML = "Finding...";

    try {

        const response = await fetch("/recommend", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                movie: selectedMovie
            })

        });

        const data = await response.json();

        // Hide loading
        loading.classList.add("hidden");
        button.disabled = false;
        button.innerHTML = "<span>✨</span> Recommend";

        // Handle error
        if (!data.success) {

            errorMessage.textContent =
                data.message || "Something went wrong.";

            errorMessage.classList.remove("hidden");

            return;
        }

        // Display recommendations
        data.recommendations.forEach((movie, index) => {

            const card = document.createElement("div");

            card.className = "movie-card";

          card.innerHTML = `
    <div class="movie-number">
        #${index + 1} RECOMMENDATION
    </div>

    <h3>${movie.title}</h3>

    <div class="genre">
        ${movie.genre.replaceAll("|", " • ")}
    </div>

    <p class="description">
        ${movie.description}
    </p>

    <div class="movie-meta">
        <div class="rating">
            ⭐ ${movie.rating}
        </div>

        <div class="match-score">
            🤖 ${movie.score}% Match
        </div>
    </div>

    <div class="recommendation-reason">
        🧠 <strong>Why recommended?</strong>
        <p>${movie.reason}</p>
    </div>
`;
            recommendations.appendChild(card);

        });

        // Show results
        resultsSection.classList.remove("hidden");

        // Smooth scroll
        resultsSection.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        loading.classList.add("hidden");

        button.disabled = false;
        button.innerHTML = "<span>✨</span> Recommend";

        errorMessage.textContent =
            "Unable to connect to the recommendation server.";

        errorMessage.classList.remove("hidden");

        console.error(error);
    }
}
function filterMovies() {
    const searchInput = document.getElementById("movieSearch");
    const movieSelect = document.getElementById("movieSelect");

    const searchText = searchInput.value.toLowerCase();

    for (let option of movieSelect.options) {
        const movieName = option.text.toLowerCase();

        if (movieName.includes(searchText) || option.value === "") {
            option.style.display = "";
        } else {
            option.style.display = "none";
        }
    }
}