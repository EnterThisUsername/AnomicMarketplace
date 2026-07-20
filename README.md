Anomic Marketplace (AMP)

Welcome to the official repository for the Anomic Marketplace (AMP). This is a production-quality, static web application serving as the central hub for the Roblox Anomic community. It provides real-time marketplace values, VHS animation Bulk IDs, and official Discord server links.

Built with a focus on performance, accessibility, and maintainability, AMP requires zero build steps and can be hosted on any static web host.
Table of Contents

     Features
     Tech Stack
     Project Structure
     Hosting & Deployment
     Data Management Guide
         Adding a Marketplace Item
         Removing a Marketplace Item
         Updating Item Values
         Adding a VHS Animation
         Updating Discord Invites
     Filters & Customization
     Accessibility & Performance
     Browser Support
     License

Features

     Dynamic Marketplace Database: Automatically loads and renders item values from JSON files. Includes a powerful instant search, multi-select filtering (Category, Event, Demand, Prediction, Rarity), and value range sliders.
     VHS Bulk ID Library: Fast, searchable directory of VHS animations with 1-10 FPS filtering support and one-click clipboard copying.
     Official Discord Directory: Centralized, easily configurable list of official community servers.
     Premium UI/UX: Dark/Light theme toggle (with OS preference detection), skeleton loading states, toast notifications, and smooth animations.
     View Toggles: Switch between grid and table layouts on the Marketplace page. Layout preferences persist via localStorage.
     Keyboard Accessibility: Ctrl + K / Cmd + K to instantly focus search, Escape to close menus, and full tab-navigable forms.
     Zero Build Step: Pure HTML, CSS, and Vanilla ES Module JavaScript. No React, no Webpack, no Node required to run.

Tech Stack

     HTML5: Semantic, accessible markup.
     CSS3: Custom properties (variables), modular files, and Tailwind CSS (via CDN for utility classes).
     Vanilla JavaScript (ES Modules): Modular, maintainable, dependency-free logic.
     Lucide Icons: Lightweight, customizable SVG icons.
     JSON: Decoupled data layer for marketplace items and VHS animations.

Project Structure
text
 
  
 
 
/
index.html              # Homepage with statistics and quick links
values.html             # Marketplace values database
vhs.html                # VHS Bulk ID database
discords.html           # Official Discord server directory
css/                    # Modular stylesheets
styles.css          # Master import file
variables.css       # Design tokens (colors, spacing, typography)
layout.css          # Grid, flex, and container utilities
navigation.css      # Navbar and mobile menu
cards.css           # Item, VHS, and Discord card styles
buttons.css         # Button variants
forms.css           # Inputs, selects, search bars
animations.css      # Keyframes and transitions
responsive.css      # Media queries for mobile/tablet
utilities.css       # Helper classes
themes.css          # Light/dark theme overrides
js/                     # Modular ES Modules
app.js              # Main entry point, initializes page scripts
config.js           # Centralized configuration & Discord links
constants.js        # Sorting options, demand rankings
loader.js           # Fetches JSON, validates data, handles errors
values.js           # Logic for the marketplace page
vhs.js              # Logic for the VHS page
discords.js         # Logic for the Discord page
search.js           # Debounced instant search
filtering.js        # Multi-criteria data filtering
sorting.js          # Stable data sorting
clipboard.js        # Modern clipboard API with fallback
theme.js            # Theme toggle and persistence
navigation.js       # Mobile menu and navbar scroll effects
keyboard.js         # Global keyboard shortcuts
toast.js            # Toast notification system
scroll.js           # Back-to-top button logic
utils.js            # Helper functions (debounce, formatNumber, etc.)
js/data/                   # Decoupled JSON Data
js/data/values/             # Marketplace items & manifest.json
ja/data/values/vhs/                # VHS animations & manifest.json
README.md               # You are here
 
 
Hosting & Deployment

Because this is a pure static website, no compilation is required. 

    Download/Clone the repository to your local machine.
    Upload the files to your chosen web host:
         GitHub Pages: Push to a repo, go to Settings > Pages, and deploy from the main branch.
         Netlify/Vercel: Drag and drop the project folder into their dashboard.
         AWS S3 / Cloudflare Pages: Sync the folder to your bucket/project.
    Local Development: Because the site uses ES Modules (import/export), you cannot just double-click index.html (browsers block module loading over the file:// protocol). You must use a local server. 
         If using VS Code, install the Live Server extension and click "Go Live".
         Alternatively, run npx serve in the project directory via terminal.

Data Management Guide

The website is designed so that non-developers can update content without touching HTML, CSS, or JavaScript. Everything is driven by JSON files.
Adding a Marketplace Item

    Navigate to /data/values/.
    Create a new .json file (e.g., summer-car.json).
    Add the item data using the standard schema:
    json
     
      
     
     
    {
      "id": "summer-car",
      "name": "Summer Car",
      "image": "https://placehold.co/600x400/1e1e1e/ff4500?text=Summer+Car",
      "value": 150000,
      "demand": "Moderate",
      "prediction": "Stable",
      "event": "Summer 2025",
      "category": "Car",
      "rarity": "Uncommon",
      "description": "A sunny ride for the summer event.",
      "lastUpdated": "2024-05-24"
    }
     
     
    Open manifest.json in the same folder and add your new filename to the items array:
    json
     
      
     
     
    {
      "items": [
        "summer-car.json",
        "other-items.json"
      ]
    }
     
     
    Reload the website. The item will automatically appear, and its Category/Rarity will automatically populate the filter sidebar.

Removing a Marketplace Item

    Delete the item's .json file from /data/values/.
    Remove the filename from manifest.json.
    Reload the website.

Updating Item Values

    Open the item's .json file.
    Change the "value" number.
    Update the "lastUpdated" date to today (format: YYYY-MM-DD). If updated recently, the card will automatically display a "Recently Updated" badge.
    Save the file.

Adding a VHS Animation

    Navigate to /data/vhs/.
    Create a new .json file (e.g., custom-dance.json).
    Note: The Anomic game engine supports 1-10 FPS for VHS tapes.
    Use the standard schema:
    json
     
      
     
     
    {
      "id": "custom-dance",
      "name": "Custom Dance",
      "preview": "/images/vhs/custom-dance.gif",
      "fps": 5,
      "bulkId": "123456789,987654321",
      "category": "Dance",
      "description": "A custom 5 FPS dance animation."
    }
     
     
    Add the filename to manifest.json in the /data/vhs/ folder.
    Reload the website.

Updating Discord Invites

Unlike items and VHS, Discord links are stored in a centralized JavaScript config file for easy access.

    Open /js/config.js.
    Scroll down to the DISCORD_SERVERS array.
    Update the invite URL, members count, or add a new server object following the existing format.
    Save and reload.

Filters & Customization
How do Filters Work?

The filtering system on the Marketplace page is 100% dynamic. 

     If you create an item with "category": "Weapon", the filter sidebar will automatically create a "Weapon" checkbox.
     If no items have the category "Weapon", it will disappear from the filters.
     This applies to Category, Event, Demand, Prediction, and Rarity.

Changing the "Recently Updated" Threshold

By default, items updated within the last 30 days get a green "Recently Updated" badge. To change this:

    Open /js/config.js.
    Find updates: { recentThresholdDays: 30 }.
    Change 30 to your desired number of days.

Accessibility & Performance

     Semantic HTML: Proper use of <header>, <nav>, <main>, <article>, and <footer>.
     Keyboard Navigation: All interactive elements are reachable via Tab. Focus states are highly visible. Ctrl+K focuses the search bar.
     Reduced Motion: The website detects prefers-reduced-motion in the user's OS and disables non-essential animations automatically.
     Lazy Loading: All item and VHS images use loading="lazy" to prevent loading off-screen images, saving bandwidth and speeding up initial paint.
     Skeleton Loaders: Instead of showing blank screens while JSON fetches, skeleton placeholders pulse to indicate loading.

Browser Support

AMP supports all modern evergreen browsers:

     Google Chrome (Latest)
     Mozilla Firefox (Latest)
     Microsoft Edge (Latest)
     Apple Safari (Latest)

Note: The Clipboard API relies on secure contexts. If hosted on http:// instead of https://, the site will automatically fall back to a legacy execCommand method for copying VHS Bulk IDs.
