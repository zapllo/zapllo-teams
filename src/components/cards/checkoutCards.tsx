import React from "react";

type TaskDelegationCardProps = {
    title: string;
    features: string[];
};

const TaskDelegationCard: React.FC<TaskDelegationCardProps> = ({ title, features }) => {
    return (
        <div className="bg-transparent  p-6 rounded-2xl w-full  border border-[#1A1C3D] shadow-lg">
            <h2 className="text-white text-xl font-semibold mb-4">{title}</h2>
            <ul className="space-y-2">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-[#FFFFFF] text-sm">
                        <img src="/icons/tick.png" alt="Tick" className="w-4 h-4 mr-2" />
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskDelegationCard;
