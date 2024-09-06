import { registerAs } from "@nestjs/config";

export default registerAs("oauth", () => ({
  github: {
    clientID: process.env.GITHUB_CLIENT_ID || "demo_id", // clientID needs to be set to something or class will not be instantiated
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "demo_secret",
    callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/auth/github/callback",
  },
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY || "demo_key",
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || "demo_secret",
    callbackURL: process.env.TWITTER_CALLBACK_URL || "http://localhost:3000/auth/twitter/callback",
  },
}));
