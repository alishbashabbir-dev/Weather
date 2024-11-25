const favCityList = document.querySelector("#favCities"); // Button for Favorites
const favoritesContainer = document.querySelector("#favoritesContainer"); // Div for displaying favorite cities


window.onload = () => {
    const favoritesContainer = document.querySelector("#favoritesList");

    fetch("/favorites")
        .then(response => response.json())
        .then(favCities => {
            if (favCities.error) {
                favoritesContainer.innerHTML = `<p style="color: red;">Failed to fetch favorite cities.</p>`;
                return;
            }
            if (favCities.length === 0) {
                favoritesContainer.innerHTML = `<p style="text-align: center;">No favorite cities found.</p>`;
            } else {
                favCities.forEach(city => {
                    const cityCard = document.createElement("div");
                    cityCard.classList.add("fav_city");
                    cityCard.innerHTML = `
                        <p><strong>City:</strong> ${city.city}</p>
                        <p><strong>Temperature:</strong> ${city.temperature}°C</p>
                        <p><strong>Description:</strong> ${city.description}</p>
                        <p><strong>Humidity:</strong> ${city.humidity}%</p>
                    `;
                    favoritesContainer.appendChild(cityCard);
                });
            }
        })
        .catch(error => {
            favoritesContainer.innerHTML = `<p style="color: red;">An error occurred while fetching favorite cities: ${error.message}</p>`;
        });
};

 