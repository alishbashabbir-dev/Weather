document.querySelector("#btn").addEventListener("click", () => {
    const cityName = document.querySelector("#city").value;
    const resultDiv = document.querySelector("#result");

    fetch(`/weather?city=${cityName}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                resultDiv.innerHTML = `<p style="color: red;">${data.error}</p>`;
            } else {
                resultDiv.innerHTML = `
                    <p><strong><bold>City:</bold></strong> ${data.city}</p>
                    <p><strong><bold>Temperature:</bold></strong> ${data.temperature}°C</p>
                    <p><strong><bold>Description:</bold></strong> ${data.description}</p>
                    <p><strong><bold>Humidity:</bold></strong> ${data.humidity}%</p>
                    <button type="button" id="favs">Add To Favourites</button>
                `;

                document.querySelector("#favs").addEventListener("click", () => {
                    if (!cityName) {
                        resultDiv.innerHTML = `<p style="color: red;">Please enter a city name</p>`;
                        return;
                    } else {
                        fetch(`/addToFavorite?city=${cityName}`)
                            .then(response => {
                                alert(`${cityName} Added To Favourites Successfully`);
                            })
                            .catch(error => {
                                console.error("Error adding to favorites:", error);
                                alert("Failed to add to favorites");
                            });
                    }
                });
            }
        })
        .catch(err => {
            resultDiv.innerHTML = `<p style="color: red;">An error occurred... ${err.message}</p>`;
        });
});

document.querySelector("#favCities").addEventListener("click", () => {
    window.location.href = "Favs.html";
});
