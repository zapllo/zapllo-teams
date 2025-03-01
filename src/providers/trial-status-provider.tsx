'use client';

import axios from 'axios';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TrialStatusContext = createContext<any>(null);

export const TrialStatusProvider = ({ children }: { children: React.ReactNode }) => {
    const [leavesTrialExpires, setLeavesTrialExpires] = useState<Date | null>(null);
    const [attendanceTrialExpires, setAttendanceTrialExpires] = useState<Date | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchTrialIconStatus = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/organization/getById');
            const { leavesTrialExpires, attendanceTrialExpires } = response.data.data;

            setLeavesTrialExpires(
                leavesTrialExpires && new Date(leavesTrialExpires) > new Date()
                    ? new Date(leavesTrialExpires)
                    : null
            );
            setAttendanceTrialExpires(
                attendanceTrialExpires && new Date(attendanceTrialExpires) > new Date()
                    ? new Date(attendanceTrialExpires)
                    : null
            );
        } catch (error) {
            console.error('Error fetching trial status:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrialIconStatus();
    }, [fetchTrialIconStatus]);

    return (
        <TrialStatusContext.Provider
            value={{
                leavesTrialExpires,
                attendanceTrialExpires,
                fetchTrialIconStatus,
                loading,
            }}
        >
            {children}
        </TrialStatusContext.Provider>
    );
};

export const useTrialStatus = () => useContext(TrialStatusContext);
