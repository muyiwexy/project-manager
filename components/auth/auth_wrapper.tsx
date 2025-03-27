"use client";

import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authstore";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !user && pathname.startsWith("/dashboard")) {
      router.push("/login_page");
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading && !pathname.startsWith("/dashboard/")) {
    return (
      <section className="h-screen flex justify-center items-center">
        <LoaderIcon className="w-8 h-8 animate-spin" />
      </section>
    );
  }

  return <>{children}</>;
}
