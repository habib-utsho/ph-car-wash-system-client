import React from "react";
import { cookies, headers } from "next/headers";
import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const [cookieStore, session] = await Promise.all([
    cookies(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  // The shadcn sidebar stores its open/collapsed state in this cookie.
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  const user = session
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
      }
    : null;

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar user={user} />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default DashboardLayout;
