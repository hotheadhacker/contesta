'use client';
import { useState, useEffect } from 'react';
import styles from './CountdownTimer.module.css';

export default function CountdownTimer({ targetDate, type = 'ends' }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);
  const [progress, setProgress] = useState(0);

  // Format the target date for display
  const formattedDate = new Date(targetDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Format the target time for display
  const formattedTime = new Date(targetDate).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Ensure we're working with Date objects
      const now = new Date();
      const target = new Date(targetDate);
      
      // Log for debugging
      console.log(`Current time: ${now.toISOString()}`);
      console.log(`Target time: ${target.toISOString()}`);
      console.log(`Difference in ms: ${target - now}`);
      
      // Calculate difference in milliseconds
      const difference = target.getTime() - now.getTime();
      
      // Check if countdown has expired
      if (difference <= 0) {
        console.log('Countdown expired');
        setIsExpired(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      // Calculate time units
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      console.log(`Calculated time left: ${days}d ${hours}h ${minutes}m ${seconds}s`);
      
      return {
        days,
        hours,
        minutes,
        seconds
      };
    };

    // Calculate progress if this is an "ends" countdown
    const calculateProgress = () => {
      if (type !== 'ends') return 0;
      
      const now = new Date();
      const start = new Date('May 20, 2025 00:00:00'); // Contest start date
      const end = new Date(targetDate);                // Contest end date
      
      // If before start date, progress is 0
      if (now < start) return 0;
      
      // If after end date, progress is 100
      if (now > end) return 100;
      
      // Calculate percentage between start and end
      const totalDuration = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      return Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
    };

    // Initial calculation
    const initialTimeLeft = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);
    setIsExpired(initialTimeLeft.days === 0 && 
                initialTimeLeft.hours === 0 && 
                initialTimeLeft.minutes === 0 && 
                initialTimeLeft.seconds === 0);
    setProgress(calculateProgress());

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      setIsExpired(newTimeLeft.days === 0 && 
                  newTimeLeft.hours === 0 && 
                  newTimeLeft.minutes === 0 && 
                  newTimeLeft.seconds === 0);
      setProgress(calculateProgress());
    }, 1000);

    // Clean up on unmount
    return () => clearInterval(timer);
  }, [targetDate, type]);

  // Add leading zero
  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  // Format days left text
  const getDaysLeftText = (days) => {
    if (days === 0) return "Less than a day left";
    if (days === 1) return "1 day left";
    return `${days} days left`;
  };

  // Determine what to display based on type and expiration
  const getHeaderText = () => {
    if (type === 'begins') {
      return isExpired ? 'Contest Has Begun' : 'Contest Begins In';
    } else {
      return isExpired ? 'Contest Has Ended' : 'Contest Ends In';
    }
  };

  const getIcon = () => {
    if (isExpired) {
      return type === 'begins' ? '✨' : '🏆';
    }
    return '🚀';
  };

  // If countdown has expired
  if (isExpired) {
    return (
      <div className={styles.countdownExpired}>
        <div className={styles.expiredMessage}>
          <span className={styles.sparkle}>{getIcon()}</span>
          {getHeaderText()}
          <span className={styles.sparkle}>{getIcon()}</span>
        </div>
        <div className={styles.endTimeInfo}>
          {type === 'begins' ? 'Started' : 'Ended'} on {formattedDate} at {formattedTime}
        </div>
        
        {type === 'begins' && (
          <div className={styles.endTimeInfo}>
            <span className={styles.daysLeft}>Contest is now live!</span>
          </div>
        )}
        
        {type === 'ends' && progress > 0 && progress < 100 && (
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${progress}%` }}
            ></div>
            <div className={styles.progressText}>
              {progress}% Complete
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active countdown
  return (
    <div className={type === 'ends' ? styles.countdownContainerGreen : styles.countdownContainer}>
      <div className={styles.countdownHeader}>
        <span className={styles.rocket}>{getIcon()}</span> {getHeaderText()}
      </div>
      <div className={styles.countdownUnits}>
        <div className={styles.countdownUnit}>
          <div className={styles.countdownValue}>{formatNumber(timeLeft.days)}</div>
          <div className={styles.countdownLabel}>Days</div>
        </div>
        <div className={styles.countdownSeparator}>:</div>
        <div className={styles.countdownUnit}>
          <div className={styles.countdownValue}>{formatNumber(timeLeft.hours)}</div>
          <div className={styles.countdownLabel}>Hours</div>
        </div>
        <div className={styles.countdownSeparator}>:</div>
        <div className={styles.countdownUnit}>
          <div className={styles.countdownValue}>{formatNumber(timeLeft.minutes)}</div>
          <div className={styles.countdownLabel}>Minutes</div>
        </div>
        <div className={styles.countdownSeparator}>:</div>
        <div className={styles.countdownUnit}>
          <div className={styles.countdownValue}>{formatNumber(timeLeft.seconds)}</div>
          <div className={styles.countdownLabel}>Seconds</div>
        </div>
      </div>
      <div className={styles.endTimeInfo}>
        {type === 'begins' ? 'Begins' : 'Ends'} on {formattedDate} at {formattedTime}
        <span className={styles.daysLeft}>{getDaysLeftText(timeLeft.days)}</span>
      </div>
    </div>
  );
}