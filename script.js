const API_URL =
  "https://countries.dev/countries?fields=name,capital,region,population,flags";

// Country cards dikhane wala container
const container = document.querySelector("#countryContainer");

// Search box
const searchInput = document.querySelector("#searchInput");

// Region dropdown
const regionFilter = document.querySelector("#regionFilter");

// Search button
const searchButton = document.querySelector("#searchBtn");

// Sorting dropdown
const sortFilter = document.querySelector("#sortFilter");

// Favorites dropdown
const favoritesFilter = document.querySelector("#favoritesFilter");

// Country details popup
const countryModal = document.querySelector("#countryModal");

// Popup ke andar details dikhane wala element
const modalDetails = document.querySelector("#modalDetails");

// Popup close button
const closeModal = document.querySelector("#closeModal");

// Dashboard Statistics
const totalCountries = document.querySelector("#totalCountries");
const showingCountries = document.querySelector("#showingCountries");
const favoriteCount = document.querySelector("#favoriteCount");

const comparisonContainer = document.querySelector("#comparisonContainer");

let allCountries = [];

// User ke favorite countries
let favoriteCountries = [];

// Comparison ke liye selected countries
let selectedCountries = [];
// 4. Browser se Purane Favorites Load Karna

// localStorage browser mein data save rakhta hai.
// Page refresh hone ke baad bhi favorites safe rahenge.

// JSON.parse saved text ko JavaScript array mein convert karta hai.

try {
  favoriteCountries = JSON.parse(
    localStorage.getItem("favoriteCountries")
  ) || [];

} catch {
  favoriteCountries = [];
}
// 5. Population Format Karna

// Population ko readable format mein convert karna.
// Example: 1000000 = 1.0 M

function formatPopulation(num) {

  // 1 Billion ya usse zyada population
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + " B";
  }

  // 1 Million ya usse zyada population
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + " M";
  }

  // 1 Thousand ya usse zyada population
  if (num >= 1_000) {
    return (num / 1_000).toFixed(0) + " K";
  }

  // Chhoti population ko string mein convert karna
  return String(num);
}


// 6. Dashboard Statistics Update Karna

// Total countries, showing countries aur favorites ki count.

function updateStatistics(filteredCountries) {

  // API se aaye total countries
  totalCountries.textContent = allCountries.length;

  // Filter ke baad screen par dikhne wale countries
  showingCountries.textContent = filteredCountries.length;

  // Total favorite countries
  favoriteCount.textContent = favoriteCountries.length;
}


// 7. Country Cards Banana

function renderCards(countries) {

  // Purane cards remove karna
  container.innerHTML = "";

  // Statistics update karna
  updateStatistics(countries);

  // Comparison section update karna
  updateComparison();


  // Agar koi country nahi mili
  if (countries.length === 0) {

    container.innerHTML =
      '<p class="empty-message">No countries found. Try a different search!</p>';

    return;
  }


  // Har country ke liye alag card banana
  countries.forEach((country) => {

    // Naya div create karna
    const card = document.createElement("div");

    // Card ko CSS class dena
    card.className = "country-card";


    // Card ke andar flag aur country details add karna
    card.innerHTML = `
      <img class="country-flag" src="${country.flag}" alt="Flag of ${country.name}" loading="lazy">

      <div class="card-info">
        <h2>${country.name}</h2>
        <p><span>Capital:</span> ${country.capital}</p>
        <p><span>Region:</span> ${country.region}</p>
        <p><span>Population:</span> ${country.population}</p>
      </div>
    `;


    // 7A. Favorite Button Banana

    const favoriteBtn = document.createElement("button");

    // Button ka type
    favoriteBtn.type = "button";

    // CSS class
    favoriteBtn.className = "favorite-btn";

    // Button ke saath country ka naam attach karna
    favoriteBtn.dataset.name = country.name;


    // Agar country already favorite hai
    if (favoriteCountries.includes(country.name)) {

      favoriteBtn.textContent = "❤️ Remove Favorite";

    } else {

      // Agar favorite nahi hai
      favoriteBtn.textContent = "🤍 Add Favorite";
    }


    // 7B. Details Button Banana

    const detailsBtn = document.createElement("button");

    detailsBtn.type = "button";

    detailsBtn.className = "details-btn";

    detailsBtn.dataset.name = country.name;

    detailsBtn.textContent = "View Details";


    // 7C. Compare Button Banana

    const compareBtn = document.createElement("button");

    compareBtn.type = "button";

    compareBtn.className = "compare-btn";

    compareBtn.dataset.name = country.name;


    // Check karna ki country already comparison mein hai ya nahi
    if (selectedCountries.includes(country.name)) {

      compareBtn.textContent = "Remove from Compare";

    } else {

      compareBtn.textContent = "Add to Compare";
    }


    // Teeno buttons ko card mein add karna
    card.append(favoriteBtn, detailsBtn, compareBtn);


    // Complete card ko webpage par dikhana
    container.appendChild(card);

  });
}


// 8. Countries ko Sort Karna

function sortCountries(countries) {

  // Original array ki copy banana
  const sorted = [...countries];


  // A-Z Sorting
  if (sortFilter.value === "az") {

    sorted.sort((a, b) => a.name.localeCompare(b.name));


    // Z-A Sorting
  } else if (sortFilter.value === "za") {

    sorted.sort((a, b) => b.name.localeCompare(a.name));


    // Population High to Low
  } else if (sortFilter.value === "populationHigh") {

    sorted.sort((a, b) => b.rawPopulation - a.rawPopulation);


    // Population Low to High
  } else if (sortFilter.value === "populationLow") {

    sorted.sort((a, b) => a.rawPopulation - b.rawPopulation);
  }

  // Sorted array return karna
  return sorted;
}
// 9. Search, Region aur Favorites Filter

function filterCountries() {

  // Search box ka text lena
  // trim() extra spaces remove karta hai
  // toLowerCase() text ko lowercase karta hai
  const searchText = searchInput.value.trim().toLowerCase();

  // Selected region lena
  const selectedRegion = regionFilter.value;

  // Selected favorites option lena
  const selectedFavorite = favoritesFilter.value;

  // Countries ko filter karna
  const result = allCountries.filter((country) => {

    // Country name ya capital mein search text check karna
    const matchesSearch =
      country.name.toLowerCase().includes(searchText) ||
      country.capital.toLowerCase().includes(searchText);


    // Region match karna
    const matchesRegion =
      selectedRegion === "all" || country.region === selectedRegion;


    // Favorites match karna
    const matchesFavorite =
      selectedFavorite !== "favorites" ||
      favoriteCountries.includes(country.name);


    // Teeno conditions true honi chahiye
    return matchesSearch && matchesRegion && matchesFavorite;

  });


  // Filtered countries ko sort karke cards mein dikhana
  renderCards(sortCountries(result));
}


// 10. Favorite Add / Remove Karna

function toggleFavorite(countryName) {

  // Check karna country already favorite hai ya nahi
  if (favoriteCountries.includes(countryName)) {

    // Agar favorite hai to remove karna
    favoriteCountries = favoriteCountries.filter((name) => name !== countryName);

  } else {

    // Agar favorite nahi hai to add karna
    favoriteCountries.push(countryName);
  }


  // Updated favorites ko browser mein save karna
  // JSON.stringify array ko text mein convert karta hai

  localStorage.setItem("favoriteCountries", JSON.stringify(favoriteCountries));


  // Cards aur statistics refresh karna
  filterCountries();
}


// 11. Country Details Popup Dikhana

function showCountryDetails(countryName) {

  // Selected country ko allCountries array mein find karna
  const selectedCountry = allCountries.find(
    (country) => country.name === countryName
  );


  // Agar country nahi mili to function stop
  if (!selectedCountry) return;


  // Popup ke andar country ki details add karna
  modalDetails.innerHTML = `
    <div class="modal-details">

      <img
        src="${selectedCountry.flag}"
        class="modal-flag"
        alt="Flag of ${selectedCountry.name}"
      >

      <h2>${selectedCountry.name}</h2>

      <p><strong>Capital:</strong> ${selectedCountry.capital}</p>

      <p><strong>Region:</strong> ${selectedCountry.region}</p>

      <p><strong>Population:</strong> ${selectedCountry.population}</p>

    </div>
  `;


  // Popup ko visible karna
  countryModal.style.display = "flex";
}


// 12. Day 11: Country Comparison Add / Remove

function toggleCompare(countryName) {


  // Check karna country already selected hai ya nahi
  if (selectedCountries.includes(countryName)) {


    // Already selected hai to remove karna
    selectedCountries = selectedCountries.filter((name) => {
      return name !== countryName;
    });


  } else {


    // Maximum 2 countries compare kar sakte hain
    if (selectedCountries.length === 2) {

      alert("You can compare only 2 countries!");

      return;
    }


    // Selected countries mein naya country add karna
    selectedCountries.push(countryName);

  }


  // Cards aur comparison table refresh karna
  filterCountries();
}


// 13. Comparison Table Update Karna

function updateComparison() {


  // Selected countries ka complete data find karna
  const comparisonData = allCountries.filter((country) => {
    return selectedCountries.includes(country.name);
  });


  // Agar koi country selected nahi hai
  if (comparisonData.length === 0) {

    comparisonContainer.innerHTML = "";

    return;
  }


  // Remove buttons ka HTML store karne ke liye variable
  let selectedNamesHTML = "";


  // Har selected country ke liye Remove button banana
  comparisonData.forEach((country) => {

    selectedNamesHTML += `
      <button
        type="button"
        class="remove-compare-btn"
        data-name="${country.name}"
      >
        Remove ${country.name}
      </button>
    `;

  });


  // Comparison box ka starting HTML
  let comparisonHTML = `
    <div class="comparison-box">

      <h2>Country Comparison</h2>

      <div>
        ${selectedNamesHTML}
      </div>
  `;


  // Agar sirf ek country selected hai
  if (comparisonData.length < 2) {

    comparisonHTML += `
      <p>Select one more country to compare.</p>
    `;


  } else {


    // Do countries select hone par comparison table banana
    comparisonHTML += `
      <table class="comparison-table">

        <tr>
          <th>Details</th>
          <th>${comparisonData[0].name}</th>
          <th>${comparisonData[1].name}</th>
        </tr>


        <tr>
          <td>Flag</td>

          <td>
            <img src="${comparisonData[0].flag}" width="80" alt="Country flag">
          </td>

          <td>
            <img src="${comparisonData[1].flag}" width="80" alt="Country flag">
          </td>
        </tr>


        <tr>
          <td>Capital</td>
          <td>${comparisonData[0].capital}</td>
          <td>${comparisonData[1].capital}</td>
        </tr>


        <tr>
          <td>Region</td>
          <td>${comparisonData[0].region}</td>
          <td>${comparisonData[1].region}</td>
        </tr>


        <tr>
          <td>Population</td>
          <td>${comparisonData[0].population}</td>
          <td>${comparisonData[1].population}</td>
        </tr>

      </table>
    `;
  }


  // Comparison box close karna
  comparisonHTML += `</div>`;


  // Final comparison HTML webpage par show karna
  comparisonContainer.innerHTML = comparisonHTML;
}


// 14. API Error Dikhana

function showError() {

  // User ko error message dikhana
  container.innerHTML =
    '<p class="empty-message">Unable to load countries. Please try again.</p>';


  // Retry button banana
  const retryBtn = document.createElement("button");

  retryBtn.type = "button";

  retryBtn.className = "retry-btn";

  retryBtn.textContent = "Retry";


  // Retry click hone par API dobara call karna
  retryBtn.addEventListener("click", fetchCountries);


  // Retry button ko page par add karna
  container.appendChild(retryBtn);
}


// 15. API se Countries ka Data Lana

// async ka matlab function asynchronous kaam karega.
// await API response ka wait karega.

async function fetchCountries() {


  // API load hone tak loading skeleton dikhana
  container.innerHTML = `
    <div class="loading-card"></div>
    <div class="loading-card"></div>
    <div class="loading-card"></div>
  `;


  // API request mein error aaye to catch handle karega
  try {


    // API se data request karna
    const response = await fetch(API_URL);


    // Check karna response successful hai ya nahi
    if (!response.ok) {

      throw new Error("Failed to fetch countries");

    }


    // API response ko JavaScript data mein convert karna
    const data = await response.json();


    // API data ko apne required format mein convert karna
    allCountries = data.map((country) => ({

      name: country.name,

      // Capital missing ho to N/A
      capital: country.capital || "N/A",

      // Region missing ho to Unknown
      region: country.region || "Unknown",

      // SVG flag nahi ho to PNG use karna
      flag: country.flags?.svg || country.flags?.png || "",

      // Population ko readable format mein convert karna
      population: formatPopulation(Number(country.population) || 0),

      // Sorting ke liye original numeric population rakhna
      rawPopulation: Number(country.population) || 0

    }));


    // Countries ko initially A-Z order mein arrange karna
    allCountries.sort((a, b) => a.name.localeCompare(b.name));


    // Data load hone ke baad cards show karna
    filterCountries();


  } catch (error) {


    // Developer ke liye Console mein actual error dikhana
    console.error("Error loading countries:", error);


    // User ko friendly error message dikhana
    showError();

  }
}


// 16. Event Listeners
// Event listener user ke actions par function chalata hai.


// Search button click hone par search karna
searchButton.addEventListener("click", filterCountries);


// Search box mein Enter press karne par search karna
searchInput.addEventListener("keyup", (event) => {

  if (event.key === "Enter") {

    filterCountries();

  }

});


// Region change hone par filter karna
regionFilter.addEventListener("change", filterCountries);


// Sorting change hone par sort karna
sortFilter.addEventListener("change", filterCountries);


// Favorites filter change hone par filter karna
favoritesFilter.addEventListener("change", filterCountries);


// 17. Country Card Buttons Handle Karna
// Is technique ko Event Delegation kehte hain.
// Parent container par ek listener se multiple buttons handle hote hain.

container.addEventListener("click", (event) => {


  // Click ki gayi jagah ke nearest button ko find karna
  const button = event.target.closest("button");


  // Agar click button par nahi hua to stop
  if (!button) return;


  // Favorite button click hua
  if (button.classList.contains("favorite-btn")) {

    toggleFavorite(button.dataset.name);


    // Details button click hua
  } else if (button.classList.contains("details-btn")) {

    showCountryDetails(button.dataset.name);


    // Compare button click hua
  } else if (button.classList.contains("compare-btn")) {

    toggleCompare(button.dataset.name);

  }

});


// 18. Comparison Remove Button Handle Karna

comparisonContainer.addEventListener("click", (event) => {


  // Check karna Remove button click hua hai ya nahi
  if (event.target.classList.contains("remove-compare-btn")) {


    // Button se country ka naam lena
    const countryName = event.target.dataset.name;


    // Country ko comparison se remove karna
    toggleCompare(countryName);

  }

});


// 19. Popup Close Button

closeModal.addEventListener("click", () => {

  // Popup hide karna
  countryModal.style.display = "none";

});


// 20. Popup ke Bahar Click Karne par Close Karna

countryModal.addEventListener("click", (event) => {


  // Agar click popup ke outer background par hua
  if (event.target === countryModal) {
    countryModal.style.display = "none";
  }

});

document.addEventListener("keydown", (event) => {
  // Keyboard par Escape press hone par popup hide karna
  if (event.key === "Escape") {
    countryModal.style.display = "none";
  }

});

fetchCountries();