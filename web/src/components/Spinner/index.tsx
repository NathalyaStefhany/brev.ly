import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="relative w-12 h-12">
      {[...Array(10)].map((_, i) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className="absolute top-4.5 left-5.5 w-1 h-3 bg-blue-base rounded origin-center animate-fade"
          style={{
            transform: `rotate(${i * 36}deg) translateY(-150%)`,
            opacity: i / 10,
            animationDelay: `${i * 0.098}s`,
          }}
        />
      ))}
    </div>
  );
};
