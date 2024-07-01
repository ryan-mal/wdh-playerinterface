$(document).ready(function() {
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

    const $grid = $('.npc-grid');
    npcs.forEach(npc => {
        $grid.append(createNPCCard(npc));
    });

    const iso = new Isotope($grid[0], {
		itemSelector: '.npc-card',
		layoutMode: 'fitRows'
	});
	console.log('Isotope initialized:', iso);

    $('.filter-btn').on('click', function() {
        const filterValue = $(this).attr('data-filter');
        iso.arrange({ filter: filterValue });
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
    });

    $('#search-input').on('keyup', function() {
        const searchText = $(this).val().toLowerCase();
        iso.arrange({
            filter: function(itemElem) {
                const name = $(itemElem).find('.npc-name').text().toLowerCase();
                const description = $(itemElem).find('.npc-description').text().toLowerCase();
                return name.includes(searchText) || description.includes(searchText);
            }
        });
    });
});