// Add this at the start of your journal-script.js
let headerHeight = 0;

function calculateHeaderHeight() {
    const header = document.querySelector('header');
    if (header) {
        headerHeight = header.getBoundingClientRect().height;
        // Update CSS variable
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
}

// Call this after header is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a short moment for header to fully render
    setTimeout(calculateHeaderHeight, 100);
});

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
    function renderMarkdown(text) {
        // Handle bold text
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Handle underlined text using <u> tag
        text = text.replace(/__(.*?)__/g, '<u>$1</u>');

        // Handle italic text (single asterisks)
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Handle line breaks
        text = text.replace(/\n\n/g, '</p><p>');
        text = text.replace(/\n/g, '<br>');

        return text;
    }

    function formatDescription(description) {
        // Split into paragraphs and apply markdown formatting to each
        const paragraphs = description.split('\n\n');
        return paragraphs
            .map(p => `<p>${renderMarkdown(p.trim())}</p>`)
            .join('');
    }

    function getBaseSessionNumber(sessionNumber) {
        // Convert session number to string and get the base number before any decimal
        return Math.floor(parseFloat(sessionNumber));
    }

    function shouldGroupTogether(current, next) {
        if (!next) return false;

        const currentBase = getBaseSessionNumber(current.sessionNumber);
        const nextBase = getBaseSessionNumber(next.sessionNumber);

        if (currentBase !== nextBase) return false;

        // Check if both sessions have decimal parts
        const currentDecimal = current.sessionNumber % 1;
        const nextDecimal = next.sessionNumber % 1;

        // Group together only if both have non-.5 decimals (like .1, .2)
        // Don't group if either is a .5
        if (currentDecimal === 0.5 || nextDecimal === 0.5) return false;
        if (currentDecimal > 0 && nextDecimal > 0) return true;

        return false;
    }

    function groupEntries(entries) {
        const groups = [];
        let currentGroup = [];

        entries.forEach((entry, index) => {
            currentGroup.push(entry);

            const nextEntry = entries[index + 1];

            // Check if current entry should be grouped with next entry
            if (!shouldGroupTogether(entry, nextEntry)) {
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
        // Create observer with adjusted root margin based on header height
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const currentId = entry.target.id;
                const currentSessionNumber = parseFloat(currentId.replace('session-', ''));
                const baseSessionNumber = Math.floor(currentSessionNumber);

                // Find all related simultaneous entries
                const simultaneousEntries = Array.from(document.querySelectorAll('.journal-entry'))
                    .filter(el => {
                        const sessionNum = parseFloat(el.id.replace('session-', ''));
                        // Match entries with same base number and decimal parts
                        return Math.floor(sessionNum) === baseSessionNumber &&
                            sessionNum % 1 !== 0 &&
                            sessionNum % 1 !== 0.5; // Exclude .5 entries
                    });

                if (entry.isIntersecting) {
                    // Remove active class from all nav links first
                    document.querySelectorAll('.journal-nav-link').forEach(link => {
                        link.classList.remove('active');
                    });

                    // If this is part of a simultaneous entry group
                    if (simultaneousEntries.length > 1) {
                        simultaneousEntries.forEach(simEntry => {
                            const link = document.querySelector(`.journal-nav-link[href="#${simEntry.id}"]`);
                            if (link) {
                                link.classList.add('active');
                                ensureLinkVisible(link);
                            }
                        });
                    } else {
                        // Regular entry
                        const link = document.querySelector(`.journal-nav-link[href="#${currentId}"]`);
                        if (link) {
                            link.classList.add('active');
                            ensureLinkVisible(link);
                        }
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: `-${headerHeight}px 0px -50% 0px`
        });

        // Observe all journal entries
        document.querySelectorAll('.journal-entry').forEach(entry => {
            observer.observe(entry);
        });
    }

    function ensureLinkVisible(link) {
        const nav = document.querySelector('.journal-nav');
        const linkRect = link.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();

        // Calculate if link is outside visible area
        const isAbove = linkRect.top < navRect.top;
        const isBelow = linkRect.bottom > navRect.bottom;

        if (isAbove) {
            // Link is above visible area, scroll up
            const scrollAmount = nav.scrollTop + (linkRect.top - navRect.top) - 20;
            nav.scrollTo({
                top: scrollAmount,
                behavior: 'smooth'
            });
        } else if (isBelow) {
            // Link is below visible area, scroll down
            const scrollAmount = nav.scrollTop + (linkRect.bottom - navRect.bottom) + 20;
            nav.scrollTo({
                top: scrollAmount,
                behavior: 'smooth'
            });
        }
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