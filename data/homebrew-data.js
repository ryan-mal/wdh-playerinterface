const homebrewData = {
    spells: [
        {
            name: "Shadow Veil",
            level: 2,
            school: "Illusion",
            castingTime: "1 action",
            range: "Self",
            components: "V, S",
            duration: "Concentration, up to 1 minute",
            description: "You weave shadows around yourself, becoming invisible in dimly lit or dark areas. While in bright light, you appear as a dark, shifting silhouette. You have advantage on Dexterity (Stealth) checks made to hide in dim light or darkness."
        },
        {
            name: "Whispers of the City",
            level: 1,
            school: "Divination",
            castingTime: "1 action",
            range: "30 feet",
            components: "V, S",
            duration: "Instantaneous",
            description: "You attune your senses to the subtle murmurs of an urban environment. You learn one rumor, secret, or piece of gossip related to your current location or a specific person or place within the city you're in."
        }
    ],
    rules: [
        {
            name: "Urban Parkour",
            description: "When attempting to quickly navigate through crowded city streets or over rooftops, you can use your Dexterity (Acrobatics) skill instead of Strength (Athletics) for climbing and jumping checks."
        },
        {
            name: "Shady Contacts",
            description: "Once per long rest, you can attempt to call in a favor from a contact in the criminal underworld. Roll a d20 and add your Charisma modifier. On a 15 or higher, you successfully acquire a piece of information, a small illegal item, or a minor service without cost."
        }
    ],
    conditions: [
        {
            name: "Marked",
            description: "You've been identified by a powerful faction within the city. While marked, you have disadvantage on Charisma (Deception) checks made to conceal your identity, and members of the faction that marked you have advantage on Wisdom (Perception) checks made to spot you in a crowd."
        },
        {
            name: "Indebted",
            description: "You owe a significant debt to a powerful individual or organization. While indebted, you must succeed on a DC 15 Wisdom saving throw to refuse a direct request from your creditor. On a failed save, you feel compelled to comply with the request, even if it goes against your better judgment."
        }
    ]
};