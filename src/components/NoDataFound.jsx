import { FileSearch } from 'lucide-react';

const NoDataFound = ({ message = "No data found", className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-gray-500 ${className}`}>
      <FileSearch size={48} className="mb-4 text-gray-400" />
      <p className="text-lg">{message}</p>
    </div>
  );
};

export default NoDataFound;