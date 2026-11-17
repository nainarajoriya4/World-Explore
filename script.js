const API_URL ="https://countries.dev/countries?fields=name,capital,region,population,flags";

const container = document.querySelector("#countryContainer");// Country cards container
const searchInput = document.querySelector("#searchInput");//search input box
const regionFilter = document.querySelector("#regionFilter");//region dropdown
const searchButton = document.querySelector("#searchBtn");//search button
const sortFilter = document.querySelector("#sortFilter");//sort dropdown
const favoritesFilter = document.querySelector("#favoritesFilter");//favorites dropdown
const countryModal = document.querySelector("#countryModal");// Popup container
const modalDetails = document.querySelector("#modalDetails");// Popup details container
const closeModal = document.querySelector("#closeModal");// Popup close button
const totalCountries = document.querySelector("#totalCountries");// Total countries count
const showingCountries = document.querySelector("#showingCountries");// Showing countries count
const favoriteCount = document.querySelector("#favoriteCount");// Favorite countries count
const comparisonContainer = document.querySelector("#comparisonContainer");// Comparison section container

// Reusable Tailwind class strings
const BUTTON_BASE =
  "block w-full cursor-pointer rounded-xl px-4 py-3 text-[0.82rem] font-extrabold transition";

const EMPTY_MESSAGE =
  "col-span-full rounded-2xl border border-dashed border-slate-600 bg-slate-800 px-4 py-12 text-center text-slate-400";

// Screen par ek time par sirf itne cards dikhane hain
const INITIAL_COUNTRY_LIMIT = 15;

// Popup open / close (Tailwind hidden + flex)
function openModal() {
  countryModal.classList.remove("hidden");
  countryModal.classList.add("flex");
}

function hideModal() {
  countryModal.classList.add("hidden");
  countryModal.classList.remove("flex");
}

let allCountries = [];
let favoriteCountries = [];// Favorite countries ka array
let selectedCountries = [];// Comparison ke liye selected countries ka array

try {
  favoriteCountries = JSON.parse(
    localStorage.getItem("favoriteCountries")
  ) || [];// Agar localStorage mein data nahi hai to empty array use karna

} catch {
  favoriteCountries = [];
}// Agar localStorage mein data corrupt hai to empty array use karna

function formatPopulation(num) {
  if (num >= 1000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + " B";
  }// 1 Billion ya usse zyada population
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + " M";
  }// 1 Million ya usse zyada population
  if (num >= 1_000) {
    return (num / 1_000).toFixed(0) + " K";
  }// 1 Thousand ya usse zyada population
  return String(num);// 1 Thousand se kam population
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

    container.innerHTML = `<p class="${EMPTY_MESSAGE}">No countries found. Try a different search!</p>`;

    return;
  }
  // Har country ke liye alag card banana
  countries.forEach((country) => {
    // Naya div create karna
    const card = document.createElement("div");
    // Card ko Tailwind utility classes dena
    card.className =
      "overflow-hidden rounded-[1.25rem] border border-slate-700 bg-slate-800 shadow-[0_4px_18px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1 hover:border-sky-400 hover:shadow-xl";


    // Card ke andar flag aur country details add karna
    card.innerHTML = `
      <img class="block h-[180px] w-full bg-slate-900 object-cover" src="${country.flag}" alt="Flag of ${country.name}" loading="lazy">

      <div class="px-5 pb-2 pt-5">
        <h2 class="mb-4 font-display text-[1.2rem] font-extrabold tracking-tight text-slate-50">${country.name}</h2>
        <p class="my-2.5 flex justify-between gap-4 text-sm text-slate-400"><span class="font-bold text-slate-200">Capital:</span> ${country.capital}</p>
        <p class="my-2.5 flex justify-between gap-4 text-sm text-slate-400"><span class="font-bold text-slate-200">Region:</span> ${country.region}</p>
        <p class="my-2.5 flex justify-between gap-4 text-sm text-slate-400"><span class="font-bold text-slate-200">Population:</span> ${country.population}</p>
      </div>
    `;


    // 7A. Favorite Button Banana

    const favoriteBtn = document.createElement("button");

    // Button ka type
    favoriteBtn.type = "button";

    // Tailwind classes
    favoriteBtn.className = BUTTON_BASE + " bg-[#4c1d3d] text-rose-300 hover:bg-rose-900";

    // Button ke saath country ka naam aur action attach karna
    favoriteBtn.dataset.name = country.name;
    favoriteBtn.dataset.action = "favorite";


    // Agar country already favorite hai
    if (favoriteCountries.includes(country.name)) {

      favoriteBtn.innerHTML = '<span class="emoji-sm">❤️</span> Remove Favorite';

    } else {

      // Agar favorite nahi hai
      favoriteBtn.innerHTML = '<span class="emoji-sm">🤍</span> Add Favorite';
    }


    // 7B. Details Button Banana

    const detailsBtn = document.createElement("button");

    detailsBtn.type = "button";

    detailsBtn.className = BUTTON_BASE + " bg-sky-900 text-sky-300 hover:bg-sky-800";

    detailsBtn.dataset.name = country.name;
    detailsBtn.dataset.action = "details";

    detailsBtn.textContent = "View Details";


    // 7C. Compare Button Banana

    const compareBtn = document.createElement("button");

    compareBtn.type = "button";

    compareBtn.className = BUTTON_BASE + " bg-indigo-900 text-violet-300 hover:bg-indigo-700";

    compareBtn.dataset.name = country.name;
    compareBtn.dataset.action = "compare";


    // Check karna ki country already comparison mein hai ya nahi
    if (selectedCountries.includes(country.name)) {

      compareBtn.textContent = "Remove from Compare";

    } else {

      compareBtn.textContent = "Add to Compare";
    }


    // Teeno buttons ko ek wrapper mein rakh kar card mein add karna
    const cardActions = document.createElement("div");
    cardActions.className = "flex flex-col gap-2 px-5 pb-5 pt-2";
    cardActions.append(favoriteBtn, detailsBtn, compareBtn);


    card.append(cardActions);


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


  // Filtered countries ko sort karke sirf pehle 15 cards dikhana
  const visibleCountries = sortCountries(result).slice(0, INITIAL_COUNTRY_LIMIT);

  renderCards(visibleCountries);
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
    <div>

      <img
        src="${selectedCountry.flag}"
        class="mb-5 block h-[190px] w-full rounded-2xl bg-slate-900 object-contain"
        alt="Flag of ${selectedCountry.name}"
      >

      <h2 class="mb-4 mt-2 font-display text-[1.7rem] font-extrabold text-slate-50">${selectedCountry.name}</h2>

      <p class="my-3 border-b border-slate-700 pb-3 text-[0.95rem] text-slate-300"><strong>Capital:</strong> ${selectedCountry.capital}</p>

      <p class="my-3 border-b border-slate-700 pb-3 text-[0.95rem] text-slate-300"><strong>Region:</strong> ${selectedCountry.region}</p>

      <p class="my-3 border-b border-slate-700 pb-3 text-[0.95rem] text-slate-300"><strong>Population:</strong> ${selectedCountry.population}</p>

    </div>
  `;


  // Popup ko visible karna
  openModal();
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
        class="m-1.5 cursor-pointer rounded-[0.65rem] bg-slate-700 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-600"
        data-action="remove-compare"
        data-name="${country.name}"
      >
        Remove ${country.name}
      </button>
    `;

  });


  // Comparison box ka starting HTML
  let comparisonHTML = `
    <div class="overflow-x-auto rounded-[1.25rem] bg-slate-900 p-6 text-white shadow-lg">

      <h2 class="mb-4 font-display text-2xl font-extrabold">Country Comparison</h2>

      <div>
        ${selectedNamesHTML}
      </div>
  `;


  // Agar sirf ek country selected hai
  if (comparisonData.length < 2) {

    comparisonHTML += `
      <p class="mt-4 text-slate-300">Select one more country to compare.</p>
    `;


  } else {


    // Do countries select hone par comparison table banana
    comparisonHTML += `
      <table class="mt-4 w-full min-w-[480px] border-collapse text-center text-sm">

        <tr>
          <th class="border border-slate-700 bg-slate-800 p-3.5 text-sky-300">Details</th>
          <th class="border border-slate-700 bg-slate-800 p-3.5 text-sky-300">${comparisonData[0].name}</th>
          <th class="border border-slate-700 bg-slate-800 p-3.5 text-sky-300">${comparisonData[1].name}</th>
        </tr>


        <tr>
          <td class="border border-slate-700 p-3.5">Flag</td>

          <td class="border border-slate-700 p-3.5">
            <img src="${comparisonData[0].flag}" width="80" alt="Country flag">
          </td>

          <td class="border border-slate-700 p-3.5">
            <img src="${comparisonData[1].flag}" width="80" alt="Country flag">
          </td>
        </tr>


        <tr>
          <td class="border border-slate-700 p-3.5">Capital</td>
          <td class="border border-slate-700 p-3.5">${comparisonData[0].capital}</td>
          <td class="border border-slate-700 p-3.5">${comparisonData[1].capital}</td>
        </tr>


        <tr>
          <td class="border border-slate-700 p-3.5">Region</td>
          <td class="border border-slate-700 p-3.5">${comparisonData[0].region}</td>
          <td class="border border-slate-700 p-3.5">${comparisonData[1].region}</td>
        </tr>


        <tr>
          <td class="border border-slate-700 p-3.5">Population</td>
          <td class="border border-slate-700 p-3.5">${comparisonData[0].population}</td>
          <td class="border border-slate-700 p-3.5">${comparisonData[1].population}</td>
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
  container.innerHTML = `<p class="${EMPTY_MESSAGE}">Unable to load countries. Please try again.</p>`;


  // Retry button banana
  const retryBtn = document.createElement("button");

  retryBtn.type = "button";

  retryBtn.className =
    "mx-auto my-4 block cursor-pointer rounded-[0.65rem] bg-sky-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-sky-500";

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
    <div class="h-80 animate-pulse rounded-[1.25rem] bg-slate-800"></div>
    <div class="h-80 animate-pulse rounded-[1.25rem] bg-slate-800"></div>
    <div class="h-80 animate-pulse rounded-[1.25rem] bg-slate-800"></div>
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


  // Click ki gayi jagah ke nearest action button ko find karna
  const button = event.target.closest("button[data-action]");


  // Agar click button par nahi hua to stop
  if (!button) return;


  // Favorite button click hua
  if (button.dataset.action === "favorite") {

    toggleFavorite(button.dataset.name);


    // Details button click hua
  } else if (button.dataset.action === "details") {

    showCountryDetails(button.dataset.name);


    // Compare button click hua
  } else if (button.dataset.action === "compare") {

    toggleCompare(button.dataset.name);

  }

});


// 18. Comparison Remove Button Handle Karna

comparisonContainer.addEventListener("click", (event) => {


  // Check karna Remove button click hua hai ya nahi
  const removeBtn = event.target.closest('button[data-action="remove-compare"]');

  if (!removeBtn) return;


  // Country ko comparison se remove karna
  toggleCompare(removeBtn.dataset.name);

});


// 19. Popup Close Button

closeModal.addEventListener("click", () => {

  // Popup hide karna
  hideModal();

});


// 20. Popup ke Bahar Click Karne par Close Karna

countryModal.addEventListener("click", (event) => {
  // Agar click popup ke outer background par hua
  if (event.target === countryModal) {
    hideModal();
  }
});
document.addEventListener("keydown", (event) => {
  // Keyboard par Escape press hone par popup hide karna
  if (event.key === "Escape") {
    hideModal();
  }
});
fetchCountries();