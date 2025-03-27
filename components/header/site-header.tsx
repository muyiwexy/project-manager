import { Separator } from "@radix-ui/react-separator";
import { SidebarTrigger } from "../ui/sidebar";

export function SiteHeader() {
  return (
    <header className="sticky top-0 bg-background px-4 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-2 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-5" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Project Manager</h1>
      </div>
    </header>
  );
}
