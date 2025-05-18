// NocoDB API helper functions
const NOCODB_CONFIG = {
  url: process.env.NOCODB_URL,
  projectName: process.env.NOCODB_PROJECT_NAME,
  tableName: process.env.NOCODB_TABLE_NAME,
  apiToken: process.env.NOCODB_API_TOKEN
};

export async function createSubmission(data) {
  const apiUrl = `${NOCODB_CONFIG.url}/api/v1/db/data/noco/${NOCODB_CONFIG.projectName}/${NOCODB_CONFIG.tableName}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xc-auth': NOCODB_CONFIG.apiToken
      },
      body: JSON.stringify(data)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error creating submission:', error);
    throw error;
  }
}

export async function getSubmissions(offset = 0, limit = 5) {
  const apiUrl = `${NOCODB_CONFIG.url}/api/v1/db/data/noco/${NOCODB_CONFIG.projectName}/${NOCODB_CONFIG.tableName}?limit=${limit}&offset=${offset}&sort=-SubmittedAt`;
  
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'xc-auth': NOCODB_CONFIG.apiToken
      },
      cache: 'no-store' // Disable caching to always get fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch submissions');
    }
    
    const data = await response.json();
    
    // Transform Airtable response to match expected format
    const transformedData = {
      list: data.records.map(record => ({
        id: record.id,
        ...record.fields
      })),
      pageInfo: {
        hasNextPage: !!data.offset,
        offset: data.offset || null
      }
    };
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching submissions:', error);
    throw error;
  }
}

const [entries, setEntries] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [offset, setOffset] = useState(null);
const [hasMore, setHasMore] = useState(false);

const loadEntries = async (reset = true) => {
  setIsLoading(true);
  setError(null);

  try {
    const url = reset 
      ? '/api/submissions' 
      : `/api/submissions?offset=${offset}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to load submissions');
    }
    
    const data = await response.json();
    
    setEntries(prev => reset ? data.list : [...prev, ...data.list]);
    setOffset(data.pageInfo.offset);
    setHasMore(data.pageInfo.hasNextPage);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

const loadMore = () => {
  if (hasMore && !isLoading) {
    loadEntries(false);
  }
};

<div id="entries">
  {entries.length > 0 ? (
    entries.map((entry, index) => (
      <div key={entry.id || index} className="entry">
        <h3>{entry.Name}</h3>
        <p><strong>Repository:</strong> <a href={entry.Repository} target="_blank" rel="noopener noreferrer">{entry.Repository}</a></p>
        <p>{entry.Reason}</p>
        {entry.SubmissionDate && (
          <p className="submission-date">Submitted on: {new Date(entry.SubmissionDate).toLocaleDateString()}</p>
        )}
      </div>
    ))
  ) : isLoading ? (
    <div className="loading-entries">Loading submissions...</div>
  ) : (
    <div className="no-entries">No submissions yet. Be the first to submit your project!</div>
  )}
</div>

{hasMore && (
  <button 
    onClick={loadMore} 
    disabled={isLoading}
    className="load-more-btn"
  >
    {isLoading ? 'Loading...' : 'Load More'}
  </button>
)}