'use client'

import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';

const TrialStatusContext = createContext<any>(null);

export const TrialStatusProvider = ({ children }: { children: React.ReactNode }) => {
    const [leavesTrialExpires, setLeavesTrialExpires] = useState<Date | null>(null);
    const [attendanceTrialExpires, setAttendanceTrialExpires] = useState<Date | null>(null);

    const fetchTrialIconStatus = async () => {
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
        }
    };

    useEffect(() => {
        fetchTrialIconStatus();
    }, []);

    return (
        <TrialStatusContext.Provider
            value={{
                leavesTrialExpires,
                attendanceTrialExpires,
                fetchTrialIconStatus,
            }}
        >
            {children}
        </TrialStatusContext.Provider>
    );
};

export const useTrialStatus = () => useContext(TrialStatusContext);
