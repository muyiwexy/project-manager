import { Databases, Client, Account, ID } from "node-appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error("Missing required environment variables");
}

export const client = new Client()
  .setEndpoint(endpoint || "")
  .setProject(projectId || "");
export const databases = new Databases(client);
export const account = new Account(client);
export const id = ID;

export const APPWRITE_NODE = {
  account,
  databases,
  client,
  id,
};
