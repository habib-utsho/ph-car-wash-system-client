import { LucideIcon } from "lucide-react";
import type { TBranch } from "@/lib/branches";

export type TUserRole = "admin" | "user" | "branchManager";

// A service as returned by the Express API (GET /services).
export type TService = {
    _id: string;
    name: string;
    branch: TBranch;
    image: string;
    description: string;
    price: number;
    duration: number;
    keyFeatures: string[];
    slot?: string | null;
    createdBy: string;
};

export type TServiceField =
    | "name"
    | "branch"
    | "image"
    | "description"
    | "price"
    | "duration"
    | "keyFeatures"
    | "slot";

// State returned by the createService server action.
export type TServiceFormState = {
    success: boolean;
    message: string;
    errors?: Partial<Record<TServiceField, string>>;
    // Raw form values, sent back so the form keeps what the user typed on error.
    values?: Partial<Record<TServiceField, string>>;
};

export type TUser = {
    name: string;
    email: string;
    image?: string | null;
    role?: string | null;
};

export type TDashboardSidebarItem = {
    title: string;
    href: string;
    icon: LucideIcon;
    roles?: TUserRole[];
};