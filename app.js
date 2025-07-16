// Wait for the DOM to finish loading so elements exist
document.addEventListener("DOMContentLoaded", () => {
  // ===== Grab important DOM nodes =====
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const resultsContainer = document.getElementById("results");

  /* =========================================================================
     EVENT LISTENER #1: Handle Search Form Submit
     -------------------------------------------------------------------------
     - Prevents default reload
     - Fetches data from Jikan API for the search query
     - Hands data off to displayResults()
  ========================================================================= */
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // SPA: no page refresh

    const query = input.value.trim(); // Remove accidental whitespace
    if (!query) return;               // Guard clause for empty string

    // Show a quick loading message while fetch runs
    resultsContainer.innerHTML = "<p>Loading...</p>";

    try {
      /* ---------------------------------------------------------------
         Fetch up to 12 anime that match the search term.
         Jikan v4 returns JSON with a 'data' array property.
      ---------------------------------------------------------------- */
      const res = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
          query
        )}&limit=12`
      );
      const json = await res.json();

      // Pass only the array of anime objects
      displayResults(json.data);
    } catch (error) {
      console.error(error);
      resultsContainer.innerHTML =
        "<p>Something went wrong. Please try again later.</p>";
    }
  });

  /* =========================================================================
     Helper Function: displayResults(animeList)
     -------------------------------------------------------------------------
     - Clears previous content
     - For each anime, creates a card with info and a like button
     - Adds EVENT LISTENER #2 on each Like button
     - Uses Array.prototype.forEach (iteration requirement)
  ========================================================================= */
  function displayResults(animeList) {
    resultsContainer.innerHTML = ""; // Clear previous results

    // If API returns no matches, inform the user
    if (animeList.length === 0) {
      resultsContainer.innerHTML = "<p>No anime found for that query.</p>";
      return;
    }

    animeList.forEach((anime) => {
      // ===== Build Card =====
      const card = document.createElement("div");
      card.className = "card";

      // Use template literals for readable HTML injection
      card.innerHTML = `
        <img src="${anime.images.jpg.image_url}" alt="${anime.title} poster">
        <h3>${anime.title}</h3>
        <p>Episodes: ${anime.episodes || "N/A"}</p>
        <p>Score&nbsp;&nbsp;&nbsp;: ${anime.score || "N/A"}</p>
        <button class="like-btn">♡ Like</button>
      `;

      // ===== Grab the like button we just created =====
      const likeBtn = card.querySelector(".like-btn");

      /* ---------------------------------------------------------------
         EVENT LISTENER #2: Like Button Toggle
         - Toggles a 'liked' class
         - Changes button text/content accordingly
      ---------------------------------------------------------------- */
      likeBtn.addEventListener("click", () => {
        likeBtn.classList.toggle("liked");
        likeBtn.textContent = likeBtn.classList.contains("liked")
          ? "♥ Liked"
          : "♡ Like";
      });

      // Finally, append card to the results grid
      resultsContainer.appendChild(card);
    });
  }
});
