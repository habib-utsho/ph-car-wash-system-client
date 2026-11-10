import { LucideIcon } from "lucide-react";

export type TUserRole = "admin" | "user" | "branchManager";

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