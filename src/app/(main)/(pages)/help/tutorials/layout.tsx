
'use client'

import InfoBar from '@/components/infobar'
import ChecklistSidebar from '@/components/sidebar/checklistSidebar'
import SettingsOptions from '@/components/sidebar/settingsSidebar'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Props = { children: React.ReactNode }

const Layout = (props: Props) => {

    const [isTrialExpired, setIsTrialExpired] = useState(false);

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                // Fetch trial status
                const response = await axios.get('/api/organization/getById');
                console.log(response.data.data); // Log the organization data
                const organization = response.data.data;
                // Check if the trial has expired
                const isExpired = organization.trialExpires && new Date(organization.trialExpires) <= new Date();
                console.log('isExpired:', isExpired);
                console.log('trialExpires:', organization.trialExpires);

                setIsTrialExpired(isExpired); // Set to true if expired, false otherwise
            } catch (error) {
                console.error('Error fetching user details or trial status:', error);
            }
        }
        getUserDetails();
    }, []);


    
    return (
        <div className='flex overflow-hidden mt-12 scrollbar-hide h-full '>
            <div className='mt-12'>
            <ChecklistSidebar />

            </div>
            <div className='w-full ml-32 '>
                {/* <InfoBar /> */}
                {props.children}
            </div>
        </div>
    )
}

export default Layout