// CountryDrop.tsx

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { getData } from 'country-list';
import Flag from 'react-world-flags';

interface Option {
    label: string;
    name: string;
    value: string;
    code?: string;
}

interface CustomDropdownProps {
    options: Option[];
    selectedValue: Option | null;
    onSelect: (option: Option) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, selectedValue, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null); // Ref to track the dropdown

    // Filter options based on the search query
    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (option: Option) => {
        onSelect(option);
        setSearchQuery('');
        setIsOpen(false); // Close the dropdown after selection
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false); // Close dropdown if clicking outside
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative z-[50]" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#04071F] w-full outline-none z-[50] p-2 border rounded flex items-center justify-between"
            >
                {selectedValue ? (
                    <div className="flex items-center">
                        {selectedValue.code && (
                            <Flag code={selectedValue.code} style={{ width: '24px', height: '16px', marginRight: '8px' }} />
                        )}
                        {selectedValue.name}
                    </div>
                ) : (
                    'Select a country'
                )}
            </button>
            {isOpen && (
                <div className="absolute bg-black border rounded w-full max-h-60 scrollbar-hide overflow-auto">
                    <input
                        type="text"
                        placeholder="Search country..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full p-2 outline-none border-b bg-[#04071F] text-sm text-white"
                    />
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option.code}
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevents the event from bubbling up
                                    handleSelect(option);
                                }}

                                className="cursor-pointer text-sm p-2 hover:bg-[#04061E] flex items-center"
                            >
                                {option.code && (
                                    <Flag code={option.code} style={{ width: '24px', height: '16px', marginRight: '8px' }} />
                                )}
                                {option.name}
                            </div>
                        ))
                    ) : (
                        <div className="p-2 text-gray-500">No options found</div>
                    )}
                </div>
            )}
        </div>
    );
};

interface CountryDropProps {
    selectedCountry: string; // Country code
    onCountrySelect: (countryCode: string) => void; // Expecting country code
}

const CountryDrop: React.FC<CountryDropProps> = ({ selectedCountry, onCountrySelect }) => {
    const [countries, setCountries] = useState<Option[]>([]);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);

    useEffect(() => {
        const countryData = getData();
        const formattedCountries = countryData.map((country) => ({
            label: country.name,
            name: country.name,
            value: country.code, // Country code
            code: country.code,
        }));
        setCountries(formattedCountries);

        // Only set the default country on initial load
        const defaultCountry = formattedCountries.find(country => country.value === selectedCountry);
        if (defaultCountry) {
            setSelectedOption(defaultCountry);
        }
    }, [selectedCountry]);

    const handleCountrySelect = (option: Option) => {
        setSelectedOption(option);
        onCountrySelect(option.value); // Pass country code to parent
    };

    return (
        <div>
            <label className="block my-4 relative">
                <span className="absolute text-xs -mt-2 bg-[#000100] text-[#787CA5] ml-2 z-[100]">Country</span>
                <CustomDropdown
                    options={countries}
                    selectedValue={selectedOption}
                    onSelect={handleCountrySelect}
                />
            </label>
        </div>
    );
};

export default CountryDrop;
