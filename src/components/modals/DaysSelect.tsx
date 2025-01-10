import React from 'react';
import { Cross2Icon, CrossCircledIcon } from '@radix-ui/react-icons';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';

interface DaysSelectModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    selectedDays: number[];
    setSelectedDays: React.Dispatch<React.SetStateAction<number[]>>;
}

const DaysSelectModal: React.FC<DaysSelectModalProps> = ({ isOpen, onOpenChange, selectedDays, setSelectedDays }) => {
    const toggleDaySelection = (day: number) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>

            <DialogContent className="z-[100] scale-90 p-6">
                <DialogTitle className="text-xl font-bold">Select Days</DialogTitle>
                <DialogDescription className="mt-2 mb-4">
                    Select the days of the month for your repeat setting.
                </DialogDescription>
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <button
                            key={day}
                            className={`w-10 h-10 flex items-center justify-center border rounded ${selectedDays.includes(day) ? 'bg-[#017A5B] text-white' : 'bg-transparent'
                                }`}
                            onClick={() => toggleDaySelection(day)}
                        >
                            {day}
                        </button>
                    ))}
                </div>
                <div className="mt-4 flex items-center justify-end">
                    <DialogClose asChild>
                        <button className="bg-[#017A5B] text-white p-2 rounded">Confirm</button>
                    </DialogClose>
                </div>
                <DialogClose asChild>
                    <button className="absolute top-8 flex items-center right-5">
                        <CrossCircledIcon className="scale-150  cursor-pointer hover:bg-[#ffffff] rounded-full hover:text-[#815BF5]" />
                    </button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default DaysSelectModal;
