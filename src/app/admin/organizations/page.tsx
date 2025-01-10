'use client'

import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Organization {
    _id: string;
    companyName: string;
    industry: string;
    password: string;
    teamSize: string;
    description: string;
    categories: [string];
    users: [string];
    trialExpires: Date;
}



export default function Organizations() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [extensionDays, setExtensionDays] = useState(1);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const res = await fetch('/api/organization/admin');
                const data = await res.json();
                setOrganizations(data.data);
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    console.log(organizations, 'organizations');

    const extendTrialPeriod = async (organizationId: any) => {
        try {
            const newTrialPeriod = new Date();
            newTrialPeriod.setMonth(newTrialPeriod.getMonth() + 1); // Extend by 1 month

            const res = await fetch('/api/organization/admin', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ organizationId, extensionDays }),
            });
            const data = await res.json();

            if (data.error) {
                alert(data.error);
            } else {
                alert('Trial period extended successfully');
                // Optionally, refetch organizations to update the UI
                // fetchOrganizations();
                setOrganizations((prevOrganizations: any) =>
                    prevOrganizations.map((org: any) =>
                        org._id === organizationId ? { ...org, trialExpires: data.data.trialExpires } : org
                    )
                );
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    const revokeTrialPeriod = async (organizationId: any) => {
        try {
            const res = await fetch('/api/organization/admin', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ organizationId, revoke: true }),
            });
            const data = await res.json();

            if (data.error) {
                alert(data.error);
            } else {
                alert('Trial period revoked successfully');
                setOrganizations((prevOrganizations: any) =>
                    prevOrganizations.map((org: any) =>
                        org._id === organizationId ? { ...org, trialExpires: data.data.trialExpires } : org
                    )
                );
            }
        } catch (error: any) {
            alert(error.message);
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='p-8'>
            <h1 className='text-center font-bold text-xl'>Organizations</h1>
            <div className='mt-4 space-y-4 gap-4'>
                {organizations.map((org, index) => (
                    <Card key={org._id} className='card flex justify-between p-4 py-8'>
                        <h1>{index + 1}.</h1>

                        <CardTitle className='text-lg font-bold'>{org.companyName}</CardTitle>
                        {/* <div>
                            <p>Industry: {org.industry}</p>
                            <p>Team Size: {org.teamSize}</p>
                        </div> */}
                        <div className=' space-y-2'>
                            <p className='flex font-bold text- bg-secondary w-fit px-2 py-1 rounded '><User className='h-5' />Users: {org.users.length}</p>
                            <p className='bg-secondary w-fit px-2 py-1 rounded font-bold'>Trial Expires: {new Date(org.trialExpires).toLocaleDateString()}</p>
                        </div>
                        <div className=''>
                            <label className='block mb-2'>Extend Trial Period (Days):</label>
                            <select
                                value={extensionDays}
                                onChange={(e) => setExtensionDays(Number(e.target.value))}
                                className='p-2 border rounded'
                            >
                                {[1, 7, 14, 30, 60, 90].map((days) => (
                                    <option key={days} value={days}>
                                        {days} {days > 1 ? 'Days' : 'Day'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='space-x-2'>
                            <Button
                                onClick={() => extendTrialPeriod(org._id)}
                                className=' mt-4'
                            >
                                Extend Trial Period
                            </Button>
                            <Button onClick={() => revokeTrialPeriod(org._id)} variant="destructive">
                                Revoke Trial Period
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
