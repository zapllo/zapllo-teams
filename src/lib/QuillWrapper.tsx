"use client";

import React, { forwardRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const QuillWrapper = forwardRef((props: any, ref) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Ensure it only renders after mounting
    }, []);

    if (!isClient) return null; // Prevents SSR issues

    return <ReactQuill ref={ref} {...props} />;
});

QuillWrapper.displayName = "QuillWrapper";
export default QuillWrapper;
