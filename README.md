# 🌍 World Explorer

A responsive, modern web application for exploring countries around the globe, discovering facts, comparing countries, and saving your favorite destinations. Built with **Tailwind CSS**, custom CSS, and vanilla **JavaScript** powered by the REST Countries API.

---

## ✨ Features

- 🔍 **Real-time Search:** Instantly search through countries by country name or capital city.
- 🌐 **Region Filtering:** Filter destinations by continent (Asia, Europe, Africa, Americas, Oceania).
- ↕️ **Smart Sorting:** Sort countries alphabetically (A-Z, Z-A) or by population (High to Low, Low to High).
- 📊 **Live Dashboard Statistics:** Dynamic counters for total countries, currently displayed countries, and saved favorites.
- 🤍 **Favorites System:** Save your favorite countries with local storage persistence across sessions.
- ⚖️ **Country Comparison:** Select and compare two countries side-by-side with flags, capitals, regions, and populations.
- 📱 **Interactive Details Modal:** Click any country to view an expanded details card with keyboard navigation (Escape to close).
- ⚡ **Skeleton Loading:** Smooth shimmer animation while data loads from the API.
- 🛡️ **Error Handling & Retry:** User-friendly fallback screen with an instant retry button if the network fails.
- 🎨 **Responsive Dark Theme:** Sleek dark-mode aesthetic with Tailwind CSS and glassmorphic styling.

---

## 🛠️ Tech Stack

- **HTML5** – Semantic markup and accessible structure.
- **Tailwind CSS (CDN)** – Utility-first CSS styling for rapid layout and responsiveness.
- **Custom CSS3** – Glassmorphic cards, custom modal popups, comparison tables, and shimmer animations.
- **Vanilla JavaScript (ES6+)** – Asynchronous API fetching (`async/await`), DOM manipulation, and `localStorage` state management.
- **API** – [countries.dev](https://countries.dev) REST Countries data.

---

## 🚀 Getting Started

No build tools or installations required! You can run this project locally in seconds:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nainarajoriya4/WORLD-EXPLORER-Tailwind-UI.git
   cd WORLD-EXPLORER-Tailwind-UI
   ```

2. **Open in browser:**
   - Double click `index.html` to open it in your favorite browser.
   - Or use VS Code **Live Server** extension: Right click `index.html` → *Open with Live Server*.

---

## 📂 Project Structure

```text
WORLD-EXPLORER-Tailwind-UI/
├── index.html        # Main HTML markup and UI structure
├── style.css         # Custom component styling, animations, and modals
├── script.js         # API integration, search, filter, favorites & modal logic
├── .gitignore        # Git ignore rules
└── README.md         # Project documentation and guide
```

---

## 👤 Author

- **Naina Rajoriya**
- GitHub: [@nainarajoriya4](https://github.com/nainarajoriya4)
- Email: nainarajoriya4@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
