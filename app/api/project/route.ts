import { APPWRITE_NODE, databases } from "@/lib/server_appwrite";
import { permit } from "@/lib/permit/permit";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Permission, Role } from "node-appwrite";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const projectCollectionId =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_COLLECTION_ID;

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEP_SEEK_R1_API_KEY || "",
});

type Project = {
  title: string;
  department: string;
  sensitivity_level: "low" | "medium" | "high";
};

async function classifyPrompt(prompt: string): Promise<boolean> {
  const response = await openai.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content:
          "Determine whether the user's message is related to project creation. Reply with only 'yes' or 'no'.",
      },
      { role: "user", content: prompt },
    ],
  });

  return (
    (response.choices[0]?.message?.content?.trim().toLowerCase() || "no") ===
    "yes"
  );
}

async function generateProject(prompt: string): Promise<Project | null> {
  const response = await openai.chat.completions.create({
    model: "deepseek-reasoner",
    messages: [
      {
        role: "system",
        content: `You are a structured project generator. You **must** always respond with a project in the following exact format:

**Title**: <project title>
**Sensitivity Level**: <low | medium | high>

Guidelines:
- Do **not** include any extra text or explanations.
- Do **not** include a Department field as this will be set based on the user's department.
- If the user's request does not explicitly contain project details, **infer** them based on general best practices.
- If the request is ambiguous, generate a reasonable project rather than rejecting it.
- Ensure all fields strictly follow the given format.
- If Sensitivity Level is referred to as priority, maintain the name Sensitivity Level but only use one of the three levels provided or do not provide at all`,
      },
      { role: "user", content: prompt },
    ],
  });

  const aiText = response.choices[0]?.message?.content || "";

  return {
    title:
      aiText.match(/\*\*Title\*\*: (.+)/)?.[1]?.trim() || "Untitled Project",
    department: "",
    sensitivity_level:
      (aiText
        .match(/\*\*Sensitivity Level\*\*: (.+)/)?.[1]
        ?.trim() as Project["sensitivity_level"]) || "medium",
  };
}

async function saveProject(projectData: Project, id: string) {
  return databases.createDocument(
    databaseId!,
    projectCollectionId!,
    id,
    projectData,
    [
      Permission.delete(Role.users()),
      Permission.update(Role.users()),
      Permission.read(Role.users()),
    ]
  );
}
type AuthContext = {
  allowed: boolean;
  uniqueId: string;
  department: string;
};

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const jwt = authHeader.split(" ")[1];
    APPWRITE_NODE.client.setJWT(jwt);

    const authError = req.headers.get("x-auth-error");
    if (authError === "true") {
      const errorMessage =
        req.headers.get("x-auth-error-message") || "Authentication failed";
      return NextResponse.json(
        { message: "Authentication error", error: errorMessage },
        { status: 403 }
      );
    }

    const authContextHeader = req.headers.get("x-auth-context");
    let authContext: AuthContext | null = null;

    if (authContextHeader) {
      try {
        authContext = JSON.parse(authContextHeader) as AuthContext;
      } catch (e) {
        console.error("Failed to parse auth context:", e);
        return NextResponse.json(
          { message: "Invalid authorization context" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Missing authorization context" },
        { status: 403 }
      );
    }

    const { allowed, uniqueId, department } = authContext;

    const body = await req.json();
    const prompt = body.prompt;
    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required" },
        { status: 400 }
      );
    }

    const isProjectRelated = await classifyPrompt(prompt);
    if (!isProjectRelated) {
      const chatResponse = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
      });

      return NextResponse.json(
        {
          message: "General AI response",
          response: chatResponse.choices[0]?.message?.content,
        },
        { status: 200 }
      );
    }

    if (!allowed) {
      return NextResponse.json(
        {
          message:
            "Permission denied. You don't have sufficient permissions to create this project.",
          error: "PERMISSION_DENIED",
        },
        { status: 403 }
      );
    }

    const projectData = await generateProject(prompt);
    if (!projectData?.title) {
      return NextResponse.json(
        {
          message: "Invalid project title generated by AI",
          generatedProject: projectData,
        },
        { status: 400 }
      );
    }

    projectData.department = department;

    await saveProject(projectData, uniqueId);
    return NextResponse.json(
      {
        message: "Project created successfully",
        project: projectData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in AI request handling:", error);
    return NextResponse.json(
      {
        message: "Failed to process request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
