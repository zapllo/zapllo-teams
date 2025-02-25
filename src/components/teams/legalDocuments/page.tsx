'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FaFile, FaFileAlt } from 'react-icons/fa';
import { Eye, X } from 'lucide-react';

interface LegalDocumentProps {
    userId: string;
}

interface FileUpload {
    name: string;
    size: string;
    url: string;
}

interface LegalDocumentsState {
    aadharCard?: FileUpload;
    drivingLicense?: FileUpload;
    panCard?: FileUpload;
    passportPhoto?: FileUpload;
}

export default function LegalDocuments({ userId }: LegalDocumentProps) {
    const [documents, setDocuments] = useState<LegalDocumentsState>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserDocuments = async () => {
            try {
                const response = await axios.get(`/api/users/${userId}`);
                const user = response.data.user;
                setDocuments({
                    aadharCard: user.legalDocuments?.aadharCard
                        ? {
                            name: 'Aadhar Card',
                            size: '',
                            url: user.legalDocuments.aadharCard,
                        }
                        : undefined,
                    drivingLicense: user.legalDocuments?.drivingLicense
                        ? {
                            name: 'Driving License',
                            size: '',
                            url: user.legalDocuments.drivingLicense,
                        }
                        : undefined,
                    panCard: user.legalDocuments?.panCard
                        ? {
                            name: 'PAN Card',
                            size: '',
                            url: user.legalDocuments.panCard,
                        }
                        : undefined,
                    passportPhoto: user.legalDocuments?.passportPhoto
                        ? {
                            name: 'Passport Photo',
                            size: '',
                            url: user.legalDocuments.passportPhoto,
                        }
                        : undefined,
                });
            } catch (error) {
                console.error('Error fetching user documents:', error);
            }
        };

        fetchUserDocuments();
    }, [userId]);

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        documentType: keyof LegalDocumentsState
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('files', file);

        try {
            const response = await axios.post('/api/upload', formData);
            const fileUrl = response.data.fileUrls[0];

            setDocuments((prevDocs) => ({
                ...prevDocs,
                [documentType]: {
                    name: file.name,
                    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                    url: fileUrl,
                },
            }));

            toast.success(`${documentType} uploaded successfully!`);
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to upload file.');
        }
    };

    const handleClearFile = (documentType: keyof LegalDocumentsState) => {
        setDocuments((prevDocs) => ({
            ...prevDocs,
            [documentType]: undefined,
        }));
    };

    console.log(documents, 'documents?')
    const saveDetails = async () => {
        setLoading(true);
        try {
            await axios.patch(`/api/users/update`, {
                _id: userId,
                legalDocuments: {
                    aadharCard: documents.aadharCard?.url || '',
                    drivingLicense: documents.drivingLicense?.url || '',
                    panCard: documents.panCard?.url || '',
                    passportPhoto: documents.passportPhoto?.url || '',
                },
            });
            toast.success('Legal documents saved successfully!');
        } catch (error) {
            console.error('Error saving legal documents:', error);
            toast.error('Failed to save details.');
        } finally {
            setLoading(false);
        }
    };

    const renderFile = (file: FileUpload | undefined, documentType: keyof LegalDocumentsState) => {
        if (file) {
            return (
                <div key={file.url} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div>
                        <p className="font-semibold text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                    <div className='flex justify-end items-center'>
                        <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline text-sm"
                        >
                            Preview
                        </a>
                        <button
                            onClick={() => handleClearFile(documentType)}
                            className="px-2 py-1 text-red-500 rounded text-sm"
                        >
                            <X className='h-5' />
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col  gap-2">

                <div className="flex justify-center items-center gap-2">
                    <label
                        htmlFor={documentType}
                        className="px-4 py-2 dark:bg-[#04061E] text-white text-sm rounded cursor-pointer"
                    >
                        <div className="flex flex-col items-center text-purple-500">
                            <FaFileAlt className='h-6' />
                            {/* <p className="text-sm font-medium">Click to upload your document</p> */}
                        </div>
                    </label>

                    <input
                        id={documentType}
                        type="file"
                        onChange={(e) => handleFileUpload(e, documentType)}
                        className="hidden"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="w-full max-w-3xl scale-90 mx-auto border p-6 rounded-xl">
            {/* <h1 className="text-lg font-semibold mb-4">Legal Documents</h1> */}
            <div className="grid grid-cols-2 gap-4">
                <div className='border border-purple-500 border-dashed rounded-xl p-2 flex justify-center text-center  items-center'>
                    <div>
                        {renderFile(documents.aadharCard, 'aadharCard')}
                        <h1 className='mt-2 text-center'>Upload Aadhaar Card</h1>
                    </div>
                </div>
                <div className='border border-purple-500 border-dashed rounded-xl p-2 flex justify-center text-center  items-center'>
                    <div>
                        {renderFile(documents.drivingLicense, 'drivingLicense')}
                        <h1 className='mt-2'>Upload Driving License</h1>
                    </div>
                </div>
                <div className='border border-purple-500 border-dashed rounded-xl p-2 flex justify-center text-center  items-center'>
                    <div>
                        {renderFile(documents.panCard, 'panCard')}
                        <h1 className='mt-2'>Upload Pan Card</h1>

                    </div>
                </div>
                <div className='border border-purple-500 border-dashed rounded-xl p-2 flex justify-center text-center  items-center'>
                    <div>
                        {renderFile(documents.passportPhoto, 'passportPhoto')}
                        <h1 className='mt-2'>Passport Size Photo</h1>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    onClick={saveDetails}
                    className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#017a5b] hover:bg-green-800'
                        }`}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Details'}
                </button>
            </div>
        </div>
    );
}
