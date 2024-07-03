const locations = [
    {
        name: "The Yawning Portal",
        type: "Inn, Tavern, Festhall",
        ward: "Castle Ward",
        image: "images/Location_Images/Yawning_Portal.png",
        description: "A famous tavern built atop the entrance to the Undermountain dungeon."
    },
    {
        name: "Blackstaff Tower",
        type: "Landmark",
        ward: "Castle Ward",
        image: "images/Location_Images/Blackstaff_Tower.png",
        description: "Home and workplace of Waterdeep's archmage, shrouded in magical mystery."
    },
    {
        name: "House of Inspired Hands",
        type: "Temple",
        ward: "Trades Ward",
        image: "images/Location_Images/House_of_Inspired_Hands.png",
        description: "A temple dedicated to Gond, the god of craft and innovation."
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
        image: "images/Location_Images/Trollskull_Manor.png",
        description: "An old, possibly haunted manor with a storied history."
    },
	    {
        name: "Archway Commons",
        type: "Landmark",
        ward: "Castle Ward",
        image: "images/Location_Images/Archway_Commons.png",
        description: "A common park usually for students of Blackstaff Academy."
    }
    // Add more locations as needed. Remember, they must all end with a , other then the last entry
];

const activeFilters = {
    ward: new Set(),
    type: new Set()
};

const searchInput = document.getElementById('search-input');
const backToTopButton = document.getElementById('back-to-top');
const locationGrid = document.getElementById('main-content');

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

    sortLocations();
}

function sortLocations() {
    const locationsList = Array.from(locationGrid.children);
    locationsList.sort((a, b) => {
        const nameA = a.querySelector('h2').textContent.toLowerCase();
        const nameB = b.querySelector('h2').textContent.toLowerCase();
        return nameA.localeCompare(nameB);
    });
    locationsList.forEach(location => locationGrid.appendChild(location));
}

function createLocationTile(location) {
    return `
    <div class="location-tile" id="location-${location.name.replace(/\s+/g, '-').toLowerCase()}" data-ward="${location.ward}" data-type="${location.type}">
        <div class="image-container">
            <img src="placeholder.png" data-src="${location.image}" alt="${location.name}" class="location-img lazy">
        </div>
        <div class="location-content">
            <h2>${location.name}</h2>
            <p class="location-type">${location.type}</p>
            <p class="location-ward">${location.ward}</p>
            <p class="location-description">${location.description}</p>
        </div>
    </div>
    `;
}

function initializeLocations() {
    locationGrid.innerHTML = locations.map(location => createLocationTile(location)).join('');

    // Lazy loading for images
    const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    
    if ("IntersectionObserver" in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(lazyImage => {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove("lazy");
        });
    }

    sortLocations();
}

document.addEventListener('DOMContentLoaded', initializeLocations);

document.querySelectorAll('.filter-title').forEach(title => {
    title.addEventListener('click', () => {
        const filterSection = title.closest('.filter-section');
        filterSection.classList.toggle('open');
        
        // Animate filter buttons
        const filterButtons = filterSection.querySelectorAll('.filter-button');
        filterButtons.forEach((button, index) => {
            setTimeout(() => {
                button.style.transform = filterSection.classList.contains('open') ? 'scale(1)' : 'scale(0)';
            }, index * 50); // Stagger the animation
        });
    });
});