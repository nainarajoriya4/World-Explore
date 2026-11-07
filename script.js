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
    renderCards(allCountries);
  } catch (error) {
    console.error("Error loading countries:", error);
    showError();
  }
}
