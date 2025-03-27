import { Models } from "appwrite";

export type PermissionType = "read" | "create" | "delete" | "update";

export interface Document extends Models.Document {
  roomId: string;
  title: string;
  storageData: string;
  created_by: string[];
}
export type SensitivityLevel = "low" | "medium" | "high";
export type Status = "In Progress" | "Completed" | "Archived";

export interface Projects extends Models.Document {
  title: string;
  department: string;
  tasks: [];
  sensitivity_level: SensitivityLevel;
  status: Status;
}
