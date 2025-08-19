import React, { useRef } from "react";
import JoditEditor from "jodit-react";

export default function TextEditor({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string) => void;
}) {
  const editor = useRef(null);

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={{
        width: 1000,
        height: 400,
      }}
      onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
      onChange={(newContent) => {}}
    />
  );
}
