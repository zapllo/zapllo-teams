"use client";

import React, { forwardRef } from "react";
import ReactQuill, { ReactQuillProps } from "react-quill";

const QuillWrapper = forwardRef<ReactQuill, ReactQuillProps>((props, ref) => {
  return <ReactQuill ref={ref} {...props} />;
});

QuillWrapper.displayName = "QuillWrapper";
export default QuillWrapper;
