
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(
  process.env.MONGODB_URL as string
);

const db = client.db("StudioSpace");

const authBaseUrl = process.env.BETTER_AUTH_URL;

if (!authBaseUrl) {
  throw new Error("BETTER_AUTH_URL is missing.");
}

export const auth = betterAuth({
  baseURL: authBaseUrl,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    jwt({
      jwt: {
        issuer: authBaseUrl,
        audience: authBaseUrl,
        expirationTime: "15m",
      },
    }),
  ],
});
