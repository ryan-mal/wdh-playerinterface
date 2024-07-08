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
        const nameSlug = spell.name.toLowerCase().replace(/\s+/g, '-');
        return `
            <div class="spell-card" data-category="spells" id="${nameSlug}">
                <h4>${spell.name} <i class="fas fa-link copy-link" data-hash="#${nameSlug}" title="Copy link to this spell"></i></h4>
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
        const nameSlug = rule.name.toLowerCase().replace(/\s+/g, '-');
        return `
            <div class="rule-card" data-category="rules" id="${nameSlug}">
                <h4>${rule.name} <i class="fas fa-link copy-link" data-hash="#${nameSlug}" title="Copy link to this rule"></i></h4>
                <div class="rule-description">
                    <p>${rule.description}</p>
                </div>
            </div>
        `;
    }


    function createConditionCard(condition) {
        const nameSlug = condition.name.toLowerCase().replace(/\s+/g, '-');
        return `
            <div class="condition-card" data-category="conditions" id="${nameSlug}">
                <h4>${condition.name} <i class="fas fa-link copy-link" data-hash="#${nameSlug}" title="Copy link to this condition"></i></h4>
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

    function scrollToElement(element) {
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 60; // Added 20px extra padding

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    function scrollToHash() {
        const hash = window.location.hash;
        if (hash) {
            let element = document.querySelector(hash);
            if (!element) {
                // If the hash doesn't match an element directly, it might be a card
                element = document.querySelector(`[id="${hash.slice(1)}"]`);
            }
            if (element) {
                setTimeout(() => {
                    const section = element.closest('.homebrew-section');
                    const toggle = section.querySelector('.section-toggle');
                    if (toggle.classList.contains('collapsed')) {
                        toggleSection(toggle);
                    }
                    setTimeout(() => {
                        scrollToElement(element);
                    }, 100); // Delay scrolling to allow section to expand
                }, 100);
            }
        }
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
            const category = button.dataset.category;
            filterHomebrewContent(category);
            if (category !== 'all') {
                window.location.hash = `#${category}`;
            } else {
                history.pushState("", document.title, window.location.pathname + window.location.search);
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-link')) {
            const hash = e.target.dataset.hash;
            const url = `${window.location.origin}${window.location.pathname}${hash}`;
            navigator.clipboard.writeText(url).then(() => {
                const successIcon = document.createElement('span');
                successIcon.classList.add('copy-success', 'fas', 'fa-check');
                e.target.appendChild(successIcon);

                // Trigger reflow
                successIcon.offsetWidth;

                successIcon.classList.add('show');

                setTimeout(() => {
                    successIcon.remove();
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy link: ', err);
            });
        }
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
                    scrollToElement(targetElement);
                }, 300);
            }
        }
    });

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    window.addEventListener('hashchange', scrollToHash);
    scrollToHash(); // Call this on initial load

});

// Helper function to allow case-insensitive contains selector
jQuery.expr[':'].contains = function (a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};