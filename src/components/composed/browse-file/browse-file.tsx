interface BrowseFileProps {
  onFileRead: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BrowseFile({ onFileRead }: BrowseFileProps) {
  return (
    <div>
      <input type="file" onChange={onFileRead} />
    </div>
  );
}
