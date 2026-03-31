import React from 'react';
import { useVotingContract } from '../hooks/useVotingContract';

const WalletConnect = () => {
  const { account, connectWallet, loading, error, isConnected, clearError } = useVotingContract();

  const handleConnect = async () => {
    clearError();
    await connectWallet();
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      {isConnected ? (
        <div style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '2rem',
          fontWeight: '600',
          fontSize: '0.875rem',
          boxShadow: '0 4px 6px -1px rgba(16,185,129,0.2)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span>✅</span> Connected: {formatAddress(account)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={handleConnect} 
            disabled={loading}
            style={{
              padding: '0.75rem 1.75rem',
              backgroundColor: loading ? '#9ca3af' : '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '2rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 6px -1px rgba(79,70,229,0.2)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = '#4338ca';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = '#4f46e5';
            }}
          >
            {loading ? '🔄 Connecting...' : '🦊 Connect Wallet'}
          </button>
          
          {typeof window.ethereum === 'undefined' && (
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#fef2f2',
              borderRadius: '0.75rem',
              maxWidth: '280px',
            }}>
              <p style={{ color: '#dc2626', margin: '0 0 0.5rem 0', fontWeight: '600', fontSize: '0.875rem' }}>
                MetaMask not detected
              </p>
              <button
                onClick={() => window.open('https://metamask.io/download/', '_blank')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Install MetaMask
              </button>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div style={{
          color: '#b91c1c',
          fontSize: '0.75rem',
          textAlign: 'center',
          maxWidth: '320px',
          padding: '0.75rem',
          backgroundColor: '#fee2e2',
          borderRadius: '0.75rem',
          border: '1px solid #fecaca',
        }}>
          ⚠️ {error}
        </div>
      )}
      
      {!isConnected && (
        <div style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
          Connect your wallet to start voting
        </div>
      )}
    </div>
  );
};

export default WalletConnect;