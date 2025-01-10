'use client'
import React, { useState, useEffect } from 'react';
import { getData } from 'country-list';
import { Country, IState, State } from 'country-state-city';
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
    onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, selectedValue, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (option: Option) => {
        onSelect(option.value);
        setSearchQuery('');
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="block bg-[#0A0D28] w-full outline-none p-2 border rounded flex items-center justify-between"
            >
                {selectedValue ? (
                    <div className="flex items-center">
                        {selectedValue.code && (
                            <Flag code={selectedValue.code} style={{ width: '24px', height: '16px', marginRight: '8px' }} />
                        )}
                        {selectedValue.name}
                    </div>
                ) : (
                    'Select an option'
                )}
            </button>
            {isOpen && (
                <div className="absolute bg-black border rounded mt-1 w-full max-h-60 scrollbar-hide overflow-auto">
                    <input
                        type="text"
                        placeholder="Search country.."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full p-2 outline-none border-b bg-[#0A0D28] text-white"
                    />
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option.code}
                                onClick={() => handleSelect(option)}
                                className="cursor-pointer p-2 hover:bg-[#04061E] flex items-center"
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

const CountryDropdown = () => {
    const [formData, setFormData] = useState({ country: '', state: '' });
    const [countries, setCountries] = useState<Option[]>([]);
    const [states, setStates] = useState<IState[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<Option | null>(null);

    useEffect(() => {
        const countryData = getData();
        const formattedCountries = countryData.map((country) => ({
            label: country.name,
            name: country.name,
            value: country.code,
            code: country.code
        }));
        setCountries(formattedCountries);
    }, []);

    useEffect(() => {
        if (formData.country) {
            const selectedCountryData = Country.getCountryByCode(formData.country);
            if (selectedCountryData) {
                const stateData = State.getStatesOfCountry(selectedCountryData.isoCode);
                setStates(stateData);
                setSelectedCountry({
                    label: selectedCountryData.name,
                    name: selectedCountryData.name,
                    value: selectedCountryData.isoCode,
                    code: selectedCountryData.isoCode
                });
            } else {
                // Handle the case where the country data is not found
                setStates([]);
                setSelectedCountry(null);
            }
        }
    }, [formData.country]);

    const handleCountrySelect = (value: string) => {
        const country = countries.find(c => c.value === value);
        if (country) {
            setFormData({ ...formData, country: value });
            setSelectedCountry(country);
        }
    };

    const handleStateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFormData({ ...formData, state: value });
    };

    return (
        <div>
            <label className="block my-4">
                <span>Country:</span>
                <CustomDropdown
                    options={countries}
                    selectedValue={selectedCountry}
                    onSelect={handleCountrySelect}
                />
            </label>
            <label className="block my-4">
                <span>State:</span>
                <select
                    name="state"
                    value={formData.state}
                    onChange={handleStateSelect}
                    className="block bg-[#0A0D28] w-full outline-none mt-1 p-2 border rounded"
                >
                    <option value="">Select State</option>
                    {states.map((state) => (
                        <option key={state.isoCode} value={state.name}>
                            {state.name}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
};

export default CountryDropdown;
