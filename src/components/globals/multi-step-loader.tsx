"use client"

// Layout.tsx
import { useEffect, useState } from "react";
// import { MultiStepLoader as Loader } from "../ui/loader";
import { usePathname, useSearchParams } from "next/navigation";

interface LoadingState {
    text: string;
}

interface LayoutProps {
    children: React.ReactNode;
}

const loadingStates: LoadingState[] = [
    { text: "Loading..." },
    { text: "Upgrading your experience..." },
    { text: "Maximizing Productivity..." },
    // Add more loading states as needed
];

const LoaderLayout: React.FC<LayoutProps> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        
        const interval = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
        }, 1000); // Update the progress every second

        return () => clearInterval(interval);
    }, [searchParams, pathname]);


    return (
        <div>
            {/* <Loader loadingStates={loadingStates} loading={loading} /> */}
            {children}
        </div>
    );
};

export default LoaderLayout;
