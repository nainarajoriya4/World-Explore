const API_URL =
  "https://countries.dev/countries?fields=name,capital,region,population,flags";

// DOM Selectors
const container = document.querySelector("#countryContainer");
const searchInput = document.querySelector("#searchInput");
const regionFilter = document.querySelector("#regionFilter");
const searchButton = document.querySelector("#searchBtn");
const sortFilter = document.querySelector("#sortFilter");
const favoritesFilter = document.querySelector("#favoritesFilter");
const totalCountries = document.querySelector("#totalCountries");
const showingCountries = document.querySelector("#showingCountries");
const favoriteCount = document.querySelector("#favoriteCount");

// State
let allCountries = [];
let favoriteCountries = [];
let selectedCountries = [];

try {
  favoriteCountries = JSON.parse(
    localStorage.getItem("favoriteCountries")
  ) || [];
} catch {
  favoriteCountries = [];
}

// Population Formatter
function formatPopulation(num) {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + " B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + " M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(0) + " K";
  }
  return String(num);
}

// API Error Display
function showError() {
  container.innerHTML =
    '<p class="empty-message">Unable to load countries. Please try again.</p>';

  const retryBtn = document.createElement("button");
  retryBtn.type = "button";
  retryBtn.className = "retry-btn";
  retryBtn.textContent = "Retry";
  retryBtn.addEventListener("click", fetchCountries);
  container.appendChild(retryBtn);
}

// Fetch Countries from API
async function fetchCountries() {
  container.innerHTML = `
    <div class="loading-card"></div>
    <div class="loading-card"></div>
    <div class="loading-card"></div>
  `;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }

    const data = await response.json();
    allCountries = data.map((country) => {
      const name = typeof country.name === 'object' ? (country.name.common || country.name.official || 'Unknown') : (country.name || 'Unknown');
      const capital = Array.isArray(country.capital) ? (country.capital[0] || 'N/A') : (country.capital || 'N/A');
      const flag = country.flags?.svg || country.flags?.png || country.flag || '';
      const rawPop = Number(country.population) || 0;
      return {
        name: name,
        capital: capital,
        region: country.region || 'Unknown',
        flag: flag,
        population: formatPopulation(rawPop),
        rawPopulation: rawPop
      };
    });

    allCountries.sort((a, b) => a.name.localeCompare(b.name));
    filterCountries();
  } catch (error) {
    console.error("Error loading countries:", error);
    showError();
  }
}

// Dashboard Statistics Update
function updateStatistics(filteredCountries) {
  totalCountries.textContent = allCountries.length;
  showingCountries.textContent = filteredCountries.length;
  favoriteCount.textContent = favoriteCountries.length;
}

// Country Cards Generator
function renderCards(countries) {
  container.innerHTML = "";
  updateStatistics(countries);

  if (countries.length === 0) {
    container.innerHTML =
      '<p class="empty-message">No countries found. Try a different search!</p>';
    return;
  }

  countries.forEach((country) => {
    const card = document.createElement("div");
    card.className = "country-card";
    card.innerHTML = `
      <img class="country-flag" src="${country.flag}" alt="Flag of ${country.name}" loading="lazy">
      <div class="card-info">
        <h2>${country.name}</h2>
        <p><span>Capital:</span> ${country.capital}</p>
        <p><span>Region:</span> ${country.region}</p>
        <p><span>Population:</span> ${country.population}</p>
      </div>
    `;

    container.appendChild(card);
  });
}



// Search and Filter Function
function filterCountries() {
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedRegion = regionFilter.value;
  const selectedFavorite = favoritesFilter.value;

  const result = allCountries.filter((country) => {
    const matchesSearch =
      country.name.toLowerCase().includes(searchText) ||
      country.capital.toLowerCase().includes(searchText);

    const matchesRegion =
      selectedRegion === "all" || country.region === selectedRegion;

    const matchesFavorite =
      selectedFavorite !== "favorites" ||
      favoriteCountries.includes(country.name);

    return matchesSearch && matchesRegion && matchesFavorite;
  });

  renderCards(sortCountries(result));
}

// Event Listeners for Search & Filter
searchButton.addEventListener("click", filterCountries);
searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    filterCountries();
  }
});
regionFilter.addEventListener("change", filterCountries);
favoritesFilter.addEventListener("change", filterCountries);



// Sorting Function
function sortCountries(countries) {
  const sorted = [...countries];

  if (sortFilter.value === "az") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortFilter.value === "za") {
    sorted.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortFilter.value === "populationHigh") {
    sorted.sort((a, b) => b.rawPopulation - a.rawPopulation);
  } else if (sortFilter.value === "populationLow") {
    sorted.sort((a, b) => a.rawPopulation - b.rawPopulation);
  }

  return sorted;
}

sortFilter.addEventListener("change", filterCountries);

fetchCountries();
