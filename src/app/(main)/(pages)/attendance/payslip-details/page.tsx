'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import Loader from '@/components/ui/loader';

export default function PayslipDetailsPage() {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact: '',
        emailOrWebsite: '',
        logo: '',
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null); // Thumbnail preview URL
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle logo file selection and generate preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file)); // Generate a temporary preview URL
        }
    };
    // Fetch existing payslip details for the logged-in user
    useEffect(() => {
        const fetchPayslip = async () => {
            try {
                const response = await axios.get('/api/payslip');
                if (response.data.success) {
                    const { name, address, contact, emailOrWebsite, logo } = response.data.data;
                    setFormData({ name, address, contact, emailOrWebsite, logo });
                    if (logo) setLogoPreview(logo);
                }
            } catch (error) {
                console.error('Error fetching payslip:', error);
            }
        };

        fetchPayslip();
    }, []);

    // Upload the logo and create the payslip
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.address || !formData.contact || !formData.emailOrWebsite) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            let logoUrl = formData.logo;

            // If a new logo is selected, upload it
            if (logoFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('files', logoFile);

                const uploadResponse = await axios.post('/api/upload', uploadFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                logoUrl = uploadResponse.data.fileUrls[0];
            }

            // Submit the payslip details
            const payslipResponse = await axios.post('/api/payslip', {
                ...formData,
                logo: logoUrl,
            });

            if (payslipResponse.data.success) {
                setSuccessMessage('Payslip details saved successfully!');
              
            } else {
                setErrorMessage('Failed to save payslip details.');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred while saving payslip details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mb-12 h-full w-full overflow-y-scroll scrollbar-hide mt-4 ">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4 border rounded-xl p-4 ">
                {/* Logo File Input */}
                <div className="flex flex-col items-center gap-4">
                    <div className=' w-full'>
                        <label className=" text-sm text-muted-foreground font-medium mb-1 justify-start flex text-start ml-3">Company Logo *</label>

                        <div className="border border-dashed border-purple-500 rounded-lg p-4 w-full flex flex-col items-center justify-center relative">

                            {!logoPreview ? (
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center text-purple-500">
                                        <img src='/icons/imagee.png' className="h-8 w-8" />
                                        <p className="text-sm font-medium">Click to upload your document</p>
                                    </div>
                                </>
                            ) : (
                                <div className="relative">
                                    <img src={logoPreview} alt="Logo Preview" className="w-full h-28 object-contain rounded-lg" />
                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 border hover:border-white bg-red-500 text-white rounded-full p-1"
                                        onClick={() => {
                                            setLogoFile(null);
                                            setLogoPreview(null);
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='grid '>
                    {/* Name Input */}
                    <div className="relative mt-4">
                        <label className="absolute text-gray-500 bg-[#04061E] px-1 -top-2 left-2 text-sm">Company Name *</label>
                        <input
                            className="border outline-none bg-[#04061E] rounded-2xl text-white -foreground focus:border-[#815bf5] px-2 py-2 w-full"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Address Input */}
                    <div className="relative mt-4">
                        <label className="absolute text-gray-500 bg-[#04061E] px-1 -top-2 left-2 text-sm">Company Address *</label>
                        <input
                            className="border outline-none bg-[#04061E] rounded-2xl text-white -foreground focus:border-[#815bf5] px-2 py-2 w-full"
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Contact Input */}
                    <div className="relative mt-4">
                        <label className="absolute text-gray-500 bg-[#04061E] px-1 -top-2 left-2 text-sm">Company Contact *</label>
                        <input
                            className="border outline-none bg-[#04061E] rounded-2xl text-white -foreground focus:border-[#815bf5] px-2 py-2 w-full"
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}

                            required
                        />
                    </div>

                    {/* Email or Website Input */}
                    <div className="relative mt-4">
                        <label className="absolute text-gray-500 bg-[#04061E] px-1 -top-2 left-2 text-sm">Website/Email</label>
                        <input
                            className="border outline-none bg-[#04061E] rounded-2xl text-white -foreground focus:border-[#815bf5] px-2 py-2 w-full"
                            type="text"
                            name="emailOrWebsite"
                            value={formData.emailOrWebsite}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
                {/* Error and Success Messages */}
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#815bf5] -500 text-white px-4 py-2 w-full rounded-md  disabled:opacity-50"
                >
                    {loading ? <Loader /> : 'Save Payslip Details'}
                </button>
            </form>
        </div>
    );
}
