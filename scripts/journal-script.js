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
        // Split the description into paragraphs
        const paragraphs = description.split('\n\n');
        
        // Wrap each paragraph in <p> tags
        return paragraphs.map(p => `<p>${p}</p>`).join('');
    }

    function renderJournalEntries() {
        journalEntries.forEach(entry => {
            const entryElement = createJournalEntry(entry);
            journalContainer.appendChild(entryElement);
        });
    }

    renderJournalEntries();
});