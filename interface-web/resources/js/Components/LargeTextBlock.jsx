import React, { useState, useEffect } from 'react';

export default function LargeTextBlock({ className = '', text, number, backgroundColor, alertColumnValue }) {
  const [isAlert, setIsAlert] = useState(false);

  useEffect(() => {
    if (alertColumnValue === 1 && !isAlert) {
      setIsAlert(true);
    }
  }, [alertColumnValue, isAlert]);

  const handleClick = () => {
    setIsAlert(false);
  };

  const alertClassName = isAlert ? 'alert' : '';

  return (
    <div
      className={`w-full flex flex-col md:flex-row rounded-lg ${className}`}
      style={{ backgroundColor }}
    >
      <div
        className={`flex-1 flex flex-col items-center justify-center p-8 ${alertClassName}`}
        onClick={handleClick}
      >
        <h1 className="text-4xl font-bold text-gray-800">{text}</h1>
        <h1 className="text-6xl font-bold text-gray-800 mt-4">{number}</h1>
      </div>
    </div>
  );
}
