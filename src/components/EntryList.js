'use client';

import { useState, useEffect } from 'react';

export default function EntryList() {
  const [entries, setEntries] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  
  const fetchEntries = async (reset = false) => {
    setIsLoading(true);
    setError('');
    
    const currentOffset = reset ? 0 : offset;
    
    try {
      const response = await fetch(`/api/submissions?offset=${currentOffset}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      
      const data = await response.json();
      
      if (reset) {
        setEntries(data.list || []);
      } else {
        setEntries(prev => [...prev, ...(data.list || [])]);
      }
      
      // Update pagination info
      setOffset(currentOffset + (data.list?.length || 0));
      setHasMore(data.pageInfo ? !data.pageInfo.isLastPage : false);
    } catch (err) {
      setError('Error loading submissions. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    fetchEntries(true);
  }, []);
  
  const handleLoadMore = () => {
    fetchEntries();
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  if (error) {
    return <p className="error-message">{error}</p>;
  }
  
  return (
    <div>
      {entries.length === 0 && !isLoading ? (
        <p className="no-entries">No submissions yet. Be the first to submit your project!</p>
      ) : (
        <div id="entries">
          {entries.map((entry, index) => (
            <div className="entry" key={entry.id || index}>
              <h3>{entry.Name || 'Anonymous'}</h3>
              <p>
                <strong>Repository:</strong>{' '}
                <a href={entry.Repository} target="_blank" rel="noopener noreferrer">
                  {entry.Repository}
                </a>
              </p>
              <p>{entry.Reason || 'No description provided'}</p>
              {entry.SubmittedAt && (
                <p><small>Submitted on {formatDate(entry.SubmittedAt)}</small></p>
              )}
            </div>
          ))}
        </div>
      )}
      
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div className="loading"></div> Loading submissions...
        </div>
      )}
      
      {hasMore && !isLoading && entries.length > 0 && (
        <button id="load-more-btn" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
}