const npcs = [
    {
        name: "Vajra Safahr",
        title: "Blackstaff",
        ward: "Castle Ward",
        factions: ["Grey Hands", "Blackstaff Academy"],
        image: "images/NPC_Images/Vajra_Safahr.png",
        description: "The Seventh Blackstaff, archmage of Waterdeep, and leader of the Grey Hands and Blackstaff Academy.",
        status: "alive"
    },
    {
        name: "Davil Starsong",
        title: "",
        ward: "Dock Ward",
        factions: ["Doom Raider Zhentarim"],
        image: "images/NPC_Images/Davil_Starsong.png",
        description: "A charismatic elven bard who serves as a public face for the Doom Raider Zhentarim splinter group in Waterdeep.",
		status: "alive"
    },
    {
        name: "Laeral Silverhand",
        title: "Open Lord",
        ward: "Castle Ward",
        factions: ["Lords Alliance"],
        image: "images/NPC_Images/Laeral_Silverhand.png",
        description: "The Open Lord of Waterdeep, a powerful mage and diplomat who governs the city.",
		status: "alive"
    },
    {
        name: "Mirt",
        title: "High Harper",
        ward: "Castle Ward",
        factions: ["Harpers"],
        image: "images/NPC_Images/Mirt.png",
        description: "The Leader of the Waterdeep Harper Sect.",
		status: "alive"
    },
    {
        name: "Xanathar",
        title: "Don",
        ward: "Undermountain/Skullport",
        factions: ["Xanathars Thieves Guild"],
        image: "images/NPC_Images/Xanathar.png",
        description: "The Leader of the underground thieves guild.",
		status: "alive"
    }
];

const activeFilters = {
    ward: new Set(),
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

// Add event listeners for collapsible sections
document.querySelectorAll('.filter-section h2').forEach(header => {
    header.addEventListener('click', () => {
        const filterButtons = header.nextElementSibling;
        filterButtons.classList.toggle('show');
        const toggleButton = header.querySelector('.toggle-filters');
        toggleButton.textContent = filterButtons.classList.contains('show') ? '▲' : '▼';
    });
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
    activeFilters.ward.clear();
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
        const ward = npc.getAttribute('data-ward');
        const factions = npc.getAttribute('data-faction').split(',');
        
        const matchesSearch = title.includes(searchTerm) || name.includes(searchTerm);
        const matchesWard = activeFilters.ward.size === 0 || activeFilters.ward.has(ward);
        const matchesFaction = activeFilters.faction.size === 0 || factions.some(faction => activeFilters.faction.has(faction));
        
        if (matchesSearch && matchesWard && matchesFaction) {
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
    <div class="npc-item ${npc.status}" data-ward="${npc.ward}" data-faction="${npc.factions.join(',')}">
        <div class="image-container">
            <img src="placeholder.png" data-src="${npc.image}" alt="${npc.name}" class="profile-img lazy">
            ${npc.status === 'dead' ? '<div class="status-overlay">Deceased</div>' : ''}
        </div>
        <div class="npc-content">
            <p class="npc-title">${npc.title || ''}</p>
            <h2>${npc.name}</h2>
            <p class="ward-tag">${npc.ward}</p>
            ${npc.factions.map(faction => `<p class="faction-tag" title="${faction}">${faction}</p>`).join('')}
            <p class="description">${npc.description}</p>
        </div>
    </div>
    `;
}

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