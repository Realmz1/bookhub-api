import dotenv from "dotenv";
import { connectDB, getDB } from "./db/connect.js";

dotenv.config();

// Sample data for generating random reviews
const bookTitles = [
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
    "Atomic Habits",
    "The Golden Compass",
];

const reviewers = [
    "Sarah Mitchell",
    "David Chen",
    "Emily Rodriguez",
    "Michael Johnson",
    "Jessica Taylor",
    "Robert Anderson",
    "Amanda White",
    "Christopher Lee",
    "Laura Martinez",
    "Daniel Brown",
    "Sophia Wilson",
    "James Davis",
    "Rachel Thompson",
    "Kevin Moore",
    "Lisa Garcia",
    "Matthew Jackson",
    "Nicole Harris",
    "Ryan Clark",
    "Jennifer Lewis",
    "Brian Walker",
];

const positiveComments = [
    "Absolutely loved this book! Couldn't put it down.",
    "A masterpiece of storytelling. Highly recommended!",
    "One of the best books I've read this year.",
    "Beautifully written and deeply moving.",
    "The author's imagination is boundless. Amazing read!",
    "This book changed my perspective on so many things.",
    "Captivating from start to finish.",
    "An instant classic that will stand the test of time.",
    "The characters feel so real and relatable.",
    "A thrilling ride that kept me guessing until the end.",
];

const neutralComments = [
    "A decent read with some interesting moments.",
    "It was okay, but not what I expected.",
    "Some parts were great, others felt a bit slow.",
    "Worth reading if you have the time.",
    "Not bad, but could have been better.",
    "Has potential but falls short in some areas.",
    "An average book with a few standout scenes.",
    "It's alright for what it is.",
];

const negativeComments = [
    "Unfortunately, this book didn't live up to the hype.",
    "The pacing was too slow for my taste.",
    "I found the characters underdeveloped.",
    "Not my cup of tea, but others might enjoy it.",
    "Struggled to finish this one.",
    "The plot felt predictable and uninspired.",
];

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomRating() {
    // Weight towards higher ratings (more realistic distribution)
    const weights = [2, 5, 10, 20, 30]; // 1-5 stars
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i++) {
        if (random < weights[i]) {
            return i + 1;
        }
        random -= weights[i];
    }
    return 5;
}

function getCommentForRating(rating) {
    if (rating >= 4) {
        return getRandomElement(positiveComments);
    } else if (rating === 3) {
        return getRandomElement(neutralComments);
    } else {
        return getRandomElement(negativeComments);
    }
}

function generateRandomReview() {
    const rating = getRandomRating();
    return {
        bookTitle: getRandomElement(bookTitles),
        reviewer: getRandomElement(reviewers),
        rating: rating,
        comment: getCommentForRating(rating),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
    };
}

async function populateReviews(count = 50) {
    try {
        await connectDB();
        const db = getDB();

        console.log(`🚀 Starting to populate database with ${count} random reviews...\n`);

        const reviews = [];
        for (let i = 0; i < count; i++) {
            reviews.push(generateRandomReview());
        }

        const result = await db.collection("reviews").insertMany(reviews);

        console.log(`✅ Successfully added ${result.insertedCount} reviews to the database!`);
        console.log(`⭐ Total reviews in database: ${await db.collection("reviews").countDocuments()}`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Error populating database:", err);
        process.exit(1);
    }
}

// Get count from command line argument or default to 50
const count = parseInt(process.argv[2]) || 50;
populateReviews(count);


