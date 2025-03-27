import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TaskCard } from "./TaskCard";
import { useState, useEffect } from "react";
import { Projects } from "@/lib/action";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authstore";
import { APPWRITE_CLIENT } from "@/lib/appwrite";

export function TaskView() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [isMobile, setIsMobile] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useAuthStore();

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth < 768);
  //   };
  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  useEffect(() => {
    const fetchProjectsFromAPI = async () => {
      setIsLoading(true);
      try {
        const jwt = await APPWRITE_CLIENT.account.createJWT();

        const response = await fetch("/api/fetchprojects", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt.jwt}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }

        const data = await response.json();

        setProjects(data.project);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Error", {
          description: "Failed to fetch projects. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email) {
      fetchProjectsFromAPI();
    }
  }, [user?.email]);

  const handleNavigate = (projectId: string) => {
    router.push(`home/projects/${projectId}`);
  };

  const groupedProjects = {
    "In Progress": projects.filter((p) => p.status === "In Progress"),
    Completed: projects.filter((p) => p.status === "Completed"),
    Archived: projects.filter((p) => p.status === "Archived"),
  };

  return (
    <div className="flex h-full min-h-full">
      <div className="flex-1 overflow-auto pr-4 flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-130">
            <Loader className="w-12 h-12 animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">My Projects</h1>
            </div>
            <Tabs defaultValue="In Progress" className="mb-6 flex-grow">
              <TabsList>
                <TabsTrigger value="In Progress">In Progress</TabsTrigger>
                <TabsTrigger value="Completed">Completed</TabsTrigger>
                <TabsTrigger value="Archived">Archived</TabsTrigger>
              </TabsList>
              {Object.entries(groupedProjects).map(([status, projectList]) => (
                <TabsContent key={status} value={status} className="h-full">
                  <div className="space-y-4">
                    {projectList.length > 0 ? (
                      projectList.map((project) => (
                        <div key={project.$id} className="max-w-md">
                          <TaskCard
                            project={project}
                            onClick={() => handleNavigate(project.$id)}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 flex items-center justify-center w-full h-130">
                        No projects in this category.
                      </p>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
