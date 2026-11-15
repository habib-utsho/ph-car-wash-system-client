import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { BRANCHES } from "./branches";


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
      },
      // Only branch managers have a branch. Set by an admin on the server, never by the user.
      // Better Auth does not check enum values at runtime, so Express must validate the value.
      branch: {
        type: [...BRANCHES],
        input: false,
        required: false,
        defaultValue: null,
      },

    }
  },

  //...other options
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {

  },
});