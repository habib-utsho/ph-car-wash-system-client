"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api/config";
import type { TUserRole } from "@/types";

type UpdateUserInput = {
  userId: string;
  role: TUserRole;
  branch: string | null;
};

type UpdateUserResult = {
  success: boolean;
  message: string;
};

// Changes one user's role and branch. Only admins can do this.
// Called directly from the users table when an admin presses Save.
export async function updateUser(input: UpdateUserInput): Promise<UpdateUserResult> {
  // 1. Who is calling? Read the session on the server, never trust the browser.
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.role !== "admin") {
    return { success: false, message: "Only admins can change users." };
  }

  // 2. An admin cannot remove their own admin role, so the site always keeps an admin.
  if (input.userId === session.user.id && input.role !== "admin") {
    return { success: false, message: "You cannot remove your own admin role." };
  }

  // 3. Send the change to the Express backend.
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/users/${input.userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: input.role, branch: input.branch }),
      cache: "no-store",
    });
  } catch {
    return { success: false, message: "Could not reach the server. Please try again." };
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return {
      success: false,
      message: body?.message || "The server could not update this user.",
    };
  }

  // 4. Refresh the page so the table shows the new values.
  revalidatePath("/dashboard/admin/users");

  return { success: true, message: "The user was updated." };
}
