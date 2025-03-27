import { Card } from "@/components/ui/card";
import { Projects } from "@/lib/action";
import { Clock, Eye, MessageCircle } from "lucide-react";

interface TaskCardProps {
  project: Projects;
  onClick: () => void;
}

export function TaskCard({ project, onClick }: TaskCardProps) {
  const getPriorityClass = (priority: string) => {
    if (priority.toLowerCase() === "high") return "bg-red-100 text-red-600";
    if (priority.toLowerCase() === "medium") return "bg-blue-100 text-blue-600";
    if (priority.toLowerCase() === "low") return "bg-green-100 text-green-600";
    return "";
  };

  return (
    <Card className="p-4 hover:shadow-md cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-center mb-4 gap-10">
        <h3 className="font-medium min-w-0 flex-1">{project.title}</h3>
        {project.sensitivity_level && (
          <span
            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap shrink-0 ${getPriorityClass(
              project.sensitivity_level
            )}`}
          >
            {project.sensitivity_level}
          </span>
        )}
      </div>

      {/* {(task.daysLeft || 0) > 0 ||
      (task.views || 0) > 0 ||
      (task.comments || 0) > 0 ? (
        <div className="flex text-gray-500 text-sm gap-4">
          {task.daysLeft && task.daysLeft > 0 && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{task.daysLeft} Days left</span>
            </div>
          )}

          {task.views && task.views > 0 && (
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{task.views}</span>
            </div>
          )}

          {task.comments && task.comments > 0 && (
            <div className="flex items-center gap-1">
              <MessageCircle size={14} />
              <span>{task.comments}</span>
            </div>
          )}
        </div>
      ) : null} */}
    </Card>
  );
}
