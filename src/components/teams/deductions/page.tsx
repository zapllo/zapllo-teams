'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Plus, Trash2 } from 'lucide-react';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { toast } from 'sonner';

interface Allowance {
    name: string;
    amount: number;
}

interface SalaryDetailsProps {
    userId: string; // Pass the user ID to bind the salary details to the user
}

interface UserDetails {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    whatsappNo: string;
    profilePic: string;
    role: string;
    reportingManager: {
        firstName: string;
        lastName: string;
        whatsappNo: string;
    } | null;
    isLeaveAccess: boolean;
    isTaskAccess: boolean;
    country: string;
    designation: string;
    staffType: string;
    contactNumber: string;
    asset: string;
    branch: string;
    status: string;
    employeeId: string; // EMP1, EMP2, etc.
    monthCalculationType: string;
}


// Default Salary Details
const DEFAULT_DEDUCTION_DETAILS: Allowance[] = [
    { name: 'Providend Fund (PF)', amount: 0 },
    { name: 'Professional Tax', amount: 0 },
    { name: 'Pension', amount: 0 },
    { name: 'Medical Insurance', amount: 0 },
    { name: 'Loans', amount: 0 },
];

export default function DeductionMenu({ userId }: SalaryDetailsProps) {
    const [deductionDetails, setDeductionDetails] = useState<Allowance[]>([]);
    const [customAllowance, setCustomAllowance] = useState('');
    const [customAmount, setCustomAmount] = useState(0);
    const [isCalculationDialogOpen, setIsCalculationDialogOpen] = useState(false);
    const [selectedCalculationMethod, setSelectedCalculationMethod] = useState('');
    const [user, setUser] = useState<UserDetails | null>(null);

    console.log(user, 'user')
    useEffect(() => {

        axios
            .get(`/api/users/${userId}`)
            .then((response) => {
                setUser(response.data.user);
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
            });
    }, [userId]);

    // Merge fetched salary details with default values
    const mergeWithDefaultDetails = (fetchedDetails: Allowance[]) => {
        const merged = [...DEFAULT_DEDUCTION_DETAILS];
        fetchedDetails.forEach((fetchedAllowance) => {
            const index = merged.findIndex((item) => item.name === fetchedAllowance.name);
            if (index !== -1) {
                merged[index].amount = fetchedAllowance.amount;
            } else {
                merged.push(fetchedAllowance); // Add custom allowances
            }
        });
        return merged;
    };

    // Fetch the existing salary details for the user
    useEffect(() => {
        const fetchSalaryDetails = async () => {
            try {
                const response = await fetch(`/api/users/${userId}/deduction`);
                if (response.ok) {
                    const data = await response.json();
                    setDeductionDetails(mergeWithDefaultDetails(data.deductionDetails || []));
                }
            } catch (error) {
                console.error('Error fetching deduction details:', error);
                setDeductionDetails(DEFAULT_DEDUCTION_DETAILS); // Fallback to defaults
            }
        };
        fetchSalaryDetails();
    }, [userId]);

    // Save salary details to the backend
    const saveSalaryDetails = async () => {
        try {
            await fetch(`/api/users/${userId}/deduction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deductionDetails
                }),
            });
            toast.success('Deduction details saved successfully!');
        } catch (error) {
            console.error('Error saving deduction details:', error);
            toast.error('Failed to save deduction details.');
        }
    };



    // Add a custom allowance
    const addCustomAllowance = () => {
        if (!customAllowance.trim()) return;
        setDeductionDetails([...deductionDetails, { name: customAllowance, amount: customAmount }]);
        setCustomAllowance('');
        setCustomAmount(0);
    };

    // Delete a custom allowance
    const deleteCustomAllowance = async (index: number) => {
        const allowanceToDelete = deductionDetails[index];

        try {
            // Send a DELETE request to the backend
            const response = await fetch(`/api/users/${userId}/deduction`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: allowanceToDelete.name }), // Pass the allowance name to delete
            });

            if (response.ok) {
                const data = await response.json();

                // Update the client-side state with the updated salary details
                setDeductionDetails(data.deductionDetails);
                toast.success(`Allowance "${allowanceToDelete.name}" deleted successfully.`);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete allowance.');
            }
        } catch (error) {
            console.error('Error deleting allowance:', error);
            toast.error('Failed to delete allowance.');
        }
    };





    return (
        <div className="space-y-6">
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className="text-lg font-semibold">Deduction Details</h2>

                </div>

            </div>

            <div className="space-y-4">
                {deductionDetails.map((allowance, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        <label className="w-1/3 font-medium">{allowance.name}</label>
                        <input
                            type="number"
                            className="w-2/3 p-2 border bg-transparent outline-none focus:border-[#815bf5] rounded-xl"
                            value={allowance.amount}
                            onChange={(e) => {
                                const updatedDeductionDetails = [...deductionDetails];
                                updatedDeductionDetails[index].amount = parseFloat(e.target.value);
                                setDeductionDetails(updatedDeductionDetails);
                            }}
                        />
                        {DEFAULT_DEDUCTION_DETAILS.findIndex((defaultAllowance) => defaultAllowance.name === allowance.name) === -1 && (
                            <button
                                onClick={() => deleteCustomAllowance(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}
                <div className="flex items-center border p-4 rounded-xl space-x-4">
                    <input
                        type="text"
                        placeholder="Custom Allowance"
                        className="w-1/3 p-2 border bg-transparent outline-none focus:border-[#815bf5] rounded-xl"
                        value={customAllowance}
                        onChange={(e) => setCustomAllowance(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        className="w-2/3 p-2 border outline-none focus:border-[#815bf5] bg-transparent rounded-xl"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(parseFloat(e.target.value))}
                    />
                    <button
                        onClick={addCustomAllowance}
                        className="h-9 w-10 flex items-center justify-center  bg-gradient-to-r from-[#815BF5] to-[#FC8929] text-white rounded-full"
                    >
                        <Plus />
                    </button>
                </div>
            </div>
            <div className="flex justify-between">
                <button
                    onClick={saveSalaryDetails}
                    className="px-4 py-2 bg-[#017a5b] text-white rounded-md hover:bg-green-800 ml-auto"
                >
                    Save Deduction Details
                </button>

            </div>
        </div>
    );
}
