import { IconProgress } from "@tabler/icons-react";
import { CheckCircle, Circle, CircleAlert, Clock } from "lucide-react";

interface TaskSummaryProps {
    overdueTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    delayedTasks: number;
    inTimeTasks: number;
}

export const TaskSummary: React.FC<TaskSummaryProps> = ({
    overdueTasks,
    completedTasks,
    inProgressTasks,
    pendingTasks,
    delayedTasks,
    inTimeTasks
}) => {
    return (
        <div className=" grid grid-cols-6 w-[80%]  gap-4 mb-8 rounded-lg shadow-md">
            {/* <h2 className="text-lg font-medium mb-4">Task Summary</h2> */}

            <div className="border shadow-[5px_5px_0px_0px_rgba(131,92,221)]  px-4 py-1 h-fit flex gap-4 rounded-xl">
                <CircleAlert className="text-red-500 h-5  " />
                <div>
                    <p className="text-xs text-red-500">Overdue </p>
                    <h1 className="font-bold text-sm">{overdueTasks}</h1>
                </div>
            </div>
            <div className="border shadow-[5px_5px_0px_0px_rgba(131,92,221)] px-4 py-1 h-fit flex gap-4 rounded-xl">
                <Circle className="text-red-400 h-5 " />
                <div>
                    <p className="text-xs text-red-400">Pending </p>
                    <h1 className="font-bold text-sm">{pendingTasks}</h1>
                </div>
            </div>
            <div className="border shadow-[5px_5px_0px_0px_rgba(131,92,221)] px-4  py-1 h-fit flex gap-4 rounded-xl">
                <IconProgress className="text-orange-500 h-5 " />
                <div>
                    <p className="text-xs text-orange-500">Progress </p>
                    <h1 className="font-bold text-sm">{inProgressTasks}</h1>
                </div>
            </div>

            <div className="border shadow-[5px_5px_0px_0px_rgba(131,92,221)] px-4 py-1 h-fit flex gap-4 rounded-xl">
                <CheckCircle className="text-green-500 h-5 " />
                <div>
                    <p className="text-xs text-green-500">Completed </p>
                    <h1 className="font-bold text-sm">{completedTasks}</h1>
                </div>
            </div>
            <div className="border shadow-[5px_5px_0px_0px_rgba(131,92,221)] px-4 py-1 h-fit flex gap-4 rounded-xl">
                <Clock className="text-green-500 h-5 " />
                <div>
                    <p className="text-xs text-green-500">In Time </p>
                    <h1 className="font-bold text-sm">{inTimeTasks}</h1>
                </div>
            </div>
            <div className="border shadow-[5px_5px_0px_0px_rgba(131,92,221)] px-4 py-1 h-fit flex gap-4 rounded-xl">
                <CheckCircle className="text-red-500 h-5 " />
                <div>
                    <p className="text-xs text-red-500">Delayed </p>
                    <h1 className="font-bold text-sm">{delayedTasks}</h1>
                </div>
            </div>
        </div>
    );
};
