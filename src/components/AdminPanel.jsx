import React from 'react';
import { useWeb3 } from '../App';

const AdminPanel = () => {
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
        <span role="img" aria-label="admin">🛡️</span> Admin Panel
      </h2>
      <div style={{
        padding: '1rem 1.25rem',
        backgroundColor: '#fffbeb',
        borderRadius: '1rem',
        borderLeft: '4px solid #f59e0b',
        marginBottom: '1rem',
      }}>
        <p style={{ margin: 0, color: '#92400e', fontSize: '0.875rem' }}>
          Admin functions available for contract management
        </p>
      </div>
      <div style={{
        padding: '0.75rem 1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.75rem',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        color: '#4b5563',
      }}>
        Connected: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
      </div>
    </div>
  );
};

export default AdminPanel;