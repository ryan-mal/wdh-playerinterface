const locations = [
    {
        name: "The Yawning Portal",
        type: "Tavern",
        ward: "Castle Ward",
        image: "images/Location_Images/yawning_portal.png",
        description: "A famous tavern built atop the entrance to the Undermountain dungeon."
    },
    {
        name: "Blackstaff Tower",
        type: "Landmark",
        ward: "Castle Ward",
        image: "images/Location_Images/blackstaff_tower.png",
        description: "Home and workplace of Waterdeep's archmage, shrouded in magical mystery."
    },
    {
        name: "Temple of Gond",
        type: "Temple",
        ward: "Trades Ward",
        image: "images/Location_Images/temple_of_gond.png",
        description: "A temple dedicated to the god of craft and innovation."
    },
    {
        name: "The Bent Nail",
        type: "Blacksmith",
        ward: "North Ward",
        image: "images/Location_Images/bent_nail.png",
        description: "A reputable blacksmith known for quality weapons and armor."
    },
    {
        name: "Trollskull Manor",
        type: "Landmark",
        ward: "North Ward",
        image: "images/Location_Images/trollskull_manor.png",
        description: "An old, possibly haunted manor with a storied history."
    },
    // Add more locations as needed
];

const activeFilters = {
    ward: new Set(),
    type: new Set()
};

const searchInput = document.getElementById('search-input');
const backToTopButton = document.getElementById('back-to-top');
const locationGrid = document.getElementById('location-grid');

searchInput.addEventListener('input', filterLocations);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.style.display = 'block';
    } else {
        backToTopButton.style.display = 'none';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

function toggleFilter(filterType, value) {
    const button = document.querySelector(`button[onclick="toggleFilter('${filterType}', '${value}')"]`);
    if (activeFilters[filterType].has(value)) {
        activeFilters[filterType].delete(value);
        button.classList.remove('active');
    } else {
        activeFilters[filterType].add(value);
        button.classList.add('active');
    }
    filterLocations();
}

function showAll() {
    clearFilters();
    filterLocations();
}

function clearFilters() {
    activeFilters.ward.clear();
    activeFilters.type.clear();
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.remove('active');
    });
    searchInput.value = '';
}

function filterLocations() {
    const searchTerm = searchInput.value.toLowerCase();
    locations.forEach(location => {
        const locationElement = document.getElementById(`location-${location.name.replace(/\s+/g, '-').toLowerCase()}`);
        const matchesSearch = location.name.toLowerCase().includes(searchTerm) || location.description.toLowerCase().includes(searchTerm);
        const matchesWard = activeFilters.ward.size === 0 || activeFilters.ward.has(location.ward);
        const matchesType = activeFilters.type.size === 0 || activeFilters.type.has(location.type);

        if (matchesSearch && matchesWard && matchesType) {
            locationElement.classList.remove('hidden');
        } else {
            locationElement.classList.add('hidden');
        }
    });
}

function createLocationTile(location) {
    const tile = document.createElement('div');
    tile.className = 'location-tile';
    tile.id = `location-${location.name.replace(/\s+/g, '-').toLowerCase()}`;
    tile.innerHTML = `
        <img src="${location.image}" alt="${location.name}" class="location-img">
        <div class="location-content">
            <h2>${location.name}</h2>
            <p class="location-type">${location.type}</p>
            <p class="location-ward">${location.ward}</p>
            <p class="location-description">${location.description}</p>
        </div>
    `;
    return tile;
}

function initializeLocations() {
    locations.forEach(location => {
        const tile = createLocationTile(location);
        locationGrid.appendChild(tile);
    });
}

document.addEventListener('DOMContentLoaded', initializeLocations);