'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from 'next/navigation';
import { GearIcon, PieChartIcon, CardStackIcon } from '@radix-ui/react-icons';
import { GitBranchPlus, GitGraphIcon } from 'lucide-react';

const SettingsSidebar: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const isActive = (path: string) => pathname === path;

    return (
        <div className="w-[250px] border-r bg-[#04061E] text-white h-screen">
            <div className="space-y-4">
                <div className="flex justify-center">
                    <Button
                        variant="default"
                        className={`w-[90%] rounded-lg mt-6 gap-2 px-4 justify-start hover:bg-[#37384B] hover:rounded-lg bg-transparent mb-2 ${isActive('/dashboard/settings') ? 'bg-[#815BF5] hover:bg-[#815BF5] rounded-lg text-white' : 'text-gray-400'}`}
                        onClick={() => handleNavigation('/dashboard/settings')}
                    >
                        <GearIcon className="h-5" /> General
                    </Button>
                </div>
                <div className="flex justify-center">
                    <Button
                        variant="default"
                        className={`w-[90%] rounded-lg gap-2 px-4 bg-transparent justify-start hover:rounded-lg hover:bg-[#37384B]  mb-2 ${isActive('/dashboard/settings/categories') ? 'bg-[#815BF5] hover:bg-[#815BF5] text-white rounded-lg' : 'text-gray-400'}`}
                        onClick={() => handleNavigation('/dashboard/settings/categories')}
                    >
                        <PieChartIcon className="h-5" /> Categories
                    </Button>
                </div>
                <div className="flex justify-center">
                    <Button
                        variant="default"
                        className={`w-[90%] rounded-lg gap-2 px-4 bg-transparent justify-start hover:bg-[#37384B] hover:rounded-lg mb-2 ${isActive('/dashboard/billing') ? 'bg-[#815BF5] text-white rounded-lg' : 'text-gray-400'}`}
                        onClick={() => handleNavigation('/dashboard/billing')}
                    >
                        <CardStackIcon className="h-5" /> Billing
                    </Button>
                </div>
                <div className="flex justify-center">
                    <Button
                        variant="default"
                        className={`w-[90%] rounded-lg gap-2 px-4 bg-transparent justify-start hover:bg-[#37384B] hover:rounded-lg mb-2 ${isActive('/dashboard/integrations') ? 'bg-[#815BF5] text-white rounded-lg' : 'text-gray-400'}`}
                        onClick={() => handleNavigation('/dashboard/integrations')}
                    >
                        <GitBranchPlus className="h-5" /> Integrations
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SettingsSidebar;
