import { useFileBrowse } from "../lib/use-file-browse";
import BrowseFile from "../components/composed/browse-file/browse-file";
import { useLabResultParser } from "../lib/use-lab-result-parser";
import { useEffect } from "react";

export default function Home() {
  const { fileContent, readFile } = useFileBrowse({ onFileRead: console.log });
  const { results, processLabResults } = useLabResultParser();

  useEffect(() => {
    if (fileContent != null) {
      processLabResults(fileContent);
    }
  }, [fileContent, processLabResults]);

  useEffect(() => {
    console.log(results);
  }, [results]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <BrowseFile onFileRead={readFile} />
      {/* <TestResults labData={results as LabTest[]} /> */}
    </div>
  );
}
