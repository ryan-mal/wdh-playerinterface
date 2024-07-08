document.addEventListener('DOMContentLoaded', () => {
    const spellList = document.querySelector('.spell-list');
    const ruleList = document.querySelector('.rule-list');
    const conditionList = document.querySelector('.condition-list');

    function createSpellCard(spell) {
        return `
            <div class="spell-card">
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
            <div class="rule-card">
                <h4>${rule.name}</h4>
                <div class="rule-description">
                    <p>${rule.description}</p>
                </div>
            </div>
        `;
    }

    function createConditionCard(condition) {
        return `
            <div class="condition-card">
                <h4>${condition.name}</h4>
                <p class="condition-details">${condition.description}</p>
            </div>
        `;
    }

    homebrewData.spells.forEach(spell => {
        spellList.innerHTML += createSpellCard(spell);
    });

    homebrewData.rules.forEach(rule => {
        ruleList.innerHTML += createRuleCard(rule);
    });

    homebrewData.conditions.forEach(condition => {
        conditionList.innerHTML += createConditionCard(condition);
    });
});