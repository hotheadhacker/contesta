// Contest dates configuration
const CONTEST_START_DATE = new Date('May 23, 2025 00:00:00');
const CONTEST_END_DATE = new Date('June 23, 2025 23:59:59');

/**
 * Get the contest start date
 * @returns {Date} Contest start date
 */
export const getContestStartDate = () => {
  return CONTEST_START_DATE;
};

/**
 * Get the contest end date
 * @returns {Date} Contest end date
 */
export const getContestEndDate = () => {
  return CONTEST_END_DATE;
};

/**
 * Get the contest start date as ISO string
 * @returns {string} ISO string of contest start date
 */
export const getContestStartDateISO = () => {
  return CONTEST_START_DATE.toISOString();
};

/**
 * Get the contest end date as ISO string
 * @returns {string} ISO string of contest end date
 */
export const getContestEndDateISO = () => {
  return CONTEST_END_DATE.toISOString();
};

/**
 * Format a date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Check if the contest has started
 * @returns {boolean} True if contest has started
 */
export const hasContestStarted = () => {
  return new Date() >= CONTEST_START_DATE;
};

/**
 * Check if the contest has ended
 * @returns {boolean} True if contest has ended
 */
export const hasContestEnded = () => {
  return new Date() >= CONTEST_END_DATE;
};

/**
 * Get the contest status
 * @returns {string} 'upcoming', 'active', or 'ended'
 */
export const getContestStatus = () => {
  if (!hasContestStarted()) {
    return 'upcoming';
  } else if (!hasContestEnded()) {
    return 'active';
  } else {
    return 'ended';
  }
};

/**
 * Calculate contest progress percentage
 * @returns {number} Percentage of contest completed (0-100)
 */
export const getContestProgress = () => {
  const now = new Date();
  
  if (now < CONTEST_START_DATE) {
    return 0;
  }
  
  if (now > CONTEST_END_DATE) {
    return 100;
  }
  
  const totalDuration = CONTEST_END_DATE - CONTEST_START_DATE;
  const elapsed = now - CONTEST_START_DATE;
  
  return Math.round((elapsed / totalDuration) * 100);
};

/**
 * Get formatted contest date range
 * @returns {string} Formatted date range (e.g., "May 20 - June 10, 2025")
 */
export const getContestDateRange = () => {
  const startMonth = CONTEST_START_DATE.toLocaleDateString('en-US', { month: 'long' });
  const startDay = CONTEST_START_DATE.getDate();
  const endMonth = CONTEST_END_DATE.toLocaleDateString('en-US', { month: 'long' });
  const endDay = CONTEST_END_DATE.getDate();
  const endYear = CONTEST_END_DATE.getFullYear();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${endYear}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`;
  }
};