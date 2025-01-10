import { IconProgress } from "@tabler/icons-react";
import { CheckCircle, Circle, CircleAlert, Clock } from "lucide-react";

interface MyTasksSummaryProps {
    myTasksOverdueCount: number;
    myTasksCompletedCount: number;
    myTasksInProgressCount: number;
    myTasksPendingCount: number;
    myTasksDelayedCount: number;
    myTasksInTimeCount: number;
}

export const MyTasksSummary: React.FC<MyTasksSummaryProps> = ({
    myTasksOverdueCount,
    myTasksCompletedCount,
    myTasksInProgressCount,
    myTasksPendingCount,
    myTasksDelayedCount,
    myTasksInTimeCount
}) => {
    return (
        <div className=" grid grid-cols-6 w-[80%]   gap-4 mb-8 rounded-lg shadow-md">
            {/* <h2 className="text-lg font-medium mb-4">Task Summary</h2> */}

            <div className="border px-4 py-1 h-fit flex gap-4 rounded-xl">
                <CircleAlert className="text-red-500 h-5 " />
                <div>
                    <p className="text-xs">Overdue </p>
                    <h1 className="font-bold text-sm">{myTasksOverdueCount}</h1>
                </div>
            </div>
            <div className="border px-4 py-1 h-fit flex gap-4 rounded-xl">
                <Circle className="text-red-400 h-5 " />
                <div>
                    <p className="text-xs">Pending </p>
                    <h1 className="font-bold text-sm">{myTasksPendingCount}</h1>
                </div>
            </div>
            <div className="border px-4 py-1 h-fit flex gap-4 rounded-xl">
                <IconProgress className="text-orange-500 h-5 " />
                <div>
                    <p className="text-xs">Progress </p>
                    <h1 className="font-bold text-sm">{myTasksInProgressCount}</h1>
                </div>
            </div>

            <div className="border px-4 py-1 h-fit flex gap-4 rounded-xl">
                <CheckCircle className="text-green-500 h-5 " />
                <div>
                    <p className="text-xs">Completed </p>
                    <h1 className="font-bold text-sm">{myTasksCompletedCount}</h1>
                </div>
            </div>
            <div className="border px-4 py-1 h-fit flex gap-4 rounded-xl">
                <Clock className="text-green-500 h-5 " />
                <div>
                    <p className="text-xs">In Time </p>
                    <h1 className="font-bold text-sm">{myTasksInTimeCount}</h1>
                </div>
            </div>
            <div className="border px-4 py-1 h-fit flex gap-4 rounded-xl">
                <CheckCircle className="text-red-500 h-5 " />
                <div>
                    <p className="text-xs">Delayed </p>
                    <h1 className="font-bold text-sm">{myTasksDelayedCount}</h1>
                </div>
            </div>
        </div>
    );
};
