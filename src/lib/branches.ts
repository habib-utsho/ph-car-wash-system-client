// The four branches. Hardcoded on purpose (no branches collection).
//
// Keep this file free of server imports. Client components use it too,
// so it must not import auth.ts or anything that talks to MongoDB.
export const BRANCHES = ["Dhaka", "Chittagong", "Khulna", "Sylhet"] as const;

export type TBranch = (typeof BRANCHES)[number];
