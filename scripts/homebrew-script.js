document.addEventListener('DOMContentLoaded', () => {
    const spellList = document.querySelector('.spell-list');
    const ruleList = document.querySelector('.rule-list');
    const conditionList = document.querySelector('.condition-list');
    const quickNavList = document.getElementById('quickNavList');
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    const sectionToggles = document.querySelectorAll('.section-toggle');

    function createSpellCard(spell) {
        return `
            <div class="spell-card" data-category="spells">
                <h4>${spell.name}</h4>
                <p class="spell-details">Level ${spell.level} ${spell.school}</p>
                <p><strong>Casting Time:</strong> ${spell.castingTime}</p>
                <p><strong>Range:</strong> ${spell.range}</p>
                <p><strong>Components:</strong> ${spell.components}</p>
                <p><strong>Duration:</strong> ${spell.duration}</p>
                <p>${spell.description}</p>
            </div>
        `;
    }

    function createRuleCard(rule) {
        return `
            <div class="rule-card" data-category="rules">
                <h4>${rule.name}</h4>
                <div class="rule-description">
                    <p>${rule.description}</p>
                </div>
            </div>
        `;
    }

    function createConditionCard(condition) {
        return `
            <div class="condition-card" data-category="conditions">
                <h4>${condition.name}</h4>
                <p class="condition-details">${condition.description}</p>
            </div>
        `;
    }

    function populateHomebrewContent() {
        homebrewData.spells.forEach(spell => {
            spellList.innerHTML += createSpellCard(spell);
            quickNavList.innerHTML += `<li><a href="#" data-name="${spell.name}" data-category="spells">${spell.name}</a></li>`;
        });

        homebrewData.rules.forEach(rule => {
            ruleList.innerHTML += createRuleCard(rule);
            quickNavList.innerHTML += `<li><a href="#" data-name="${rule.name}" data-category="rules">${rule.name}</a></li>`;
        });

        homebrewData.conditions.forEach(condition => {
            conditionList.innerHTML += createConditionCard(condition);
            quickNavList.innerHTML += `<li><a href="#" data-name="${condition.name}" data-category="conditions">${condition.name}</a></li>`;
        });
    }

    function filterHomebrewContent(category) {
        const allCards = document.querySelectorAll('.spell-card, .rule-card, .condition-card');
        allCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function toggleSection(toggle) {
        const section = toggle.closest('.homebrew-section');
        const content = section.querySelector('.section-content');
        toggle.classList.toggle('collapsed');
        content.classList.toggle('collapsed');
    }

    sectionToggles.forEach(toggle => {
        toggle.addEventListener('click', () => toggleSection(toggle));
    });

    function populateHomebrewContent() {
        homebrewData.spells.forEach(spell => {
            spellList.innerHTML += createSpellCard(spell);
            quickNavList.innerHTML += `<li><a href="#" data-name="${spell.name}" data-category="spells">${spell.name}</a></li>`;
        });

        homebrewData.rules.forEach(rule => {
            ruleList.innerHTML += createRuleCard(rule);
            quickNavList.innerHTML += `<li><a href="#" data-name="${rule.name}" data-category="rules">${rule.name}</a></li>`;
        });

        homebrewData.conditions.forEach(condition => {
            conditionList.innerHTML += createConditionCard(condition);
            quickNavList.innerHTML += `<li><a href="#" data-name="${condition.name}" data-category="conditions">${condition.name}</a></li>`;
        });

        // Add staggered animation to cards
        const cards = document.querySelectorAll('.spell-card, .rule-card, .condition-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 50}ms`;
        });
    }

    function searchHomebrewContent(query) {
        const allCards = document.querySelectorAll('.spell-card, .rule-card, .condition-card');
        const lowerQuery = query.toLowerCase();
        allCards.forEach(card => {
            const cardContent = card.textContent.toLowerCase();
            if (cardContent.includes(lowerQuery)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    populateHomebrewContent();

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterHomebrewContent(button.dataset.category);
        });
    });

    searchInput.addEventListener('input', (e) => {
        searchHomebrewContent(e.target.value);
    });

    quickNavList.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.tagName === 'A') {
            const targetName = e.target.dataset.name;
            const targetCategory = e.target.dataset.category;
            const targetElement = document.querySelector(`.${targetCategory}-card h4:contains('${targetName}')`);
            if (targetElement) {
                const section = targetElement.closest('.homebrew-section');
                const toggle = section.querySelector('.section-toggle');
                const content = section.querySelector('.section-content');

                if (content.classList.contains('collapsed')) {
                    toggleSection(toggle);
                }

                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        }
    });

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
});

// Helper function to allow case-insensitive contains selector
jQuery.expr[':'].contains = function (a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};