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
const DEFAULT_SALARY_DETAILS: Allowance[] = [
  { name: 'Basic Salary', amount: 0 },
  { name: 'Dearness Allowance (DA)', amount: 0 },
  { name: 'House Rent Allowance (HRA)', amount: 0 },
  { name: 'Travelling Allowance', amount: 0 },
  { name: 'Internet Allowance', amount: 0 },
  { name: 'Medical Allowance', amount: 0 },
];

export default function SalaryMenu({ userId }: SalaryDetailsProps) {
  const [salaryDetails, setSalaryDetails] = useState<Allowance[]>([]);
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
        setSelectedCalculationMethod(response.data.user.monthCalculationType)
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
  }, [userId]);

  // Merge fetched salary details with default values
  const mergeWithDefaultDetails = (fetchedDetails: Allowance[]) => {
    const merged = [...DEFAULT_SALARY_DETAILS];
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
        const response = await fetch(`/api/users/${userId}/salary`);
        if (response.ok) {
          const data = await response.json();
          setSalaryDetails(mergeWithDefaultDetails(data.salaryDetails || []));
        }
      } catch (error) {
        console.error('Error fetching salary details:', error);
        setSalaryDetails(DEFAULT_SALARY_DETAILS); // Fallback to defaults
      }
    };
    fetchSalaryDetails();
  }, [userId]);

  // Save salary details to the backend
  const saveSalaryDetails = async () => {
    try {
      await fetch(`/api/users/${userId}/salary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salaryDetails
        }),
      });
      toast.success('Salary details saved successfully!');
    } catch (error) {
      console.error('Error saving salary details:', error);
      toast.error('Failed to save salary details.');
    }
  };

  // Save month calculation type to the backend
  const saveMonthCalculationType = async () => {
    try {
      await fetch(`/api/users/${userId}/salary`, {
        method: 'PATCH', // Use PATCH for partial updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ monthCalculationType: selectedCalculationMethod }),
      });
      toast.success('Month calculation type saved successfully!');
      setIsCalculationDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error('Error saving month calculation type:', error);
      toast.error('Failed to save month calculation type.');
    }
  };

  // Add a custom allowance
  const addCustomAllowance = () => {
    if (!customAllowance.trim()) return;
    setSalaryDetails([...salaryDetails, { name: customAllowance, amount: customAmount }]);
    setCustomAllowance('');
    setCustomAmount(0);
  };

  // Delete a custom allowance
  const deleteCustomAllowance = async (index: number) => {
    const allowanceToDelete = salaryDetails[index];

    try {
      // Send a DELETE request to the backend
      const response = await fetch(`/api/users/${userId}/salary`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: allowanceToDelete.name }), // Pass the allowance name to delete
      });

      if (response.ok) {
        const data = await response.json();

        // Update the client-side state with the updated salary details
        setSalaryDetails(data.salaryDetails);
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


  const renderCalculationDialog = () => (
    <Dialog open={isCalculationDialogOpen} onOpenChange={setIsCalculationDialogOpen}>
      <DialogContent className="z-[100] h-screen max-w-md w-full p-4">
        <div className='flex items-center justify-between w-full'>

          <h2 className="text-lg font-semibold ">Month Calculation</h2>
          <DialogClose>
            <CrossCircledIcon className="scale-150  cursor-pointer hover:bg-white rounded-full hover:text-[#815BF5]" />
          </DialogClose>
        </div>
        <div className="space-y-3">
          {[
            { method: 'Calendar Month', description: 'Ex: March - 31 Days, April - 30 Days etc (Per day salary = Salary/No. of days in month)' },
            { method: 'Every Month 30 Days', description: 'Ex: March - 30 Days, April - 30 Days etc (Per day salary = Salary/30)' },
            { method: 'Every Month 28 Days', description: 'Ex: March - 28 Days, April - 28 Days etc (Per day salary = Salary/28)' },
            { method: 'Every Month 26 Days', description: 'Ex: March - 26 Days, April - 26 Days etc (Per day salary = Salary/26)' },
            { method: 'Exclude Weekly Offs', description: 'Ex: Month with 31 days and 4 weekly-offs will have 27 payable days (Per day salary = Salary/Payable Days)' },
          ].map((option) => (
            <label
              key={option.method}
              className={`block p-4 border rounded-lg cursor-pointer ${selectedCalculationMethod === option.method ? 'bg-gradient-to-l from-[#815BF5] to-purple-900 text-white border-transparent -50' : ''
                }`}
            >
              <input
                type="radio"
                name="calculationMethod"
                value={option.method}
                checked={selectedCalculationMethod === option.method}
                onChange={() => setSelectedCalculationMethod(option.method)}
                className="hidden"
              />
              <h3 className="font-semibold">{option.method}</h3>
              <p className="text-sm text-gray-300">{option.description}</p>
            </label>
          ))}
        </div>
        <div className="flex justify-end mt-4 space-x-3">

          <button
            className="px-4 py-2 w-full text-white bg-[#815bf5] rounded-md hover:bg-primary"
            onClick={saveMonthCalculationType}
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );


  return (
    <div className="space-y-6">
      <div className='flex justify-between items-center'>
        <div>
          <h2 className="text-lg font-semibold">Salary Details</h2>
          <p className='text-muted-foreground text-sm'>
            Calculated according to -  {selectedCalculationMethod}
          </p>
        </div>
        <button
          onClick={() => setIsCalculationDialogOpen(true)}
          className="px-4 py-2 text-sm bg-[#815bf5] -700 text-white rounded-md hover:bg-primary"
        >
          Select Salary Type
        </button>
      </div>

      <div className="space-y-4">
        {salaryDetails.map((allowance, index) => (
          <div key={index} className="flex items-center space-x-4">
            <label className="w-1/3 font-medium">{allowance.name}</label>
            <input
              type="number"
              className="w-2/3 p-2 border bg-transparent outline-none focus:border-[#815bf5] rounded-xl"
              value={allowance.amount}
              onChange={(e) => {
                const updatedSalaryDetails = [...salaryDetails];
                updatedSalaryDetails[index].amount = parseFloat(e.target.value);
                setSalaryDetails(updatedSalaryDetails);
              }}
            />
            {DEFAULT_SALARY_DETAILS.findIndex((defaultAllowance) => defaultAllowance.name === allowance.name) === -1 && (
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
          className="px-4 py-2 text-sm bg-[#017a5b] text-white rounded-md hover:bg-green-800 ml-auto"
        >
          Save Salary Details
        </button>

        {renderCalculationDialog()}
      </div>
    </div>
  );
}
