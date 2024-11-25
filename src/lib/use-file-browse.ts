import { useState } from "react";

interface UseFileBrowseProps {
  onFileRead?: (fileContent: string) => void;
}

export const useFileBrowse = ({ onFileRead = () => {} }: UseFileBrowseProps) => {
  const [fileContent, setFileContent] = useState<string | null>(null);

  const readFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e?.target?.result ?? "") as string;
      setFileContent(content);
      onFileRead(content);
    };
    reader.readAsText(e.target.files?.[0] ?? new Blob());
  };

  return { fileContent, readFile };
};
