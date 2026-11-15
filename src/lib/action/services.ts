"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api/config";
import { BRANCHES, type TBranch } from "@/lib/branches";
import type { TServiceField, TServiceFormState } from "@/types";

// Roles allowed to create services. Checked on the server, never trusted from the form.
const ALLOWED_ROLES = ["branchManager", "admin"];

// Creates a service in the Express backend (POST /services).
// Called directly from the Add Service form's submit handler.
export async function createService(formData: FormData): Promise<TServiceFormState> {
  try {
    return await saveService(formData);
  } catch (error) {
    // Unexpected failure: log the full error for the developer, and show the user a plain message.
    console.error("createService failed:", error);
    return {
      success: false,
      message: "Something went wrong while saving the service. Please try again.",
    };
  }
}

async function saveService(formData: FormData): Promise<TServiceFormState> {
  // 1. Who is calling? Read the session on the server.
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !ALLOWED_ROLES.includes(session.user.role ?? "")) {
    return { success: false, message: "You are not allowed to add services." };
  }

  // 2. Read and validate the form fields.
  const { values, errors, data } = readServiceForm(formData);

  if (data === null) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      errors,
      values,
    };
  }

  // 3. Send to Express. createdBy comes from the verified session, not from the form.
  try {
    const res = await fetch(`${API_BASE_URL}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, createdBy: session.user.email }),
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        success: false,
        message: "The server could not save the service. Please try again.",
        values,
      };
    }
  } catch {
    return {
      success: false,
      message: "Could not reach the server. Please try again.",
      values,
    };
  }

  // 4. Refresh the page so the table shows the new service.
  revalidatePath("/dashboard/branchManager/services");

  return { success: true, message: `${data.name} was added.` };
}

// Reads the raw form values, checks them, and returns clean data when valid.
// Returns data = null when any field is invalid.
function readServiceForm(formData: FormData) {
  const values: Partial<Record<TServiceField, string>> = {
    name: String(formData.get("name") ?? "").trim(),
    branch: String(formData.get("branch") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    duration: String(formData.get("duration") ?? "").trim(),
    keyFeatures: String(formData.get("keyFeatures") ?? "").trim(),
    slot: String(formData.get("slot") ?? "").trim(),
  };

  const errors: Partial<Record<TServiceField, string>> = {};

  if (!values.name) {
    errors.name = "Service name is required.";
  }

  if (!BRANCHES.includes(values.branch as TBranch)) {
    errors.branch = "Choose a valid branch.";
  }

  if (!isHttpUrl(values.image ?? "")) {
    errors.image = "Enter a valid image URL starting with http:// or https://.";
  }

  if (!values.description) {
    errors.description = "Description is required.";
  }

  const price = Number(values.price);
  if (values.price === "" || Number.isNaN(price) || price < 0) {
    errors.price = "Price must be 0 or more.";
  }

  const duration = Number(values.duration);
  if (values.duration === "" || !Number.isInteger(duration) || duration <= 0) {
    errors.duration = "Duration must be a whole number of minutes.";
  }

  // One feature per line. Empty lines are ignored.
  const keyFeatures = (values.keyFeatures ?? "")
    .split("\n")
    .map((feature) => feature.trim())
    .filter(Boolean);

  if (keyFeatures.length === 0) {
    errors.keyFeatures = "Add at least one key feature (one per line).";
  }

  if (Object.keys(errors).length > 0) {
    return { values, errors, data: null };
  }

  return {
    values,
    errors,
    data: {
      name: values.name as string,
      branch: values.branch as TBranch,
      image: values.image as string,
      description: values.description as string,
      price,
      duration,
      keyFeatures,
      slot: values.slot || undefined,
    },
  };
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
