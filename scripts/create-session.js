// scripts/create-session.js
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function createNewSession() {
    try {
        // Get session details
        const number = await question('Session number: ');
        const name = await question('Session name: ');
        const gameday = await question('Game day (e.g., Ches 1st): ');

        // Create content
        const date = new Date().toISOString();
        const content = `---
tags:
  - "#SessionRecap"
number: ${number}
name: ${name}
date: ${date}
gameday:
  - ${gameday}
---
> [!metadata|metadata]- Metadata 
>> [!metadata|metadataoption]- System
>> #### System
>>  |
>> ---|---|
> **Tags** | \`INPUT[Tags][inlineListSuggester:tags]\` |
>
>> [!metadata|metadataoption]- Info
>> #### Info
>>  |
>> ---|---|
>> **Session Number** | \`INPUT[number:number]\` |
>> **Session Name** | \`INPUT[text:name]\` |
>> **Session Date** | \`INPUT[datePicker:date]\`
>> **In-Game Day** | \`INPUT[list:gameday]\` |

[Enter session recap here...]
`;

        // Get the project root directory (two levels up from scripts folder)
        const projectRoot = path.join(__dirname, '..');
        const filename = `Session ${number} - ${name}.md`;
        const filePath = path.join(projectRoot, 'data', 'journal-entries', filename);

        // Ensure the directory exists
        const dirPath = path.join(projectRoot, 'data', 'journal-entries');
        await fs.mkdir(dirPath, { recursive: true });

        // Write the file
        await fs.writeFile(filePath, content);

        console.log(`Created new session file: ${filename}`);
    } catch (error) {
        console.error('Error creating session:', error);
    } finally {
        rl.close();
    }
}

createNewSession();