import React from 'react';
import { TabsTrigger } from '@radix-ui/react-tabs'; // Ensure the import path is correct based on your setup
import HomeIcon from '../icons/homeIcon';
import TasksIcon from '../icons/tasksIcon';
import { Tabs, TabsList } from '../ui/tabs';


interface User {
    _id: string;
    firstName: string;
    lastName: string;
    organization: string;
    email: string;
    role: string;
}

interface TaskTabsProps {
    userDetails?: {
        role: string | null;
    } | null;
    activeTab: string;
    setActiveTab: (value: string) => void;
}


const TaskSidebar: React.FC<TaskTabsProps> = ({ userDetails, activeTab, setActiveTab }) => {
    return (
        <div className=" w-44    fixed   ">
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-[180px] mt-12 "
            >
                <TabsList className="flex gap-y-6 mt-4 h-24  text-center">
                    <TabsTrigger value="all" className="flex justify-start gap-2">
                        <div className="flex justify-start ml-4 w-full gap-2">
                            <HomeIcon />
                            <h1 className="mt-auto text-xs">Dashboard</h1>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="myTasks"
                        className="flex justify-start w-full gap-2"
                    >
                        <div className="flex justify-start ml-4 w-full gap-2">
                            <TasksIcon />
                            <h1 className="mt-auto text-xs">My Tasks</h1>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="delegatedTasks"
                        className="flex justify-start w-full gap-2"
                    >
                        <div className="flex justify-start w-full ml-4 gap-2">
                            <img
                                src="/icons/delegated.png"
                                className="h-[16px] mt-1"
                                alt="Delegated Tasks Icon"
                            />
                            <h1 className="text-xs mt-1">Delegated Tasks</h1>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="allTasks"
                        className="flex justify-start w-full gap-2 "
                    >
                        <div className="flex justify-start w-full gap-2 ml-4">
                            <img
                                src="/icons/all.png"
                                className="h-5 mt-0.5"
                                alt="All Tasks Icon"
                            />
                            <h1 className="text-xs mt-1">All Tasks</h1>
                        </div>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
};

export default TaskSidebar;
