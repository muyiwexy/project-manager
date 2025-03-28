import { NextResponse } from "next/server";
import { permit } from "@/lib/permit/permit";
import { Projects } from "@/lib/action";
import { APPWRITE_NODE } from "@/lib/server_appwrite";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    APPWRITE_NODE.client.setJWT(authHeader.split(" ")[1]);
    const user = await APPWRITE_NODE.account.get();
    const { roles, department, employment_status } = user.prefs;

    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "";
    const projectCollectionId =
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID ?? "";
    const { documents: fetchedProjects } =
      await APPWRITE_NODE.databases.listDocuments<Projects>(
        databaseId,
        projectCollectionId
      );

    const permittedProjects = (
      await Promise.all(
        fetchedProjects.map(async (project) => {
          const hasReadAccess = await permit.check(
            {
              key: user.email,
              attributes: { roles, department, employment_status },
            },
            "read",
            {
              type: "Projects",
              key: project.$id,
              attributes: { department: project.department },
            }
          );

          return hasReadAccess ? project : null;
        })
      )
    ).filter(Boolean);

    return NextResponse.json(
      {
        message: "Projects fetched successfully",
        project: permittedProjects,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch projects",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
