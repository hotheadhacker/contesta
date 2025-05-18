'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from '../components/Modal';
import CountdownTimer from '../components/CountdownTimer';
import styles from './page.module.css';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    repo: '',
    reason: ''
  });

  const contestStartDate = '2025-05-19T00:00:00.000Z';
  const contestEndDate = '2025-06-10T23:59:59.999Z';
  const [countdownType, setCountdownType] = useState('begins');
  const [countdownTarget, setCountdownTarget] = useState(contestStartDate);

  useEffect(() => {
    const now = new Date();
    const startDate = new Date(contestStartDate);
    if (now >= startDate) {
      setCountdownType('ends');
      setCountdownTarget(contestEndDate);
    } else {
      setCountdownType('begins');
      setCountdownTarget(contestStartDate);
    }
  }, []);

  const fetchSubmissionCount = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/submissions?countOnly=true');
      if (!response.ok) throw new Error('Failed to fetch submission count');
      const data = await response.json();
      if (data.totalRecords !== undefined) {
        setTotalSubmissions(data.totalRecords);
      }
    } catch (err) {
      console.error('Error fetching submission count:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissionCount();
  }, []);

  useEffect(() => {
    if (activeTab === 'submissions') {
      loadEntries();
      fetchSubmissionCount();
    }
  }, [activeTab]);

  const formatCount = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return count.toString();
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit entry');
      setFormData({ name: '', email: '', repo: '', reason: '' });
      setIsModalOpen(false);
      alert('Submission successful! Your project has been entered into the contest.');
      fetchSubmissionCount();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEntries = async (reset = true) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = reset ? '/api/submissions' : `/api/submissions?offset=${offset}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load submissions');
      const data = await response.json();
      setEntries(prev => reset ? data.list : [...prev, ...data.list]);
      setOffset(data.pageInfo.offset);
      setHasMore(data.pageInfo.hasNextPage);
      if (data.pageInfo.totalRecords) {
        setTotalSubmissions(data.pageInfo.totalRecords);
      }
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

  return (
    <>
      <div className={styles.headerBanner}>
        <div className={styles.bannerImageWrapper}>
          <Image
            src="/gitadsXgithubprojects-logo-only-min.png"
            alt="GitAds x GitHub Projects Banner"
            fill
            priority
            sizes="100vw"
            className={styles.bannerImage}
          />
        </div>
        <div className={styles.bannerOverlay}></div>
      </div>

      <div className={styles.container}>
        <h1>🚀 GitAds Open-Source Spotlight Contest</h1>

        <CountdownTimer targetDate={countdownTarget} type={countdownType} />

        <p className="description">
          Submit your most impactful open-source project. Gain recognition, win rewards,
          and join the future of ethical monetization with GitAds.
        </p>

        <div className="tabs">
          <button className={`tab-button ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>About</button>
          <button className={`tab-button ${activeTab === 'rewards' ? 'active' : ''}`} onClick={() => setActiveTab('rewards')}>Rewards</button>
          <button className={`tab-button ${activeTab === 'submissions' ? 'active' : ''}`} onClick={() => setActiveTab('submissions')}>
            Submissions {totalSubmissions > 0 && <span className="submission-count">({formatCount(totalSubmissions)})</span>}
          </button>
          <button className={`tab-button ${activeTab === 'winners' ? 'active' : ''}`} onClick={() => setActiveTab('winners')}>Winners</button>
        </div>

        <div className="card">
          <div id="about" className={`tab-content ${activeTab === 'about' ? 'active' : ''}`}>
            <div className="section">
              <h2>📁 Register & Verify Your Repository</h2>
              <p>
                Sign up as a publisher at <a href="https://gitads.dev" target="_blank" rel="noopener noreferrer">gitads.dev</a> and verify your project to enter.
              </p>
            </div>
            <div className="section">
              <h2>🐦 Follow @git_ads</h2>
              <p>
                Stay updated and increase your chances of being featured. Follow us on <a href="https://x.com/git_ads" target="_blank" rel="noopener noreferrer">X</a>.
              </p>
            </div>
            <div className="section">
              <h2>⭐ Get Featured on @githubprojects</h2>
              <p>
                Top entries will be highlighted on <a href="https://x.com/githubprojects" target="_blank" rel="noopener noreferrer">@githubprojects</a> for extra visibility.
              </p>
            </div>
            <div className="section">
              <button onClick={() => setIsModalOpen(true)}>📝 Join the Contest</button>
            </div>
          </div>

          {activeTab === 'rewards' && (
            <div className={styles.rewardsContent}>
              <h2>🏆 Contest Rewards</h2>
              <p className={styles.rewardsIntro}>
                Join our Open-Source Spotlight Contest and win amazing rewards for your contributions to the open-source community!
              </p>
              
              <div className={styles.rewardsList}>
                {/* First place */}
                <div className={styles.rewardCard}>
                  <div className={styles.rewardBadge}>1st</div>
                  <h3>GitHub Projects "Open-Source Champ Award"</h3>
                  <ul>
                    <li>T-shirt and goodies worth $110</li>
                    <li>Featured spotlight on the GitHubProjects platform</li>
                    <li>Exclusive winner's certificate</li>
                    <li>Social media recognition</li>
                  </ul>
                </div>
                
                {/* Second place */}
                <div className={styles.rewardCard}>
                  <div className={styles.rewardBadge}>2nd</div>
                  <h3>GitHub Projects "Runner-up Award"</h3>
                  <ul>
                    <li>T-shirt and goodies worth $80</li>
                    <li>Featured spotlight on the GitHubProjects platform</li>
                    <li>Runner-up certificate</li>
                    <li>Social media mention</li>
                  </ul>
                </div>
                
                {/* Third place */}
                <div className={styles.rewardCard}>
                  <div className={styles.rewardBadge}>3rd</div>
                  <h3>GitHub Projects "Bronze Award"</h3>
                  <ul>
                    <li>T-shirt and goodies worth $45</li>
                    <li>Featured spotlight on the GitHubProjects platform</li>
                    <li>Bronze certificate</li>
                    <li>Social media mention</li>
                  </ul>
                </div>
                
                {/* Top 50 */}
                <div className={styles.rewardCard}>
                  <div className={styles.rewardBadge}>Top 50</div>
                  <h3>Open-Source Contributor Recognition</h3>
                  <ul>
                    <li>Open-source goodies coupons</li>
                    <li>Digital participation certificate</li>
                    <li>Recognition in our community newsletter</li>
                  </ul>
                </div>
              </div>
              
              <div className={styles.rewardsNote}>
                <p>All winners will be announced after the contest ends. Follow us on social media for updates!</p>
                <button className={styles.submitButton} onClick={() => setIsModalOpen(true)}>
                  Submit Your Project
                </button>
              </div>
            </div>
          )}

          <div id="submissions" className={`tab-content ${activeTab === 'submissions' ? 'active' : ''}`}>
            <div className="section">
              <h2>📦 All Submissions</h2>
              {error && <div className="error-message">Error: {error}</div>}
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
                <button onClick={loadMore} disabled={isLoading} className="load-more-btn">
                  {isLoading ? 'Loading...' : 'Load More'}
                </button>
              )}
            </div>
          </div>

          <div id="winners" className={`tab-content ${activeTab === 'winners' ? 'active' : ''}`}>
            <div className="section">
              <h2>🏆 Winners</h2>
              <p>Winners will be announced after the contest ends. Follow us for updates!</p>
            </div>
          </div>
        </div>

        <p className="footer-note">
          Contest runs from May 20, 2025 to June 10, 2025. All entries must follow the guidelines.
        </p>

        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Submit Your Project"
        >
          <form onSubmit={handleSubmit} className="submission-form">
            <input type="text" id="name" value={formData.name} onChange={handleInputChange} placeholder="Your Name" required />
            <input type="email" id="email" value={formData.email} onChange={handleInputChange} placeholder="Your Email" required />
            <input type="url" id="repo" value={formData.repo} onChange={handleInputChange} placeholder="GitHub Repository URL" required />
            <textarea id="reason" value={formData.reason} onChange={handleInputChange} placeholder="Why is this project valuable?" required />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={isLoading}>{isLoading ? 'Submitting...' : 'Submit Entry'}</button>
          </form>
        </Modal>
      </div>
    </>
  );
}
