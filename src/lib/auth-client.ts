import { createAuthClient } from "better-auth/react"
import { auth } from "./auth"
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [inferAdditionalFields<typeof auth>(), jwtClient()],
})

export const { signIn, signUp, signOut, useSession } = createAuthClient()
