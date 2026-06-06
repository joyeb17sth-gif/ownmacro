import { useEffect, useRef } from 'react';
import './MacroRing.css';

const MacroRing = ({ value, max, label, color, size = 100, strokeWidth = 8, unit = 'g', showPercentage = false }) => {
  const circleRef = useRef(null);
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = circumference;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          circleRef.current.style.strokeDashoffset = offset;
        });
      });
    }
  }, [offset, circumference]);

  return (
    <div className="macro-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="macro-ring__progress"
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="macro-ring__content">
        <span className="macro-ring__value" style={{ color }}>
          {showPercentage ? `${Math.round(percentage)}%` : Math.round(value)}
        </span>
        {!showPercentage && <span className="macro-ring__unit">{unit}</span>}
        {label && <span className="macro-ring__label">{label}</span>}
      </div>
    </div>
  );
};

export default MacroRing;
