'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from '../components/Modal';
import CountdownTimer from '../components/CountdownTimer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const contestStartDate = '2025-05-25T06:00:00.000Z';
  const contestEndDate = '2025-06-20T23:59:59.999Z';
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
    setHasSubmitted(true);
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
      toast.success('Submission successful! Your project has been entered into the contest.', {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        style: {
          background: 'linear-gradient(90deg, #fef9c3 0%, #fde047 100%)',
          color: '#92400e',
          border: '2px solid #facc15',
          borderRadius: '12px',
          fontWeight: 600,
          fontSize: '1.1rem'
        }
      });
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

        {/* Centralized and more attractive CTA button */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              background: 'linear-gradient(90deg, #fde047 0%, #facc15 100%)', // yellow gradient
              color: '#1a1a1a',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              padding: '1rem 2.5rem',
              border: 'none',
              borderRadius: '2rem',
              boxShadow: '0 4px 24px rgba(250,204,21,0.15)',
              cursor: 'pointer',
              transition: 'transform 0.1s, box-shadow 0.1s',
              letterSpacing: '0.05em',
              textShadow: '0 2px 8px rgba(0,0,0,0.08)',
              outline: 'none'
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(250,204,21,0.25)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(250,204,21,0.15)';
            }}
            aria-label="Join the Contest"
          >
            📝 Join the Contest
          </button>
        </div>

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
              <h1>How to enter contest:</h1>
              <p>
                This contest is sponsored by <a href="https://gitads.dev" target="_blank" rel="noopener noreferrer">GitAds</a> and hosted by <a href="https://x.com/githubprojects" target="_blank" rel="noopener noreferrer">GitHub Projects Community</a>
              </p>
            </div>
            <div className="section">
              <h2>1. Register & Verify Your Repository</h2>
              <p>
                Sign up as a publisher at <a href="https://gitads.dev" target="_blank" rel="noopener noreferrer">gitads.dev</a> and verify your project to enter.
              </p>
              <p>
                Check <a href="https://docs.gitads.dev" target="_blank" rel="noopener noreferrer">GitAds Publisher Documentation</a> for smooth onboarding of your project/repository.
              </p>
            </div>
            <div className="section">
              <h2>2. Follow <a href="https://x.com/git_ads" target="_blank" rel="noopener noreferrer">@git_ads</a></h2>
              <p>
                Stay updated and increase your chances of being featured. Follow us on <a href="https://x.com/git_ads" target="_blank" rel="noopener noreferrer">X/Twitter</a>.
              </p>
            </div>
            <div className="section">
              <h2>3. Submit Your Repository</h2>
              <p>
                Submit your project using the form below. Make sure to include a brief description of why your project is valuable to the open-source community.
                {/* Top entries will be highlighted on <a href="https://x.com/githubprojects" target="_blank" rel="noopener noreferrer">@githubprojects</a> for extra visibility. */}
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
                  <div className={styles.rewardLogos}>
                    <div className={styles.logoItem}>
                      <Image src="/certificate.png" alt="Certificate" width={40} height={40} />
                      <span>Certification</span>
                    </div>
                    <div className={styles.logoItem}>
                      <Image src="https://freelogopng.com/images/all_img/1681038887chatgpt-logo%20black-and-white.png" alt="ChatGPT" width={40} height={40} />
                      <span>3 Months ChatGPT Plus</span>
                    </div>
                    <div className={styles.logoItem}>
                      <Image src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png" alt="GitHub" width={40} height={40} />
                      <span>3 Months GitHub Pro</span>
                    </div>
                    <div className={styles.logoItem}>
                      <Image src="/gitAds_20250305_232426_0000.png" alt="GitAds" width={40} height={40} />
                      <span>GitAds $30</span>
                    </div>
                    <div className={styles.logoItem}>
                      <Image src="/github_projects.png" alt="Showcase" width={40} height={40} />
                      <span>Project Showcase</span>
                    </div>
                  </div>
                </div>
                
                {/* Second place */}
                <div className={styles.rewardCard}>
                  <div className={styles.rewardBadge}>2nd</div>
                  <h3>GitHub Projects "Runner-up Award"</h3>
                  <div className={styles.rewardLogos}>
                    <div className={styles.logoItem}>
                      <Image src="/certificate.png" alt="Certificate" width={40} height={40} />
                      <span>Certification</span>
                    </div>
                    <div className={styles.logoItem}>
                      <Image src="https://freelogopng.com/images/all_img/1681038887chatgpt-logo%20black-and-white.png" alt="ChatGPT" width={40} height={40} />
                      <span>2 Months ChatGPT Plus</span>
                    </div>
                    <div className={styles.logoItem}>
                      <Image src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png" alt="GitHub" width={40} height={40} />
                      <span>2 Months GitHub Pro</span>
                    </div>
                    <div className={styles.logoItem}>
                      <Image src="/gitAds_20250305_232426_0000.png" alt="GitAds" width={40} height={40} />
                      <span>GitAds $20</span>
                    </div>
                    <div className={styles.logoItem}>
                      <Image src="/github_projects.png" alt="Showcase" width={40} height={40} />
                      <span>Project Showcase</span>
                    </div>
                  </div>
                </div>
                
                {/* Third place */}
                <div className={styles.rewardCard}>
                  <div className={styles.rewardBadge}>3rd</div>
                  <h3>GitHub Projects "Bronze Award"</h3>
                  <div className={styles.rewardLogos}>
                    <div className={styles.logoItem}>
                      <Image src="/certificate.png" alt="Certificate" width={40} height={40} />
                      <span>Certification</span>
                    </div>
                    <div className={styles.logoItem}>
                      <Image src="https://freelogopng.com/images/all_img/1681038887chatgpt-logo%20black-and-white.png" alt="ChatGPT" width={40} height={40} />
                      <span>1 Month ChatGPT Plus</span>
                    </div>
                    <div className={styles.logoItem}>
                      <Image src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_960_720.png" alt="GitHub" width={40} height={40} />
                      <span>1 Month GitHub Pro</span>
                    </div>
                    <div className={styles.logoItem}>
                      <Image src="/gitAds_20250305_232426_0000.png" alt="GitAds" width={40} height={40} />
                      <span>GitAds $10</span>
                    </div>
                    <div className={styles.logoItem}>
                      <Image src="/github_projects.png" alt="Showcase" width={40} height={40} />
                      <span>Project Showcase</span>
                    </div>
                  </div>
                </div>
                
                {/* Top 10 */}
                <div className={styles.rewardCard}>
                  <div className={styles.rewardBadge}>Top 10</div>
                  <h3>Open-Source Contributor Recognition</h3>
                  <div className={styles.rewardLogos}>
                    <div className={styles.logoItem}>
                      <Image src="/certificate.png" alt="Certificate" width={40} height={40} />
                      <span>Certification</span>
                    </div>
                    <div className={styles.logoItem}>
                      <Image src="/gitAds_20250305_232426_0000.png" alt="GitAds" width={40} height={40} />
                      <span>GitAds $5</span>
                    </div>
                  </div>
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
          Contest runs from May 25, 2025 to June 20, 2025. All entries must follow the guidelines.
        </p>

        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="Submit Your Project"
        >
          <form onSubmit={handleSubmit} className="submission-form">
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              required
              className={
                hasSubmitted
                  ? !formData.name
                    ? 'input-error'
                    : 'input-valid'
                  : ''
              }
            />
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your Email"
              required
              className={
                hasSubmitted
                  ? !formData.email
                    ? 'input-error'
                    : 'input-valid'
                  : ''
              }
            />
            <input
              type="url"
              id="repo"
              value={formData.repo}
              onChange={handleInputChange}
              placeholder="GitHub Repository URL"
              required
              className={
                hasSubmitted
                  ? !formData.repo
                    ? 'input-error'
                    : 'input-valid'
                  : ''
              }
            />
            <textarea
              id="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Why is this project valuable?"
              required
              className={
                hasSubmitted
                  ? !formData.reason
                    ? 'input-error'
                    : 'input-valid'
                  : ''
              }
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={isLoading}>{isLoading ? 'Submitting...' : 'Submit Entry'}</button>
          </form>
        </Modal>

        <ToastContainer />
      </div>
    </>
  );
}
