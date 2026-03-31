import React from 'react';
import { useWeb3 } from '../App';

const VoterRegistration = () => {
  const { account } = useWeb3();

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <span role="img" aria-label="voter">✅</span> Voter Registration
      </h2>
      <div style={{
        marginBottom: '1rem',
        padding: '0.75rem 1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.75rem',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        color: '#4b5563',
        wordBreak: 'break-all',
      }}>
        Connected: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
      </div>
      <div style={{
        padding: '1rem 1.25rem',
        backgroundColor: '#ecfdf5',
        borderRadius: '1rem',
        borderLeft: '4px solid #10b981',
      }}>
        <p style={{ margin: 0, color: '#065f46', fontSize: '0.875rem', fontWeight: '500' }}>
          🟢 Registration status: Ready to vote
        </p>
      </div>
    </div>
  );
};

export default VoterRegistration;