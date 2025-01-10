'use client'

import React, { useEffect, useState } from 'react'
import InfoBar from '@/components/infobar'
import AdminSidebar from '@/components/sidebar/adminSidebar'
import axios from 'axios'
import Loader from '@/components/ui/loader' // Import a loader for loading state

type Props = { children: React.ReactNode }

const Layout = (props: Props) => {
    const [loading, setLoading] = useState(true); // Loading state while fetching user details
    const [isAdmin, setIsAdmin] = useState(false); // To check if user is Admin
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Store error message if not authorized

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const userRes = await axios.get('/api/users/me');
                const userRole = userRes.data.data.role;

                if (userRole === 'Admin') {
                    setIsAdmin(true);
                } else {
                    setErrorMessage("You're not authorized to view this page!");
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                setErrorMessage('Error fetching user details!');
            } finally {
                setLoading(false);
            }
        };

        getUserDetails();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader /> {/* Show loader while fetching user details */}
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="flex justify-center items-center h-screen text-center">
                <h1 className="text-xl font-bold text-red-500">{errorMessage}</h1>
            </div>
        );
    }

    if (isAdmin) {
        return (
            <div className={`flex overflow-hidden dark:bg-[#201124] scrollbar-hide h-full w-full`}>
                <AdminSidebar />
                <div className='w-full overflow-hidden please h-screen '>
                    <InfoBar />
                    <div className='mt-12 ml-12'>
                        {props.children}
                    </div>
                </div>
            </div>
        );
    }

    return null; // Fallback in case there's no role match, but this should never be hit due to the previous conditions
};

export default Layout;
