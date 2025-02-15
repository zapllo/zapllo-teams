"use client";

import React, { forwardRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill (only on the client)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const QuillWrapper = forwardRef((props: any, ref) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      // Dynamically import Quill on the client
      const { Quill } = require("react-quill");
      import("react-quill-image-uploader")
        .then((module) => {
          const ImageUploader = module.default;
          // Prevent duplicate registration
          if (!(window as any).__quillImageUploaderRegistered) {
            Quill.register("modules/imageUploader", ImageUploader);
            (window as any).__quillImageUploaderRegistered = true;
          }
        })
        .catch((error) => {
          console.error("Error loading react-quill-image-uploader:", error);
        });
    }
  }, []);

  if (!isClient) return null;

  return <ReactQuill ref={ref} {...props} />;
});

QuillWrapper.displayName = "QuillWrapper";
export default QuillWrapper;
