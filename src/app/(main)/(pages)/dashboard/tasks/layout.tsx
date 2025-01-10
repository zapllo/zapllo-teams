'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
    const [isTrialExpired, setIsTrialExpired] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const [userResponse, organizationResponse] = await Promise.all([
                    axios.get('/api/users/me'),
                    axios.get('/api/organization/getById'),
                ]);

                const user = userResponse.data.data;
                const organization = organizationResponse.data.data;

                // Determine if the trial has expired
                const trialExpired = organization.trialExpires && new Date(organization.trialExpires) <= new Date();

                // Determine if the subscription is valid
                const subscriptionValid = organization.subscriptionExpires && new Date(organization.subscriptionExpires) > new Date();

                // Redirect if trial has expired and there is no valid subscription or subscribed plan
                if (trialExpired && (!organization.subscribedPlan || !subscriptionValid)) {
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Error fetching user or organization details:', error);
            }
        };

        checkAccess();
    }, [router]);

    return <div className='w-full overflow-hidden h-screen'>{props.children}</div>;
};

export default Layout;