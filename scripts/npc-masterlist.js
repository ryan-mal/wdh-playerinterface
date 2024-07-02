const npcs = [
    {
        name: "Vajra Safahr",
        title: "Blackstaff",
        location: "Castle Ward",
        factions: ["Grey Hands", "Blackstaff Academy"],
        image: "images/NPC_Images/Vajra_Safahr.png",
        description: "The Seventh Blackstaff, archmage of Waterdeep, and leader of the Grey Hands and Blackstaff Academy."
    },
    {
        name: "Davil Starsong",
        title: "",
        location: "Dock Ward",
        factions: ["Zhentarim (DR)"],
        image: "images/NPC_Images/Davil_Starsong.png",
        description: "A charismatic elven bard who serves as a public face for the Doom Raider Zhentarim splinter group in Waterdeep."
    },
    {
        name: "Laeral Silverhand",
        title: "Open Lord",
        location: "Castle Ward",
        factions: ["Lord's Alliance"],
        image: "images/NPC_Images/Laeral_Silverhand.png",
        description: "The Open Lord of Waterdeep, a powerful mage and diplomat who governs the city."
    },
	
    {
        name: "Mirt",
        title: "High Harper",
        location: "Castle Ward",
        factions: ["Harpers"],
        image: "images/NPC_Images/Mirt.png",
        description: "The Leader of the Waterdeep Harper Sect."
    },
	
    {
        name: "Xanathar",
        title: "Don",
        location: "Undermountain/Skullport",
        factions: ["Xanathars Thieves Guild"],
        image: "images/NPC_Images/Xanathar.png",
        description: "The Leader of the underground thieves guild."
    }

];

const activeFilters = {
    location: new Set(),
    faction: new Set()
};

const searchInput = document.getElementById('search-input');
const backToTopButton = document.getElementById('back-to-top');

searchInput.addEventListener('input', filterNPCs);

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
    filterNPCs();
}

function showAll() {
    clearFilters();
    filterNPCs();
}

function clearFilters() {
    activeFilters.location.clear();
    activeFilters.faction.clear();
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.remove('active');
    });
    searchInput.value = '';
}

function filterNPCs() {
    const searchTerm = searchInput.value.toLowerCase();
    const npcs = document.querySelectorAll('.npc-item');
    npcs.forEach(npc => {
        const title = npc.querySelector('.npc-title').textContent.toLowerCase();
        const name = npc.querySelector('h2').textContent.toLowerCase();
        // const description = npc.querySelector('.description').textContent.toLowerCase();
        const location = npc.getAttribute('data-location');
        const factions = npc.getAttribute('data-faction').split(',');
        
        //const matchesSearch = title.includes(searchTerm) || name.includes(searchTerm) || description.includes(searchTerm);
        const matchesSearch = title.includes(searchTerm) || name.includes(searchTerm);
        const matchesLocation = activeFilters.location.size === 0 || activeFilters.location.has(location);
        const matchesFaction = activeFilters.faction.size === 0 || factions.some(faction => activeFilters.faction.has(faction));
        
        if (matchesSearch && matchesLocation && matchesFaction) {
            npc.classList.remove('hidden');
        } else {
            npc.classList.add('hidden');
        }
    });

    sortNPCs(); // Sort NPCs after filtering
}

function sortNPCs() {
    const npcList = document.getElementById('main-content');
    const npcs = Array.from(npcList.children);
    
    npcs.sort((a, b) => {
        const nameA = a.querySelector('h2').textContent.toLowerCase();
        const nameB = b.querySelector('h2').textContent.toLowerCase();
        return nameA.localeCompare(nameB);
    });
    
    npcs.forEach(npc => npcList.appendChild(npc));
}

function createNPCCard(npc) {
    return `
    <div class="npc-item" data-location="${npc.location}" data-faction="${npc.factions.join(',')}">
        <img src="placeholder.png" data-src="${npc.image}" alt="${npc.name}" class="profile-img lazy">
        <div class="npc-content">
            <p class="npc-title">${npc.title || ''}</p>
            <h2>${npc.name}</h2>
            <p class="location-tag">${npc.location}</p>
            ${npc.factions.map(faction => `<p class="faction-tag" title="${faction}">${faction}</p>`).join('')}
            <p class="description">${npc.description}</p>
        </div>
    </div>
    `;
}

// Lazy loading for images
document.addEventListener("DOMContentLoaded", () => {
    // Populate NPC list
    const npcList = document.getElementById('main-content');
    npcList.innerHTML = npcs.map(npc => createNPCCard(npc)).join('');

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

    sortNPCs(); // Sort NPCs on initial load
});