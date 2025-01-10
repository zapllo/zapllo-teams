'use client';

import ChecklistSidebar from '@/components/sidebar/checklistSidebar';
import { Button } from '@/components/ui/button';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Tutorials() {
    const { id } = useParams();
    const [tutorial, setTutorial] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTutorial = async () => {
            try {
                const response = await axios.get(`/api/tutorials/${id}`);
                setTutorial(response.data.tutorial);
            } catch (err) {
                console.error("Failed to fetch tutorial:", err);
                setError("Failed to load tutorial.");
            } finally {
                setLoading(false);
            }
        };

        fetchTutorial();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!tutorial) {
        return <p className="text-center text-gray-500">Tutorial not found.</p>;
    }

    return (
        <div className="   h-fit max-h-screen   scrollbar-hide overflow-y-scroll ">
            <div className="ml-28 bg-[#04061e] text-white">
                <div className='flex gap-2 mb-4 mt-8 items-center'>
                    <Link href='/help/tutorials'>
                        <div className='h-7 w-7 flex items-center hover:bg-[#ffffff] hover:text-black cursor-pointer border rounded-full'>
                            <ArrowLeft className='  h-6 w-6 ' />
                        </div>
                    </Link>
                    <h1 className="text-xl ">{tutorial.title}</h1>
                </div>

                <div className="w-full border rounded max-w-4xl mt-4 aspect-video">
                    <iframe className='rounded w-full h-full'  src={tutorial.link} title="Zapllo Tutorials" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen ></iframe>
                </div>
            </div>
        </div>
    );
}
