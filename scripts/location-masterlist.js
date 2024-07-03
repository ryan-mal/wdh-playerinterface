// Active filter sets
const activeFilters = {
    ward: new Set(),
    type: new Set()
};

// DOM element references
const searchInput = document.getElementById('search-input');
const backToTopButton = document.getElementById('back-to-top');
const filterToggle = document.getElementById('filter-toggle');
const filterDropdown = document.getElementById('filter-dropdown');
const locationList = document.getElementById('main-content');
const sortToggle = document.querySelector('.sort-toggle');
const sortButtonsContainer = document.querySelector('.sort-buttons');
const sortButtons = document.querySelectorAll('.sort-button');

// Event listeners
searchInput.addEventListener('input', filterLocations);
window.addEventListener('scroll', handleScroll);
backToTopButton.addEventListener('click', scrollToTop);
filterToggle.addEventListener('click', toggleFilterDropdown);
sortToggle.addEventListener('click', toggleSortButtons);
sortButtons.forEach(button => {
    button.addEventListener('click', () => {
        sortButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        sortLocations(button.dataset.sort);
        toggleSortButtons();
    });
});

function toggleFilter(filterType, value, keepDropdownClosed = false) {
    const button = document.querySelector(`button[onclick="toggleFilter('${filterType}', '${value}')"]`);
    if (activeFilters[filterType].has(value)) {
        activeFilters[filterType].delete(value);
        button.classList.remove('active');
    } else {
        activeFilters[filterType].add(value);
        button.classList.add('active');
    }
	
	filterLocations();
    highlightActiveTags();
	updateModalTags();
}

function highlightActiveTags() {
    document.querySelectorAll('.tag').forEach(tag => {
        const type = tag.classList[1].split('-')[0]; // e.g., "ward" from "ward-tag"
        const value = tag.textContent;
        if (activeFilters[type].has(value)) {
            tag.classList.add('active');
        } else {
            tag.classList.remove('active');
        }
    });
}

function showAll() {
    clearFilters();
    filterLocations();
    highlightActiveTags();
}

function clearFilters() {
    Object.keys(activeFilters).forEach(key => activeFilters[key].clear());
    document.querySelectorAll('.filter-button').forEach(button => button.classList.remove('active'));
    searchInput.value = '';
}

function filterLocations() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredLocations = locations.filter(location => {
        const matchesSearch = 
            location.name.toLowerCase().includes(searchTerm) || 
            location.ward.toLowerCase().includes(searchTerm) ||
            location.type.some(type => type.toLowerCase().includes(searchTerm));

        const matchesWard = activeFilters.ward.size === 0 || activeFilters.ward.has(location.ward);
        const matchesType = activeFilters.type.size === 0 || location.type.some(type => activeFilters.type.has(type));
        
        return matchesSearch && matchesWard && matchesType;
    });

    displayLocations(filteredLocations);
}

function displayLocations(filteredLocations) {
    locationList.innerHTML = filteredLocations.map(location => createLocationCard(location)).join('');
    sortLocations(document.querySelector('.sort-button.active').dataset.sort);
    highlightActiveTags();
}

function toggleSortButtons() {
    sortButtonsContainer.classList.toggle('open');
    sortToggle.textContent = sortButtonsContainer.classList.contains('open') ? 'Sort ⏴' : 'Sort ⏵';
}

function sortLocations(sortBy) {
    const locations = Array.from(locationList.children);

    locations.sort((a, b) => {
        if (sortBy === 'name') {
            return a.querySelector('h2').textContent.localeCompare(b.querySelector('h2').textContent);
        } else {
            const aValues = a.getAttribute(`data-${sortBy}`).split(',');
            const bValues = b.getAttribute(`data-${sortBy}`).split(',');
            return (aValues[0] || '').localeCompare(bValues[0] || '');
        }
    });

    locations.forEach(location => locationList.appendChild(location));
}

function createLocationCard(location) {
  const { name, ward, type, image, description } = location;
  const locationId = name.replace(/\s+/g, '-').toLowerCase();
  
  return `
  <div class="location-item" 
       data-name="${name}"
       data-ward="${ward}" 
       data-type="${type.join(',')}"
       onclick="openModal('${locationId}')">
        <div class="image-container">
            <img src="${image}" alt="${name}" class="profile-img">
        </div>
        <div class="location-content">
            <h2>${name}</h2>
            <div class="tags-container">
                ${createTags([ward], 'ward')}
                ${createTags(type, 'type')}
            </div>
            <p class="description">${description}</p>
        </div>
    </div>
    `;
}

function createTags(items, type) {
    return items.map(item => `<span class="tag ${type}-tag" title="${type.charAt(0).toUpperCase() + type.slice(1)}" onclick="toggleTagFilter(event, '${type}', '${item}')">${item}</span>`).join('');
}

function toggleTagFilter(event, filterType, value) {
    event.stopPropagation(); // Prevent the Location card click event from firing
    const button = document.querySelector(`button[onclick="toggleFilter('${filterType}', '${value}')"]`);
    if (button) {
        button.click(); // Simulate a click on the filter button
    }
}

function openModal(locationId) {
    // Open modal with location details
    const modal = document.getElementById('location-modal');
    const modalContent = document.getElementById('modal-location-content');
    const location = locations.find(n => n.name.replace(/\s+/g, '-').toLowerCase() === locationId);

    if (location) {
        modalContent.innerHTML = createModalContent(location);
        modal.style.display = 'block';
        window.location.hash = locationId;
        
        // Add event listeners to modal tags
        modalContent.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', (event) => {
                const type = tag.classList[1].split('-')[0];
                const value = tag.textContent;
                toggleTagFilter(event, type, value);
                updateModalTags();
            });
        });
    }
}

function updateModalTags() {
    const modalContent = document.getElementById('modal-location-content');
    if (modalContent) {
        modalContent.querySelectorAll('.tag').forEach(tag => {
            const type = tag.classList[1].split('-')[0];
            const value = tag.textContent;
            if (activeFilters[type].has(value)) {
                tag.classList.add('active');
            } else {
                tag.classList.remove('active');
            }
        });
    }
}

function createModalContent(location) {
    const { name, ward, type, image, description, notableInfo } = location;
    
    return `
        <div class="modal-header">
            <h2>${name}</h2>
        </div>
        <div class="modal-body">
            <img src="${image}" alt="${name}" class="modal-img">
            <div class="modal-info">
                <div class="tags-container">
                    ${createModalTags([ward], 'ward')}
                    ${createModalTags(type, 'type')}
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

function createModalTags(items, type) {
    return items.map(item => {
        const isActive = activeFilters[type].has(item);
        return `<span class="tag ${type}-tag${isActive ? ' active' : ''}" title="${type.charAt(0).toUpperCase() + type.slice(1)}">${item}</span>`;
    }).join('');
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
    displayLocations(locations);
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
        const locationId = window.location.hash.substring(1);
        openModal(locationId);
    }
});


// Close modal when clicking outside or on close button
window.onclick = function(event) {
    const modal = document.getElementById('location-modal');
    if (event.target == modal || event.target.className == 'close') {
        modal.style.display = 'none';
        window.location.hash = '';
    }
};