
import React from 'react';

interface NeonTitleProps {
  text: string;
  className?: string;
}

const NeonTitle: React.FC<NeonTitleProps> = ({ text, className = "" }) => {
  const colorClasses = ['neon-red', 'neon-blue', 'neon-yellow', 'neon-green', 'neon-purple'];
  
  return (
    <h1 className={`font-heading ${className}`}>
      {text.split('').map((letter, index) => {
        // Skip spaces
        if (letter === ' ') {
          return <span key={index} className="mx-1"> </span>;
        }
        
        const colorClass = colorClasses[index % colorClasses.length];
        const randomDelay = Math.random() * 2; // Random animation delay
        
        return (
          <span 
            key={index} 
            className={`neon-letter ${colorClass}`} 
            style={{ 
              animationDelay: `${randomDelay}s`,
              animationDuration: `${3 + Math.random() * 3}s` // Random duration between 3-6s
            }}
          >
            {letter}
          </span>
        );
      })}
    </h1>
  );
};

export default NeonTitle;
