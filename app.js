document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const resultsContainer = document.getElementById("results");


  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;


    resultsContainer.innerHTML = "<p>Loading...</p>";

    try {

      const res = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
          query
        )}&limit=12`
      );
      const json = await res.json();


      displayResults(json.data);
    } catch (error) {
      console.error(error);
      resultsContainer.innerHTML =
        "<p>Something went wrong. Please try again later.</p>";
    }
  });


  function displayResults(animeList) {
    resultsContainer.innerHTML = "";


    if (animeList.length === 0) {
      resultsContainer.innerHTML = "<p>No anime found for that query.</p>";
      return;
    }

    animeList.forEach((anime) => {

      const card = document.createElement("div");
      card.className = "card";


      card.innerHTML = `
        <img src="${anime.images.jpg.image_url}" alt="${anime.title} poster">
        <h3>${anime.title}</h3>
        <p>Episodes: ${anime.episodes || "N/A"}</p>
        <p>Score&nbsp;&nbsp;&nbsp;: ${anime.score || "N/A"}</p>
        <button class="like-btn">♡ Like</button>
      `;


      const likeBtn = card.querySelector(".like-btn");


      likeBtn.addEventListener("click", () => {
        likeBtn.classList.toggle("liked");
        likeBtn.textContent = likeBtn.classList.contains("liked")
          ? "♥ Liked"
          : "♡ Like";
      });


      resultsContainer.appendChild(card);
    });
  }
});
