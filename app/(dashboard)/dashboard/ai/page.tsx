"use client";

import { APPWRITE_CLIENT } from "@/lib/appwrite";
import { useAuthStore } from "@/store/authstore";
import { useState } from "react";
import { toast } from "sonner";

export default function AITaskCreator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();

  const createAITask = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const jwt = await APPWRITE_CLIENT.account.createJWT();

      const res = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt["jwt"]}`,
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 && data.error === "PERMISSION_DENIED") {
          toast.error(
            "Permission denied: You don't have sufficient permissions to create this project."
          );
        } else {
          toast.error(data.message || "An error occurred");
        }

        setError(data.message || "An error occurred");
        return;
      }

      setResponse(data);
      toast.success("Project created successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">AI Task Creator</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Provide a specific task prompt"
        className="w-full p-2 border rounded mb-4"
        rows={3}
      />

      <button
        onClick={createAITask}
        disabled={isLoading || !prompt.trim()}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? "Creating Task..." : "Generate AI Task"}
      </button>

      {/* {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">{error}</div>
      )} */}

      {response && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h3 className="font-bold">Task Created Successfully</h3>
          <pre className="text-sm overflow-x-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
