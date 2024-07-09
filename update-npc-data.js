const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const obsidianNpcFolder = path.join('E:', 'Documents', 'GitHub', 'Ryans_WDH_DM_Notes', 'World Almanac', 'NPCs');
const npcDataFile = path.join(__dirname, 'data', 'npc-data.js');
const npcImagesFolder = path.join(__dirname, 'images', 'NPC_Images');

function extractNpcData(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const [, frontmatter] = content.split('---');

        const data = yaml.load(frontmatter);

        if (data.metParty !== true) {
            return null; // Skip this NPC if they haven't met the party
        }

        let imagePath = data.art
            ? path.join('images', 'NPC_Images', path.basename(data.art))
            : path.join('images', 'NPC_Images', 'PlaceholderImage.png');

        // Check if the image file exists
        const fullImagePath = path.join(__dirname, imagePath);
        if (!fs.existsSync(fullImagePath)) {
            console.warn(`Warning: Image not found for ${data.name}: ${fullImagePath}`);
            imagePath = path.join('images', 'NPC_Images', 'PlaceholderImage.png');
        }

        // Helper function to remove [[ and ]] from strings and apostrophes
        const cleanString = (str) => str.replace(/\[\[|\]\]/g, '').replace(/'/g, '');

        return {
            name: path.basename(filePath, '.md'),
            title: data.aliases && data.aliases.length > 0 ? data.aliases[0] : '',
            wards: (data.wards || []).map(cleanString),
            factions: (data.organization || []).map(cleanString),
            status: data.status || [],
            race: [data.ancestry, data.heritage].filter(Boolean),
            image: imagePath,
            description: data.description || '',
            isAlive: data.condition !== 'dead',
            notableInfo: data.notableInfo || ''
        };
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        return null;
    }
}

function updateNpcData() {
    const npcs = [];
    
    fs.readdirSync(obsidianNpcFolder).forEach(file => {
        if (path.extname(file) === '.md') {
            const filePath = path.join(obsidianNpcFolder, file);
            const npcData = extractNpcData(filePath);
            if (npcData) {
                npcs.push(npcData);
            }
        }
    });
    
    const npcDataContent = `const npcs = ${JSON.stringify(npcs, null, 2)};`;
    fs.writeFileSync(npcDataFile, npcDataContent);
    
    console.log(`Updated ${npcs.length} NPCs in ${npcDataFile}`);
}

updateNpcData();