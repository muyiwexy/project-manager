import { DynamicBreadcrumb } from "@/components/navigation/dynamicBreadcrumbs";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className=" overflow-hidden p-4 gap-4">
      <DynamicBreadcrumb />
      {children}
    </section>
  );
}
