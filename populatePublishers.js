import dotenv from "dotenv";
import { connectDB, getDB } from "./db/connect.js";

dotenv.config();

// Sample data for publishers
const publishers = [
    {
        name: "Penguin Random House",
        country: "United States",
        founded: 2013,
        website: "https://www.penguinrandomhouse.com",
    },
    {
        name: "HarperCollins",
        country: "United States",
        founded: 1989,
        website: "https://www.harpercollins.com",
    },
    {
        name: "Simon & Schuster",
        country: "United States",
        founded: 1924,
        website: "https://www.simonandschuster.com",
    },
    {
        name: "Macmillan Publishers",
        country: "United Kingdom",
        founded: 1843,
        website: "https://www.macmillan.com",
    },
    {
        name: "Hachette Book Group",
        country: "France",
        founded: 1826,
        website: "https://www.hachettebookgroup.com",
    },
    {
        name: "Scholastic Corporation",
        country: "United States",
        founded: 1920,
        website: "https://www.scholastic.com",
    },
    {
        name: "Oxford University Press",
        country: "United Kingdom",
        founded: 1586,
        website: "https://global.oup.com",
    },
    {
        name: "Cambridge University Press",
        country: "United Kingdom",
        founded: 1534,
        website: "https://www.cambridge.org",
    },
    {
        name: "Bloomsbury Publishing",
        country: "United Kingdom",
        founded: 1986,
        website: "https://www.bloomsbury.com",
    },
    {
        name: "Pearson Education",
        country: "United Kingdom",
        founded: 1844,
        website: "https://www.pearson.com",
    },
    {
        name: "Wiley",
        country: "United States",
        founded: 1807,
        website: "https://www.wiley.com",
    },
    {
        name: "Springer Nature",
        country: "Germany",
        founded: 2015,
        website: "https://www.springernature.com",
    },
    {
        name: "Kodansha",
        country: "Japan",
        founded: 1909,
        website: "https://www.kodansha.co.jp",
    },
    {
        name: "Shueisha",
        country: "Japan",
        founded: 1925,
        website: "https://www.shueisha.co.jp",
    },
    {
        name: "Gallimard",
        country: "France",
        founded: 1911,
        website: "https://www.gallimard.fr",
    },
    {
        name: "Planeta",
        country: "Spain",
        founded: 1949,
        website: "https://www.planetadelibros.com",
    },
    {
        name: "Bonnier Books",
        country: "Sweden",
        founded: 1837,
        website: "https://www.bonnierbooks.com",
    },
    {
        name: "Companhia das Letras",
        country: "Brazil",
        founded: 1986,
        website: "https://www.companhiadasletras.com.br",
    },
    {
        name: "Tor Books",
        country: "United States",
        founded: 1980,
        website: "https://www.tor.com",
    },
    {
        name: "Vintage Books",
        country: "United States",
        founded: 1954,
        website: "https://www.penguinrandomhouse.com/publishers/vintage-books",
    },
    {
        name: "Faber and Faber",
        country: "United Kingdom",
        founded: 1929,
        website: "https://www.faber.co.uk",
    },
    {
        name: "Knopf Doubleday",
        country: "United States",
        founded: 1915,
        website: "https://knopfdoubleday.com",
    },
    {
        name: "Random House",
        country: "United States",
        founded: 1927,
        website: "https://www.penguinrandomhouse.com",
    },
    {
        name: "Penguin Books",
        country: "United Kingdom",
        founded: 1935,
        website: "https://www.penguin.co.uk",
    },
    {
        name: "Little, Brown and Company",
        country: "United States",
        founded: 1837,
        website: "https://www.littlebrown.com",
    },
];

async function populatePublishers() {
    try {
        await connectDB();
        const db = getDB();

        console.log(`🚀 Starting to populate database with ${publishers.length} publishers...\n`);

        // Add createdAt timestamp to each publisher
        const publishersWithTimestamp = publishers.map(publisher => ({
            ...publisher,
            createdAt: new Date(),
        }));

        const result = await db.collection("publishers").insertMany(publishersWithTimestamp);

        console.log(`✅ Successfully added ${result.insertedCount} publishers to the database!`);
        console.log(`📖 Total publishers in database: ${await db.collection("publishers").countDocuments()}`);

        // Display some stats
        const countries = [...new Set(publishers.map(p => p.country))];
        console.log(`\n📊 Publishers from ${countries.length} different countries:`);
        countries.forEach(country => {
            const count = publishers.filter(p => p.country === country).length;
            console.log(`   - ${country}: ${count}`);
        });

        process.exit(0);
    } catch (err) {
        console.error("❌ Error populating database:", err);
        process.exit(1);
    }
}

populatePublishers();


