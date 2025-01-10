// fetchTasks.ts
import axios from "axios";

interface Task {
  title: string;
  user: {
    _id: string;
    firstName: string;
  };
  description: string;
  assignedUser: {
    _id: string;
    firstName: string;
  };
  categories: string[];
  priority: string;
  repeatType?: string;
  repeat: boolean;
  days?: string[];
  dueDate: string;
  attachment?: string;
  links?: string[];
  status: string;
}

export async function fetchTasks(): Promise<Task[]> {
  const response = await axios.get("/api/tasks", {
    params: {
      populate: "user,assignedUser",
    },
  });
  return response.data;
}
