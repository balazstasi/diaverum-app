import { useFileBrowse } from "../utils/use-file-browse";
import BrowseFile from "../components/browse-file/browse-file";
import { useLabResultParser } from "../utils/use-lab-result-parser";
import { useEffect } from "react";
import { Effect } from "effect";

export default function Home() {
  const { fileContent, readFile } = useFileBrowse({ onFileRead: console.log });
  const { results, processLabResults } = useLabResultParser();

  useEffect(() => {
    if (fileContent) {
      console.log("processing");
      Effect.runPromise(processLabResults(fileContent));
    }
  }, [fileContent, processLabResults]);

  useEffect(() => {
    console.log(results);
  }, [results]);

  return <BrowseFile onFileRead={readFile} />;
}
