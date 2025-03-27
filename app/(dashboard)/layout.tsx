import { SiteHeader } from "@/components/header/site-header";
import { AppSidebar } from "@/components/navigation/sidenav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SiteHeader />
            <div className="px-4 lg:px-1">{children}</div>
            <Toaster />
          </div>
        </div>
      </div>

      {/* <main>
        <SiteHeader />
        {children}
      </main> */}
    </SidebarProvider>
  );
}
