document.addEventListener('DOMContentLoaded', function() {
    const journalContainer = document.getElementById('journal-entries');

    function createJournalEntry(entry) {
        const entryElement = document.createElement('div');
        entryElement.className = 'journal-entry';

        let titleHtml = entry.title 
            ? `<h2>${entry.sessionNumber}. ${entry.title}</h2>`
            : `<h2>Session ${entry.sessionNumber}</h2>`;

        let metaHtml = `
            <div class="journal-meta">
                <span class="journal-date">${entry.date}</span>
                ${entry.day ? `<span class="journal-day">Day: ${entry.day}</span>` : ''}
            </div>
        `;

        let descriptionHtml = `<div class="journal-content">${formatDescription(entry.description)}</div>`;

        entryElement.innerHTML = metaHtml + titleHtml + descriptionHtml;

        return entryElement;
    }

    function formatDescription(description) {
        const paragraphs = description.split('\n\n');
        return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
    }

    function getBaseSessionNumber(sessionNumber) {
        // Convert session number to string and get the base number before any decimal
        return Math.floor(parseFloat(sessionNumber));
    }

    function groupEntries(entries) {
        const groups = [];
        let currentGroup = [];
        
        entries.forEach((entry, index) => {
            const currentBase = getBaseSessionNumber(entry.sessionNumber);
            const nextEntry = entries[index + 1];
            const nextBase = nextEntry ? getBaseSessionNumber(nextEntry.sessionNumber) : null;
            
            currentGroup.push(entry);
            
            // If next entry isn't part of current session number or this is the last entry
            if (!nextEntry || currentBase !== nextBase) {
                groups.push(currentGroup);
                currentGroup = [];
            }
        });
        
        return groups;
    }

    function renderJournalEntries() {
        const groups = groupEntries(journalEntries);
        
        groups.forEach(group => {
            const groupContainer = document.createElement('div');
            groupContainer.className = 'journal-group';
            
            // Apply flex layout if there are multiple entries in the group
            if (group.length > 1) {
                groupContainer.classList.add('journal-group-flex');
            }
            
            group.forEach(entry => {
                const entryElement = createJournalEntry(entry);
                if (group.length > 1) {
                    entryElement.classList.add('journal-entry-flex');
                }
                groupContainer.appendChild(entryElement);
            });
            
            journalContainer.appendChild(groupContainer);
        });
    }

    renderJournalEntries();
});