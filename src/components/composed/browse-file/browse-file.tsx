import { Input } from "@/components/ui/input";

interface BrowseFileProps {
  onFileRead: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BrowseFile({ onFileRead }: BrowseFileProps) {
  return <Input type="file" onChange={onFileRead} className="w-full" accept=".txt" />;
}
