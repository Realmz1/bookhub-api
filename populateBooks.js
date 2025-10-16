import dotenv from "dotenv";
import { connectDB, getDB } from "./db/connect.js";

dotenv.config();

// Sample data for generating random books
const titles = [
    "The Silent Echo",
    "Midnight Chronicles",
    "Shadows of Tomorrow",
    "The Last Kingdom",
    "Whispers in the Wind",
    "The Forgotten Path",
    "Beyond the Horizon",
    "The Crystal Garden",
    "Echoes of Eternity",
    "The Quantum Paradox",
    "Rivers of Time",
    "The Starlight Prophecy",
    "Dancing with Dragons",
    "The Secret Library",
    "Voices of the Past",
    "The Crimson Tide",
    "Tales of the Ancients",
    "The Infinite Loop",
    "The Golden Compass",
    "The Storm Weavers",
    "The Emerald City",
    "Dreams of Fire",
    "The Silver Thread",
    "The Lost Archipelago",
    "The Wandering Stars",
    "The Phoenix Rising",
    "The Moonlit Path",
    "The Clockwork Heart",
    "The Shadow Realm",
    "The Eternal Flame",
    "The Hidden Valley",
    "The Sapphire Sea",
    "The Broken Crown",
    "The Ancient Code",
    "The Mystic Portal",
    "The Frozen Kingdom",
    "The Desert Bloom",
    "The Midnight Garden",
    "The Celestial Journey",
    "The Forgotten Empire"
];

const authors = [
    "Emma Blackwood",
    "James Morrison",
    "Sarah Chen",
    "Michael Anderson",
    "Olivia Roberts",
    "David Martinez",
    "Emily Thompson",
    "Christopher Lee",
    "Sophia Williams",
    "Daniel Brown",
    "Isabella Garcia",
    "Matthew Davis",
    "Ava Rodriguez",
    "Joshua Wilson",
    "Mia Johnson",
    "Andrew Taylor",
    "Charlotte Moore",
    "Ryan Jackson",
    "Amelia White",
    "Nathan Harris"
];

const genres = [
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Thriller",
    "Romance",
    "Historical Fiction",
    "Adventure",
    "Horror",
    "Contemporary Fiction",
    "Literary Fiction",
    "Dystopian",
    "Magical Realism",
    "Crime",
    "Young Adult",
    "Urban Fantasy"
];

const summaries = [
    "A captivating tale of courage and redemption in a world on the brink of collapse.",
    "An epic journey through time and space that will leave you breathless.",
    "A gripping story of love and betrayal set against a backdrop of political intrigue.",
    "A haunting exploration of what it means to be human in an increasingly digital world.",
    "An unforgettable adventure that spans continents and generations.",
    "A mesmerizing blend of magic and reality that challenges our perception of truth.",
    "A powerful narrative about family, sacrifice, and the choices that define us.",
    "A thrilling page-turner that keeps you guessing until the very end.",
    "A beautiful meditation on loss, hope, and the resilience of the human spirit.",
    "An imaginative tale that pushes the boundaries of what's possible.",
    "A thought-provoking story about identity and belonging in a fractured world.",
    "A richly detailed saga of power, ambition, and the price of greatness.",
    "An intimate portrait of ordinary people facing extraordinary circumstances.",
    "A spine-tingling mystery that will keep you up all night.",
    "A lyrical exploration of dreams, destiny, and the nature of reality.",
    "A compelling story of survival against impossible odds.",
    "A sweeping epic that brings history to life with vivid detail and emotion.",
    "A dark and twisted tale that explores the shadows of the human psyche.",
    "A heartwarming story about friendship, forgiveness, and second chances.",
    "A mind-bending adventure through alternate realities and parallel worlds."
];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomYear() {
    return Math.floor(Math.random() * (2024 - 1950 + 1)) + 1950;
}

function generateRandomBook() {
    return {
        title: getRandomElement(titles),
        author: getRandomElement(authors),
        genre: getRandomElement(genres),
        year: getRandomYear(),
        summary: getRandomElement(summaries),
        createdAt: new Date(),
    };
}

async function populateBooks(count = 50) {
    try {
        await connectDB();
        const db = getDB();

        console.log(`🚀 Starting to populate database with ${count} random books...\n`);

        const books = [];
        for (let i = 0; i < count; i++) {
            books.push(generateRandomBook());
        }

        const result = await db.collection("books").insertMany(books);

        console.log(`✅ Successfully added ${result.insertedCount} books to the database!`);
        console.log(`📚 Total books in database: ${await db.collection("books").countDocuments()}`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Error populating database:", err);
        process.exit(1);
    }
}

// Get count from command line argument or default to 50
const count = parseInt(process.argv[2]) || 50;
populateBooks(count);

