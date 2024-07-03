const npcs = [
    {
        name: "Vajra Safahr",
        title: "Blackstaff",
        wards: ["Castle Ward"],
        factions: ["Grey Hands", "Blackstaff Academy"],
        status: ["City Official", "Leader"],
        race: ["Human"],
        image: "images/NPC_Images/Vajra_Safahr.png",
        description: "The Seventh Blackstaff, archmage of Waterdeep, and leader of the Grey Hands and Blackstaff Academy.",
        isAlive: true
    },
    {
        name: "Davil Starsong",
        title: "",
        wards: ["Dock Ward"],
        factions: ["Doom Raider Zhentarim"],
        status: [],
        race: ["Elf"],
        image: "images/NPC_Images/Davil_Starsong.png",
        description: "A charismatic elven bard who serves as a public face for the Doom Raider Zhentarim splinter group in Waterdeep.",
        isAlive: true
    },
    {
        name: "Laeral Silverhand",
        title: "Open Lord",
        wards: ["Castle Ward"],
        factions: ["Lords Alliance"],
        status: ["City Official"],
        race: ["Elf"],
        image: "images/NPC_Images/Laeral_Silverhand.png",
        description: "The Open Lord of Waterdeep, a powerful mage and diplomat who governs the city.",
        isAlive: true
    },
    {
        name: "Mirt",
        title: "High Harper",
        wards: ["Castle Ward"],
        factions: ["Harpers"],
        status: ["Spy", "Leader"],
        race: ["Human"],
        image: "images/NPC_Images/Mirt.png",
        description: "The Leader of the Waterdeep Harper Sect.",
        isAlive: true
    },
    {
        name: "Xanathar",
        title: "Don",
        wards: ["Undermountain/Skullport"],
        factions: ["Xanathars Thieves Guild"],
        status: ["Criminal", "Leader"],
        race: ["Beholder"],
        image: "images/NPC_Images/Xanathar.png",
        description: "The Leader of the underground thieves guild.",
        isAlive: true
    }
];

const activeFilters = {
    ward: new Set(),
    faction: new Set(),
    status: new Set(),
    race: new Set()
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
    activeFilters.ward.clear();
    activeFilters.faction.clear();
    activeFilters.status.clear();
    activeFilters.race.clear();
    document.querySelectorAll('.filter-button').forEach(button => {
        button.classList.remove('active');
    });
    searchInput.value = '';
}

function filterNPCs() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredNPCs = npcs.filter(npc => {
        const matchesSearch = 
            npc.name.toLowerCase().includes(searchTerm) || 
            (npc.title && npc.title.toLowerCase().includes(searchTerm)) ||
            npc.description.toLowerCase().includes(searchTerm) ||
            npc.wards.some(ward => ward.toLowerCase().includes(searchTerm)) ||
            npc.factions.some(faction => faction.toLowerCase().includes(searchTerm)) ||
            npc.status.some(status => status.toLowerCase().includes(searchTerm)) ||
            npc.race.some(race => race.toLowerCase().includes(searchTerm));

        const matchesWard = activeFilters.ward.size === 0 || npc.wards.some(ward => activeFilters.ward.has(ward));
        const matchesFaction = activeFilters.faction.size === 0 || npc.factions.some(faction => activeFilters.faction.has(faction));
        const matchesStatus = activeFilters.status.size === 0 || npc.status.some(status => activeFilters.status.has(status));
        const matchesRace = activeFilters.race.size === 0 || npc.race.some(race => activeFilters.race.has(race));
        
        return matchesSearch && matchesWard && matchesFaction && matchesStatus && matchesRace;
    });

    displayNPCs(filteredNPCs);
}
function displayNPCs(filteredNPCs) {
    const npcList = document.getElementById('main-content');
    npcList.innerHTML = filteredNPCs.map(npc => createNPCCard(npc, false)).join('');
    sortNPCs();
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

function createNPCCard(npc, useLazyLoading = true) {
    return `
    <div class="npc-item ${npc.isAlive ? 'alive' : 'dead'}" 
         data-wards="${npc.wards.join(',')}" 
         data-factions="${npc.factions.join(',')}"
         data-status="${npc.status.join(',')}"
         data-race="${npc.race.join(',')}">
        <div class="image-container">
            <img ${useLazyLoading ? 'data-src' : 'src'}="${npc.image}" alt="${npc.name}" class="profile-img ${useLazyLoading ? 'lazy' : ''}">
            ${!npc.isAlive ? '<div class="status-overlay">Deceased</div>' : ''}
        </div>
        <div class="npc-content">
            <p class="npc-title">${npc.title || ''}</p>
            <h2>${npc.name}</h2>
            <div class="tags-container">
                ${npc.wards.map(ward => `<span class="tag ward-tag" title="Ward">${ward}</span>`).join('')}
                ${npc.factions.map(faction => `<span class="tag faction-tag" title="Faction">${faction}</span>`).join('')}
                ${npc.status.map(status => `<span class="tag status-tag" title="Status">${status}</span>`).join('')}
                ${npc.race.map(race => `<span class="tag race-tag" title="Race">${race}</span>`).join('')}
            </div>
            <p class="description">${npc.description}</p>
        </div>
    </div>
    `;
}

function initializeLazyLoading() {
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
}

document.addEventListener("DOMContentLoaded", () => {
    const npcList = document.getElementById('main-content');
    npcList.innerHTML = npcs.map(npc => createNPCCard(npc, true)).join('');
    sortNPCs();
    initializeLazyLoading();
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