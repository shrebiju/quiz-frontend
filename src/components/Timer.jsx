import { useEffect, useState } from 'react';

const Timer = ({ initialTime, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
      timeLeft < 30 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
    }`}>
      Time: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};

export default Timer;