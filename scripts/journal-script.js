// Front matter parser
function parseFrontMatter(content) {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);

    if (!match) return null;

    const [, frontMatter, body] = match;
    const metadata = {};

    // Parse the front matter
    frontMatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            let value = valueParts.join(':').trim();
            // Remove quotes if they exist
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            metadata[key.trim()] = value;
        }
    });

    return {
        metadata,
        content: body.trim()
    };
}

async function loadJournalEntries() {
    try {
        // Fetch the list of files from your entries directory
        const response = await fetch('/journal/entries/');
        const files = await response.json();  // This would need to be implemented on your server

        const entries = await Promise.all(
            files.map(async file => {
                const response = await fetch(`/journal/entries/${file}`);
                const text = await response.text();
                const parsed = parseFrontMatter(text);

                if (!parsed) return null;

                return {
                    ...parsed.metadata,
                    description: parsed.content,
                    sessionNumber: parseFloat(parsed.metadata.sessionNumber)
                };
            })
        );

        // Filter out any null entries and sort by session number
        return entries
            .filter(entry => entry !== null)
            .sort((a, b) => a.sessionNumber - b.sessionNumber);

    } catch (error) {
        console.error('Error loading journal entries:', error);
        return [];
    }
}

document.addEventListener('DOMContentLoaded', function () {
    function formatDescription(description) {
        // Split the description into paragraphs
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

    function createNavigation() {
        // Group entries by game day
        const entriesByDay = {};
        journalEntries.forEach(entry => {
            if (!entriesByDay[entry.day]) {
                entriesByDay[entry.day] = [];
            }
            entriesByDay[entry.day].push(entry);
        });

        // Create navigation element
        const nav = document.createElement('nav');
        nav.className = 'journal-nav';

        // Sort days chronologically
        const sortedDays = Object.keys(entriesByDay).sort((a, b) => {
            // Extract month and day number for comparison
            const [aMonth, aDay] = a.split(' ');
            const [bMonth, bDay] = b.split(' ');
            // You might want to add proper month comparison logic here
            return parseInt(aDay) - parseInt(bDay);
        });

        // Create navigation structure
        sortedDays.forEach(day => {
            const daySection = document.createElement('div');
            daySection.className = 'journal-nav-day';
            
            const dayTitle = document.createElement('h3');
            dayTitle.textContent = day;
            
            const linksList = document.createElement('div');
            linksList.className = 'journal-nav-links';
            
            entriesByDay[day].forEach(entry => {
                const link = document.createElement('a');
                link.href = `#session-${entry.sessionNumber}`;
                link.className = 'journal-nav-link';
                link.textContent = `${entry.sessionNumber}. ${entry.title || 'Session ' + entry.sessionNumber}`;
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById(`session-${entry.sessionNumber}`)
                        .scrollIntoView({ behavior: 'smooth' });
                });
                linksList.appendChild(link);
            });
            
            daySection.appendChild(dayTitle);
            daySection.appendChild(linksList);
            nav.appendChild(daySection);
        });

        return nav;
    }

    function createJournalEntry(entry) {
        const entryElement = document.createElement('div');
        entryElement.className = 'journal-entry';
        entryElement.id = `session-${entry.sessionNumber}`;

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

    function addScrollSpy() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active class from all links
                    document.querySelectorAll('.journal-nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to corresponding link
                    const id = entry.target.id;
                    const correspondingLink = document.querySelector(`.journal-nav-link[href="#${id}"]`);
                    if (correspondingLink) {
                        correspondingLink.classList.add('active');
                    }
                }
            });
        }, {
            threshold: 0.5
        });

        // Observe all journal entries
        document.querySelectorAll('.journal-entry').forEach(entry => {
            observer.observe(entry);
        });
    }

    function renderJournal() {
        // Get the original container
        const originalContainer = document.getElementById('journal-entries');

        // Create main container
        const mainContainer = document.createElement('div');
        mainContainer.className = 'journal-container';

        // Add navigation
        const nav = createNavigation();
        mainContainer.appendChild(nav);

        // Create entries container
        const entriesContainer = document.createElement('div');
        entriesContainer.className = 'journal-entries';

        // Render entries
        const groups = groupEntries(journalEntries);
        groups.forEach(group => {
            const groupContainer = document.createElement('div');
            groupContainer.className = 'journal-group';
            
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
            
            entriesContainer.appendChild(groupContainer);
        });

        mainContainer.appendChild(entriesContainer);

        // Replace existing content
        originalContainer.replaceWith(mainContainer);

        // Add scroll spy functionality
        addScrollSpy();
    }

    // Initialize the journal
    renderJournal();
});