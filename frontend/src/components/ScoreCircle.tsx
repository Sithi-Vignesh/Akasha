import React, { useEffect, useState } from 'react';

interface ScoreCircleProps {
  score: number;
}

export function ScoreCircle({ score }: ScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  useEffect(() => {
    let startTimestamp: number;
    const duration = 1200;
    
    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.floor(easeProgress * score));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score]);

  const dashoffset = circumference - (animatedScore / 100) * circumference;

  let colorVar = '--score-low';
  if (score > 70) colorVar = '--score-high';
  else if (score > 40) colorVar = '--score-mid';

  let message = "Let's rebuild this story together.";
  if (score > 70) message = "You're a strong match. Let's make it perfect.";
  else if (score > 40) message = "Good foundation. Let's bridge the gaps.";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg fill="none" viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
          <circle 
            cx={size / 2} cy={size / 2} r={radius} 
            strokeWidth={strokeWidth}
            className="stroke-[var(--glass-border)]"
          />
          <circle 
            cx={size / 2} cy={size / 2} r={radius} 
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            style={{ stroke: `var(${colorVar})`, transition: 'stroke-dashoffset 0.1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display font-extrabold text-4xl">{animatedScore}</span>
        </div>
      </div>
      <p className="text-[var(--text-secondary)] italic font-medium">{message}</p>
    </div>
  );
}
