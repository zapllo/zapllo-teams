'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from 'next/navigation';
import { GearIcon, PieChartIcon, CardStackIcon } from '@radix-ui/react-icons';
import { GitBranchPlus, GitBranchPlusIcon, GitGraphIcon, PieChart, Settings, WalletCards } from 'lucide-react';
import { FaCodeBranch } from 'react-icons/fa';

const SettingsSidebar: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const isActive = (path: string) => pathname === path;

    return (
        <div className="w-[250px] border-r mt-1 dark:bg-[#04061E] text-white h-screen">
            <div className="space-y-4">
                <div className="flex justify-center">
                    <Button
                        variant="default"
                        className={`w-[90%] rounded-lg shadow-none mt-6 gap-2 px-4 justify-start dark:hover:bg-[#37384B] hover:bg-accent hover:rounded-lg bg-transparent mb-2 ${isActive('/dashboard/settings') ? 'bg-[#815BF5] hover:bg-[#815BF5] rounded-lg text-white' : 'dark:text-gray-400 text-black'}`}
                        onClick={() => handleNavigation('/dashboard/settings')}
                    >
                        <Settings className="h-5" /> General
                    </Button>
                </div>
                <div className="flex justify-center">
                    <Button
                        variant="default"
                        className={`w-[90%] rounded-lg shadow-none gap-2 px-4 bg-transparent justify-start hover:rounded-lg dark:hover:bg-[#37384B] hover:bg-accent  mb-2 ${isActive('/dashboard/settings/categories') ? 'bg-[#815BF5] hover:bg-[#815BF5] text-white rounded-lg' : 'dark:text-gray-400 text-black'}`}
                        onClick={() => handleNavigation('/dashboard/settings/categories')}
                    >
                        <PieChart className="h-5" /> Categories
                    </Button>
                </div>
                <div className="flex justify-center">
                    <Button
                        variant="default"
                        className={`w-[90%] rounded-lg shadow-none gap-2 px-4 bg-transparent justify-start dark:hover:bg-[#37384B] hover:bg-accent hover:rounded-lg mb-2 ${isActive('/dashboard/billing') ? 'bg-[#815BF5] text-white rounded-lg' : 'dark:text-gray-400 text-black'}`}
                        onClick={() => handleNavigation('/dashboard/billing')}
                    >
                        <WalletCards className="h-5" /> Billing
                    </Button>
                </div>
                <div className="flex justify-center">
                    <Button
                        variant="default"
                        className={`w-[90%] shadow-none rounded-lg gap-2 px-4 bg-transparent justify-start dark:hover:bg-[#37384B] hover:bg-accent hover:rounded-lg mb-2 ${isActive('/dashboard/integrations') ? 'bg-[#815BF5] text-white rounded-lg' : 'dark:text-gray-400 text-black'}`}
                        onClick={() => handleNavigation('/dashboard/settings/integrations')}
                    >
                        <GitBranchPlusIcon className='h-5' /> Integrations
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SettingsSidebar;
