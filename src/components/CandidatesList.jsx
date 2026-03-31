import React, { useState, useEffect } from 'react';
import { useVotingContract } from '../hooks/useVotingContract';

const CandidatesList = () => {
  const {
    getAllCandidates,
    vote,
    hasVoterVoted,
    isVoterRegistered,
    getVotingStatus,
    account,
    loading,
    error,
    clearError
  } = useVotingContract();
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [votingStatus, setVotingStatus] = useState('Loading...');
  const [votingLoading, setVotingLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [profileCandidateId, setProfileCandidateId] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [profileDescription, setProfileDescription] = useState('');
  const [profileWallet, setProfileWallet] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    const handler = () => setRefreshKey((prev) => prev + 1);
    window.addEventListener('candidateAdded', handler);
    return () => window.removeEventListener('candidateAdded', handler);
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching candidates...');
        const candidatesData = await getAllCandidates();
        console.log('Candidates data:', candidatesData);
        setCandidates(candidatesData);
        const status = await getVotingStatus();
        setVotingStatus(status);
        if (account) {
          const voted = await hasVoterVoted();
          setHasVoted(voted);
          const registered = await isVoterRegistered();
          setIsRegistered(registered);
        }
      } catch (error) {
        console.error('Error fetching candidates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, [getAllCandidates, hasVoterVoted, isVoterRegistered, getVotingStatus, account, refreshKey]);

  const handleVote = async (candidateId) => {
    if (hasVoted) return;
    setVotingLoading(true);
    clearError();
    try {
      await vote(candidateId);
      setHasVoted(true);
      setRefreshKey(prev => prev + 1);
    } finally {
      setVotingLoading(false);
    }
  };

  const getTotalVotes = () => {
    return candidates.reduce((total, candidate) => total + candidate.voteCount, 0);
  };

  const getVotePercentage = (votes) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const saveCandidateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    const id = Number(profileCandidateId);
    if (!Number.isFinite(id) || id < 0) {
      setProfileMessage('Invalid candidate ID');
      return;
    }
    if (typeof window === 'undefined') return;
    setProfileSaving(true);
    try {
      const key = 'candidateMetaV1';
      const raw = window.localStorage.getItem(key);
      const meta = raw ? JSON.parse(raw) : {};
      meta[String(id)] = {
        ...(meta[String(id)] || {}),
        imageUrl: profileImageUrl.trim(),
        description: profileDescription.trim(),
        walletAddress: profileWallet.trim()
      };
      window.localStorage.setItem(key, JSON.stringify(meta));
      setProfileMessage('Saved candidate profile info');
      setRefreshKey(prev => prev + 1);
      setProfileCandidateId('');
      setProfileImageUrl('');
      setProfileDescription('');
      setProfileWallet('');
    } catch (err) {
      setProfileMessage('Failed to save profile');
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileMessage(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        textAlign: 'center',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
      }}>
        <div style={{ color: '#6b7280' }}>Loading candidates...</div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        textAlign: 'center',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', fontSize: '1.125rem' }}>🗳️ Candidates</h3>
        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>Status: {votingStatus}</div>
        {error && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            backgroundColor: '#fee2e2',
            borderRadius: '0.75rem',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '0.75rem',
          }}>
            ⚠️ {error}
          </div>
        )}
        <p style={{ color: '#6b7280', margin: '0 0 1rem 0' }}>No candidates available yet. Ask the admin to add candidates.</p>
        <button
          onClick={() => setRefreshKey(prev => prev + 1)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          🔄 Refresh
        </button>
      </div>
    );
  }

  const isVotingActive = votingStatus === 'Active' || votingStatus === 'Ongoing';
  const isVotingExplicitlyInactive = !isVotingActive && votingStatus !== 'Unknown' && votingStatus !== 'Loading...';

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.25rem', fontWeight: '700' }}>
          🗳️ Candidates ({candidates.length})
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Total Votes: {getTotalVotes()}</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Status: {votingStatus}</div>
          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: '#fee2e2',
          borderRadius: '0.75rem',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          fontSize: '0.75rem',
          textAlign: 'center',
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            style={{
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #f3f4f6',
              boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.03)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '1rem',
                  backgroundColor: '#f3f4f6',
                  overflow: 'hidden',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e5e7eb',
                }}>
                  {candidate.imageUrl ? (
                    <img src={candidate.imageUrl} alt={candidate.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <span style={{ color: '#9ca3af', fontSize: '1.5rem' }}>🗳️</span>
                  )}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#1f2937', fontSize: '1rem', fontWeight: '700' }}>
                    #{candidate.id} {candidate.name}
                  </h4>
                  {candidate.description && (
                    <div style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{candidate.description}</div>
                  )}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>🗳️ Votes: <strong>{candidate.voteCount}</strong></div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>📊 {getVotePercentage(candidate.voteCount)}%</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleVote(candidate.id)}
                disabled={isVotingExplicitlyInactive || hasVoted || votingLoading || loading}
                style={{
                  padding: '0.5rem 1.25rem',
                  backgroundColor: (isVotingExplicitlyInactive || hasVoted) ? '#d1d5db' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: (isVotingExplicitlyInactive || hasVoted) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {hasVoted
                  ? '✅ Voted'
                  : !isVotingActive && isVotingExplicitlyInactive
                    ? `⏳ Voting: ${votingStatus}`
                    : votingLoading
                      ? '🔄 Voting...'
                      : !isRegistered
                        ? '🗳️ Vote (check registration)'
                        : '🗳️ Vote'}
              </button>
            </div>

            {/* Progress bar */}
            <div style={{
              marginTop: '0.75rem',
              width: '100%',
              height: '0.5rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}>
              <div
                style={{
                  width: `${getVotePercentage(candidate.voteCount)}%`,
                  height: '100%',
                  backgroundColor: '#10b981',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {hasVoted && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#ecfdf5',
          borderRadius: '1rem',
          border: '1px solid #d1fae5',
          textAlign: 'center',
        }}>
          <div style={{ color: '#065f46', fontWeight: '700', fontSize: '0.875rem' }}>✅ You have successfully cast your vote!</div>
          <div style={{ color: '#065f46', fontSize: '0.75rem', marginTop: '0.25rem' }}>Thank you for participating.</div>
        </div>
      )}

      {getTotalVotes() > 0 && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#eff6ff',
          borderRadius: '1rem',
          border: '1px solid #dbeafe',
        }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e3a8a', fontSize: '0.75rem', fontWeight: '700' }}>📊 Voting Statistics</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e3a8a' }}>{candidates.length}</div>
              <div style={{ fontSize: '0.7rem', color: '#475569' }}>Candidates</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e3a8a' }}>{getTotalVotes()}</div>
              <div style={{ fontSize: '0.7rem', color: '#475569' }}>Total Votes</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e3a8a' }}>{candidates.length ? Math.round(getTotalVotes() / candidates.length) : 0}</div>
              <div style={{ fontSize: '0.7rem', color: '#475569' }}>Avg Votes</div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Profile Editor */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #f3f4f6',
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937', fontSize: '0.875rem', fontWeight: '700' }}>Candidate Profile (off-chain)</h4>
        <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.75rem' }}>
          Updates only the candidate card image/description locally. Votes remain on-chain.
        </div>
        <form onSubmit={saveCandidateProfile} style={{ display: 'grid', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              value={profileCandidateId}
              onChange={(e) => setProfileCandidateId(e.target.value)}
              placeholder="Candidate ID (e.g. 0)"
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
              }}
            />
            <input
              value={profileWallet}
              onChange={(e) => setProfileWallet(e.target.value)}
              placeholder="Wallet (optional)"
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
              }}
            />
          </div>
          <input
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
            placeholder="Image URL (optional)"
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '0.75rem',
            }}
          />
          <textarea
            value={profileDescription}
            onChange={(e) => setProfileDescription(e.target.value)}
            placeholder="Description / manifesto (optional)"
            rows={2}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '0.75rem',
              resize: 'vertical',
            }}
          />
          <button
            type="submit"
            disabled={profileSaving}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: profileSaving ? '#9ca3af' : '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: profileSaving ? 'not-allowed' : 'pointer',
            }}
          >
            {profileSaving ? 'Saving...' : 'Save Profile Info'}
          </button>
          {profileMessage && (
            <div style={{
              padding: '0.5rem',
              borderRadius: '0.75rem',
              backgroundColor: '#f9fafb',
              color: '#1f2937',
              fontSize: '0.7rem',
              textAlign: 'center',
            }}>
              {profileMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CandidatesList;