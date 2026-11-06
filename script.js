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
