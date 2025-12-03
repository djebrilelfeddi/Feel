import React, { useState, useEffect } from "react";

interface ResponseAreaProps {
  message: string;
  typewriterSpeed?: number;
}

function ResponseArea({ message, typewriterSpeed = 25 }: ResponseAreaProps) {
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedMessage("");
    setIsComplete(false);
    
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex < message.length) {
        setDisplayedMessage(message.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(intervalId);
      }
    }, typewriterSpeed);

    return () => clearInterval(intervalId);
  }, [message, typewriterSpeed]);

  return (
    <div className="container-response">
      <p className="text-primary">
        {displayedMessage}
        {!isComplete && (
          <span className="inline-block w-0.5 h-6 bg-black ml-0.5 animate-pulse drop-shadow-lg" />
        )}
      </p>
    </div>
  );
}

export default ResponseArea;