import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.DB_URI as string);
const db = client.db("ph-car-wash-system");

export const auth = betterAuth({

  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      role: {
        type: ["admin", "user", "branchManager"],
        input: false,
        defaultValue: "user",
      }
    }
  },

  //...other options
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {

  },
});