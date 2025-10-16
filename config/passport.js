import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { getDB } from "../db/connect.js";
import { ObjectId } from "mongodb";

// Configure Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const db = getDB();
                const email = profile.emails[0].value;
                const name = profile.displayName;
                const googleId = profile.id;

                // Check if user already exists
                let user = await db.collection("users").findOne({
                    $or: [{ email }, { googleId }],
                });

                if (user) {
                    // Update googleId if not present
                    if (!user.googleId) {
                        await db.collection("users").updateOne(
                            { _id: user._id },
                            { $set: { googleId, updatedAt: new Date() } }
                        );
                        user.googleId = googleId;
                    }
                    return done(null, user);
                }

                // Create new user if doesn't exist
                const result = await db.collection("users").insertOne({
                    name,
                    email,
                    googleId,
                    role: "user",
                    provider: "google",
                    createdAt: new Date(),
                });

                const newUser = {
                    _id: result.insertedId,
                    name,
                    email,
                    googleId,
                    role: "user",
                    provider: "google",
                };

                return done(null, newUser);
            } catch (err) {
                console.error("❌ Google OAuth Error:", err);
                return done(err, null);
            }
        }
    )
);

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id.toString());
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const db = getDB();
        const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;

