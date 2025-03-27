"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

const convertToReadableLabel = (segment: string) => {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  const breadcrumbItems = useMemo(() => {
    const pathSegments = pathname.replace(/^\/|\/$/g, "").split("/");

    const processedSegments =
      pathSegments[0] === "dashboard" ? pathSegments.slice(1) : pathSegments;

    if (processedSegments.length === 1 && processedSegments[0] === "home") {
      return [
        <BreadcrumbItem key="home">
          <BreadcrumbPage>Home</BreadcrumbPage>
        </BreadcrumbItem>,
      ];
    }

    const routeSegments =
      processedSegments[0] === "home"
        ? processedSegments.slice(1)
        : processedSegments;

    const displaySegments =
      routeSegments.length > 4
        ? ["home", "...", ...routeSegments.slice(-2)]
        : ["home", ...routeSegments];

    return displaySegments.map((segment, index) => {
      if (segment === "...") {
        return (
          <BreadcrumbItem key="ellipsis">
            <span className="px-2 text-gray-500">...</span>
          </BreadcrumbItem>
        );
      }

      const href =
        segment === "home"
          ? "/dashboard/home"
          : "/" +
            ["dashboard", "home", ...routeSegments.slice(0, index)].join("/");

      const isLastSegment = index === displaySegments.length - 1;
      const label = convertToReadableLabel(segment);

      if (isLastSegment) {
        return (
          <BreadcrumbItem key={segment}>
            <BreadcrumbPage>{label}</BreadcrumbPage>
          </BreadcrumbItem>
        );
      }

      return (
        <React.Fragment key={segment}>
          <BreadcrumbItem>
            <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </React.Fragment>
      );
    });
  }, [pathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
    </Breadcrumb>
  );
}
