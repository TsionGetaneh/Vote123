import React, { useState } from 'react';
import { useWeb3 } from '../App';

const ProposalForm = () => {
  const { account } = useWeb3();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Proposal submitted: ${title}`);
    setTitle('');
    setDescription('');
  };

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
        <span role="img" aria-label="proposal">📝</span> Create Proposal
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#374151',
            fontSize: '0.875rem',
          }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#374151',
            fontSize: '0.875rem',
          }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              resize: 'vertical',
              outline: 'none',
            }}
            onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#4f46e5',
            color: 'white',
            border: 'none',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#4338ca'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#4f46e5'}
        >
          Submit Proposal
        </button>
      </form>
    </div>
  );
};

export default ProposalForm;