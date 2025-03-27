import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Info, Eye, Download } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

interface Attachment {
  name: string;
  date: string;
}

interface Comment {
  author: string;
  date: string;
  content: string;
}

interface Task {
  id: number;
  title: string;
  priority: string;
  daysLeft?: number;
  views?: number;
  comments?: number;
  date?: string;
  description?: string;
  timeSpent?: string;
  attachments?: { name: string; date: string }[];
  commentsList?: { author: string; date: string; content: string }[];
}

interface TaskDetailsProps {
  task: Task;
}

export function TaskDetails({ task }: TaskDetailsProps) {
  const getPriorityClass = (priority: string) => {
    if (priority === "High Priority") return "bg-red-100 text-red-600";
    if (priority === "Medium Priority") return "bg-blue-100 text-blue-600";
    if (priority === "Low Priority") return "bg-green-100 text-green-600";
    return "";
  };

  return (
    <Card className="h-full">
      <CardContent className=" w-[400px] max-h-120 overflow-auto p-6 h-full flex flex-col">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <input type="checkbox" className="mr-1" />
              Appointments
            </span>
          </div>

          <h2 className="text-2xl font-semibold mb-4">{task.title}</h2>

          <div className="flex gap-4 mb-6">
            <Badge
              variant="outline"
              className={`${getPriorityClass(task.priority)}`}
            >
              {task.priority}
            </Badge>

            <div className="flex items-center gap-1 text-sm">
              <Clock size={16} />
              <span>{task.date}</span>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} />
              <span className="font-medium">Time Spent on this project</span>
              <span className="ml-auto text-xl font-semibold">
                {task.timeSpent}
              </span>
              <Info size={16} className="text-gray-400" />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line">
              {task.description}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-4">Attachments</h3>
            <div className="space-y-2">
              {(task.attachments || []).map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 bg-gray-50 rounded-lg"
                >
                  <div className="bg-red-100 p-2 rounded-lg mr-3">
                    {attachment.name.endsWith(".docx") ? "📝" : "📄"}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{attachment.name}</p>
                    <p className="text-xs text-gray-500">{attachment.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-500">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 text-gray-500">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Tabs defaultValue="comments">
            <TabsList className="mb-4">
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
            </TabsList>

            <TabsContent value="comments" className="space-y-4">
              {(task.commentsList || []).map((comment, index) => (
                <div key={index} className="flex gap-3">
                  <Avatar className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600">
                    {comment.author
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-xs text-gray-500">
                        • {comment.date}
                      </span>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="updates">
              <p className="text-gray-500">No updates available</p>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
