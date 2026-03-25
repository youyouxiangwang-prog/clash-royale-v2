import React from 'react';

interface TimerProps {
  time: number;
}

const Timer: React.FC<TimerProps> = ({ time }) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="timer">
      <span className="timer-value">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;