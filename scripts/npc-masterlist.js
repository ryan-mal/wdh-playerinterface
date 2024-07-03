
// npc data stored in npc-data.js in the following format:
/**
		name: "",
        title: "",
        wards: [""],
        factions: [""],
        status: [""],
        race: [""],
        image: "images/NPC_Images/.png",
        description: "",
        isAlive: true,
        notableInfo: ""
*/



// Active filter sets
const activeFilters = {
    ward: new Set(),
    faction: new Set(),
    status: new Set(),
    race: new Set()
};

// DOM element references
const searchInput = document.getElementById('search-input');
const backToTopButton = document.getElementById('back-to-top');
const filterToggle = document.getElementById('filter-toggle');
const filterDropdown = document.getElementById('filter-dropdown');
const npcList = document.getElementById('main-content');

// Event listeners
searchInput.addEventListener('input', filterNPCs);
window.addEventListener('scroll', handleScroll);
backToTopButton.addEventListener('click', scrollToTop);
filterToggle.addEventListener('click', toggleFilterDropdown);

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
    Object.keys(activeFilters).forEach(key => activeFilters[key].clear());
    document.querySelectorAll('.filter-button').forEach(button => button.classList.remove('active'));
    searchInput.value = '';
}

function filterNPCs() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredNPCs = npcs.filter(npc => {
        const matchesSearch = 
            npc.name.toLowerCase().includes(searchTerm) || 
            (npc.title && npc.title.toLowerCase().includes(searchTerm)) ||
            // npc.description.toLowerCase().includes(searchTerm) ||
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
    npcList.innerHTML = filteredNPCs.map(npc => createNPCCard(npc)).join('');
    sortNPCs();
}

function sortNPCs() {
    const npcs = Array.from(npcList.children);
    npcs.sort((a, b) => a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent));
    npcs.forEach(npc => npcList.appendChild(npc));
}

function createNPCCard(npc) {
    const { name, title, wards, factions, status, race, image, description, isAlive } = npc;
    const npcId = name.replace(/\s+/g, '-').toLowerCase();
    
    return `
    <div class="npc-item ${isAlive ? 'alive' : 'dead'}" 
         data-wards="${wards.join(',')}" 
         data-factions="${factions.join(',')}"
         data-status="${status.join(',')}"
         data-race="${race.join(',')}"
         onclick="openModal('${npcId}')">
        <div class="image-container">
            <img src="${image}" alt="${name}" class="profile-img">
            ${!isAlive ? '<div class="status-overlay">Deceased</div>' : ''}
        </div>
        <div class="npc-content">
            <p class="npc-title">${title || ''}</p>
            <h2>${name}</h2>
            <div class="tags-container">
                ${createTags(wards, 'ward')}
                ${createTags(factions, 'faction')}
                ${createTags(status, 'status')}
                ${createTags(race, 'race')}
            </div>
            <p class="description">${description}</p>
        </div>
    </div>
    `;
}

function createTags(items, type) {
    return items.map(item => `<span class="tag ${type}-tag" title="${type.charAt(0).toUpperCase() + type.slice(1)}">${item}</span>`).join('');
}

function openModal(npcId) {
    const modal = document.getElementById('npc-modal');
    const modalContent = document.getElementById('modal-npc-content');
    const npc = npcs.find(n => n.name.replace(/\s+/g, '-').toLowerCase() === npcId);

    if (npc) {
        modalContent.innerHTML = createModalContent(npc);
        modal.style.display = 'block';
        window.location.hash = npcId;
    }
}

function createModalContent(npc) {
    const { name, title, wards, factions, status, race, image, description, notableInfo } = npc;
    
    return `
        <div class="modal-header">
            <h2>${name}</h2>
            <p class="npc-title">${title || ''}</p>
        </div>
        <div class="modal-body">
            <img src="${image}" alt="${name}" class="modal-img">
            <div class="modal-info">
                <div class="tags-container">
                    ${createTags(wards, 'ward')}
                    ${createTags(factions, 'faction')}
                    ${createTags(status, 'status')}
                    ${createTags(race, 'race')}
                </div>
                <p class="modal-description">${description}</p>
                ${notableInfo ? `
                <div class="modal-notable-info">
                    <h3>Notable Information</h3>
                    <p>${notableInfo}</p>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

function handleScroll() {
    backToTopButton.style.display = window.pageYOffset > 300 ? 'block' : 'none';
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleFilterDropdown() {
    filterDropdown.classList.toggle('open');
    filterToggle.textContent = filterDropdown.classList.contains('open') ? 'Filters ▲' : 'Filters ▼';
}

function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll("img.lazy");
    
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

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
    displayNPCs(npcs);
    initializeLazyLoading();

    document.querySelectorAll('.filter-title').forEach(title => {
        title.addEventListener('click', () => {
            const filterSection = title.closest('.filter-section');
            filterSection.classList.toggle('open');

            const filterButtons = filterSection.querySelectorAll('.filter-button');
            filterButtons.forEach((button, index) => {
                setTimeout(() => {
                    button.style.opacity = filterSection.classList.contains('open') ? '1' : '0';
                    button.style.transform = filterSection.classList.contains('open') ? 'scale(1)' : 'scale(0.8)';
                }, index * 30);
            });
        });
    });

    // Check for hash in URL on page load
    if(window.location.hash) {
        const npcId = window.location.hash.substring(1);
        openModal(npcId);
    }
});

// Close modal when clicking outside or on close button
window.onclick = function(event) {
    const modal = document.getElementById('npc-modal');
    if (event.target == modal || event.target.className == 'close') {
        modal.style.display = 'none';
        window.location.hash = '';
    }
};