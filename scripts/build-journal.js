// scripts/build-journal.js
const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

// Function to clean up the date format
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Will format as DD/MM/YYYY
}

// Function to extract session number from filename
function extractSessionNumber(filename) {
    const match = filename.match(/Session (\d+(\.\d+)?)/i);
    return match ? parseFloat(match[1]) : null;
}

// Function to extract clean text content without metadata callouts
function cleanContent(content) {
    // Remove the metadata callout block
    content = content.replace(/> \[!metadata\|metadata\][\s\S]*?(?=\n\n)/g, '');

    // Clean up any remaining empty lines at the start
    content = content.replace(/^\s+/, '');

    return content.trim();
}

async function buildJournalEntries() {
    // Get the project root directory (one level up from scripts folder)
    const projectRoot = path.join(__dirname, '..');
    const entriesDir = path.join(projectRoot, 'data', 'journal-entries');

    try {
        // Read all files in the entries directory
        const files = await fs.readdir(entriesDir);
        const markdownFiles = files.filter(file => file.endsWith('.md'));

        // Process each file
        const entries = await Promise.all(
            markdownFiles.map(async file => {
                const filePath = path.join(entriesDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                const { data, content: markdown } = matter(content);

                // Use session number from filename if not in frontmatter
                const sessionNumber = data.number || extractSessionNumber(file);

                if (!sessionNumber) {
                    console.warn(`Warning: Could not extract session number from ${file}`);
                }

                // Convert the data into the format expected by your journal viewer
                return {
                    sessionNumber: sessionNumber,
                    title: data.name,
                    date: formatDate(data.date),
                    day: Array.isArray(data.gameday) ? data.gameday[0] : data.gameday,
                    description: cleanContent(markdown),
                    tags: data.tags || []
                };
            })
        );

        // Filter out any entries where we couldn't get a session number
        const validEntries = entries.filter(entry => entry.sessionNumber !== null);

        // Sort entries by session number
        validEntries.sort((a, b) => a.sessionNumber - b.sessionNumber);

        // Generate the JavaScript file
        const jsContent = `const journalEntries = ${JSON.stringify(validEntries, null, 2)};`;

        // Write to journal-entries.js in the js directory
        const outputPath = path.join(projectRoot, 'scripts', 'journal-entries.js');
        await fs.writeFile(outputPath, jsContent);

        console.log('Successfully built journal entries');
        console.log(`Output: ${outputPath}`);
        console.log(`Processed ${validEntries.length} entries`);

        // Log each entry for verification
        validEntries.forEach(entry => {
            console.log(`- Session ${entry.sessionNumber}: ${entry.title} (${entry.day})`);
        });

        // Log any warnings about file naming
        const invalidFiles = markdownFiles.filter(file => !extractSessionNumber(file));
        if (invalidFiles.length > 0) {
            console.warn('\nWarning: The following files do not follow the "Session X - Name" format:');
            invalidFiles.forEach(file => console.warn(`- ${file}`));
        }
    } catch (error) {
        console.error('Error building journal entries:', error);
        console.error('Detailed error:', error.message);
        throw error;
    }
}

buildJournalEntries();