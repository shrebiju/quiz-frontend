import { BeatLoader } from 'react-spinners';

const LoadingSpinner = ({ size = 10, color = "#3b82f6" }) => {
  return (
    <div className="flex justify-center p-4">
      <BeatLoader color={color} size={size} />
    </div>
  );
};

export default LoadingSpinner;