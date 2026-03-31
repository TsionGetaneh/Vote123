import React, { useState, useEffect } from 'react';
import { useVotingContract } from '../hooks/useVotingContract';

const VotingStatus = () => {
  const { getVotingStatus, getWinner } = useVotingContract();
  const [status, setStatus] = useState('Loading...');
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const votingStatus = await getVotingStatus();
        setStatus(votingStatus);
        
        if (votingStatus === 'Ended') {
          const winnerData = await getWinner();
          setWinner(winnerData);
        }
      } catch (error) {
        console.error('Error fetching voting status:', error);
        setStatus('Error');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [getVotingStatus, getWinner]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Started': return '#6b7280';
      case 'Active': return '#10b981';
      case 'Ended': return '#ef4444';
      case 'Scheduled': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Not Started': return '⏳';
      case 'Active': return '🗳️';
      case 'Ended': return '✅';
      case 'Scheduled': return '📅';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '1rem',
        textAlign: 'center',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
      }}>
        <div style={{ color: '#6b7280' }}>Loading voting status...</div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
    }}>
      <h3 style={{
        margin: '0 0 1rem 0',
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#1f2937',
      }}>
        📊 Voting Status
      </h3>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.75rem',
        border: `2px solid ${getStatusColor(status)}`,
      }}>
        <span style={{ fontSize: '1.75rem' }}>{getStatusIcon(status)}</span>
        <div>
          <div style={{
            fontWeight: '700',
            color: getStatusColor(status),
            fontSize: '1rem',
          }}>
            {status}
          </div>
          {status === 'Active' && (
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Voting is currently in progress
            </div>
          )}
          {status === 'Not Started' && (
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              Waiting for admin to start voting
            </div>
          )}
        </div>
      </div>

      {winner && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#ecfdf5',
          borderRadius: '0.75rem',
          border: '1px solid #d1fae5',
        }}>
          <h4 style={{
            margin: '0 0 0.5rem 0',
            color: '#065f46',
            fontSize: '0.875rem',
            fontWeight: '700',
          }}>
            🏆 Election Results
          </h4>
          <div style={{ color: '#065f46', fontSize: '0.875rem' }}>
            <strong>Winner:</strong> {winner.name}
          </div>
          <div style={{ color: '#065f46', fontSize: '0.875rem' }}>
            <strong>Votes:</strong> {winner.votes}
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingStatus;