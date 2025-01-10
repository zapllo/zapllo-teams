import { IconProgress } from "@tabler/icons-react";
import { CheckCircle, Circle, CircleAlert, Clock } from "lucide-react";

interface DelegatedTasksSummaryProps {
    delegatedTasksOverdueCount: number;
    delegatedTasksCompletedCount: number;
    delegatedTasksInProgressCount: number;
    delegatedTasksPendingCount: number;
    delegatedTasksDelayedCount: number;
    delegatedTasksInTimeCount: number;
}

export const DelegatedTasksSummary: React.FC<DelegatedTasksSummaryProps> = ({
    delegatedTasksOverdueCount,
    delegatedTasksCompletedCount,
    delegatedTasksInProgressCount,
    delegatedTasksPendingCount,
    delegatedTasksDelayedCount,
    delegatedTasksInTimeCount
}) => {
    return (
        <div className=" grid grid-cols-6 w-[80%]  gap-4 mb-8 rounded-lg shadow-md">
            {/* <h2 className="text-lg font-medium mb-4">Task Summary</h2> */}

            <div className="border px-4 py-1 h-fit flex gap-4 rounded-xl">
                <CircleAlert className="text-red-500 h-5 " />
                <div>
                    <p className="text-xs">Overdue </p>
                    <h1 className="font-bold text-sm">{delegatedTasksOverdueCount}</h1>
                </div>
            </div>
            <div className="border px-4 py-1 h-fit flex gap-4 rounded-xl">
                <Circle className="text-red-400 h-5 " />
                <div>
                    <p className="text-xs">Pending </p>
                    <h1 className="font-bold text-sm">{delegatedTasksPendingCount}</h1>
                </div>
            </div>
            <div className="border px-4 py-1 h-fit flex gap-4 rounded-xl">
                <IconProgress className="text-orange-500 h-5 " />
                <div>
                    <p className="text-xs">Progress </p>
                    <h1 className="font-bold text-sm">{delegatedTasksInProgressCount}</h1>
                </div>
            </div>

            <div className="border px-4 py-1 h-fit flex gap-4 rounded-xl">
                <CheckCircle className="text-green-500 h-5 " />
                <div>
                    <p className="text-xs">Completed </p>
                    <h1 className="font-bold text-sm">{delegatedTasksCompletedCount}</h1>
                </div>
            </div>
            <div className="border px-4 py-1 h-fit flex gap-4 rounded-xl">
                <Clock className="text-green-500 h-5 " />
                <div>
                    <p className="text-xs">In Time </p>
                    <h1 className="font-bold text-sm">{delegatedTasksInTimeCount}</h1>
                </div>
            </div>
            <div className="border px-4 py-1 h-fit flex gap-4 rounded-xl">
                <CheckCircle className="text-red-500 h-5 " />
                <div>
                    <p className="text-xs">Delayed </p>
                    <h1 className="font-bold text-sm">{delegatedTasksDelayedCount}</h1>
                </div>
            </div>
        </div>
    );
};
