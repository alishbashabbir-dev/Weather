document.querySelector("#btn").addEventListener("click", () => {
  const cityName = document.querySelector("#city").value;
  const resultDiv = document.querySelector("#result");

  if (!cityName) {
      resultDiv.innerHTML = `<p style="color: red;">Please enter a city name</p>`;
      return;
  }

  fetch(`/weather?city=${cityName}`)
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              resultDiv.innerHTML = `<p style="color: red;">${data.error}</p>`;
          } else {
              resultDiv.innerHTML = `
                  <p><strong>City:</strong> ${data.city}</p>
                  <p><strong>Temperature:</strong> ${data.temperature}°C</p>
                  <p><strong>Description:</strong> ${data.description}</p>
                  <p><strong>Humidity:</strong> ${data.humidity}%</p>
              `;
          }
      })
      .catch(err => {
          resultDiv.innerHTML = `<p style="color: red;">An error occurred while fetching the data</p>`;
      });
});
