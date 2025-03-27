"use client";

import { ClipboardList, Users, Share2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authstore";

export default function LandingPage() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 xl:py-40 text-center">
          <div className="px-4 md:px-6 flex flex-col items-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Streamline Your Projects, Boost Team Productivity
            </h1>
            <p className="max-w-2xl mt-4 text-gray-500 md:text-lg">
              Plan, track, and collaborate on tasks in real-time with your team.
              The ultimate project management solution for modern teams.
            </p>
            <div className="mt-6 space-x-4">
              {user ? (
                <Button asChild>
                  <Link href="/dashboard/home">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="default" asChild>
                    <Link href="/signup_page">Get Started</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/login_page">Log In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="w-full py-16 md:py-24 lg:py-32 bg-gray-100"
          id="features"
        >
          <div className="px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<ClipboardList className="h-12 w-12 mb-4 text-primary" />}
                title="Task Management"
                description="Create, assign, and track tasks effortlessly. Stay on top of project deadlines."
              />
              <FeatureCard
                icon={<Users className="h-12 w-12 mb-4 text-primary" />}
                title="Team Collaboration"
                description="Work together seamlessly with real-time updates and shared workspaces."
              />
              <FeatureCard
                icon={<Share2 className="h-12 w-12 mb-4 text-primary" />}
                title="Easy File Sharing"
                description="Upload and share project files securely, all in one place."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-12 w-12 mb-4 text-primary" />}
                title="Access Control"
                description="Manage permissions with role-based access for Admins, Managers, and Members."
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-16 md:py-24 lg:py-32 text-center">
          <div className="px-4 md:px-6 flex flex-col items-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Get Your Team Organized Today
            </h2>
            <p className="max-w-2xl mt-4 text-gray-500 md:text-lg">
              Join thousands of teams using TaskFlow to enhance productivity and
              manage projects with ease.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href={user ? "/dashboard" : "/signup_page"}>
                Start Free Trial
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} TaskFlow. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      {icon}
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
