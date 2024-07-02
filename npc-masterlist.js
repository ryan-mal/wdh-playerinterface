document.addEventListener('DOMContentLoaded', function() {
    const npcs = [
        {
            name: "Vajra Safahr",
            image: "Vajra_Safahr.png",
            faction: "Harpers",
            location: "Castle Ward",
            description: "The Blackstaff, archmage of Waterdeep, and leader of the Watchful Order of Magists and Protectors."
        },
        {
            name: "Davil Starsong",
            image: "davil_starsong.png",
            faction: "Zhentarim",
            location: "Dock Ward",
            description: "A charismatic half-elf bard who serves as a public face for the Zhentarim in Waterdeep."
        },
        {
            name: "Xanathar",
            image: "xanathar.png",
            faction: "Xanathar Guild",
            location: "Field Ward",
            description: "The paranoid beholder crime lord who rules the Xanathar Guild from the shadows."
        },
        {
            name: "Laeral Silverhand",
            image: "laeral_silverhand.png",
            faction: "Lords' Alliance",
            location: "Castle Ward",
            description: "The Open Lord of Waterdeep, a powerful mage and diplomat who governs the city."
        },
        // Add more NPCs here
    ];

    function createNPCCard(npc) {
        return `
            <div class="npc-card faction-${npc.faction.toLowerCase().replace(/\s+/g, '')} location-${npc.location.toLowerCase().replace(/\s+/g, '')}">
                <img src="${npc.image}" alt="${npc.name}" class="npc-image">
                <div class="npc-info">
                    <h3 class="npc-name">${npc.name}</h3>
                    <div class="npc-tags">
                        <span class="npc-tag">${npc.faction}</span>
                        <span class="npc-tag">${npc.location}</span>
                    </div>
                    <p class="npc-description">${npc.description}</p>
                </div>
            </div>
        `;
    }

    const grid = document.querySelector('.npc-grid');
    npcs.forEach(npc => {
        grid.innerHTML += createNPCCard(npc);
    });

    let iso;

    imagesLoaded(grid, function() {
        iso = new Isotope(grid, {
            itemSelector: '.npc-card',
            layoutMode: 'fitRows'
        });
        console.log('Isotope initialized:', iso);
    });

    // Filter button functionality
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            iso.arrange({ filter: filterValue });
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Search functionality
    document.getElementById('search-input').addEventListener('keyup', function() {
        const searchText = this.value.toLowerCase();
        iso.arrange({
            filter: function(itemElem) {
                const name = itemElem.querySelector('.npc-name').textContent.toLowerCase();
                const description = itemElem.querySelector('.npc-description').textContent.toLowerCase();
                const faction = itemElem.querySelector('.npc-tag').textContent.toLowerCase();
                const location = itemElem.querySelectorAll('.npc-tag')[1].textContent.toLowerCase();
                return name.includes(searchText) || 
                       description.includes(searchText) || 
                       faction.includes(searchText) || 
                       location.includes(searchText);
            }
        });
    });
});